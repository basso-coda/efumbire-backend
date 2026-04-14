const yup = require('yup');
const Terrain = require("../../db/models/gestion_terrains/Terrain");
const Commande = require("../../db/models/gestion_commandes/Commande");
const TypeEngrais = require('../../db/models/gestion_terrains/TypeEngrais');
const CommandeItems = require("../../db/models/gestion_commandes/CommandeItems");
const TerrainTypeCulture = require('../../db/models/gestion_terrains/TerrainTypeCulture');
const EngraisRecommandation = require('../../db/models/gestion_terrains/EngraisRecommandation');
const TerrainSaisonCulture = require('../../db/models/gestion_terrains/TerrainSaisonCulture');
const { sequelize } = require('../../db/models');
const Agriculteur = require('../../db/models/gestion_agriculteurs/Agriculteur');
const CommandeInvoice = require('../../db/models/gestion_commandes/CommandeInvoice');
const { Op } = require('sequelize');

const getCommandes = async (req, res) => {
    try {

        const { rows = 10, first = 0, sortField, sortOrder, search } = req.query;

        const defaultSortDirection = "DESC";

        // ===== SORT CONFIG =====
        const sortColumns = {
            commandes: {
                as: "commande",
                fields: {
                    id_commande: "id_commande",
                    date_commande: "date_commande",
                    agriculteur_id: "agriculteur_id",
                    saison_id: "saison_id"
                }
            }
        };

        let orderColumn, orderDirection;
        let sortModel;

        if (sortField) {
            for (let key in sortColumns) {
                if (sortColumns[key].fields.hasOwnProperty(sortField)) {
                    sortModel = {
                        model: key,
                        as: sortColumns[key].as
                    };

                    orderColumn = sortColumns[key].fields[sortField];
                    break;
                }
            }
        }

        if (!orderColumn) {
            orderColumn = "id_commande";
        }

        // ===== ORDER =====
        if (sortOrder == 1) {
            orderDirection = "ASC";
        } else if (sortOrder == -1) {
            orderDirection = "DESC";
        } else {
            orderDirection = defaultSortDirection;
        }

        // ===== SEARCH =====
        const globalSearchWhereLike = search && search.trim() !== ""
            ? {
                [Op.or]: [
                    { "$agriculteur.nom_complet$": { [Op.substring]: search } },
                    { "$commande_invoice.invoice_number$": { [Op.substring]: search } }
                ]
            }
            : {};

        // ===== QUERY =====
        const data = await Commande.findAndCountAll({
            limit: parseInt(rows),
            offset: parseInt(first),
            order: [[orderColumn, orderDirection]],
            where: globalSearchWhereLike,
            distinct: true,
            subQuery: false,

            include: [
                {
                    model: Agriculteur,
                    as: "agriculteur",
                    // attributes: ["id_agriculteur", "nom_complet", "numero_telephone"]
                },
                {
                    model: CommandeItems,
                    as: "items",
                    include: [
                        {
                            model: TypeEngrais,
                            as: "type_engrais",
                            // attributes: ["id_type_engrais", "nom_type_engrais", "prix"]
                        }
                    ]
                },
                {
                    model: CommandeInvoice,
                    as: "commande_invoice",
                    required: false
                }
            ]
        });

        return res.json({
            httpStatus: 200,
            message: "Commandes récupérées avec succès",
            data
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            httpStatus: 500,
            message: error.message,
            data: null
        });
    }
};

const createCommande = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { agriculteur_id, saison_id, cultures, items } = req.body;

        // 1. Validation basique
        if (!agriculteur_id || !saison_id || !items?.length || !cultures?.length) {
            return res.status(400).json({
                message: "Données invalides"
            });
        }

        // 2. Vérifier terrains de l'agriculteur
        const terrains = await Terrain.findAll({
            where: { agriculteur_id },
            transaction: t
        });

        if (!terrains.length) {
            throw new Error("Aucun terrain trouvé pour cet agriculteur");
        }

        // 🔥 Transformer en map pour accès rapide
        const terrainsMap = {};
        terrains.forEach(t => {
            terrainsMap[t.id_terrain] = t;
        });

        // 3. Enregistrer cultures pour la saison
        for (let culture of cultures) {

            const { terrain_id, type_culture_id } = culture;

            // Vérifier que le terrain appartient à l'agriculteur
            if (!terrainsMap[terrain_id]) {
                throw new Error(`Terrain ${terrain_id} invalide`);
            }

            // Vérifier que la culture est autorisée sur ce terrain
            const exists = await TerrainTypeCulture.findOne({
                where: { terrain_id, type_culture_id },
                transaction: t
            });

            if (!exists) {
                throw new Error("Culture non autorisée pour ce terrain");
            }

            // Vérifier doublon saison
            const already = await TerrainSaisonCulture.findOne({
                where: { terrain_id, saison_id },
                transaction: t
            });

            if (already) {
                throw new Error(`Culture déjà définie pour terrain ${terrain_id} cette saison`);
            }

            // Enregistrer
            await TerrainSaisonCulture.create({
                terrain_id,
                saison_id,
                type_culture_id
            }, { transaction: t });
        }

        // 4. Charger cultures saison avec terrains
        const culturesSaison = await TerrainSaisonCulture.findAll({
            where: { saison_id },
            include: [{
                model: Terrain,
                as: 'terrain_saison',
                attributes: ['id_terrain', 'superficie']
            }],
            transaction: t
        });
        
        // 5. Créer commande
        const commande = await Commande.create({
            agriculteur_id,
            saison_id,
            date_commande: new Date()
        }, { transaction: t });

        let totalAmount = 0;

        // 6. Traiter les items
        for (let item of items) {

            const engrais = await TypeEngrais.findByPk(item.type_engrais_id, { transaction: t });

            if (!engrais) {
                throw new Error(`Type engrais ${item.type_engrais_id} introuvable`);
            }

            // Charger recommandations UNE FOIS PAR ITEM
            const recommandations = await EngraisRecommandation.findAll({
                where: {
                    type_engrais_id: item.type_engrais_id,
                    saison_id
                },
                transaction: t
            });

            if (!recommandations.length) {
                throw new Error("Aucune recommandation définie pour cet engrais");
            }

            let quantiteMax = 0;

            // 🔥 Calcul intelligent basé sur culture réelle
            for (let tsc of culturesSaison) {

                const regle = recommandations.find(r =>
                    r.type_culture_id === tsc.type_culture_id
                );

                if (regle) {
                    quantiteMax += Number(tsc.terrain_saison.superficie) * Number(regle.dose_par_hectare);
                }
            }

            // Validation métier
            if (item.quantite > quantiteMax) {
                throw new Error(
                    `Quantité demandée (${item.quantite}) dépasse la recommandation (${quantiteMax})`
                );
            }

            // Enregistrer item
            await CommandeItems.create({
                commande_id: commande.id_commande,
                type_engrais_id: item.type_engrais_id,
                quantite: item.quantite,
                prix_unitaire: engrais.prix
            }, { transaction: t });

            totalAmount += item.quantite * engrais.prix;
        }

        // 7. Commit
        await t.commit();

        return res.status(201).json({
            message: "Commande créée avec succès",
            commande_id: commande.id_commande,
            total_amount: totalAmount
        });

    } catch (error) {

        await t.rollback();

        console.error(error);

        return res.status(500).json({
            message: error.message
        });
    }
};

const getOneCommande = async (req, res) => {
    try {
        const { id_commande } = req.params

        const commande = await Commande.findByPk(id_commande, {
            include: [
                {
                    model: Agriculteur,
                    as: "agriculteur",
                    // attributes: ["id_agriculteur", "nom_complet", "numero_telephone"]
                },
                {
                    model: CommandeItems,
                    as: "items",
                    include: [
                        {
                            model: TypeEngrais,
                            as: "type_engrais",
                            // attributes: ["id_type_engrais", "nom_type_engrais", "prix"]
                        }
                    ]
                },
                {
                    model: CommandeInvoice,
                    as: "commande_invoice",
                    required: false
                }
            ]
        });

        if (!commande) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Commande non trouvé',
                data: commande
            });
        }

        res.json({
            httpStatus: 200,
            message: 'Commande trouvé avec succès',
            data: commande
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

module.exports = {
    getCommandes,
    createCommande,
    getOneCommande
}
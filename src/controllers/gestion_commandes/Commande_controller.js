const yup = require('yup');
const Terrain = require("../../db/models/gestion_terrains/Terrain");
const Commande = require("../../db/models/gestion_commandes/Commande");
const TypeEngrais = require('../../db/models/gestion_terrains/TypeEngrais');
const CommandeItems = require("../../db/models/gestion_commandes/CommandeItems");
const TerrainTypeCulture = require('../../db/models/gestion_terrains/TerrainTypeCulture');
const EngraisRecommandation = require('../../db/models/gestion_terrains/EngraisRecommandation');
const TerrainSaisonCulture = require('../../db/models/gestion_terrains/TerrainSaisonCulture');
const { sequelize } = require('../../db/models');

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

module.exports = {
    createCommande
}
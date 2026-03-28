const yup = require('yup')
const Agriculteur = require('../../db/models/gestion_agriculteurs/Agriculteur')
const Membre = require('../../db/models/gestion_terrains/Membre')
const Terrain = require('../../db/models/gestion_terrains/Terrain')
const ExploitationTerrain = require('../../db/models/gestion_terrains/ExploitationTerrain')
const AgriculteurWallet = require('../../db/models/gestion_paiements/AgriculteurWallet')
const User = require('../../db/models/gestion_utilisateurs/User')
const TerrainTypeCulture = require('../../db/models/gestion_terrains/TerrainTypeCulture')
const bcrypt = require('bcrypt')
const { ValidationError, Op } = require('sequelize')
const { sequelize } = require('../../db/models')
const passwordGenerator = require('../../utils/passwordGenerator')
const { generateUniqueWalletNumber } = require('../../services/wallet.service')
const { generateMatricule } = require('../../services/matricule.service')
const Upload = require('../../utils/Upload')
const TerrainValidation = require('../../db/models/gestion_terrains/TerrainValidation')
const TypeAgriculteur = require('../../db/models/gestion_agriculteurs/TypeAgriculteur')
const Colline = require('../../db/models/gestion_provinces/Colline')
const TypeCulture = require('../../db/models/gestion_terrains/TypeCulture')


const getAgriculteurs = async (req, res) => {
    try {
        const { rows = 10, first = 0, sortField, sortOrder, search } = req.query

        const defaultSortDirection = "DESC"

        const sortColumns = {
            agriculteurs: {
                as: "agriculteur",
                fields: {
                    id_agriculteur: "id_agriculteur",
                    nom_complet: "nom_complet",
                    numero_telephone: "numero_telephone",
                    matricule: "matricule",
                    colline_id:"colline_id",
                    carte_identite: "carte_identite",
                    nif: "nif",
                    type_agriculteur_id: "type_agriculteur_id",
                    date_creation: "date_creation"
                }
            }
        }

        let orderColumn, orderDirection
        // sorting
        let sortModel

        if (sortField) {
            for (let key in sortColumns) {
                if (sortColumns[key].fields.hasOwnProperty(sortField)) {
                    sortModel = {
                        model: key,
                        as: sortColumns[key].as
                    }

                    orderColumn = sortColumns[key].fields[sortField]

                    break
                }
            }
        }

        if (!orderColumn || !sortModel) {
            orderColumn = sortColumns.agriculteurs.fields.id_agriculteur

            sortModel = {
                model: 'agriculteurs',
                as: sortColumns.agriculteurs.as
            }

        }

        // ordering
        if (sortOrder == 1) {
            orderDirection = 'ASC'
        } else if (sortOrder == -1) {
            orderDirection = 'DESC'
        } else {
            orderDirection = defaultSortDirection
        }

        // searching
        const globalSearchColumns = [
            "id_agriculteur",
            "nom_complet",
            "numero_telephone",
            "matricule",
            "colline_id",
            "carte_identite",
            "nif",
            "type_agriculteur_id",
            "date_creation",
            "$type_agriculteur.nom_type_agriculteur$",
            "$colline.COLLINE_NAME$"
        ]

        let globalSearchWhereLike = {}

        if (search && search.trim() != "") {
            const searchWildCard = {}

            globalSearchColumns.forEach(column => {
                searchWildCard[column] = {
                    [Op.substring]: search
                }
            })

            globalSearchWhereLike = {
                [Op.or]: searchWildCard
            }
        }
        console.log(orderColumn)
        // console.log(Agriculteur.associations);
        const data = await Agriculteur.findAndCountAll({
            limit: parseInt(rows),
            offset: parseInt(first),
            order: [[orderColumn, orderDirection]],
            where: { ...globalSearchWhereLike, },
            include: [
                {
                    model: TypeAgriculteur,
                    as: 'type_agriculteur'
                },
                {
                    model: Colline,
                    as: 'colline'
                },
                {
                    model: AgriculteurWallet,
                    as: 'wallet'
                },
                {
                    model: Membre,
                    as: 'membres'
                },
                {
                    model: Terrain,
                    as: 'terrains',
                    include: [
                        {
                            model: Colline,
                            as: 'colline'
                        },
                        {
                            model: TerrainTypeCulture,
                            as: 'terrain_cultures',
                            include: [
                                {
                                    model: TypeCulture,
                                    as: 'type_culture'
                                }
                            ]
                        },
                        {
                            model: ExploitationTerrain,
                            as: 'exploitation',
                            include: [
                                {
                                    model: Membre,
                                    as: 'membre'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        res.json({
            httpStatus: 200,
            message: 'Agriculteurs recupérés avec succès',
            data
        });
    } catch (error) {
        console.error(error);

        res.json({
            // message: 'Erreur interne du serveur',
            message: error.message,
            httpStatus: 500,
            data: null
        })
    }
}

const createAgriculteur = async (req, res) => {

    const t = await sequelize.transaction();

    let files = {};

    // copier tous les fichiers uploadé
    for (const name in req.files) {
        files[name] = req.files[name]
    }

    try {

        const data = req.body;

        // password
        const salt = await bcrypt.genSalt(10);
        const randomPassword = passwordGenerator();
        const password = await bcrypt.hash(randomPassword, salt)

        // stocker les fichiers dans la memoire et recuperer le chemin
        for (const name in files) {
            const uploadedFile = await Upload.save(files[name], 'documents');
            const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
            files[name] = `${baseUrl}/${uploadedFile?.fileInfo?.fileName}`;
        }

        // Créer USER
        const user = await User.create({
            nom_complet: data.nom_complet,
            numero_telephone: data.numero_telephone,
            email: data.email || null,
            password: password,
            role_id: 1,
            colline_id: data.colline_id,
            statut: 1
        }, { transaction: t });

        // Créer AGRICULTEUR

        // matricule
        const matricule = await generateMatricule(data.colline_id, t);

        const agriculteur = await Agriculteur.create({
            type_agriculteur_id: data.type_agriculteur_id,
            nom_complet: data.nom_complet,
            numero_telephone: data.numero_telephone,
            carte_identite: data.carte_identite,
            matricule: matricule,
            colline_id: data.colline_id,
            user_id: user.id_user
        }, { transaction: t });

        // Créer WALLET
        const walletNumber = await generateUniqueWalletNumber();

        await AgriculteurWallet.create({
            agriculteur_id: agriculteur.id_agriculteur,
            wallet_number: walletNumber,
            balance_available: 0,
            blocked_balance: 0
        }, { transaction: t });

        // Enregistrer Membres si MENAGE
        let membres = [];
        if (data.type_agriculteur_id === 1 && data.membres) {
            for (let membreData of JSON.parse(data.membres)) {
                const membre = await Membre.create({
                    nom_complet: membreData.nom_complet,
                    agriculteur_id: agriculteur.id_agriculteur
                }, { transaction: t });

                membres.push(membre);
            }
        }

        // Enregistrement de Terrains
        const terrains = JSON.parse(data.terrains);

        for (let index = 0; index < terrains.length; index++) {
            const terrainData = terrains[index];

            const terrain = await Terrain.create({
                agriculteur_id: agriculteur.id_agriculteur,
                superficie: terrainData.superficie,
                colline_id: terrainData.colline_id,
                longitude: terrainData.longitude,
                latitude: terrainData.latitude,
                land_tenure_type: terrainData.land_tenure_type,
                titre_document: files[`titre_document_${index}`],
                validation_status: 0
            }, { transaction: t });

            // Types culture
            for (let cultureId of terrainData.type_culture_ids) {
                await TerrainTypeCulture.create({
                    terrain_id: terrain.id_terrain,
                    type_culture_id: cultureId,
                    status: 1
                }, { transaction: t })
            }

            // Exploitation
            let membreId = null;
            if (data.type_agriculteur_id === 1) {
                if(terrainData.membre_index !== null && membres[terrainData.membre_index]) {
                    membreId = membres[terrainData.membre_index].id;
                }
            }

            await ExploitationTerrain.create({
                terrain_id: terrain.id_terrain,
                membre_id: membreId,
                status: 1
            }, { transaction: t });
            
        }

        await t.commit();

        // Envoyer mot de passe par SMS (à integrer avec API SMS)
        console.log(`Mot de passe envoyé à ${data.numero_telephone} : ${randomPassword}`)

        return res.status(200).json({
            message: "Agriculteur crée avec succès",
            wallet_created: true
        })

    } catch (error) {

        await t.rollback();

        return res.status(400).json({
            error: error.message
        });
    }
}

const validateTerrain = async (req, res) => {

    const t = await sequelize.transaction();

    try {
        
        const { terrain_id } = req.params;
        const { status, commentaire } = req.body;
        
        const terrain = await Terrain.findByPk(terrain_id, { transaction: t });

        if (!terrain) {
            return res.json({
                httpStatus: 404,
                message: 'Terrain non trouvé',
            });
        }

        if (terrain.validation_status === 2) {
            return res.json({
                httpStatus: 404,
                message: 'Terrain déjà validé',
            });
        }

        if (terrain.validation_status === 3) {
            return res.json({
                httpStatus: 404,
                message: 'Terrain déjà rejeté',
            });
        }

        // Créer validation
        await TerrainValidation.create({
            terrain_id,
            user_id,
            role_validation,
            status,
            commentaire,
            date_validation: new Date()
        }, { transaction: t });

        // Recalcul status terrain 
        const validations = await TerrainValidation.findAll({
            where: { terrain_id },
            transaction: t
        });

        // (0 = 'REJECTED') and (1 = 'APPROVED')
        const hasRejected = validations.some(v => v.status === 0);
        const approvedCount = validations.filter(v => v.status === 1).length;

        // 0: 'PENDING', 1: 'PARTIALLY_VALIDATED', 2: 'VALIDATED', 3: 'REJECTED (For validation_status)
        let newStatus = 0;

        if (hasRejected) {
            newStatus = 3;
        } else if (approvedCount >= 3) {
            newStatus = 2;
        } else if (approvedCount >= 1) {
            newStatus = 1;
        }

        await terrain.update(
            { validation_status: newStatus },
            { transaction: t }
        );

        await t.commit();

        return res.json({
            message: "Validation enregistrée",
            terrain_status: newStatus
        });
    } catch (error) {
        await t.rollback();

        return res.status(400).json({
            error: error.message
        });
    }
}

const updateAgriculteur = async (req, res) => {

    const t = await sequelize.transaction();

    try {
        
        const { id } = req.params;
        const data = req.body;

        const agriculteur = await Agriculteur.findByPk(id, { transaction: t });

        if (!agriculteur) {
            return res.json({
                httpStatus: 404,
                message: 'Agriculteur non trouvé'
            });
        }

        // ================ USER ======================
        await User.update({
            nom_complet: data.nom_complet,
            numero_telephone: data.numero_telephone,
            email: data.email || null,
            colline_id: data.colline_id
        }, {
            where: { id_user: agriculteur.user_id },
            transaction: t
        });

        // =============== AGRICULTEUR ================
        await agriculteur.update({
            nom_complet: data.nom_complet,
            numero_telephone: data.numero_telephone,
            carte_identite: data.carte_identite,
            type_agriculteur_id: data.type_agriculteur_id,
            colline_id: data.colline_id
        }, { transaction: t });

        // =============== MEMBRES ====================
        const existingMembres = await Membre.findAll({
            where: { agriculteur_id: agriculteur.id_agriculteur },
            transaction: t
        });

        // const existingIds = existingMembres.map(m => m.id);
        const payloadMembres = JSON.parse(data.membres || "[]");

        const payloadIds = payloadMembres
            .filter(m => m.id)
            .map(m => m.id);

        // DESACTIVATION ceux absents du payload
        for (let membre of existingMembres) {
            if (!payloadIds.includes(membre.id)) {
                await membre.update( { status: 0 }, { transaction: t });
            }
        }

        // UPDATE OR CREATE
        for (let membreData of payloadMembres) {

            if (membreData.id) {
                // UPDATE
                await Membre.update(
                    { 
                        nom_complet: membreData.nom_complet,
                        status: 1 
                    },
                    { where: { id: membreData.id }, transaction: t }
                );
            } else {
                // CREATE
                await Membre.create({
                    nom_complet: membreData.nom_complet,
                    agriculteur_id: agriculteur.id_agriculteur,
                    status: 1
                }, { transaction: t });
            }
        }

        // =================== TERRAIN ====================
        const existingTerrains = await Terrain.findAll({
            where: { agriculteur_id: agriculteur.id_agriculteur },
            transaction: t
        });

        // const existingTerrainIds = existingTerrains.map(t => t.id_terrain);
        const payloadTerrains = JSON.parse(data.terrains || "[]");

        const payloadTerrainIds = payloadTerrains
            .filter(t => t.id)
            .map(t => t.id);

        // DESACTIVATION
        for (let terrain of existingTerrains) {
            if (!payloadTerrainIds.includes(terrain.id_terrain)) {

                // Désactiver exploitation active
                await ExploitationTerrain.update(
                    {
                        status: 0,
                        date_fin: new Date()
                    }, 
                    {
                        where: { 
                            terrain_id: terrain.id_terrain,
                            status: 1 
                        },
                        transaction: t
                    }
                );

                // Désactiver terrain
                await terrain.update({ status: 0 }, { transaction: t });
            }
        }

        // UPDATE / CREATE
        for (let terrainData of payloadTerrains) {

            let terrain;

            if (terrainData.id) {

                // UPDATE
                await Terrain.update({
                    superficie: terrainData.superficie,
                    colline_id: terrainData.colline_id,
                    longitude: terrainData.longitude,
                    latitude: terrainData.latitude,
                    land_tenure_type: terrainData.land_tenure_type,
                    validation_status: 1, // reset PENDING
                    status: 1
                }, {
                    where: { id_terrain: terrainData.id },
                    transaction: t
                });

                terrain = await Terrain.findByPk(terrainData.id, { transaction: t });

            } else {

                // CREATE
                terrain = await Terrain.create({
                    agriculteur_id: agriculteur.id_agriculteur,
                    superficie: terrainData.superficie,
                    colline_id: terrainData.colline_id,
                    longitude: terrainData.longitude,
                    latitude: terrainData.latitude,
                    land_tenure_type: terrainData.land_tenure_type,
                    validation_status: 1
                }, { transaction: t });

            }

            // ================= UPDATE CULTURES INTELLIGENT =================

            const existingCultures = await TerrainTypeCulture.findAll({
                where: { 
                    terrain_id: terrain.id_terrain
                },
                transaction: t
            });

            // IDs existants
            const existingCultureIds = existingCultures.map(c => c.type_culture_id);

            // IDs envoyés
            const payloadCultureIds = terrainData.type_culture_ids || [];

            // Désactiver celles supprimées
            for (let culture of existingCultures) {

                if (!payloadCultureIds.includes(culture.type_culture_id) && culture.status === 1) {

                    await culture.update({
                        status: 0,
                        date_fin: new Date()
                    }, { transaction: t });

                }
            }

            // Ajouter ou réactiver
            for (let cultureId of payloadCultureIds) {

                const existing = existingCultures.find(
                    c => c.type_culture_id === cultureId
                );

                if (existing) {

                    // Si existait mais inactif → réactiver
                    if (existing.status === 0) {
                        await existing.update({
                            status: 1,
                            date_fin: null
                        }, { transaction: t });
                    }

                } else {

                    // Nouvelle culture
                    await TerrainTypeCulture.create({
                        terrain_id: terrain.id_terrain,
                        type_culture_id: cultureId,
                        status: 1
                    }, { transaction: t });
                }
            }

            // ================= EXPLOITATION =================

            let membreId = null;

            if (data.type_agriculteur_id === 1) {
                membreId = terrainData.membre_id || null;
            }

            // exploitation active actuelle
            const activeExploitation = await ExploitationTerrain.findOne({
            where: {
                terrain_id: terrain.id_terrain,
                status: 1
            },
            transaction: t
            });

            // Si changement de membre
            if (activeExploitation && activeExploitation.membre_id !== membreId) {

                // Désactiver ancienne
                await activeExploitation.update({
                    status: 0,
                    date_fin: new Date()
                }, { transaction: t });

                // Créer nouvelle
                await ExploitationTerrain.create({
                    terrain_id: terrain.id_terrain,
                    membre_id: membreId,
                    status: 1
                }, { transaction: t });

            } else if (!activeExploitation) {

                // Nouveau terrain
                await ExploitationTerrain.create({
                    terrain_id: terrain.id_terrain,
                    membre_id: membreId,
                    status: 1
                }, { transaction: t });

            }

        }

        await t.commit();

        return res.status(200).json({
            message: "Agriculteur modifié avec succès"
        });

    } catch (error) {

        await t.rollback();

        return res.status(400).json({
            error: error.message
        });
    }
}

module.exports = {
    createAgriculteur,
    validateTerrain,
    updateAgriculteur,
    getAgriculteurs
}
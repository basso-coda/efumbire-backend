const { sequelize } = require("../../db/models");
const Approvisionnement = require("../../db/models/gestion_stocks/Approvisionnement");
const ApprovisionnementItems = require("../../db/models/gestion_stocks/ApprovisionnementItems");
const StockMouvement = require("../../db/models/gestion_stocks/StockMouvement");
const Stock = require("../../db/models/gestion_stocks/Stock");

const createApprovisionnement = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const {
            fournisseur_id,
            date_reception,
            items,
            user_id
        } = req.body;

        // const user_id = req.user?.id_user || 1; // adapte selon ton auth

        // =========================
        // 1. Validation
        // =========================
        if (!fournisseur_id || !date_reception || !items?.length || !user_id) {
            return res.status(400).json({
                message: "Données invalides"
            });
        }

        // =========================
        // 2. Générer référence
        // =========================
        const referenceNumber = "APP-" + Date.now();

        // =========================
        // 3. Créer approvisionnement
        // =========================
        const approvisionnement = await Approvisionnement.create({
            reference_number: referenceNumber,
            fournisseur_id,
            date_reception,
            user_id
        }, { transaction: t });

        // =========================
        // 4. Traiter les items
        // =========================
        for (let item of items) {

            const { type_engrais_id, quantite_recue, colline_id } = item;

            if (!type_engrais_id || !quantite_recue || !colline_id) {
                throw new Error("Item invalide");
            }

            // 4.1 créer item
            await ApprovisionnementItems.create({
                approvisionnement_id: approvisionnement.id_approvisionnement,
                type_engrais_id,
                quantite_recue
            }, { transaction: t });

            // 4.2 trouver ou créer stock
            let stock = await Stock.findOne({
                where: {
                    type_engrais_id,
                    colline_id
                },
                transaction: t
            });

            if (!stock) {
                stock = await Stock.create({
                    type_engrais_id,
                    colline_id,
                    quantite_disponible: quantite_recue
                }, { transaction: t });
            } else {
                await stock.update({
                    quantite_disponible:
                        Number(stock.quantite_disponible) + Number(quantite_recue),
                    updated_date: new Date()
                }, { transaction: t });
            }

            // 4.3 mouvement stock
            await StockMouvement.create({
                stock_id: stock.id_stock,
                type_mouvement: "ENTREE",
                quantite: quantite_recue,
                reference_type: "APPROVISIONNEMENT",
                reference_id: approvisionnement.id_approvisionnement
            }, { transaction: t });
        }

        // =========================
        // 5. Commit
        // =========================
        await t.commit();

        return res.status(201).json({
            message: "Approvisionnement enregistré avec succès",
            approvisionnement_id: approvisionnement.id_approvisionnement,
            reference_number: referenceNumber
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
    createApprovisionnement
}

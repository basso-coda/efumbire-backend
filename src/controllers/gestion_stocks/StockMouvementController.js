const { sequelize } = require("../../db/models");
const Commande = require("../../db/models/gestion_commandes/Commande");
const CommandeInvoice = require("../../db/models/gestion_commandes/CommandeInvoice");
const Colline = require("../../db/models/gestion_provinces/Colline");
const Approvisionnement = require("../../db/models/gestion_stocks/Approvisionnement");
const Fournisseur = require("../../db/models/gestion_stocks/Fournisseur");
const Stock = require('../../db/models/gestion_stocks/Stock');
const StockMouvement = require("../../db/models/gestion_stocks/StockMouvement");
const TypeEngrais = require("../../db/models/gestion_terrains/TypeEngrais");
const CommandeItems = require("../../db/models/gestion_commandes/CommandeItems")


const getStockMouvements = async (req, res) => {
    try {

        const { rows = 10, first = 0 } = req.query;

        const mouvements = await StockMouvement.findAndCountAll({
            limit: parseInt(rows),
            offset: parseInt(first),
            order: [["date_mouvement", "DESC"]],
            include: [
                {
                    model: Stock,
                    as: "stock",
                    include: ["type_engrais", "colline"]
                }
            ]
        });

        // ===============================
        // 1. Grouper les références
        // ===============================
        const approvisionnementIds = [];
        const commandeIds = [];

        for (let m of mouvements.rows) {
            if (m.reference_type === "APPROVISIONNEMENT") {
                approvisionnementIds.push(m.reference_id);
            }
            if (m.reference_type === "COMMANDE") {
                commandeIds.push(m.reference_id);
            }
        }

        // ===============================
        // 2. Charger les données liées
        // ===============================
        const approvisionnements = await Approvisionnement.findAll({
            where: { id_approvisionnement: approvisionnementIds },
            include: [{ model: Fournisseur, as: "fournisseur" }]
        });

        const commandes = await CommandeInvoice.findAll({
            where: { id_commande_invoice: commandeIds }
        });

        // ===============================
        // 3. Transformer en MAP (optimisation)
        // ===============================
        const approMap = {};
        approvisionnements.forEach(a => {
            approMap[a.id_approvisionnement] = a;
        });

        const cmdMap = {};
        commandes.forEach(c => {
            cmdMap[c.id_commande_invoice] = c;
        });

        // ===============================
        // 4. Enrichir les mouvements
        // ===============================
        const enriched = mouvements.rows.map(m => {

            let reference_data = null;

            if (m.reference_type === "APPROVISIONNEMENT") {
                reference_data = approMap[m.reference_id] || null;
            }

            if (m.reference_type === "COMMANDE") {
                reference_data = cmdMap[m.reference_id] || null;
            }

            return {
                ...m.toJSON(),
                reference_data
            };
        });

        return res.json({
            httpStatus: 200,
            message: "Mouvements récupérés avec succès",
            data: {
                count: mouvements.count,
                rows: enriched
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            httpStatus: 500,
            message: error.message
        });
    }
};

const retraitStockByVoucher = async (req, res) => {
    const t = await sequelize.transaction();

    try {

        const { voucher_code } = req.body;

        if (!voucher_code) {
            return res.status(400).json({
                message: "voucher_code requis"
            });
        }

        // ============================
        // 1. Trouver facture via voucher
        // ============================
        const invoice = await CommandeInvoice.findOne({
            where: { voucher_code },
            include: [
                {
                    model: Commande,
                    as: 'commande',
                    include: [
                        {
                            model: CommandeItems,
                            as: 'items'
                        }
                    ]
                }
            ],
            transaction: t
        });

        if (!invoice) {
            throw new Error("Voucher invalide");
        }

        if (invoice.statut_payment !== "PAID") {
            throw new Error("Paiement non effectué");
        }

        if (invoice.voucher_used) {
            throw new Error("Voucher déjà utilisé");
        }

        const commande = invoice.commande;

        // ============================
        // 2. Traitement stock
        // ============================
        for (let item of commande.items) {

            const stock = await Stock.findOne({
                where: {
                    type_engrais_id: item.type_engrais_id,
                    colline_id: commande.colline_id
                },
                transaction: t
            });

            if (!stock) {
                throw new Error("Stock introuvable");
            }

            const dispo = Number(stock.quantite_disponible);

            if (dispo < item.quantite) {
                throw new Error(
                    `Stock insuffisant pour engrais ${item.type_engrais_id}`
                );
            }

            // Déduction stock
            await stock.update({
                quantite_disponible: dispo - item.quantite
            }, { transaction: t });

            // Mouvement stock
            await StockMouvement.create({
                stock_id: stock.id_stock,
                type_mouvement: "SORTIE",
                quantite: item.quantite,
                reference_type: "COMMANDE",
                reference_id: commande.id_commande
            }, { transaction: t });
        }

        // ============================
        // 3. Marquer voucher utilisé
        // ============================
        await invoice.update({
            voucher_used: true
        }, { transaction: t });

        await t.commit();

        return res.status(200).json({
            message: "Retrait effectué avec succès",
            data: {
                agriculteur_id: commande.agriculteur_id,
                total_items: commande.items.length
            }
        });

    } catch (error) {

        await t.rollback();

        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getStockMouvements,
    retraitStockByVoucher
}
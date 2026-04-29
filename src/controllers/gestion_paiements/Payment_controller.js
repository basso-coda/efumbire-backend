const path = require("path")
const { sequelize } = require("../../db/models");
const Payment = require("../../db/models/gestion_paiements/Payment");
const Deposit = require("../../db/models/gestion_paiements/Deposit");
const WalletTransaction = require("../../db/models/gestion_paiements/WalletTransaction");
const CommandeInvoice = require("../../db/models/gestion_commandes/CommandeInvoice");
const AgriculteurWallet = require("../../db/models/gestion_paiements/AgriculteurWallet");

const Upload = require("../../utils/Upload")
const voucherCodeGenerator = require("../../utils/voucherCodeGenerator");


/**
 * Générer voucher unique
 */
const generateUniqueVoucher = async () => {
    let code;
    let exists = true;

    while (exists) {
        code = voucherCodeGenerator();

        exists = await CommandeInvoice.findOne({
            where: { voucher_code: code }
        });
    }

    return code;
};

/**
 * Consommer subvention bloquée
 */
const consumeBlockedSubvention = async (wallet, invoice, transaction) => {
    const blocked = Number(wallet.blocked_balance || 0);
    const subvention = Number(invoice.subvention_amount || 0);

    if (blocked < subvention) {
        throw new Error("Solde subvention bloqué insuffisant");
    }

    await wallet.update({
        blocked_balance: blocked - subvention
    }, { transaction });
};

/**
 * Créer un paiement (BANK ou WALLET)
 * POST /payments
 */
const createPayment = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        const {
            commande_invoice_id,
            payment_method,
            payment_reference
        } = req.body;

        // ===================================
        // Validation entrée
        // ===================================
        if (!commande_invoice_id || !payment_method) {
            await t.rollback();

            return res.status(400).json({
                message: "commande_invoice_id et payment_method sont obligatoires"
            });
        }

        if (!["BANK", "WALLET"].includes(payment_method)) {
            await t.rollback();

            return res.status(400).json({
                message: "Méthode de paiement invalide"
            });
        }

        // ===================================
        // Charger facture
        // ===================================
        const invoice = await CommandeInvoice.findByPk(
            commande_invoice_id,
            { transaction: t }
        );

        if (!invoice) {
            await t.rollback();

            return res.status(404).json({
                message: "Facture introuvable"
            });
        }

        if (["PAID", "CANCELLED"].includes(invoice.statut_payment)) {
            await t.rollback();

            return res.status(400).json({
                message: "Cette facture ne peut plus être payée"
            });
        }

        const amountToPay = Number(invoice.amount_to_pay || 0);

        // ===================================
        // Récupérer commande + wallet
        // ===================================
        const commande = await invoice.getCommande({
            transaction: t
        });

        if (!commande) {
            throw new Error("Commande introuvable");
        }

        const wallet = await AgriculteurWallet.findOne({
            where: {
                agriculteur_id: commande.agriculteur_id
            },
            transaction: t
        });

        if (!wallet) {
            throw new Error("Wallet introuvable");
        }

        // ===================================
        // Générer voucher unique
        // ===================================
        const voucherCode = await generateUniqueVoucher();

        // ===================================
        // CAS BANK
        // ===================================
        if (payment_method === "BANK") {

            if (!payment_reference) {
                await t.rollback();

                return res.status(400).json({
                    message: "Référence bordereau obligatoire"
                });
            }

            if (!req.files || !req.files.proof_document){
                await t.rollback();

                return res.status(400).json({
                    message: "Le bordereau bancaire est obligatoire"
                });
            }

            // Upload fichier
            const uploadedFile = await Upload.save(
                req.files.proof_document,
                "payments"
            );

            const baseUrl =
                process.env.BASE_URL ||
                `${req.protocol}://${req.get("host")}`;

            const proofDocument =
                `${baseUrl}/${uploadedFile?.fileInfo?.fileName}`;

            // consommer subvention bloquée
            await consumeBlockedSubvention(wallet, invoice, t);

            const payment = await Payment.create({
                commande_invoice_id,
                payment_method: "BANK",
                amount_paid: amountToPay,
                payment_reference,
                proof_document: proofDocument,
                payment_status: "PAID",
                payment_date: new Date()
            }, { transaction: t });

            await invoice.update({
                statut_payment: "PAID",
                voucher_code: voucherCode
            }, { transaction: t });

            await t.commit();

            return res.status(201).json({
                message: "Paiement banque effectué avec succès",
                payment,
                voucher_code: voucherCode
            });
        }

        // ===================================
        // CAS WALLET
        // ===================================
        if (payment_method === "WALLET") {

            const available = Number(wallet.balance_available || 0);

            if (available < amountToPay) {
                await t.rollback();

                return res.status(400).json({
                    message: "Solde wallet insuffisant"
                });
            }

            // retirer argent wallet
            await wallet.update({
                balance_available: available - amountToPay
            }, { transaction: t });

            // consommer subvention bloquée
            await consumeBlockedSubvention(wallet, invoice, t);

            // transaction wallet
            const walletTx = await WalletTransaction.create({
                transaction_type: "PAYMENT",
                transaction_amount: amountToPay,
                transaction_code: "PAY-" + Date.now(),
                wallet_id: wallet.id_agriculteur_wallet,
                transaction_date: new Date()
            }, { transaction: t });

            const payment = await Payment.create({
                wallet_transaction_id: walletTx.id_wallet_transaction,
                commande_invoice_id,
                payment_method: "WALLET",
                amount_paid: amountToPay,
                payment_status: "PAID",
                payment_date: new Date()
            }, { transaction: t });

            await invoice.update({
                statut_payment: "PAID",
                voucher_code: voucherCode
            }, { transaction: t });

            await t.commit();

            return res.status(201).json({
                message: "Paiement wallet effectué avec succès",
                payment,
                voucher_code: voucherCode
            });
        }

    } catch (error) {

        await t.rollback();

        console.error(error);

        return res.status(500).json({
            message: error.message || "Erreur interne du serveur"
        });
    }
};

module.exports = {
    createPayment
};
const paymentRouter = require('express').Router();
const PaymentController = require('../../controllers/gestion_paiements/Payment_controller')


/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Effectuer le paiement d’une facture commande
 *     description: >
 *       Permet de payer une facture liée à une commande d’engrais.
 *       
 *       Deux méthodes sont supportées :
 *       - **BANK** : l’agent enregistre un paiement bancaire avec upload du bordereau.
 *       - **WALLET** : paiement électronique via wallet de l’agriculteur.
 *
 *       Si le paiement réussit :
 *       - la facture passe à **PAID**
 *       - un **voucher_code** est généré automatiquement
 *       - le paiement est enregistré dans la table payment
 *       - si WALLET : une transaction PAYMENT est ajoutée dans wallet_transaction
 *
 *     tags:
 *       - Paiements
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - commande_invoice_id
 *               - payment_method
 *             properties:
 *               commande_invoice_id:
 *                 type: integer
 *                 example: 12
 *
 *               payment_method:
 *                 type: string
 *                 enum: [BANK, WALLET]
 *                 example: BANK
 *
 *               payment_reference:
 *                 type: string
 *                 description: Référence bancaire / numéro bordereau (obligatoire si BANK)
 *                 example: BRB-2026-8891
 *
 *               proof_document:
 *                 type: string
 *                 format: binary
 *                 description: Bordereau scanné ou preuve bancaire (obligatoire si BANK)
 *
 *     responses:
 *       201:
 *         description: Paiement effectué avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 httpStatus:
 *                   type: integer
 *                   example: 201
 *
 *                 message:
 *                   type: string
 *                   example: Paiement effectué avec succès
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_payment:
 *                       type: integer
 *                       example: 5
 *
 *                     commande_invoice_id:
 *                       type: integer
 *                       example: 12
 *
 *                     payment_method:
 *                       type: string
 *                       example: BANK
 *
 *                     amount_paid:
 *                       type: number
 *                       example: 25000
 *
 *                     payment_status:
 *                       type: string
 *                       example: PAID
 *
 *                     payment_date:
 *                       type: string
 *                       format: date-time
 *
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 httpStatus:
 *                   type: integer
 *                   example: 400
 *
 *                 message:
 *                   type: string
 *                   example: commande_invoice_id et payment_method sont obligatoires
 *
 *       404:
 *         description: Facture ou wallet introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 httpStatus:
 *                   type: integer
 *                   example: 404
 *
 *                 message:
 *                   type: string
 *                   example: Facture introuvable
 *
 *       422:
 *         description: Paiement refusé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 httpStatus:
 *                   type: integer
 *                   example: 422
 *
 *                 message:
 *                   type: string
 *                   example: Solde insuffisant
 *
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 httpStatus:
 *                   type: integer
 *                   example: 500
 *
 *                 message:
 *                   type: string
 *                   example: Erreur interne du serveur
 */
paymentRouter.post('/payments', PaymentController.createPayment);

module.exports = paymentRouter;
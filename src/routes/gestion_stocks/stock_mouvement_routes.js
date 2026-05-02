const stockMouvementRouter = require('express').Router();
const StockMouvementController = require("../../controllers/gestion_stocks/StockMouvementController");

/**
 * @swagger
 * /stock_mouvements/retrait:
 *   post:
 *     summary: Retrait d'engrais via voucher
 *     description: >
 *       Permet à un agent de valider un voucher présenté par un agriculteur
 *       et de procéder à la sortie du stock.
 *     tags:
 *       - Stock
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - voucher_code
 *             properties:
 *               voucher_code:
 *                 type: string
 *                 example: VCH-20260430-12345
 *     responses:
 *       200:
 *         description: Retrait effectué avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Retrait effectué avec succès
 *                 data:
 *                   type: object
 *                   properties:
 *                     agriculteur_id:
 *                       type: integer
 *                     total_items:
 *                       type: integer
 *       400:
 *         description: Erreur métier (voucher invalide, déjà utilisé, etc.)
 *       500:
 *         description: Erreur serveur
 */
stockMouvementRouter.post("/stock_mouvements/retrait", StockMouvementController.retraitStockByVoucher);

stockMouvementRouter.get("/stock_mouvements", StockMouvementController.getStockMouvements);

module.exports = stockMouvementRouter;
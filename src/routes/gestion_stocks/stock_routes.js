const stockRouter = require('express').Router();
const StockController = require('../../controllers/gestion_stocks/StockController');


stockRouter.get("/stocks", StockController.getStocks);

/**
 * @swagger
 * /stocks/:colline_id:
 *   get:
 *     summary: Lister le stock par colline
 *     description: >
 *       Permet de récupérer la liste des stocks disponibles par colline et par type d’engrais.
 *       Possibilité de filtrer par colline.
 *     tags:
 *       - Stock
 *     parameters:
 *       - in: query
 *         name: colline_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtrer par colline
 *     responses:
 *       200:
 *         description: Stock récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 httpStatus:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Stock récupéré avec succès
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_stock:
 *                         type: integer
 *                       quantite_disponible:
 *                         type: number
 *                       updated_date:
 *                         type: string
 *                         format: date-time
 *                       type_engrais:
 *                         type: object
 *                         properties:
 *                           id_type_engrais:
 *                             type: integer
 *                           nom_type_engrais:
 *                             type: string
 *                           prix:
 *                             type: number
 *                       colline:
 *                         type: object
 *                         properties:
 *                           id_colline:
 *                             type: integer
 *                           nom_colline:
 *                             type: string
 *       500:
 *         description: Erreur interne du serveur
 */
stockRouter.get("/stocks/:colline_id", StockController.getStockByColline);

module.exports = stockRouter;
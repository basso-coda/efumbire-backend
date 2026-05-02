const approvisionnementRouter = require('express').Router();
const ApprovisionnementController = require('../../controllers/gestion_stocks/ApprovisionnementController');


/**
 * @swagger
 * /approvisionnements:
 *   post:
 *     summary: Créer un approvisionnement (entrée de stock)
 *     description: >
 *       Permet d’enregistrer un approvisionnement en engrais.
 *       Cette opération :
 *       - crée un approvisionnement
 *       - enregistre les items
 *       - met à jour le stock
 *       - enregistre les mouvements de stock (ENTREE)
 *     tags:
 *       - Stock
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fournisseur_id
 *               - date_reception
 *               - items
 *             properties:
 *               fournisseur_id:
 *                 type: integer
 *                 example: 1
 *               date_reception:
 *                 type: string
 *                 format: date
 *                 example: "2026-04-30"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - type_engrais_id
 *                     - quantite_recue
 *                     - colline_id
 *                   properties:
 *                     type_engrais_id:
 *                       type: integer
 *                       example: 1
 *                     quantite_recue:
 *                       type: number
 *                       example: 500
 *                     colline_id:
 *                       type: integer
 *                       example: 10
 *     responses:
 *       201:
 *         description: Approvisionnement créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Approvisionnement enregistré avec succès
 *                 approvisionnement_id:
 *                   type: integer
 *                   example: 1
 *                 reference_number:
 *                   type: string
 *                   example: APP-1714460000000
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur interne du serveur
 */
approvisionnementRouter.post("/approvisionnements", ApprovisionnementController.createApprovisionnement);




module.exports = approvisionnementRouter;
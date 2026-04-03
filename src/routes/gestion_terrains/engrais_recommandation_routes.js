const engraisRecommandationRouter = require('express').Router();
const EngraisRecommandationController = require('../../controllers/gestion_terrains/EngraisRecommandation_controller')

/**
 * @swagger
 * /engrais_recommandations:
 *   get:
 *     summary: Récupérer la liste des recommandations d'engrais
 *     tags:
 *       - Engrais Recommandations
 *     parameters:
 *       - in: query
 *         name: rows
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments à retourner
 *         example: 10
 *       - in: query
 *         name: first
 *         schema:
 *           type: integer
 *         description: Offset (pagination)
 *         example: 0
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *         example: dose_par_hectare
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: integer
 *         description: 1 = ASC, -1 = DESC
 *         example: -1
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche globale
 *         example: 50
 *     responses:
 *       200:
 *         description: Liste récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
engraisRecommandationRouter.get('/engrais_recommandations', EngraisRecommandationController.getEngraisRecommandations);

/**
 * @swagger
 * /engrais_recommandations:
 *   post:
 *     summary: Créer une recommandation d'engrais
 *     tags:
 *       - Engrais Recommandations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type_engrais_id
 *               - type_culture_id
 *               - dose_par_hectare
 *             properties:
 *               type_engrais_id:
 *                 type: integer
 *                 example: 1
 *               type_culture_id:
 *                 type: integer
 *                 example: 2
 *               dose_par_hectare:
 *                 type: number
 *                 example: 50
 *               min_dose:
 *                 type: number
 *                 example: 30
 *               max_dose:
 *                 type: number
 *                 example: 70
 *               saison_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Recommandation créée avec succès
 *       422:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 */
engraisRecommandationRouter.post('/engrais_recommandations', EngraisRecommandationController.createEngraisRecommandation);

/**
 * @swagger
 * /engrais_recommandations/{id_engrais_recommandations}:
 *   get:
 *     summary: Récupérer une recommandation d'engrais
 *     tags:
 *       - Engrais Recommandations
 *     parameters:
 *       - in: path
 *         name: id_engrais_recommandations
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Recommandation trouvée
 *       404:
 *         description: Non trouvé
 *       500:
 *         description: Erreur serveur
 */
engraisRecommandationRouter.get('/engrais_recommandations/:id_engrais_recommandations', EngraisRecommandationController.getOneEngraisRecommandation);

/**
 * @swagger
 * /engrais_recommandations/{id_engrais_recommandations}:
 *   put:
 *     summary: Modifier une recommandation d'engrais
 *     tags:
 *       - Engrais Recommandations
 *     parameters:
 *       - in: path
 *         name: id_engrais_recommandations
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_engrais_id:
 *                 type: integer
 *                 example: 1
 *               type_culture_id:
 *                 type: integer
 *                 example: 2
 *               dose_par_hectare:
 *                 type: number
 *                 example: 60
 *     responses:
 *       200:
 *         description: Recommandation mise à jour
 *       404:
 *         description: Non trouvé
 *       500:
 *         description: Erreur serveur
 */
engraisRecommandationRouter.put('/engrais_recommandations/:id_engrais_recommandations', EngraisRecommandationController.updateEngraisRecommandation);

/**
 * @swagger
 * /engrais_recommandations/delete:
 *   delete:
 *     summary: Supprimer une ou plusieurs recommandations d'engrais
 *     tags:
 *       - Engrais Recommandations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids_engrais_recommandation
 *             properties:
 *               ids_engrais_recommandation:
 *                 type: string
 *                 description: JSON string contenant les IDs
 *                 example: "[1,2,3]"
 *     responses:
 *       200:
 *         description: Suppression réussie
 *       404:
 *         description: Non trouvé
 *       500:
 *         description: Erreur serveur
 */
engraisRecommandationRouter.delete('/engrais_recommandations/delete', EngraisRecommandationController.deleteEngraisRecommandations);

module.exports = engraisRecommandationRouter;

const agriculteurRouter = require('express').Router();
const AgriculteurController = require('../../controllers/gestion_agriculteurs/Agriculteur_controller')


agriculteurRouter.get('/agriculteurs', AgriculteurController.getAgriculteurs);

/**
 * @swagger
 * /agriculteurs:
 *   post:
 *     summary: Créer un agriculteur avec terrains, membres et documents
 *     tags:
 *       - Agriculteurs
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nom_complet
 *               - numero_telephone
 *               - type_agriculteur_id
 *               - colline_id
 *               - terrains
 *             properties:
 *               nom_complet:
 *                 type: string
 *                 example: "Jean Ndayishimiye"
 *               numero_telephone:
 *                 type: string
 *                 example: "25761234567"
 *               email:
 *                 type: string
 *                 example: "jean@gmail.com"
 *               type_agriculteur_id:
 *                 type: integer
 *                 example: 1
 *               colline_id:
 *                 type: integer
 *                 example: 10
 *               carte_identite:
 *                 type: string
 *                 example: "123456789"
 *               
 *               membres:
 *                 type: string
 *                 description: JSON string des membres (si ménage)
 *                 example: '[{"nom_complet":"Marie"},{"nom_complet":"Paul"}]'
 *               
 *               terrains:
 *                 type: string
 *                 description: JSON string des terrains
 *                 example: >
 *                   [
 *                     {
 *                       "superficie": 2.5,
 *                       "colline_id": 5,
 *                       "longitude": 29.36,
 *                       "latitude": -3.38,
 *                       "land_tenure_type": "OWNED",
 *                       "type_culture_ids": [1,2],
 *                       "membre_index": 0
 *                     }
 *                   ]
 *               
 *               titre_document_0:
 *                 type: string
 *                 format: binary
 *                 description: Document du terrain 0
 *
 *     responses:
 *       200:
 *         description: Agriculteur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Agriculteur crée avec succès
 *                 wallet_created:
 *                   type: boolean
 *                   example: true
 *
 *       400:
 *         description: Erreur lors de la création
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
agriculteurRouter.post('/agriculteurs', AgriculteurController.createAgriculteur);

agriculteurRouter.post('/terrain-validations/:terrain_id', AgriculteurController.validateTerrain);
agriculteurRouter.put('/agriculteur-update/:id_agriculteur', AgriculteurController.updateAgriculteur)

module.exports = agriculteurRouter;
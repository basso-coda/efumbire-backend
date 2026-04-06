const agriculteurRouter = require('express').Router();
const AgriculteurController = require('../../controllers/gestion_agriculteurs/Agriculteur_controller')

/**
 * @swagger
 * /agriculteurs:
 *   get:
 *     summary: Récupérer la liste des agriculteurs
 *     description: Retourne une liste paginée des agriculteurs avec leurs relations (type, colline, wallet, membres, terrains, cultures, exploitation).
 *     tags:
 *       - Agriculteurs
 *     parameters:
 *       - in: query
 *         name: rows
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: first
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Offset (début de la pagination)
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *           example: nom_complet
 *         description: Champ de tri
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Ordre de tri (1 = ASC, -1 = DESC)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: Jean
 *         description: Recherche globale
 *     responses:
 *       200:
 *         description: Liste des agriculteurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_agriculteur:
 *                         type: integer
 *                         example: 1
 *                       nom_complet:
 *                         type: string
 *                         example: Jean Ndayizeye
 *                       numero_telephone:
 *                         type: string
 *                         example: 69000000
 *                       matricule:
 *                         type: string
 *                         example: AGR12345
 *                       type_agriculteur:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           libelle:
 *                             type: string
 *                       colline:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nom:
 *                             type: string
 *                       wallet:
 *                         type: object
 *                         properties:
 *                           solde:
 *                             type: number
 *                             example: 50000
 *                       membres:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             nom:
 *                               type: string
 *                       terrains:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             superficie:
 *                               type: number
 *                             colline:
 *                               type: object
 *                             terrain_cultures:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   type_culture:
 *                                     type: object
 *                             exploitation:
 *                               type: object
 *                               properties:
 *                                 membre:
 *                                   type: object
 *       500:
 *         description: Erreur serveur
 */
agriculteurRouter.get('/agriculteurs', AgriculteurController.getAgriculteurs);

/**
 * @swagger
 * /agriculteur/{id_agriculteur}:
 *   get:
 *     summary: Récupérer un agriculteur par ID
 *     description: Récupère les informations détaillées d’un agriculteur avec ses relations (type, colline, wallet, membres, terrains, cultures, exploitations).
 *     tags:
 *       - Agriculteurs
 *     parameters:
 *       - in: path
 *         name: id_agriculteur
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unique de l'agriculteur
 *     responses:
 *       200:
 *         description: Agriculteur trouvé avec succès
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
 *                   example: Agriculteur trouvé avec succès
 *                 data:
 *                   type: object
 *       404:
 *         description: Agriculteur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 httpStatus:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Agriculteur non trouvé
 *                 data:
 *                   nullable: true
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
 *                 message:
 *                   type: string
 *                   example: Erreur interne du serveur
 *                 data:
 *                   nullable: true
 */
agriculteurRouter.get('/agriculteur/:id_agriculteur', AgriculteurController.getOneAgriculteur);

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

/**
 * @swagger
 * /terrain-validations/{terrain_id}:
 *   post:
 *     summary: Valider ou rejeter un terrain
 *     description: Permet d’enregistrer une validation sur un terrain et de recalculer son statut global.
 *     tags:
 *       - Terrains
 *     parameters:
 *       - in: path
 *         name: terrain_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du terrain à valider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: integer
 *                 example: 1
 *                 description: |
 *                   Statut de validation:
 *                   - 1 = APPROVED
 *                   - 0 = REJECTED
 *               commentaire:
 *                 type: string
 *                 example: Terrain conforme
 *     responses:
 *       200:
 *         description: Validation enregistrée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation enregistrée
 *                 terrain_status:
 *                   type: integer
 *                   example: 2
 *                   description: |
 *                     Statut global du terrain:
 *                     - 0 = PENDING
 *                     - 1 = PARTIALLY_VALIDATED
 *                     - 2 = VALIDATED
 *                     - 3 = REJECTED
 *       404:
 *         description: Terrain non trouvé ou déjà traité
 *       400:
 *         description: Erreur lors de la validation
 */
agriculteurRouter.post('/terrain-validations/:terrain_id', AgriculteurController.validateTerrain);

/**
 * @swagger
 * /agriculteur-update/{id_agriculteur}:
 *   put:
 *     summary: Modifier un agriculteur
 *     description: Met à jour un agriculteur, ses membres, ses terrains, cultures et exploitation.
 *     tags:
 *       - Agriculteurs
 *     parameters:
 *       - in: path
 *         name: id_agriculteur
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'agriculteur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_complet:
 *                 type: string
 *                 example: Jean Ndayizeye
 *               numero_telephone:
 *                 type: string
 *                 example: 69000000
 *               email:
 *                 type: string
 *                 example: jean@gmail.com
 *               carte_identite:
 *                 type: string
 *                 example: 123456789
 *               type_agriculteur_id:
 *                 type: integer
 *                 example: 1
 *               colline_id:
 *                 type: integer
 *                 example: 10
 *               membres:
 *                 type: array
 *                 items:
 *                   type: object
 *               terrains:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Agriculteur modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Agriculteur modifié avec succès
 *       404:
 *         description: Agriculteur non trouvé
 *       400:
 *         description: Erreur lors de la mise à jour
 */
agriculteurRouter.put('/agriculteur-update/:id_agriculteur', AgriculteurController.updateAgriculteur);



module.exports = agriculteurRouter;
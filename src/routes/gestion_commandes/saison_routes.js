const saisonRouter = require('express').Router();
const SaisonController = require('../../controllers/gestion_commandes/Saison_controller')

/**
 * @swagger
 * /saisons:
 *   get:
 *     summary: Récupérer la liste des saisons
 *     description: Retourne tous les saisons avec possibilité de recherche
 *     tags:
 *       - Saison
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par intitulé
 *     responses:
 *       200:
 *         description: Liste récupérée avec succès
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
 *                   example: Les saisons recupérés avec succès
 *                 data:
 *                   type: object
 */
saisonRouter.get('/saisons', SaisonController.getSaisons);

/**
 * @swagger
 * /saisons:
 *   post:
 *     summary: Créer un saison
 *     tags:
 *       - Saison
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - intitule
 *             properties:
 *               intitule:
 *                 type: string
 *                 example: Saison A
 *     responses:
 *       200:
 *         description: Saison créé avec succès
 *       422:
 *         description: Erreur de validation
 */
saisonRouter.post('/saisons', SaisonController.createSaison);

/**
 * @swagger
 * /saison/{id_saison}:
 *   get:
 *     summary: Récupérer un saison
 *     tags:
 *       - Saison
 *     parameters:
 *       - in: path
 *         name: id_saison
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du saison
 *     responses:
 *       200:
 *         description: Saison trouvé
 *       404:
 *         description: Saison non trouvé
 */
saisonRouter.get('/saison/:id_saison', SaisonController.getSaison);

/**
 * @swagger
 * /saison/{id_saison}:
 *   put:
 *     summary: Modifier un saison
 *     tags:
 *       - Saison
 *     parameters:
 *       - in: path
 *         name: id_saison
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               intitule:
 *                 type: string
 *                 example: Saison A
 *     responses:
 *       200:
 *         description: Saison modifié
 *       404:
 *         description: Non trouvé
 */
saisonRouter.put('/saison/:id_saison', SaisonController.updateSaison);

/**
 * @swagger
 * /saison/delete:
 *   delete:
 *     summary: Supprimer un ou plusieurs saisons
 *     tags:
 *       - Saison
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids_saison:
 *                 type: string
 *                 example: "[1,2,3]"
 *     responses:
 *       200:
 *         description: Saisons supprimés
 *       404:
 *         description: Non trouvé
 */
saisonRouter.delete('/saison/delete', SaisonController.deleteSaison);

module.exports = saisonRouter;
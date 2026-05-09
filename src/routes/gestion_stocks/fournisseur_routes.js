const fournisseurRouter = require('express').Router();
const FournisseurController = require('../../controllers/gestion_stocks/FournisseurController')

/**
 * @swagger
 * /fournisseurs:
 *   get:
 *     summary: Récupérer la liste des fournisseurs
 *     description: Retourne tous les fournisseurs avec possibilité de recherche
 *     tags:
 *       - Fournisseur
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par nom du fournisseur
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
 *                   example: Les fournisseurs recupérés avec succès
 *                 data:
 *                   type: array
 *                   items: 
 *                      type: object
 */
fournisseurRouter.get('/fournisseurs', FournisseurController.getFournisseurs);

/**
 * @swagger
 * /fournisseurs:
 *   post:
 *     summary: Créer un fournisseur
 *     tags:
 *       - Fournisseur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom_fournisseur
 *               - numero_telephone
 *             properties:
 *               nom_fournisseur:
 *                 type: string
 *                 example: FOMI
 *               numero_telephone:
 *                 type: string
 *                 example: +25768954236
 *     responses:
 *       200:
 *         description: Fournisseur créé avec succès
 *       422:
 *         description: Erreur de validation
 */
fournisseurRouter.post('/fournisseurs', FournisseurController.createFournisseur);

/**
 * @swagger
 * /fournisseurs/{id_fournisseur}:
 *   get:
 *     summary: Récupérer un fournisseur
 *     tags:
 *       - Fournisseur
 *     parameters:
 *       - in: path
 *         name: id_fournisseur
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du fournisseur
 *     responses:
 *       200:
 *         description: Fournisseur trouvé
 *       404:
 *         description: Fournisseur non trouvé
 */
fournisseurRouter.get('/fournisseurs/:id_fournisseur', FournisseurController.getFournisseur);

/**
 * @swagger
 * /fournisseurs/{id_fournisseur}:
 *   put:
 *     summary: Modifier un fournisseur
 *     tags:
 *       - Fournisseur
 *     parameters:
 *       - in: path
 *         name: id_fournisseur
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
 *               nom_fournisseur:
 *                 type: string
 *                 example: FOMI
 *               numero_telephone:
 *                 type: string
 *                 example: +25776965463
 *     responses:
 *       200:
 *         description: Fournisseur modifié
 *       404:
 *         description: Non trouvé
 */
fournisseurRouter.put('/fournisseurs/:id_fournisseur', FournisseurController.updateFournisseur);

/**
 * @swagger
 * /fournisseurs/delete:
 *   delete:
 *     summary: Supprimer un ou plusieurs fournisseurs
 *     tags:
 *       - Fournisseur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids_fournisseur:
 *                 type: string
 *                 example: "[1,2,3]"
 *     responses:
 *       200:
 *         description: Fournisseurs supprimés
 *       404:
 *         description: Non trouvé
 */
fournisseurRouter.delete('/fournisseurs/delete', FournisseurController.deleteFournisseur);

module.exports = fournisseurRouter;
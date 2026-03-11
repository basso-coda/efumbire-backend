const typeAgriculteurRouter = require('express').Router();
const TypeAgriculteurController = require('../../controllers/gestion_agriculteurs/TypeAgriculteur_controller')

/**
 * @swagger
 * /type_agriculteurs:
 *   get:
 *     summary: Récupérer la liste des types d'agriculteurs
 *     description: Retourne tous les types d'agriculteurs avec possibilité de recherche
 *     tags:
 *       - TypeAgriculteur
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par nom du type d'agriculteur
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
 *                   example: Les types d'agriculteurs recupérés avec succès
 *                 data:
 *                   type: array
 *                   items: 
 *                      type: object
 */
typeAgriculteurRouter.get('/type_agriculteurs', TypeAgriculteurController.getTypeAgriculteurs);

/**
 * @swagger
 * /type_agriculteurs:
 *   post:
 *     summary: Créer un type d'agriculteur
 *     tags:
 *       - TypeAgriculteur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom_type_agriculteur
 *             properties:
 *               nom_type_agriculteur:
 *                 type: string
 *                 example: Coopérative agricole
 *     responses:
 *       200:
 *         description: Type agriculteur créé avec succès
 *       422:
 *         description: Erreur de validation
 */
typeAgriculteurRouter.post('/type_agriculteurs', TypeAgriculteurController.createTypeAgriculteur);

/**
 * @swagger
 * /type_agriculteurs/{id_type_agriculteur}:
 *   get:
 *     summary: Récupérer un type d'agriculteur
 *     tags:
 *       - TypeAgriculteur
 *     parameters:
 *       - in: path
 *         name: id_type_agriculteur
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du type agriculteur
 *     responses:
 *       200:
 *         description: Type agriculteur trouvé
 *       404:
 *         description: Type agriculteur non trouvé
 */
typeAgriculteurRouter.put('/type_agriculteurs/:id_type_agriculteur', TypeAgriculteurController.updateTypeAgriculteur);

/**
 * @swagger
 * /type_agriculteurs/{id_type_agriculteur}:
 *   put:
 *     summary: Modifier un type d'agriculteur
 *     tags:
 *       - TypeAgriculteur
 *     parameters:
 *       - in: path
 *         name: id_type_agriculteur
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
 *               nom_type_agriculteur:
 *                 type: string
 *                 example: Agriculteur commercial
 *     responses:
 *       200:
 *         description: Type agriculteur modifié
 *       404:
 *         description: Non trouvé
 */
typeAgriculteurRouter.get('/type_agriculteurs/:id_type_agriculteur', TypeAgriculteurController.getTypeAgriculteur);

/**
 * @swagger
 * /type_agriculteurs/delete:
 *   delete:
 *     summary: Supprimer un ou plusieurs types d'agriculteurs
 *     tags:
 *       - TypeAgriculteur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids_type_agriculteur:
 *                 type: string
 *                 example: "[1,2,3]"
 *     responses:
 *       200:
 *         description: Types agriculteurs supprimés
 *       404:
 *         description: Non trouvé
 */
typeAgriculteurRouter.delete('/type_agriculteurs/delete', TypeAgriculteurController.deleteTypeAgriculteur);

module.exports = typeAgriculteurRouter;
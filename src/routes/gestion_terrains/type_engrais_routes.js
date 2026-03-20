const typeEngraisRouter = require('express').Router();
const TypeEngraisController = require('../../controllers/gestion_terrains/TypeEngrais_controller')

/**
 * @swagger
 * /type_engrais:
 *   get:
 *     summary: Récupérer la liste des type d'engrais
 *     description: Retourne tous les type d'engrais avec possibilité de recherche
 *     tags:
 *       - TypeEngrais
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
 *                   example: Les type d'engrais recupérés avec succès
 *                 data:
 *                   type: object
 */
typeEngraisRouter.get('/type_engrais', TypeEngraisController.getTypeEngrais);

/**
 * @swagger
 * /type_engrais:
 *   post:
 *     summary: Créer un type d'engrais
 *     tags:
 *       - TypeEngrais
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
 *                 example: Ifumbire
 *     responses:
 *       200:
 *         description: Type engrais créé avec succès
 *       422:
 *         description: Erreur de validation
 */
typeEngraisRouter.post('/type_engrais', TypeEngraisController.createTypeEngrais);

/**
 * @swagger
 * /type_engrais/{id_type_engrais}:
 *   get:
 *     summary: Récupérer un type d'engrais
 *     tags:
 *       - TypeEngrais
 *     parameters:
 *       - in: path
 *         name: id_type_engrais
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du type engrais
 *     responses:
 *       200:
 *         description: Type engrais trouvé
 *       404:
 *         description: Type engrais non trouvé
 */
typeEngraisRouter.get('/type_engrais/:id_type_engrais', TypeEngraisController.getOneTypeEngrais);

/**
 * @swagger
 * /type_engrais/{id_type_engrais}:
 *   put:
 *     summary: Modifier un type d'engrais
 *     tags:
 *       - TypeEngrais
 *     parameters:
 *       - in: path
 *         name: id_type_engrais
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
 *                 example: Ifumbire
 *     responses:
 *       200:
 *         description: Type d'engrais modifié
 *       404:
 *         description: Non trouvé
 */
typeEngraisRouter.put('/type_engrais/:id_type_engrais', TypeEngraisController.updateTypeEngrais);

/**
 * @swagger
 * /type_engrais/delete:
 *   delete:
 *     summary: Supprimer un ou plusieurs type d'engrais
 *     tags:
 *       - TypeEngrais
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids_type_engrais:
 *                 type: string
 *                 example: "[1,2,3]"
 *     responses:
 *       200:
 *         description: Type d'engrais supprimés
 *       404:
 *         description: Non trouvé
 */
typeEngraisRouter.delete('/type_engrais/delete', TypeEngraisController.deleteTypeEngrais);

module.exports = typeEngraisRouter;
const typeCultureRouter = require('express').Router();
const TypeCultureController = require('../../controllers/gestion_terrains/TypeCulture_controller')

/**
 * @swagger
 * /type_cultures:
 *   get:
 *     summary: Récupérer la liste des type de cultures
 *     description: Retourne tous les type de cultures avec possibilité de recherche
 *     tags:
 *       - TypeCulture
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
 *                   example: Les type de cultures recupérés avec succès
 *                 data:
 *                   type: object
 */
typeCultureRouter.get('/type_cultures', TypeCultureController.getTypeCultures);

/**
 * @swagger
 * /type_cultures:
 *   post:
 *     summary: Créer un type de culture
 *     tags:
 *       - TypeCulture
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
 *                 example: Grains
 *     responses:
 *       200:
 *         description: Type culture créé avec succès
 *       422:
 *         description: Erreur de validation
 */
typeCultureRouter.post('/type_cultures', TypeCultureController.createTypeCulture);

/**
 * @swagger
 * /type_culture/{id_type_culture}:
 *   get:
 *     summary: Récupérer un type de culture
 *     tags:
 *       - TypeCulture
 *     parameters:
 *       - in: path
 *         name: id_type_culture
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du type culture
 *     responses:
 *       200:
 *         description: Type culture trouvé
 *       404:
 *         description: Type culture non trouvé
 */
typeCultureRouter.get('/type_culture/:id_type_culture', TypeCultureController.getTypeCulture);

/**
 * @swagger
 * /type_culture/{id_type_culture}:
 *   put:
 *     summary: Modifier un type de culture
 *     tags:
 *       - TypeCulture
 *     parameters:
 *       - in: path
 *         name: id_type_culture
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
 *                 example: Grains
 *     responses:
 *       200:
 *         description: Type de culture modifié
 *       404:
 *         description: Non trouvé
 */
typeCultureRouter.put('/type_culture/:id_type_culture', TypeCultureController.updateTypeCulture);

/**
 * @swagger
 * /type_culture/delete:
 *   delete:
 *     summary: Supprimer un ou plusieurs type de cultures
 *     tags:
 *       - TypeCulture
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids_type_cultures:
 *                 type: string
 *                 example: "[1,2,3]"
 *     responses:
 *       200:
 *         description: Type de cultures supprimés
 *       404:
 *         description: Non trouvé
 */
typeCultureRouter.delete('/type_culture/delete', TypeCultureController.deleteTypeCulture);

module.exports = typeCultureRouter;
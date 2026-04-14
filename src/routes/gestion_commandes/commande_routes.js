const commandeRouter = require('express').Router();
const CommandeController = require('../../controllers/gestion_commandes/Commande_controller')


/**
 * @swagger
 * /commandes:
 *   get:
 *     summary: Récupérer la liste des commandes
 *     description: >
 *       Permet de récupérer la liste des commandes avec pagination, tri et recherche.
 *       Inclut les informations de l'agriculteur, les items commandés (engrais),
 *       et la facture associée si disponible.
 *     tags:
 *       - Commandes
 *
 *     parameters:
 *       - in: query
 *         name: rows
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Nombre d’éléments à retourner
 *
 *       - in: query
 *         name: first
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Index de départ (pagination)
 *
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *           example: id_commande
 *         description: Champ de tri
 *
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: integer
 *           enum: [1, -1]
 *           example: -1
 *         description: Ordre de tri (1 = ASC, -1 = DESC)
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: Jean
 *         description: Recherche globale (nom agriculteur, numéro facture)
 *
 *     responses:
 *       200:
 *         description: Commandes récupérées avec succès
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
 *                   example: Commandes récupérées avec succès
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 2
 *                     rows:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id_commande:
 *                             type: integer
 *                             example: 1
 *                           date_commande:
 *                             type: string
 *                             format: date-time
 *
 *                           agriculteur:
 *                             type: object
 *                             properties:
 *                               id_agriculteur:
 *                                 type: integer
 *                               nom_complet:
 *                                 type: string
 *                               numero_telephone:
 *                                 type: string
 *
 *                           items:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id_commande_items:
 *                                   type: integer
 *                                 quantite:
 *                                   type: number
 *                                 prix_unitaire:
 *                                   type: number
 *
 *                                 type_engrais:
 *                                   type: object
 *                                   properties:
 *                                     id_type_engrais:
 *                                       type: integer
 *                                     nom_type_engrais:
 *                                       type: string
 *                                     prix:
 *                                       type: number
 *
 *                           commande_invoice:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               id_commande_invoice:
 *                                 type: integer
 *                               invoice_number:
 *                                 type: string
 *                               total_amount:
 *                                 type: number
 *                               subvention_amount:
 *                                 type: number
 *                               amount_to_pay:
 *                                 type: number
 *                               statut_payment:
 *                                 type: string
 *
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
commandeRouter.get('/commandes', CommandeController.getCommandes);

/**
 * @swagger
 * /commandes:
 *   post:
 *     summary: Créer une commande d'engrais
 *     description: >
 *       Permet à un agriculteur de créer une commande d'engrais pour une saison donnée.
 *       L'utilisateur doit spécifier les cultures choisies par terrain pour cette saison,
 *       ainsi que les types d'engrais et quantités souhaitées.
 * 
 *       ⚠️ Le système vérifie automatiquement :
 *       - que les cultures sont autorisées sur les terrains
 *       - que la quantité demandée respecte les recommandations agronomiques
 *     tags:
 *       - Commandes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agriculteur_id
 *               - saison_id
 *               - cultures
 *               - items
 *             properties:
 *               agriculteur_id:
 *                 type: integer
 *                 example: 1
 *               saison_id:
 *                 type: integer
 *                 example: 2
 *               cultures:
 *                 type: array
 *                 description: Liste des cultures choisies pour chaque terrain
 *                 items:
 *                   type: object
 *                   required: 
 *                     - terrain_id
 *                     - type_culture_id
 *                   properties:
 *                     terrain_id:
 *                        type: integer
 *                        example: 1
 *                     type_culture_id:
 *                        type: integer
 *                        example: 2
 *               items:
 *                 type: array
 *                 description: Liste des engrais commandés
 *                 items:
 *                   type: object
 *                   required:
 *                     - type_engrais_id
 *                     - quantite
 *                   properties:
 *                     type_engrais_id:
 *                       type: integer
 *                       example: 1
 *                     quantite:
 *                       type: number
 *                       example: 50
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Commande créée avec succès
 *                 commande_id:
 *                   type: integer
 *                   example: 10
 *                 total_amount:
 *                   type: number
 *                   example: 50000
 *       400:
 *         description: Données invalides
 *         content: 
 *           application/json:
 *             example:
 *               message: Données invalides
 *       500:
 *         description: Erreur interne ou métier
 *         content:
 *           application/json:
 *             examples:
 *               terrain_invalide:
 *                 value:
 *                   message: Terrain 3 invalide
 *               culture_non_autorisee:
 *                 value:
 *                   message: Culture non autorisée pour ce terrain
 *               culture_deja_definie:
 *                 value:
 *                   message: Culture déjà définie pour terrain 1 cette saison
 *               engrais_introuvable:
 *                 value:
 *                   message: Type engrais 2 introuvable
 *               quantite_excessive:
 *                 value: 
 *                   message: Quantité demandée (200) dépasse la recommandation (150)
 */
commandeRouter.post('/commandes', CommandeController.createCommande);

/**
 * @swagger
 * /commande/{id_commande}:
 *   get:
 *     summary: Récupérer une commande par ID
 *     description: Récupère les informations détaillées d’une commande avec ses relations (items, invoices, ...).
 *     tags:
 *       - Commandes
 *     parameters:
 *       - in: path
 *         name: id_commande
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unique de la commande
 *     responses:
 *       200:
 *         description: Commande trouvé avec succès
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
 *                   example: Commande trouvé avec succès
 *                 data:
 *                   type: object
 *       404:
 *         description: Commande non trouvé
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
 *                   example: Commande non trouvé
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
commandeRouter.get('/commande/:id_commande', CommandeController.getOneCommande);

// commandeRouter.put('/commande/:id_commande', CommandeController.updateCommande);

// commandeRouter.delete('/commande/delete', CommandeController.deleteCommande);

module.exports = commandeRouter;
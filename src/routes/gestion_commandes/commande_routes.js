const commandeRouter = require('express').Router();
const CommandeController = require('../../controllers/gestion_commandes/Commande_controller')


// commandeRouter.get('/commandes', CommandeController.getCommandes);

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

// commandeRouter.get('/commande/:id_commande', CommandeController.getCommande);

// commandeRouter.put('/commande/:id_commande', CommandeController.updateCommande);

// commandeRouter.delete('/commande/delete', CommandeController.deleteCommande);

module.exports = commandeRouter;
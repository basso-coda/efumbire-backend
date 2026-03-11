const agriculteurRouter = require('express').Router();
const AgriculteurController = require('../../controllers/gestion_agriculteurs/Agriculteur_controller')

agriculteurRouter.post('/agriculteurs', AgriculteurController.createAgriculteur);
agriculteurRouter.post('/terrain-validations/:terrain_id', AgriculteurController.validateTerrain);
agriculteurRouter.put('/agriculteur-update/:id_agriculteur', AgriculteurController.updateAgriculteur)

module.exports = agriculteurRouter;
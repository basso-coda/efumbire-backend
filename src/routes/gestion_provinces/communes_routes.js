const communesRouter = require('express').Router();
const CommuneController = require('../../controllers/gestion_provinces/Commune_controller')

communesRouter.get('/communes', CommuneController.getCommunes);

module.exports = communesRouter;
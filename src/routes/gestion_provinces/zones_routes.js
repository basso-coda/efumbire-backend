const zonesRouter = require('express').Router();
const ZoneController = require('../../controllers/gestion_provinces/Zone_controller')

zonesRouter.get('/zones', ZoneController.getZones);

module.exports = zonesRouter;
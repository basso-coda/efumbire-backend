const collinesRouter = require('express').Router();
const CollineController = require('../../controllers/gestion_provinces/Colline_controller')

collinesRouter.get('/collines', CollineController.getCollines);

module.exports = collinesRouter;
const provincesRouter = require('express').Router();
const ProvinceController = require('../../controllers/gestion_provinces/Province_controller')

provincesRouter.get('/provinces', ProvinceController.getProvinces);

module.exports = provincesRouter;
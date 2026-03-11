const typeCultureRouter = require('express').Router();
const TypeCultureController = require('../../controllers/gestion_terrains/TypeCulture_controller')

typeCultureRouter.get('/type_cultures', TypeCultureController.getTypeCultures);
typeCultureRouter.post('/type_cultures', TypeCultureController.createTypeCulture);
typeCultureRouter.get('/type_culture/:id_type_culture', TypeCultureController.getTypeCulture);
typeCultureRouter.put('/type_culture/:id_type_culture', TypeCultureController.updateTypeCulture);
typeCultureRouter.delete('/type_culture/delete', TypeCultureController.deleteTypeCulture);

module.exports = typeCultureRouter;
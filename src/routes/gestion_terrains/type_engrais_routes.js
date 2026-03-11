const typeEngraisRouter = require('express').Router();
const TypeEngraisController = require('../../controllers/gestion_terrains/TypeEngrais_controller')

typeEngraisRouter.get('/type_cultures', TypeEngraisController.getTypeEngrais);
typeEngraisRouter.post('/type_cultures', TypeEngraisController.createTypeEngrais);
typeEngraisRouter.get('/type_culture/:id_type_culture', TypeEngraisController.getOneTypeEngrais);
typeEngraisRouter.put('/type_culture/:id_type_culture', TypeEngraisController.updateTypeEngrais);
typeEngraisRouter.delete('/type_culture/delete', TypeEngraisController.deleteTypeEngrais);

module.exports = typeEngraisRouter;
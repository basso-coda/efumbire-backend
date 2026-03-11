const mainRouter = require('express').Router();

const agriculteurRouter = require('./gestion_agriculteurs/agriculteur_routes');
const typeAgriculteurRouter = require('./gestion_agriculteurs/type_agriculteur_routes');
const saisonRouter = require('./gestion_commandes/saison_routes');
const typeEngraisRouter = require('./gestion_terrains/type_engrais_routes');

mainRouter.use(typeAgriculteurRouter);
mainRouter.use(saisonRouter);
mainRouter.use(typeEngraisRouter);
mainRouter.use(agriculteurRouter);

module.exports = mainRouter;
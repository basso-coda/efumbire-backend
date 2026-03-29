const mainRouter = require('express').Router();

const agriculteurRouter = require('./gestion_agriculteurs/agriculteur_routes');
const typeAgriculteurRouter = require('./gestion_agriculteurs/type_agriculteur_routes');
const saisonRouter = require('./gestion_commandes/saison_routes');
const collinesRouter = require('./gestion_provinces/collines_routes');
const communesRouter = require('./gestion_provinces/communes_routes');
const provincesRouter = require('./gestion_provinces/provinces_routes');
const zonesRouter = require('./gestion_provinces/zones_routes');
const typeCultureRouter = require('./gestion_terrains/type_culture_routes');
const typeEngraisRouter = require('./gestion_terrains/type_engrais_routes');

mainRouter.use(typeAgriculteurRouter);
mainRouter.use(saisonRouter);
mainRouter.use(typeEngraisRouter);
mainRouter.use(agriculteurRouter);
mainRouter.use(typeCultureRouter);
mainRouter.use(collinesRouter);
mainRouter.use(communesRouter);
mainRouter.use(provincesRouter);
mainRouter.use(zonesRouter);

module.exports = mainRouter;
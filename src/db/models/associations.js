const Agriculteur = require('./gestion_agriculteurs/Agriculteur');
const TypeAgriculteur = require('./gestion_agriculteurs/TypeAgriculteur');
const AgriculteurWallet = require('./gestion_paiements/AgriculteurWallet');
const Colline = require('./gestion_provinces/Colline');
const ExploitationTerrain = require('./gestion_terrains/ExploitationTerrain');
const Membre = require('./gestion_terrains/Membre');
const Terrain = require('./gestion_terrains/Terrain');
const TerrainTypeCulture = require('./gestion_terrains/TerrainTypeCulture');
const TypeCulture = require('./gestion_terrains/TypeCulture');

const initAssociations = () => {

    // Agriculteur relations
    Agriculteur.belongsTo(TypeAgriculteur, {
        foreignKey: 'type_agriculteur_id',
        as: 'type_agriculteur'
    });

    Agriculteur.belongsTo(Colline, {
        foreignKey: 'colline_id',
        as: 'colline'
    });

    Agriculteur.hasOne(AgriculteurWallet, {
        foreignKey: 'agriculteur_id',
        as: 'wallet'
    });

    Agriculteur.hasMany(Membre, {
        foreignKey: 'agriculteur_id',
        as: 'membres'
    });

    Agriculteur.hasMany(Terrain, {
        foreignKey: 'agriculteur_id',
        as: 'terrains'
    });

    // Wallet
    AgriculteurWallet.belongsTo(Agriculteur, {
        foreignKey: 'agriculteur_id',
        as: 'agriculteur'
    });

    // Terrain
    Terrain.belongsTo(Agriculteur, {
        foreignKey: 'agriculteur_id',
        as: 'agriculteur'
    });

    Terrain.belongsTo(Colline, {
        foreignKey: 'colline_id',
        as: 'colline'
    });

    Terrain.hasMany(TerrainTypeCulture, {
        foreignKey: 'terrain_id',
        as: 'terrain_cultures'
    });

    Terrain.hasOne(ExploitationTerrain, {
        foreignKey: 'terrain_id',
        as: 'exploitation'
    });

    // Culture
    TerrainTypeCulture.belongsTo(TypeCulture, {
        foreignKey: 'type_culture_id',
        as: 'type_culture'
    });

    TerrainTypeCulture.belongsTo(Terrain, {
        foreignKey: 'terrain_id',
        as: 'terrain'
    })

    // Exploitation
    ExploitationTerrain.belongsTo(Membre, {
        foreignKey: 'membre_id',
        as: 'membre'
    });

    // Membre
    Membre.hasMany(ExploitationTerrain, {
        foreignKey: 'membre_id',
        as: 'exploitations'
    })

};

module.exports = initAssociations;
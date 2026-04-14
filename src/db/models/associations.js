const Agriculteur = require('./gestion_agriculteurs/Agriculteur');
const TypeAgriculteur = require('./gestion_agriculteurs/TypeAgriculteur');
const AgriculteurWallet = require('./gestion_paiements/AgriculteurWallet');
const Colline = require('./gestion_provinces/Colline');
const ExploitationTerrain = require('./gestion_terrains/ExploitationTerrain');
const Membre = require('./gestion_terrains/Membre');
const Terrain = require('./gestion_terrains/Terrain');
const TerrainTypeCulture = require('./gestion_terrains/TerrainTypeCulture');
const TypeCulture = require('./gestion_terrains/TypeCulture');
const EngraisRecommandation = require('./gestion_terrains/EngraisRecommandation');
const TypeEngrais = require('./gestion_terrains/TypeEngrais');
const Saison = require('./gestion_commandes/Saison');
const TerrainSaisonCulture = require('./gestion_terrains/TerrainSaisonCulture');
const CommandeItems = require('./gestion_commandes/CommandeItems');
const Commande = require('./gestion_commandes/Commande');
const CommandeInvoice = require('./gestion_commandes/CommandeInvoice')

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

    // EngraisRecommendation relations
    EngraisRecommandation.belongsTo(TypeEngrais, {
        foreignKey: 'type_engrais_id',
        as: 'type_engrais'
    });

    EngraisRecommandation.belongsTo(TypeCulture, {
        foreignKey: 'type_culture_id',
        as: 'type_culture'
    });

    EngraisRecommandation.belongsTo(Saison, {
        foreignKey: 'saison_id',
        as: 'saison'
    });

    // TerrainSaisonCulture relations
    TerrainSaisonCulture.belongsTo(Terrain, {
        foreignKey: 'terrain_id',
        as: 'terrain_saison'
    });

    TerrainSaisonCulture.belongsTo(Saison, {
        foreignKey: 'saison_id',
        as: 'saison'
    });

    TerrainSaisonCulture.belongsTo(TypeCulture, {
        foreignKey: 'type_culture_id',
        as: 'type_culture'
    });

    // Commandes relations
    Commande.belongsTo(Agriculteur, {
        foreignKey: 'agriculteur_id',
        as: 'agriculteur'
    });

    Commande.hasMany(CommandeItems, {
        foreignKey: 'commande_id',
        as: 'items'
    });

    Commande.hasOne(CommandeInvoice, {
        foreignKey: 'commande_id',
        as: 'commande_invoice'
    });

    CommandeItems.belongsTo(TypeEngrais, {
        foreignKey: 'type_engrais_id',
        as: 'type_engrais'
    });

};

module.exports = initAssociations;
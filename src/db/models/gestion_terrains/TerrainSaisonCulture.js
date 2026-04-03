const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const TerrainSaisonCulture = sequelize.define('terrain', {
    id_terrain_saison_culture: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    terrain_id: DataTypes.SMALLINT,

    saison_id: DataTypes.INTEGER,

    type_culture_id: DataTypes.INTEGER,

}, {
    tableName: 'terrain_saison_culture',
    timestamps: false,
})

// Terrain.belongsTo(Agriculteur, { foreignKey: 'agriculteur_id', as: 'agriculteur' })
// Terrain.belongsTo(Colline, { foreignKey: 'colline_id', as: 'colline' })

module.exports = TerrainSaisonCulture;
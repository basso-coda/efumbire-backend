const { DataTypes } = require('sequelize');
const Terrain = require('./Terrain');
const TypeCulture = require('./TypeCulture');
const sequelize = require('../index').sequelize;

const TerrainTypeCulture = sequelize.define('terrain_type_culture', {
    id_terrain_type_culture: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    terrain_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type_culture_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    date_debut: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    date_fin: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: false,
    initialAutoIncrement: 1,
    tableName: 'terrain_type_culture'
})

TerrainTypeCulture.belongsTo(Terrain, { as: 'terrain', foreignKey: 'terrain_id' })
TerrainTypeCulture.belongsTo(TypeCulture, { as: 'type_culture', foreignKey: 'type_culture_id' })

module.exports = TerrainTypeCulture;
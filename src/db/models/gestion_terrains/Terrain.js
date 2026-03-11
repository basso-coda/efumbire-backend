const { DataTypes } = require('sequelize');
const Agriculteur = require('../gestion_agriculteurs/Agriculteur');
const Colline = require('../gestion_provinces/Colline')
const sequelize = require('../index').sequelize;

const Terrain = sequelize.define('terrain', {
    id_terrain: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    superficie: DataTypes.STRING,

    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    land_tenure_type: {
        type: DataTypes.ENUM('OWNED', 'LEASED', 'ALLOCATED'),
        allowNull: false
    },

    titre_document: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    validation_status: {
        type: DataTypes.TINYINT,
        allowNull: false
    },

    colline_id: DataTypes.SMALLINT,
    agriculteur_id: DataTypes.INTEGER,
    type_culture_id: DataTypes.INTEGER,

    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    date_creation: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    date_modification: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    tableName: 'terrains',
    timestamps: false,
})

Terrain.belongsTo(Agriculteur, { foreignKey: 'agriculteur_id', as: 'agriculteur' })
Terrain.belongsTo(Colline, { foreignKey: 'colline_id', as: 'colline' })

module.exports = Terrain;
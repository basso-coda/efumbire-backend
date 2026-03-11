const { DataTypes } = require('sequelize');
const Terrain = require('./Terrain');
const User = require('../gestion_utilisateurs/User');
const sequelize = require('../index').sequelize;

const TerrainValidation = sequelize.define('terrain_validation', {
    id_terrain_validation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    terrain_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role_validation: {
        type: DataTypes.ENUM('AGRONOME', 'CHEF_COLLINE', 'CHEF_DEVELOPPEMENT'),
        allowNull: false
    },
    commentaire: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    date_validation: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false,
    initialAutoIncrement: 1,
    tableName: 'terrain_validations'
})

TerrainValidation.belongsTo(Terrain, { as: 'terrain', foreignKey: 'terrain_id' })
TerrainValidation.belongsTo(User, { as: 'user', foreignKey: 'user_id' })

module.exports = TerrainValidation;
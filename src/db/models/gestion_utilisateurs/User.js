const { DataTypes } = require('sequelize');
const Colline = require('../gestion_provinces/Colline');
const Role = require('./Role');
const Ministere = require('./Ministere');
const sequelize = require('../index').sequelize;

const User = sequelize.define('user', {
    id_users: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    nom_complet: DataTypes.STRING,

    numero_telephone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },

    password: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },

    statut: {
        type: DataTypes.ENUM('ACTIF', 'INACTIF'),
        allowNull: true,
    },

    role_id: DataTypes.INTEGER,
    province_id: DataTypes.TINYINT,
    commune_id: DataTypes.SMALLINT,
    zone_id: DataTypes.SMALLINT,
    colline_id: DataTypes.SMALLINT,
    ministere_id: DataTypes.INTEGER,

    created_at: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },

    updated_at: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: false,
})

User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' })
User.belongsTo(Colline, { foreignKey: 'colline_id', as: 'colline' })
User.belongsTo(Ministere, { foreignKey: 'ministere_id', as: 'ministere' })

module.exports = User;
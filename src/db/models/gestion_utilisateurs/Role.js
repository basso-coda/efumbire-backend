const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const Role = sequelize.define('role', {
    id_role: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    nom_role: DataTypes.STRING,

}, {
    tableName: 'roles',
    timestamps: false,
})

module.exports = Role;
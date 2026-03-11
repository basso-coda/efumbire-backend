const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const Ministere = sequelize.define('ministere', {
    id_ministere: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    nom_ministere: DataTypes.STRING,

}, {
    tableName: 'ministeres',
    timestamps: false,
})

module.exports = Ministere;
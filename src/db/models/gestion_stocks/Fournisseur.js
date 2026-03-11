const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const Fournisseur = sequelize.define('fournisseur', {
    id_fournisseur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    nom_fournisseur: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    numero_telephone: {
        type: DataTypes.STRING,
        allowNull: false
    },

    date_creation: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    tableName: 'fournisseurs',
    timestamps: false,
})

module.exports = Fournisseur;
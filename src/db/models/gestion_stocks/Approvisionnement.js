const { DataTypes } = require('sequelize');
const Fournisseur = require('./Fournisseur');
const sequelize = require('../index').sequelize;

const Approvisionnement = sequelize.define('approvisionnement', {
    id_approvisionnement: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    reference_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    fournisseur_id: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },

    date_reception: {
        type: DataTypes.DATE,
        allowNull: false
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

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
    tableName: 'approvisionnement',
    timestamps: false,
})

Approvisionnement.belongsTo(Fournisseur, { foreignKey: 'fournisseur_id', as: 'fournisseur' })

module.exports = Approvisionnement;
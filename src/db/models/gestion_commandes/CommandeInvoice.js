const { DataTypes } = require('sequelize');
const Commande = require('./Commande');
const sequelize = require('../index').sequelize;

const CommandeInvoice = sequelize.define('commande_invoice', {
    id_commande_invoice: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    invoice_number: {
        type: DataTypes.STRING,
        allowNull: false
    },

    code_reference: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    voucher_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    subvention_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    amount_to_pay: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    statut_payment: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'UNPAID'),
        allowNull: false
    },

    date_emission: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },

    voucher_used: {
        type: DataTypes.TINYINT(1),
        allowNull: false
    },

    commande_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

}, {
    tableName: 'commande_invoices',
    timestamps: false,
})

CommandeInvoice.belongsTo(Commande, { foreignKey: 'commande_id', as: 'commande' })

module.exports = CommandeInvoice;
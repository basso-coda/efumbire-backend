const { DataTypes } = require('sequelize');
const WalletTransaction = require('./WalletTransaction');
const CommandeInvoice = require('../gestion_commandes/CommandeInvoice');
const sequelize = require('../index').sequelize;

const Payment = sequelize.define('payment', {
    id_payment: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    commande_invoice_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
    },

    wallet_transaction_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true,
    },

    payment_method: {
        type: DataTypes.ENUM('WALLET','BANK','MOBILE_MONEY'),
        allowNull: false
    },

    amount_paid: {
        type: DataTypes.DECIMAL(18,2),
        allowNull: false
    },

    payment_reference: {
        type: DataTypes.STRING,
        allowNull: true
    },

    proof_document: {
        type: DataTypes.STRING,
        allowNull: true
    },

    payment_status: {
        type: DataTypes.ENUM('PENDING','UNDER_REVIEW','PAID','REJECTED'),
        allowNull:true
    },

    payment_date: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    tableName: 'payment',
    timestamps: false,
})

// Payment.belongsTo(WalletTransaction, { foreignKey: 'wallet_transaction_id', as: 'wallet_transaction' })
// Payment.belongsTo(CommandeInvoice, { foreignKey: 'commande_invoice_id', as: 'commande_invoice' })

module.exports = Payment;
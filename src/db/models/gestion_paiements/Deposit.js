const { DataTypes } = require('sequelize');
const WalletTransaction = require('./WalletTransaction');
const sequelize = require('../index').sequelize;

const Deposit = sequelize.define('deposit', {
    id_deposit: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    wallet_transaction_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
    },

    deposit_date: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    tableName: 'deposit',
    timestamps: false,
})

// Deposit.belongsTo(WalletTransaction, { foreignKey: 'wallet_transaction_id', as: 'wallet_transaction' })

module.exports = Deposit;
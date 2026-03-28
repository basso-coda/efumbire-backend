const { DataTypes } = require('sequelize');
const AgriculteurWallet = require('./AgriculteurWallet');
const sequelize = require('../index').sequelize;

const WalletTransaction = sequelize.define('wallet_transaction', {
    id_wallet_transaction: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    nom_complet: DataTypes.STRING,

    transaction_type: {
        type: DataTypes.ENUM('SUBVENTION', 'DEPOSIT', 'PAYMENT'),
        allowNull: false,
    },

    transaction_amount: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },

    transaction_code: {
        type: DataTypes.STRING,
        allowNull: false
    },

    wallet_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    transaction_date: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    tableName: 'wallet_transaction',
    timestamps: false,
})

// WalletTransaction.belongsTo(AgriculteurWallet, { foreignKey: 'agriculteur_wallet_id', as: 'agriculteur_wallet' })

module.exports = WalletTransaction;
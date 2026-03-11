const { DataTypes } = require('sequelize');
const Agriculteur = require('../gestion_agriculteurs/Agriculteur');
const sequelize = require('../index').sequelize;

const AgriculteurWallet = sequelize.define('agriculteur_wallet', {
    id_agriculteur_wallet: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    wallet_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },

    balance_available: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    blocked_balance: {
        type: DataTypes.FLOAT,
        allowNull: true
    },

    agriculteur_id: DataTypes.INTEGER,

    date_creation: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    tableName: 'agriculteur_wallet',
    timestamps: false,
})

AgriculteurWallet.belongsTo(Agriculteur, { foreignKey: 'agriculteur_id', as: 'agriculteur' })

module.exports = AgriculteurWallet;
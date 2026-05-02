const { DataTypes } = require('sequelize');
const Stock = require('./Stock');
const sequelize = require('../index').sequelize;

const StockMouvement = sequelize.define('stock_mouvement', {
    id_stock_mouvement: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    stock_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    type_mouvement: {
        type: DataTypes.ENUM('ENTREE', 'SORTIE'),
        allowNull: false
    },

    quantite: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },

    reference_type: {
        type: DataTypes.ENUM('APPROVISIONNEMENT', 'COMMANDE', 'AJUSTEMENT'),
        allowNull: false
    },

    reference_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    date_mouvement: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    tableName: 'stock_mouvement',
    timestamps: false,
})

StockMouvement.belongsTo(Stock, { foreignKey: 'stock_id', as: 'stock' })

module.exports = StockMouvement;
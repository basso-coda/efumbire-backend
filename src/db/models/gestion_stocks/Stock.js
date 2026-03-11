const { DataTypes } = require('sequelize');
const TypeEngrais = require('../gestion_terrains/TypeEngrais');
const Colline = require('../gestion_provinces/Colline')
const sequelize = require('../index').sequelize;

const Stock = sequelize.define('stock', {
    id_stock: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    type_engrais_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    quantite_disponible: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },

    colline_id: DataTypes.SMALLINT,

    updated_date: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    tableName: 'stock',
    timestamps: false,
})

Stock.belongsTo(TypeEngrais, { foreignKey: 'type_engrais_id', as: 'type_engrais' })
Stock.belongsTo(Colline, { foreignKey: 'colline_id', as: 'colline' })

module.exports = Stock;
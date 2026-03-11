const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;
/**
 * model for culture types
 * @author elam
 * @date 16/2/2026
 */
const TypeCulture = sequelize.define('type_culture', {
    id_type_culture: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_type_culture: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    date_creation: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false,
    initialAutoIncrement: 1,
    tableName:'type_cultures'
})

module.exports = TypeCulture;
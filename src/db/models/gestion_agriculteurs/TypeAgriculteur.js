const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;
/**
 * model for farmer types
 * @author elam
 * @date 16/2/2026
 */
const TypeAgriculteur = sequelize.define('type_agriculteur', {
    id_type_agriculteur: {
        type: DataTypes.TINYINT(4),
        primaryKey: true,
        autoIncrement: true
    },
    nom_type_agriculteur: {
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
    tableName:'type_agriculteurs'
})

module.exports = TypeAgriculteur;
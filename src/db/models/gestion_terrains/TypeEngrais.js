const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;
/**
 * model for fertilizer types
 * @author elam
 * @date 16/2/2026
 */
const TypeEngrais = sequelize.define('type_engrais', {
    id_type_engrais: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_type_engrais: {
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
    tableName:'type_engrais'
})

module.exports = TypeEngrais;
const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;
/**
 * model for seasons
 * @author elam
 * @date 16/2/2026
 */
const Saison = sequelize.define('saison', {
    id_saison: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    intitule: {
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
    tableName:'saisons'
})

module.exports = Saison;
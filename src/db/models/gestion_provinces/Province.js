const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;
/**
 * model pour  les provinces
 * @author elam 
 * @date 16/2/2026
 */
const Province = sequelize.define('provinces', {
    PROVINCE_ID: {
        type: DataTypes.TINYINT,
        primaryKey: true,
        autoIncrement: true,
        defaultValue: null
    },
    PROVINCE_NAME: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    PROVINCE_LATITUDE: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    PROVINCE_LONGITUDE: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    PROVINCE_NAME: DataTypes.STRING,
    PROVINCE_LATITUDE: DataTypes.STRING,
    PROVINCE_LONGITUDE: DataTypes.STRING,
}, {
    timestamps: false,
    initialAutoIncrement: 1,
    tableName:'provinces'
})

module.exports = Province;
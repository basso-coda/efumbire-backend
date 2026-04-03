const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const EngraisRecommandation = sequelize.define('engrais_recommandation', {
    id_engrais_recommandations: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    type_engrais_id: DataTypes.INTEGER,
    type_culture_id: DataTypes.INTEGER,

    dose_par_hectare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    min_dose: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    max_dose: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    saison_id: DataTypes.INTEGER,

    date_creation: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
}, {
    tableName: 'engrais_recommandations',
    timestamps: false,
})

module.exports = EngraisRecommandation;
const { DataTypes } = require('sequelize');
const Approvisionnement = require('./Approvisionnement');
const TypeEngrais = require('../gestion_terrains/TypeEngrais');
const sequelize = require('../index').sequelize;

const ApprovisionnementItems = sequelize.define('approvisionnement_items', {
    id_approvisionnement_items: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    approvisionnement_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    type_engrais_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    quantite_recue: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },

}, {
    tableName: 'approvisionnement_items',
    timestamps: false,
})

ApprovisionnementItems.belongsTo(Approvisionnement, { foreignKey: 'approvisionnement_id', as: 'approvisionnement' })
ApprovisionnementItems.belongsTo(TypeEngrais, { foreignKey: 'type_engrais_id', as: 'type_engrais' })

module.exports = ApprovisionnementItems;
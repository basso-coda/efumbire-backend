const { DataTypes } = require('sequelize');
const Commande = require('./Commande');
const TypeEngrais = require('../gestion_terrains/TypeEngrais')
const sequelize = require('../index').sequelize;

const CommandeItems = sequelize.define('commande_items', {
    id_commande_items: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    quantite: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    prix_unitaire: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },

    commande_id: DataTypes.INTEGER,
    type_engrais_id: DataTypes.INTEGER,

}, {
    tableName: 'commande_items',
    timestamps: false,
})

// CommandeItems.belongsTo(Commande, { foreignKey: 'commande_id', as: 'commande' })
// CommandeItems.belongsTo(TypeEngrais, { foreignKey: 'type_engrais_id', as: 'type_engrais' })

module.exports = CommandeItems;
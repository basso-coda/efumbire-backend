const { DataTypes } = require('sequelize');
const Agriculteur = require('../gestion_agriculteurs/Agriculteur');
const Saison = require('../gestion_commandes/Saison')
const sequelize = require('../index').sequelize;

const Commande = sequelize.define('commande', {
    id_commande: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    agriculteur_id: DataTypes.INTEGER,
    saison_id: DataTypes.INTEGER,
    colline_id: DataTypes.SMALLINT,

    date_commande: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    
}, {
    tableName: 'commandes',
    timestamps: false,
})

// Commande.belongsTo(Agriculteur, { foreignKey: 'agriculteur_id', as: 'agriculteur' })
// Commande.belongsTo(Saison, { foreignKey: 'saison_id', as: 'saison' })

module.exports = Commande;
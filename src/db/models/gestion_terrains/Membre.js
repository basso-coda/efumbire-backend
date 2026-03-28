const { DataTypes } = require('sequelize');
const Agriculteur = require('../gestion_agriculteurs/Agriculteur');
const sequelize = require('../index').sequelize;

const Membre = sequelize.define('membre', {
    id_membre: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nom_complet_membre: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    agriculteur_id: DataTypes.INTEGER,

    // status: {
    //     type: DataTypes.BOOLEAN,
    //     allowNull: false
    // },

    date_creation: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    tableName: 'membres',
    timestamps: false,
})

// Membre.belongsTo(Agriculteur, { foreignKey: 'agriculteur_id', as: 'agriculteur' })

module.exports = Membre;
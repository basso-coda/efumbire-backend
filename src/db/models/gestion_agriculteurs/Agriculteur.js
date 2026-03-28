const { DataTypes } = require('sequelize');
const TypeAgriculteur = require('./TypeAgriculteur');
const Colline = require('../gestion_provinces/Colline');
const sequelize = require('../index').sequelize;

const Agriculteur = sequelize.define('agriculteur', {
    id_agriculteur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    nom_complet: DataTypes.STRING,

    numero_telephone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },

    matricule: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },

    carte_identite: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },

    nif: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },

    colline_id: DataTypes.SMALLINT,
    type_agriculteur_id: DataTypes.TINYINT,

    date_creation: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    tableName: 'agriculteurs',
    timestamps: false,
})

// Agriculteur.belongsTo(TypeAgriculteur, { foreignKey: 'type_agriculteur_id', as: 'type_agriculteur' })
// Agriculteur.belongsTo(Colline, { foreignKey: 'colline_id', as: 'collines' })

module.exports = Agriculteur;
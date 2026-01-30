const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class PharmacieNom extends Model {}

PharmacieNom.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    matricule: {
        type: DataTypes.NUMERIC(6, 0), // Type numérique de 6 chiffres
        allowNull: false,
        unique: true,
        validate: {
            min: 100000, // Minimum 6 chiffres
            max: 999999, // Maximum 6 chiffres
        },
    },
    pharmanom: {  // Renommé le champ en pharmanom
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'PharmacieNom',  // Nom du modèle
    tableName: 'pharmacienom',  // Nom de la table
    timestamps: false,
});

module.exports = PharmacieNom;

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    adresse: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    datenaissance: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    motdepasse: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    matricule: {
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            len: [6, 6],  // Vérifie que la longueur est de 6 caractères
            isNumeric: true,  // Vérifie que c'est numérique
        },
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'utilisateur', 
    timestamps: false, 
});

module.exports = User;

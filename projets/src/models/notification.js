const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Notification = sequelize.define('Notification', {
    idN: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        allowNull: false,
        primaryKey: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    datenvoie: { 
        type: DataTypes.DATE,
        allowNull: false,
        unique: true, 
    },
    heure: { 
        type: DataTypes.TIME,
        allowNull: false,
        unique: true, 
    },
    lue: { 
        type: DataTypes.BOOLEAN,
        defaultValue: false, 
    },
    matricule: {
        type: DataTypes.STRING(6), // Limiter la longueur à 6 caractères
        allowNull: false,
        unique: true,  // Assurez-vous que le matricule est unique
        validate: {
            len: [6, 6], // Validation pour garantir exactement 6 caractères
            isNumeric: true, // Le matricule doit être composé uniquement de chiffres
        },
    },
}, {
    tableName: 'notification', 
    timestamps: false,
});

module.exports = Notification;

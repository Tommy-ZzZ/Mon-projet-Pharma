const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const DossierPatient = sequelize.define('DossierPatient', {

    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        allowNull: false,
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
    adress: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
    },
    medicament: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
    },
    historiquecommande: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
    },
}, {
    tableName: 'dossierpatient', 
    timestamps: false,
});

module.exports = DossierPatient;

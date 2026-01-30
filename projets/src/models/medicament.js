const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Medicament = sequelize.define('Medicament', {
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
    posologie: {
        type: DataTypes.STRING,
        allowNull: false,
    
    },
    indication: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    interaction: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    effetIndesirable: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
    },

    coût: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
    },

}, {
    tableName: 'medicament', 
    timestamps: false,
});

module.exports = Medicament;

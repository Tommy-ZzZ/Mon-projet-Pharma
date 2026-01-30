const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const CompteClient = sequelize.define('CompteClient', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        allowNull: false,
        primaryKey: true,
    },
    motdepasse: { 
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
      matricule: {
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            len: [6, 6], 
            isNumeric: true, 
    },
},
        
}, {
    tableName: 'compteclient', 
    timestamps: false, 
});

module.exports = CompteClient;

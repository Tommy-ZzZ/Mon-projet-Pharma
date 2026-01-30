const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const generateMatricule = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Génère un nombre aléatoire de 6 chiffres
};

const Pharmacie = sequelize.define('Pharmacie', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    matricule: {
        type: DataTypes.STRING(6), 
        allowNull: false,
        unique: true,
        validate: {
            len: [6, 6], 
        },
    },
    nom: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    nomPharmacie: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [8, 100],
        },
    },
    telephone: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, 
{
    tableName: 'pharmacie',
    timestamps: false,
});

// Hachage du mot de passe avant la création
Pharmacie.beforeCreate(async (pharmacie) => {
    const salt = await bcrypt.genSalt(10);
    pharmacie.password = await bcrypt.hash(pharmacie.password, salt);
});

module.exports = Pharmacie;

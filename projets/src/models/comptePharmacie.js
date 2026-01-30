const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ComptePharmacie = sequelize.define('ComptePharmacie', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 100],
        },
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    matricule: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [6, 6],
            isNumeric: true,
        },
    },
    nomPharmacie: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'comptepharmacie',
    timestamps: false,
});

module.exports = ComptePharmacie;

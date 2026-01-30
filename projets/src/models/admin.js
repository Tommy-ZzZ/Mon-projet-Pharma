// models/admin.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Admin extends Model {}

Admin.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    matricule: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [5, 5], // Le matricule doit être de 6 caractères
            isNumeric: true, // Le matricule doit être composé de chiffres
        },
    },
}, {
    sequelize,
    tableName: 'admin',
    timestamps: false,
});

module.exports = Admin;

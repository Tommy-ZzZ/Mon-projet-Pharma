const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Pharmacie = require('./pharmacie'); // Si vous avez une relation avec le modèle Pharmacie

const Commande = sequelize.define('Commande', {
    idC: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        allowNull: false,
        primaryKey: true,
    },
    clientName: {  // Ajout du nom du client
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {  // Ajout de l'adresse du client
        type: DataTypes.STRING,
        allowNull: false,
    },
    pharmacyName: {  // Vous pouvez lier ce champ à une clé étrangère pour la pharmacie
        type: DataTypes.STRING,  // Si vous préférez stocker juste le nom de la pharmacie
        allowNull: false,
    },
    prescriptionImage: {  // Ajout du champ d'image de prescription (optionnel)
        type: DataTypes.STRING,  // Stocke l'URL ou le chemin de l'image
        allowNull: true,
    },
    date: { 
        type: DataTypes.DATE,
        allowNull: false,
        unique: true, 
    },
     pharmacyMatricule: {  // Champ pour le matricule de la pharmacie
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    products: {  // Ajout de la structure des produits, cela pourrait être une relation ou un champ JSON
        type: DataTypes.JSONB,  // Utilisation d'un champ JSONB pour stocker les informations sur les produits (id, name, quantity)
        allowNull: false,
    },
    matricule: {  
    type: DataTypes.INTEGER,  // Changer en type numérique
    allowNull: false,
    validate: {
        isInt: {
            msg: "Le matricule doit être un nombre entier."  // Validation pour s'assurer que c'est bien un entier
        },
        len: {
            args: [6, 6],  // La longueur doit être exactement 6 caractères
            msg: "Le matricule doit comporter exactement 6 chiffres."
        }
    }
    },
    telephone: {  // Ajout du champ téléphone avec validation
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [10, 10], // Le téléphone doit comporter exactement 10 caractères
                msg: "Le téléphone doit comporter exactement 10 chiffres."
            },
            isNumeric: {  // Le téléphone doit être un nombre (pour éviter les lettres ou symboles)
                msg: "Le téléphone doit être constitué uniquement de chiffres."
            }
        }
    }
}, {
    tableName: 'commande', 
    timestamps: false, 
});

module.exports = Commande;

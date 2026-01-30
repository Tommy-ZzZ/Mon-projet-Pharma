/*const Notification = require('../models/notification');

// POST - Créer une notification
exports.createNotification = async (req, res) => {
    try {
        const { message, datenvoie, heure, matricule } = req.body;

        // Vérifier que tous les champs nécessaires sont présents
        if (!message || !datenvoie || !heure || !matricule) {
            console.log("Erreur : champs manquants dans la requête.");
            return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
        }

        // Créer une nouvelle notification avec la valeur 'lue' par défaut (false)
        const newNotification = await Notification.create({
            message,
            datenvoie,
            heure,
            matricule,  // Ajouter le matricule
            lue: false, // Par défaut, la notification est marquée comme non lue
        });

        // Message de succès
        console.log("Notification créée avec succès :", newNotification);

        // Retourner la notification créée
        res.status(201).json(newNotification);
    } catch (error) {
        console.error('Erreur lors de la création de la notification:', error.message);
        res.status(500).json({ error: 'Erreur lors de la création de la notification' });
    }
};

// GET - Récupérer toutes les notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        console.log(`Nombre de notifications récupérées : ${notifications.length}`);

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// GET - Récupérer une notification par ID
exports.getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Recherche de la notification avec l'ID : ${id}`);

        const notification = await Notification.findByPk(id);

        if (!notification) {
            console.log(`Notification avec l'ID ${id} non trouvée.`);
            return res.status(404).json({ error: 'Notification non trouvée' });
        }

        console.log(`Notification trouvée :`, notification);
        res.status(200).json(notification);
    } catch (error) {
        console.error('Erreur lors de la récupération de la notification:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// GET - Récupérer les notifications par matricule
exports.getNotificationByMatricule = async (req, res) => {
    try {
        const { matricule } = req.params;  // Récupérer le matricule passé dans l'URL

        // Vérifier que le matricule est un nombre valide
        if (!matricule || isNaN(matricule)) {
            return res.status(400).json({ error: 'Le matricule doit être un nombre valide.' });
        }

        // Convertir le matricule en nombre (dans le cas où il serait passé en tant que chaîne de caractères)
        const matriculeNumber = parseInt(matricule, 10);

        console.log(`Recherche des notifications pour le matricule : ${matriculeNumber}`);

        // Recherche des notifications en fonction du matricule
        const notifications = await Notification.findAll({
            where: { matricule: matriculeNumber },  // Utiliser le matricule numérique comme critère de recherche
        });

        if (notifications.length === 0) {
            console.log(`Aucune notification trouvée pour le matricule ${matriculeNumber}`);
            return res.status(404).json({ error: 'Aucune notification trouvée pour ce matricule' });
        }

        console.log(`Nombre de notifications trouvées pour le matricule ${matriculeNumber} : ${notifications.length}`);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications par matricule:', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
    }
};

// PUT - Mettre à jour une notification
exports.updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { lue, matricule } = req.body; // Récupérer 'lue' et 'matricule' pour mise à jour

        const notification = await Notification.findByPk(id);

        if (!notification) {
            console.log(`Notification avec l'ID ${id} non trouvée.`);
            return res.status(404).json({ error: 'Notification non trouvée' });
        }

        // Mise à jour de l'état 'lue' et 'matricule'
        if (lue !== undefined) notification.lue = lue;
        if (matricule) notification.matricule = matricule; // Mise à jour du matricule si fourni

        await notification.save();

        console.log(`Notification avec l'ID ${id} mise à jour avec succès :`, notification);
        res.status(200).json(notification);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la notification:', error.message);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la notification' });
    }
};

// DELETE - Supprimer une notification
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('Tentative de suppression de la notification avec l\'ID:', id);

        const result = await Notification.destroy({
            where: { idN: id }
        });

        if (result === 0) {
            console.log(`Notification avec l'ID ${id} non trouvée.`);
            return res.status(404).json({ error: 'Notification non trouvée' });
        }

        console.log(`Notification avec l'ID ${id} supprimée avec succès.`);
        res.status(200).json({ message: 'Notification supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la notification:', error.message);
        res.status(500).json({ error: 'Erreur lors de la suppression de la notification' });
    }
};
*/
const Notification = require('../models/notification');

// POST - Créer une notification
exports.createNotification = async (req, res) => {
    try {
        const { message, datenvoie, heure, matricule } = req.body;

        // Vérifier que tous les champs nécessaires sont présents
        if (!message || !datenvoie || !heure || !matricule) {
            console.log("Erreur : champs manquants dans la requête.");
            return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
        }

        // Créer une nouvelle notification avec la valeur 'lue' par défaut (false)
        const newNotification = await Notification.create({
            message,
            datenvoie,
            heure,
            matricule,  // Ajouter le matricule
            lue: false, // Par défaut, la notification est marquée comme non lue
        });

        // Message de succès
        console.log("Notification créée avec succès :", newNotification);

        // Retourner la notification créée
        res.status(201).json(newNotification);
    } catch (error) {
        console.error('Erreur lors de la création de la notification:', error.message);
        res.status(500).json({ error: 'Erreur lors de la création de la notification' });
    }
};

// GET - Récupérer toutes les notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        console.log(`Nombre de notifications récupérées : ${notifications.length}`);

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// GET - Récupérer une notification par ID
exports.getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Recherche de la notification avec l'ID : ${id}`);

        const notification = await Notification.findByPk(id);

        if (!notification) {
            console.log(`Notification avec l'ID ${id} non trouvée.`);
            return res.status(404).json({ error: 'Notification non trouvée' });
        }

        console.log(`Notification trouvée :`, notification);
        res.status(200).json(notification);
    } catch (error) {
        console.error('Erreur lors de la récupération de la notification:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// GET - Récupérer les notifications par matricule
exports.getNotificationByMatricule = async (req, res) => {
    try {
        const { matricule } = req.params;  // Récupérer le matricule passé dans l'URL

        // Vérifier que le matricule est un nombre valide
        if (!matricule || isNaN(matricule)) {
            return res.status(400).json({ error: 'Le matricule doit être un nombre valide.' });
        }

        // Convertir le matricule en nombre (dans le cas où il serait passé en tant que chaîne de caractères)
        const matriculeNumber = parseInt(matricule, 10);

        console.log(`Recherche des notifications pour le matricule : ${matriculeNumber}`);

        // Recherche des notifications en fonction du matricule
        const notifications = await Notification.findAll({
            where: { matricule: matriculeNumber },  // Utiliser le matricule numérique comme critère de recherche
        });

        if (notifications.length === 0) {
            console.log(`Aucune notification trouvée pour le matricule ${matriculeNumber}`);
            return res.status(404).json({ error: 'Aucune notification trouvée pour ce matricule' });
        }

        console.log(`Nombre de notifications trouvées pour le matricule ${matriculeNumber} : ${notifications.length}`);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications par matricule:', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
    }
};

// PUT - Mettre à jour une notification
exports.updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { lue, matricule } = req.body; // Récupérer 'lue' et 'matricule' pour mise à jour

        const notification = await Notification.findByPk(id);

        if (!notification) {
            console.log(`Notification avec l'ID ${id} non trouvée.`);
            return res.status(404).json({ error: 'Notification non trouvée' });
        }

        // Mise à jour de l'état 'lue' et 'matricule'
        if (lue !== undefined) notification.lue = lue;
        if (matricule) notification.matricule = matricule; // Mise à jour du matricule si fourni

        await notification.save();

        console.log(`Notification avec l'ID ${id} mise à jour avec succès :`, notification);
        res.status(200).json(notification);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la notification:', error.message);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la notification' });
    }
};

// DELETE - Supprimer une notification
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('Tentative de suppression de la notification avec l\'ID:', id);

        const result = await Notification.destroy({
            where: { idN: id }
        });

        if (result === 0) {
            console.log(`Notification avec l'ID ${id} non trouvée.`);
            return res.status(404).json({ error: 'Notification non trouvée' });
        }

        console.log(`Notification avec l'ID ${id} supprimée avec succès.`);
        res.status(200).json({ message: 'Notification supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la notification:', error.message);
        res.status(500).json({ error: 'Erreur lors de la suppression de la notification' });
    }
};

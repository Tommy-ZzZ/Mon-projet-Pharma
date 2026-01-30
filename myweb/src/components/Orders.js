import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // Pour gérer le type de message (succès ou erreur)
  const [pharmacies, setPharmacies] = useState([]); // Nouveau state pour les pharmacies
  const [selectedPharmacy, setSelectedPharmacy] = useState(""); // State pour la pharmacie sélectionnée
  const [orderHistory, setOrderHistory] = useState([]); // Nouveau state pour l'historique des commandes
  const [clientMatricule, setClientMatricule] = useState(localStorage.getItem('clientMatricule') || null); // Matricule récupéré à la connexion

  // Calcul du montant total des produits
  const calculateTotal = (products) => {
    let total = 0;
    products.forEach(product => {
      if (product.price && product.quantity) {
        total += product.price * product.quantity;
      }
    });
    return total || 0;
  };

  // Validation des commandes (ajout de valeurs par défaut si elles sont manquantes)
  const validateOrder = (order) => {
    if (!order.clientName) order.clientName = "Non classé";
    if (!order.address) order.address = "Non classé";
    if (!order.pharmacyName) order.pharmacyName = "Non classé"; // Correction : utiliser pharmacyName
    if (!order.telephone) order.telephone = "Non classé"; // Ajouter le téléphone

    let products = [];
    try {
      products = JSON.parse(order.products);
    } catch (error) {
      console.error('Erreur lors de la conversion des produits:', error);
      products = [];
    }

    const updatedProducts = products.map(product => {
      if (!product.price || !product.quantity) {
        return { ...product, price: "Non classé", quantity: "Non classé" };
      }
      return product;
    });

    return {
      ...order,
      products: updatedProducts,
      totalAmount: calculateTotal(updatedProducts),
      statut: order.statut || "En attente", // Statut par défaut "En attente"
    };
  };

  // Tri des commandes en fonction du statut
  const sortOrders = (orders) => {
    return orders.sort((a, b) => {
      if (a.statut === "En attente" && b.statut !== "En attente") return -1;
      if (b.statut === "En attente" && a.statut !== "En attente") return 1;
      if (a.statut === "Nouvelle commande" && b.statut !== "Nouvelle commande") return -1;
      if (b.statut === "Nouvelle commande" && a.statut !== "Nouvelle commande") return 1;
      return 0;
    });
  };

  // Récupération des commandes depuis l'API
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://192.168.209.25:4000/api/commande');
      const data = await response.json();
      if (Array.isArray(data)) {
        const validatedOrders = data.map(order => validateOrder(order));
        setOrders(sortOrders(validatedOrders));

        // Log détaillé pour le filtrage des commandes avec le matricule du client
        if (clientMatricule) {
          console.log(`Comparaison des matricules : Client matricule = ${clientMatricule}`);
          const matchingOrders = validatedOrders.filter(order => order.matricule === clientMatricule);
          console.log(`Commandes trouvées pour le matricule ${clientMatricule}:`, matchingOrders);
          
          if (matchingOrders.length > 0) {
            setSelectedOrder(matchingOrders[0]); // Afficher directement la première commande correspondante
            console.log('Commande correspondante trouvée:', matchingOrders[0]);
          } else {
            console.log('Aucune commande correspondante trouvée.');
          }
        }
      } else {
        console.error('Les données des commandes sont invalides');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    }
  };

  // Récupération des pharmacies depuis l'API
  const fetchPharmacies = async () => {
    try {
      const response = await fetch('http://192.168.209.25:4000/api/nompharmacie');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des pharmacies');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        const pharmaciesNames = data.map(pharmacy => pharmacy.nompharmacie);
        setPharmacies(pharmaciesNames); // Stocker seulement les noms des pharmacies
      } else {
        console.error('Données invalides pour les pharmacies', data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des pharmacies:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPharmacies();
  }, [clientMatricule]); // Recharger les commandes chaque fois que le matricule du client change

  // Changement du statut de la commande
  const handleStatusChange = (id, newStatus) => {
    console.log(`Changement de statut pour la commande ${id}: ${newStatus}`);
    setOrders(orders.map(order =>
      order.matricule === id ? { ...order, statut: newStatus } : order
    ));

    // Déplacer la commande dans l'historique après statut changé
    const updatedOrder = orders.find(order => order.matricule === id);
    if (updatedOrder) {
      setOrderHistory(prevHistory => [...prevHistory, { ...updatedOrder, statut: newStatus }]);
    }
  };

  // Suppression d'une commande
  const handleDelete = async (matricule) => {
    if (!matricule) {
      console.error('Matricule de la commande manquant pour la suppression');
      return;
    }

    try {
      console.log(`Suppression de la commande avec matricule: ${matricule}`);
      const response = await fetch(`http://192.168.209.25:4000/api/commande/matricule/${matricule}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setOrders(orders.filter(order => order.matricule !== matricule));
        setSelectedOrder(null); // Fermer la vue des détails après suppression
        setMessage("Commande supprimée avec succès !");
        setMessageType("success");

        // Ajouter la commande à l'historique
        const deletedOrder = orders.find(order => order.matricule === matricule);
        if (deletedOrder) {
          setOrderHistory(prevHistory => [...prevHistory, { ...deletedOrder, statut: 'Supprimée' }]);
        }
      } else {
        console.error(`Erreur lors de la suppression de la commande avec matricule ${matricule}`);
        setMessage("Erreur lors de la suppression de la commande.");
        setMessageType("error");
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande:', error);
      setMessage("Erreur lors de la suppression de la commande.");
      setMessageType("error");
    }
  };

  // Sélection d'une commande pour afficher les détails
  const handleSelectOrder = (id) => {
    const order = orders.find(order => order.matricule === id);
    setSelectedOrder(order);
  };

  // Envoi d'un message au client
  const handleSendMessage = async () => {
  if (selectedOrder && message) {
    try {
      const date = new Date();
      const datenvoie = date.toISOString().split('T')[0];
      const heure = date.toTimeString().split(' ')[0];

      if (!datenvoie || !heure) {
        console.error('Date ou heure non valide');
        return;
      }

      const response = await fetch('http://192.168.209.25:4000/api/notification', {
        method: 'POST',
        body: JSON.stringify({
          matricule: selectedOrder.matricule,
          message,
          datenvoie,
          heure,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        console.log('Message envoyé avec succès');
        setMessageType('success');
        setMessage('Message envoyé avec succès.');
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de l\'envoi du message:', errorData.message);
        setMessageType('error');
        setMessage('Erreur lors de l\'envoi du message.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setMessageType('error');
      setMessage('Erreur lors de l\'envoi du message.');
    }
  }
};


  // Gestion de la fermeture des détails de commande
  const handleOverlayClick = () => {
    setSelectedOrder(null);
  };

  // Filtrage des commandes en fonction de la pharmacie sélectionnée
  const filteredOrders = selectedPharmacy
    ? orders.filter(order => order.pharmacyName === selectedPharmacy)
    : orders;

  // Fonction pour obtenir la classe CSS du statut de la commande
  const getStatusClass = (status) => {
    switch (status) {
      case 'Livré':
        return 'success';
      case 'Rejeté':
        return 'error';
      case 'En attente':
        return 'pending';
      case 'Nouvelle commande':
        return 'new';
      default:
        return '';
    }
  };

  return (
    <div className="orders-container">
      <h2>Liste des commandes</h2>

      {message && (
        <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Sélection de pharmacie */}
      <div className="pharmacy-filter-container">
        <select
          onChange={(e) => setSelectedPharmacy(e.target.value)}
          value={selectedPharmacy}
          className="pharmacy-filter"
        >
          <option value="">-- Sélectionner une pharmacie --</option>
          {pharmacies.length > 0 ? (
            pharmacies.map((pharmacy, index) => (
              <option key={index} value={pharmacy}>
                {pharmacy}
              </option>
            ))
          ) : (
            <option>Pas de pharmacies disponibles</option>
          )}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Date</th>
            <th>Nom du Client</th>
            <th>Adresse</th>
            <th>Pharmacie en charge</th>
            <th>Téléphone</th>
            <th>Nom du Produit</th>
            <th>Prix du Produit</th>
            <th>Statut de la Commande</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.matricule} onClick={() => handleSelectOrder(order.matricule)} style={{ cursor: 'pointer' }}>
              <td>{order.matricule || "Non classé"}</td>
              <td>{new Date(order.date).toLocaleString() || "Non classé"}</td>
              <td>{order.clientName}</td>
              <td>{order.address}</td>
              <td>{order.pharmacyName}</td>
              <td>{order.telephone || "Non classé"}</td>
              <td>{order.products.map(product => product.name || "Non classé").join(', ')}</td>
              <td>{order.products.map(product => `${product.price !== "Non classé" ? `${product.price} MGA` : "Non classé"} x ${product.quantity !== "Non classé" ? product.quantity : "Non classé"}`).join(', ')}</td>
              <td><span className={getStatusClass(order.statut)}>{order.statut}</span></td>
              <td>
                <button onClick={(e) => { e.stopPropagation(); handleStatusChange(order.matricule, 'Livré'); }} className="btn-accept">Accepter</button>
                <button onClick={(e) => { e.stopPropagation(); handleStatusChange(order.matricule, 'Rejeté'); }} className="btn-reject">Rejeter</button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(order.matricule); }} className="btn-delete">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="order-details-overlay" onClick={handleOverlayClick}>
          <div className="order-details" onClick={e => e.stopPropagation()}>
            <h3>Détails de la commande</h3>
            <p><strong>Nom du client:</strong> {selectedOrder.clientName}</p>
            <p><strong>Adresse:</strong> {selectedOrder.address}</p>
            <p><strong>Pharmacie:</strong> {selectedOrder.pharmacyName}</p>
            <p><strong>Téléphone:</strong> {selectedOrder.telephone || "Non classé"}</p>
            <p><strong>Produits:</strong></p>
            <ul>
              {selectedOrder.products.map(product => (
                <li key={product.id}>
                  {product.name} - {product.price} MGA x {product.quantity}
                </li>
              ))}
            </ul>
            <textarea
              placeholder="Écrivez un message au client..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            ></textarea>
            <button onClick={handleSendMessage}>Envoyer Message</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

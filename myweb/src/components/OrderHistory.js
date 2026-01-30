import React, { useState, useEffect } from 'react';
import '../App.css'; // Importation du fichier CSS

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Fonction pour récupérer les commandes historiques
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://192.168.209.25:4000/api/commande'); // Remplacez ceci par l'URL de votre API
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const filteredOrders = orders.filter((order) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      order.matricule.toLowerCase().includes(lowerCaseSearchTerm) ||
      order.clientName.toLowerCase().includes(lowerCaseSearchTerm) ||
      order.matricule.toLowerCase().includes(lowerCaseSearchTerm) // Recherche par matricule
    );
  });

  // Fonction pour obtenir la classe CSS en fonction du statut de la commande
  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'status-delivered';
      case 'canceled':
        return 'status-canceled';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  return (
    <div className="order-history-container">
      <h1 className="table-title">Historique des Commandes</h1>

      {/* Icône de loupe pour activer la barre de recherche */}
      <div className="search-icon" onClick={toggleSearch}>
        <i className="fa fa-search"></i>
      </div>

      {/* Barre de recherche visible en dessous de la navbar */}
      {showSearch && (
        <input
          type="text"
          placeholder="Rechercher par matricule ou nom"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      )}

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
            <th>Quantité</th>
            <th>Statut de la Commande</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => {
            // Parsing des produits JSON pour accéder aux données
            const products = JSON.parse(order.products);

            return (
              <tr key={index}>
                <td>{order.matricule}</td>
                <td>{order.date}</td>
                <td>{order.clientName}</td>
                <td>{order.address}</td>
                <td>{order.pharmacy}</td>
                <td>{order.telephone}</td>

                {/* Affichage des produits avec leur quantité */}
                {products.map((product, productIndex) => (
                  <tr key={productIndex}>
                    <td colSpan={2}></td> {/* Cellules vides pour aligner les produits avec les autres données */}
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td className={getStatusClass(order.orderStatus)}>
                      {order.orderStatus}
                    </td>
                  </tr>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer toutes les commandes et filtrer par matricule
  const fetchOrders = async () => {
    try {
      // Récupérer le matricule de l'utilisateur depuis AsyncStorage
      const matricule = await AsyncStorage.getItem('matricule');
      console.log('Matricule récupéré depuis AsyncStorage:', matricule);

      if (matricule) {
        // Récupérer toutes les commandes
        const orderResponse = await fetch('http://192.168.209.25:4000/api/commande');
        if (!orderResponse.ok) {
          console.error('Erreur lors de la requête commandes:', orderResponse.status, orderResponse.statusText);
          throw new Error(`Erreur réseau: ${orderResponse.statusText}`);
        }

        const orderData = await orderResponse.json();
        console.log('Commandes reçues:', orderData);

        // Filtrer les commandes qui correspondent au matricule de l'utilisateur
        const filteredOrders = orderData.filter(order => order.matricule === matricule);
        console.log('Commandes filtrées:', filteredOrders);

        if (filteredOrders.length > 0) {
          setOrders(filteredOrders); // Mettre à jour l'état avec les commandes filtrées
        } else {
          console.log('Aucune commande trouvée pour ce matricule');
        }
      } else {
        console.warn('Aucun matricule trouvé dans AsyncStorage');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error.message);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  useEffect(() => {
    console.log('Composant HistoryScreen monté, récupération des commandes...');
    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des Commandes</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <ScrollView style={styles.scrollView}>
          {orders.length > 0 ? (
            orders.map((order) => (
              <View key={order.idC} style={styles.orderContainer}>
                <Text style={styles.orderText}>Date: {order.date}</Text>
                <Text style={styles.orderText}>Pharmacie: {order.pharmacyName}</Text>
                <Text style={styles.orderText}>Téléphone: {order.telephone}</Text>
                <Text style={styles.orderText}>Produits: {order.products}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noOrdersText}>Aucune commande trouvée pour ce matricule.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollView: {
    width: '100%',
  },
  orderContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderText: {
    fontSize: 16,
    color: '#495057',
  },
  noOrdersText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
  },
});

export default HistoryScreen;

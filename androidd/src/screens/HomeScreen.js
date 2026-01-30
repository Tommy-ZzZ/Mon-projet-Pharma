import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { homeScreenStyles } from '../styles/homeScreenStyles';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const HomeScreen = ({ navigation }) => {
  const [matricule, setMatricule] = useState(''); // Matricule de l'utilisateur
  const [notifications, setNotifications] = useState([]); // Notifications de l'utilisateur
  const [isModalVisible, setIsModalVisible] = useState(false); // Visibilité du modal

  const adImages = [
    require('../../assets/images/prom1.jpg'),
    require('../../assets/images/prom2.jpg'),
    require('../../assets/images/prom3.jpg'),
    require('../../assets/images/prom4.jpg'),
  ];

  // Fonction pour récupérer le matricule de l'utilisateur depuis AsyncStorage
  const fetchMatricule = async () => {
    try {
      const storedMatricule = await AsyncStorage.getItem('matricule'); // Récupération du matricule
      if (storedMatricule) {
        setMatricule(storedMatricule); // Mise à jour de l'état avec le matricule récupéré
      } else {
        console.log("Matricule non trouvé dans AsyncStorage.");
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du matricule:', error);
    }
  };

  // Fonction pour récupérer les notifications depuis l'API
  const fetchNotifications = async () => {
    if (matricule) {
      console.log("Recherche des notifications pour le matricule :", matricule);
      try {
        const response = await fetch(`http://192.168.209.25:4000/api/notification/notifications/matricule/${matricule}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Réponse API :', data); // Affiche la réponse du backend

          if (Array.isArray(data)) {
            setNotifications(data); // Mettre à jour l'état avec les notifications reçues
          } else {
            console.log("Les données reçues ne sont pas un tableau.");
            setNotifications([]); // Si les données ne sont pas sous forme de tableau, on vide les notifications
          }
        } else {
          console.error(`Erreur API: ${response.status} - ${response.statusText}`);
          setNotifications([]); // Si une erreur API se produit, on vide les notifications
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
        setNotifications([]); // On vide les notifications en cas d'erreur
      }
    } else {
      console.log("Matricule introuvable. Impossible de récupérer les notifications.");
    }
  };

  // Fonction pour marquer la notification comme lue
  const markAsRead = (idN) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification =>
        notification.idN === idN ? { ...notification, lue: true } : notification
      )
    );
  };

  useEffect(() => {
    fetchMatricule(); // Récupérer le matricule dès que le composant est monté
  }, []);

  useEffect(() => {
    if (matricule) {
      fetchNotifications(); // Récupérer les notifications après que le matricule ait été récupéré
    }
  }, [matricule]);

  const handleNotificationPress = (notification) => {
    markAsRead(notification.idN);
    setIsModalVisible(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (matricule) {
        fetchNotifications(); // Actualiser les notifications à chaque focus
      }
    }, [matricule])
  );

  return (
    <ScrollView contentContainerStyle={homeScreenStyles.scrollContainer}>
      <View style={homeScreenStyles.navBar}>
        <TouchableOpacity>
          <Image source={require('../../assets/images/homme.png')} style={homeScreenStyles.profileIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={{ position: 'relative' }}>
          <Image source={require('../../assets/images/bell.jpg')} style={homeScreenStyles.notificationIcon} />
          {notifications.some(notification => !notification.lue) && (
            <View style={homeScreenStyles.notificationBadge}>
              <Text style={homeScreenStyles.notificationBadgeText}>
                {notifications.filter(notification => !notification.lue).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={homeScreenStyles.searchContainer}>
        <TextInput
          style={homeScreenStyles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor="#888"
        />
      </View>

      <Text style={homeScreenStyles.sectionTitle}>Nos services</Text>
      <View style={homeScreenStyles.servicesContainer}>
        <TouchableOpacity style={homeScreenStyles.serviceCard} onPress={() => navigation.navigate('Pharmacie Proche')}>
          <Image source={require('../../assets/images/3loca.png')} style={homeScreenStyles.serviceImage} />
          <Text style={homeScreenStyles.serviceText}>Pharmacie la plus proche</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeScreenStyles.serviceCard} onPress={() => navigation.navigate('Réservation')}>
          <Image source={require('../../assets/images/3coman.png')} style={homeScreenStyles.serviceImage} />
          <Text style={homeScreenStyles.serviceText}>Réserver</Text>
        </TouchableOpacity>
      </View>

      <View style={homeScreenStyles.servicesContainer}>
        <TouchableOpacity style={homeScreenStyles.serviceCard} onPress={() => navigation.navigate('Produits')}>
          <Image source={require('../../assets/images/3med.png')} style={homeScreenStyles.serviceImage} />
          <Text style={homeScreenStyles.serviceText}>Liste des Produits</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeScreenStyles.serviceCard} onPress={() => navigation.navigate('Alarme')}>
          <Image source={require('../../assets/images/3call.png')} style={homeScreenStyles.serviceImage} />
          <Text style={homeScreenStyles.serviceText}>Rappel de prise de médicament</Text>
        </TouchableOpacity>
      </View>

      <View style={homeScreenStyles.adContainer}>
        <Text style={homeScreenStyles.adTitle}>Publicités</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled={false}>
          {adImages.map((image, index) => (
            <Image key={index} source={image} style={homeScreenStyles.adImage} />
          ))}
        </ScrollView>
      </View>

      <Modal visible={isModalVisible} transparent={true} animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
        <View style={homeScreenStyles.modalContainer}>
          <View style={[homeScreenStyles.modalContent, { width: '90%' }]}>
            <Text style={homeScreenStyles.modalTitle}>Notifications</Text>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <TouchableOpacity
                  key={index}
                  style={[homeScreenStyles.notificationItem, notification.lue && { backgroundColor: '#ddd' }]}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <Text style={homeScreenStyles.modalText}>{notification.message}</Text>
                  <Text style={homeScreenStyles.modalText}>{`${notification.datenvoie} ${notification.heure}`}</Text>
                  {!notification.lue && <View style={homeScreenStyles.notificationReadIndicator} />}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={homeScreenStyles.modalText}>Aucune notification disponible</Text>
            )}
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={homeScreenStyles.closeButton}>
              <Text style={homeScreenStyles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default HomeScreen;

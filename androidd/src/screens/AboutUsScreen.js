import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const AboutUsScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initialiser l'animation

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Valeur finale de l'animation
      duration: 1000, // Durée de l'animation
      useNativeDriver: true, // Utiliser le driver natif pour des performances optimales
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>À Propos de Nous</Text>
      <Text style={styles.content}>PharmaPLUS, Edité par Sunsoft, en collaboration avec des pharmaciens, PharmaPLUS est un outil de travail adapté spécialement pour les exercices officinaux. contacter-nous si vous avez besoin d'aides.</Text>
      
      <View style={styles.contactContainer}>
        <Text style={styles.contactTitle}>Contactez-nous :</Text>
        
        <View style={styles.contactItem}>
          {/* Geolocation icon */}
          <Icon name="map-marker" size={30} color="green" style={styles.icon} />
          <Text style={styles.contactLabel}>Adresse :</Text>
          <Text>Ankadindravola Ivato - 105 Antananarivo Madagascar</Text>
        </View>
        
        <View style={styles.contactItem}>
          {/* Phone icon */}
          <Icon name="phone" size={30} color="green" style={styles.icon} />
          <Text style={styles.contactLabel}>Téléphone :</Text>
          <Text>+261 34 22 222 17, +261 32 05 222 17</Text>
        </View>
        
        <View style={styles.contactItem}>
          {/* Email icon */}
          <Icon name="envelope" size={30} color="green" style={styles.icon} />
          <Text style={styles.contactLabel}>Email :</Text>
          <Text>sunrise@moov.mg</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Fond gris clair
  },
  title: {
    fontSize: 30, // Augmentation de la taille du texte
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  content: {
    fontSize: 18, // Augmentation de la taille du texte
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  contactContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0', // Bordure légère
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff', // Fond blanc pour la section contact
    width: '90%',
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 24, // Augmentation de la taille du texte
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  contactItem: {
    marginVertical: 10,
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 20, // Augmentation de la taille du texte
    fontWeight: '600',
    color: '#777',
    marginTop: 10,
  },
  icon: {
    marginBottom: 10, // Spacing between icon and text
  },
});

export default AboutUsScreen;

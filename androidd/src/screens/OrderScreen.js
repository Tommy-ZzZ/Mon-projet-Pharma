import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, TextInput, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderScreen = ({ route }) => {
  const [matricule, setMatricule] = useState('');
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [selectedPharmacyMatricule, setSelectedPharmacyMatricule] = useState('');
  const [updatedMedicaments, setUpdatedMedicaments] = useState(route.params?.selectedMedicaments || []);

  // Récupérer les informations client depuis AsyncStorage
  useEffect(() => {
    const loadClientInfo = async () => {
      try {
        const storedMatricule = await AsyncStorage.getItem('matricule');
        const storedNom = await AsyncStorage.getItem('nom');
        const storedPrenom = await AsyncStorage.getItem('prenom');
        const storedAddress = await AsyncStorage.getItem('adresse');
        const storedPhoneNumber = await AsyncStorage.getItem('telephone');

        if (storedMatricule) {
          setMatricule(storedMatricule);
        }

        if (storedNom && storedPrenom) {
          setClientName(`${storedNom} ${storedPrenom}`); // Combinaison nom et prénom
        }

        if (storedAddress) {
          setAddress(storedAddress);
        }

        if (storedPhoneNumber) {
          setPhoneNumber(storedPhoneNumber);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations du client :", error);
        Alert.alert("Erreur", "Une erreur s'est produite lors de la récupération des informations du client.");
      }
    };

    loadClientInfo();
  }, []);

  // Récupérer les pharmacies depuis l'API
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await fetch('http://192.168.209.25:4000/api/pharmacienom');
        const data = await response.json();
        if (Array.isArray(data)) {
          setPharmacies(data);
          console.log("Pharmacies récupérées:", data); // Log pour vérifier la liste des pharmacies
        } else {
          throw new Error('Les données des pharmacies ne sont pas au bon format');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des pharmacies:', error);
        Alert.alert("Erreur", "Erreur lors de la récupération des pharmacies");
      }
    };

    fetchPharmacies();
  }, []);

  // Gérer la sélection de la pharmacie
  const handlePharmacySelect = (pharmacyName) => {
    console.log('Pharmacie sélectionnée:', pharmacyName); // Log du nom de la pharmacie sélectionnée
    setSelectedPharmacy(pharmacyName);
    
    // Chercher la pharmacie correspondant au nom sélectionné et mettre à jour la matricule
    const selected = pharmacies.find(pharmacy => pharmacy.pharmanom === pharmacyName);
    if (selected) {
      setSelectedPharmacyMatricule(selected.matricule);
      console.log('Matricule de la pharmacie sélectionnée:', selected.matricule); // Log du matricule de la pharmacie
    } else {
      console.log('Aucune pharmacie trouvée pour le nom:', pharmacyName); // Log si aucune pharmacie n'est trouvée
    }
  };

  // Confirmation de la commande
  const confirmOrder = async () => {
    if (!matricule) {
      Alert.alert("Erreur", "Le matricule du client est manquant.");
      return;
    }

    if (!clientName || !address || !phoneNumber) {
      Alert.alert("Erreur", "Veuillez compléter toutes les informations du client.");
      return;
    }

    if (!updatedMedicaments || updatedMedicaments.length === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner au moins un produit.");
      return;
    }

    if (!selectedPharmacy || !selectedPharmacyMatricule) {
      Alert.alert("Erreur", "Veuillez sélectionner une pharmacie.");
      return;
    }

    // Détails de la commande
    const orderDetails = {
      matricule: matricule,
      clientName,
      address,
      telephone: phoneNumber,
      pharmacyMatricule: selectedPharmacyMatricule,  // Matricule de la pharmacie ajoutée
      pharmacyName: selectedPharmacy,  // Nom de la pharmacie
      products: updatedMedicaments.map(product => ({
        name: product.libelle || 'Non classé',
        quantity: product.quantity || 1
      })),
      prescriptionImage: prescriptionImage || null,
    };

    console.log('Détails de la commande:', orderDetails); // Log des détails de la commande avant envoi

    try {
      const response = await fetch('http://192.168.209.25:4000/api/commande', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Réponse du serveur:', data); // Log de la réponse du serveur

        // Création de la notification
        const notification = {
          message: `Nouvelle commande: ${clientName} a passé une commande pour la pharmacie ${selectedPharmacy} (Matricule: ${matricule}).`,
          datenvoie: new Date().toISOString().split('T')[0], // Date actuelle
          heure: new Date().toLocaleTimeString(), // Heure actuelle
          lue: false, // Notification non lue
          matricule: matricule,
        };

        // Envoi de la notification
        const notificationResponse = await fetch('http://192.168.209.25:4000/api/notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notification),
        });

        if (notificationResponse.ok) {
          console.log('Notification envoyée avec succès'); // Log si la notification est envoyée avec succès
        } else {
          console.error('Erreur lors de l\'envoi de la notification:', notificationResponse.statusText); // Log en cas d'erreur
        }

        Alert.alert('Commande confirmée', `Votre commande a été envoyée avec succès. ID de commande: ${data.id}`);
      } else {
        console.error('Erreur lors de l\'envoi de la commande:', response.statusText); // Log si la commande échoue
        Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi de la commande');
      }
    } catch (error) {
      console.error('Erreur de communication avec le serveur:', error); // Log en cas d'erreur serveur
      Alert.alert('Erreur', 'Impossible de contacter le serveur');
    }
  };

  // Télécharger l'ordonnance
  const handlePrescriptionUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPrescriptionImage(result.assets[0].uri);
      console.log('Ordonnance téléchargée:', result.assets[0].uri); // Log de l'URI de l'ordonnance téléchargée
    }
  };

  // Mise à jour de la quantité
  const handleQuantityChange = (id, value) => {
    const quantity = Math.max(1, parseInt(value));
    const updatedProducts = updatedMedicaments.map(product =>
      product.id === id ? { ...product, quantity } : product
    );
    setUpdatedMedicaments(updatedProducts);
    console.log('Quantité mise à jour:', id, quantity); // Log de la quantité mise à jour
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.clientName}>Votre Commande</Text>

      {/* Informations client */}
      <TextInput
        style={styles.input}
        placeholder="Nom du client"
        value={clientName}
        onChangeText={setClientName}
      />
      <TextInput
        style={styles.input}
        placeholder="Adresse du client"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Numéro de téléphone"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* Produits sélectionnés */}
      {updatedMedicaments.map((product, index) => (
        <View key={index} style={styles.selectedProductContainer}>
          <Image source={{ uri: product.image }} style={styles.selectedProductImage} />
          <Text style={styles.selectedProductName}>{product.libelle}</Text>
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            value={String(product.quantity)}
            onChangeText={value => handleQuantityChange(product.id, value)}
          />
        </View>
      ))}

      {/* Sélection de la pharmacie */}
      <Text style={styles.pharmacyTitle}>Sélectionner une pharmacie</Text>
      <Picker
        selectedValue={selectedPharmacy}
        onValueChange={handlePharmacySelect}
        style={styles.picker}
      >
        <Picker.Item label="Sélectionner une pharmacie" value="" />
        {pharmacies.map(pharmacy => (
          <Picker.Item key={pharmacy.matricule} label={pharmacy.pharmanom} value={pharmacy.pharmanom} />
        ))}
      </Picker>

      <Button title="Ajouter votre ordonnance (Optionnel)" onPress={handlePrescriptionUpload} />
      {prescriptionImage && <Image source={{ uri: prescriptionImage }} style={styles.prescriptionImage} />}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={confirmOrder}>
          <MaterialCommunityIcons name="cart" size={24} color="white" style={styles.cartIcon} />
          <Text style={styles.buttonText}>Commander</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Style du composant
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  selectedProductContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedProductImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedProductName: {
    flex: 1,
    fontSize: 16,
  },
  quantityInput: {
    width: 60,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    textAlign: 'center',
  },
  pharmacyTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  prescriptionImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  confirmButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  cartIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default OrderScreen;

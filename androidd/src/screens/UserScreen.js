import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const UsersScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [matricule, setMatricule] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [attempts, setAttempts] = useState(3);
  const [loading, setLoading] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(new Animated.Value(0)); // For animation

  useEffect(() => {
    const loadUserData = async () => {
      const storedMatricule = await AsyncStorage.getItem('matricule');
      if (storedMatricule) {
        fetchUserData(storedMatricule);
      } else {
        Alert.alert("Erreur", "Aucun matricule trouvé. Veuillez vous reconnecter.");
        navigation.navigate('Login');
      }
    };

    loadUserData();
  }, [navigation]);

  const fetchUserData = async (matricule) => {
    try {
      const response = await fetch(`http://192.168.209.25:4000/api/utilisateur/matricule/${matricule}`);
      if (response.ok) {
        const data = await response.json();
        setName(data.nom);
        setPrenom(data.prenom);
        setAdresse(data.adresse);
        setTelephone(data.telephone);
        setEmail(data.email);
        setDateNaissance(data.datenaissance);
        setMatricule(data.matricule);
        setProfileImage(data.profileImage || null);
      } else {
        const errorData = await response.json();
        Alert.alert('Erreur', errorData.error || 'Impossible de récupérer les données utilisateur.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la récupération des données.');
    }
  };

  const handleSave = async () => {
    if (attempts <= 0) {
      Alert.alert("Erreur", "Vous ne pouvez plus modifier vos informations.");
      return;
    }

    setLoading(true);
    const updatedUserData = {
      nom: name,
      prenom,
      adresse,
      telephone,
      email,
      datenaissance: dateNaissance,
      matricule,
      profileImage,
    };

    try {
      const response = await fetch(`http://192.168.209.25:4000/api/utilisateur/matricule/${matricule}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      if (response.ok) {
        await AsyncStorage.setItem('profileImage', JSON.stringify(profileImage));
        Alert.alert("Succès", "Vos informations ont été mises à jour avec succès.");
        showSuccessAnimation();
        navigation.navigate('Profil');
      } else {
        const errorData = await response.json();
        Alert.alert("Erreur", errorData.error || "Échec de la mise à jour des informations.");
        setAttempts(prev => prev - 1);
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur s'est produite lors de la mise à jour des données.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccessAnimation = () => {
    setSuccessAnimation(new Animated.Value(1));
    Animated.timing(successAnimation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const handleImageChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier vos informations</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Nom" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Prénom" value={prenom} onChangeText={setPrenom} />
        <TextInput style={styles.input} placeholder="Adresse" value={adresse} onChangeText={setAdresse} />
        <TextInput style={styles.input} placeholder="Téléphone" value={telephone} onChangeText={setTelephone} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Date de Naissance" value={dateNaissance} onChangeText={setDateNaissance} />
        <Text style={styles.text}>Matricule: {matricule}</Text>
        <Text style={styles.text}>Tentatives restantes: {attempts}</Text>
        {profileImage && <Image source={{ uri: profileImage }} style={styles.profileImage} />}
        
        {/* Success Animation */}
        {successAnimation && (
          <Animated.View style={{ opacity: successAnimation }}>
            <Icon name="check-circle" size={30} color="green" />
            <Text style={styles.successText}>Informations mises à jour !</Text>
          </Animated.View>
        )}
      </View>

      <TouchableOpacity style={styles.imageButton} onPress={handleImageChange}>
        <Text style={styles.buttonText}>Changer l'image de profil</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enregistrer</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('Profil')}>
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#51f117',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  imageButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  text: {
    marginVertical: 5,
  },
  successText: {
    color: 'green',
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default UsersScreen;

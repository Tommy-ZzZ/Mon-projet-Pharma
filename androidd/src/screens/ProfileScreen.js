import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';
import translations from '../translations/translations';

const profileImages = [
  require('../../assets/profiles/1.jpg'),
  require('../../assets/profiles/2.jpg'),
  require('../../assets/profiles/3.jpg'),
  require('../../assets/profiles/4.jpg'),
  require('../../assets/profiles/5.jpg'),
  require('../../assets/profiles/6.jpg'),
  require('../../assets/profiles/7.jpg'),
  require('../../assets/profiles/8.jpg'),
];

const ProfileScreen = ({ navigation }) => {
  const { language } = useLanguage();
  const t = translations[language].profile;

  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [phone, setPhone] = useState('');
  const [matricule, setMatricule] = useState('');
  const [profileImage, setProfileImage] = useState('');

  // Utilisation de useFocusEffect pour charger les informations utilisateur à chaque fois que la vue est focus
  useFocusEffect(
    React.useCallback(() => {
      const loadUserInfo = async () => {
        // Vérification de la présence du matricule dans AsyncStorage
        const storedMatricule = await AsyncStorage.getItem('matricule');
        console.log('Stored Matricule:', storedMatricule);  // Log du matricule récupéré

        const storedProfileImage = await AsyncStorage.getItem('profileImage');
        console.log('Stored Profile Image:', storedProfileImage); // Log de l'image de profil stockée

        if (storedMatricule) {
          await fetchUserData(storedMatricule, storedProfileImage);
        } else {
          Alert.alert("Erreur", "Aucun matricule trouvé. Veuillez vous reconnecter.");
        }
      };

      const fetchUserData = async (identifier, storedProfileImage) => {
        try {
          // Requête API pour récupérer les données de l'utilisateur
          const response = await fetch(`http://192.168.209.25:4000/api/utilisateur/matricule/${identifier}`);
          console.log('Réponse du serveur:', response); // Log de la réponse de l'API

          if (response.ok) {
            const userInfo = await response.json();
            console.log('Utilisateur récupéré:', userInfo); // Log des données de l'utilisateur

            const { nom, prenom, telephone } = userInfo;

            setName(nom);
            setPrenom(prenom);
            setPhone(telephone);
            setMatricule(identifier);

            if (storedProfileImage) {
              setProfileImage(JSON.parse(storedProfileImage)); // Charger l'image stockée
            } else {
              // Si aucune image stockée, on en sélectionne une aléatoire
              const randomImageIndex = Math.floor(Math.random() * profileImages.length);
              const selectedImage = profileImages[randomImageIndex];
              setProfileImage(selectedImage);
              await AsyncStorage.setItem('profileImage', JSON.stringify(selectedImage)); // Sauvegarder l'image sélectionnée
            }
          } else {
            // Gérer les erreurs liées à l'API
            if (response.status === 404) {
              Alert.alert("Erreur", "Utilisateur non trouvé avec ce matricule.");
            } else {
              Alert.alert("Erreur", "Impossible de récupérer les données de l'utilisateur.");
            }
          }
        } catch (error) {
          // Gérer les erreurs de connexion ou autres erreurs
          Alert.alert("Erreur", "Une erreur s'est produite lors de la récupération des données.");
          console.error('Erreur lors de la récupération des données:', error);
        }
      };

      loadUserInfo();
    }, [])
  );

  // Fonction de déconnexion
  const handleLogout = async () => {
    await AsyncStorage.removeItem('matricule');
    Alert.alert("Déconnexion", "Vous avez été déconnecté.", [
      { text: "OK", onPress: () => navigation.navigate('Login') },
    ]);
  };

  // Fonction pour naviguer vers l'écran de modification du profil
  const handleEditProfile = () => {
    navigation.navigate('User');
  };

  // Fonction pour mettre à jour les données du profil
  const handleUpdateProfile = async () => {
    const updatedUserData = {
      nom: name,
      prenom,
      telephone: phone,
      matricule,
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
        Alert.alert("Succès", "Profil mis à jour avec succès.");
      } else {
        Alert.alert("Erreur", "Échec de la mise à jour du profil.");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur s'est produite lors de la mise à jour des données.");
      console.error('Erreur lors de la mise à jour des données:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image source={profileImage} style={styles.profileImage} />
            ) : (
              <FontAwesome name="user-circle" size={80} color="#fff" />
            )}
          </View>
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfo}>
              <Text style={styles.userLabel}>Nom:</Text>
              <Text style={styles.userDetails}>{name}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userLabel}>Prénom:</Text>
              <Text style={styles.userDetails}>{prenom}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userLabel}>Téléphone:</Text>
              <Text style={styles.userDetails}>{phone}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userLabel}>Matricule:</Text>
              <Text style={styles.userDetails}>{matricule}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
          <View style={styles.menuIconText}>
            <FontAwesome name="user" size={20} color="black" />
            <Text style={styles.menuText}>Mon Profil</Text>
          </View>
          <FontAwesome name="chevron-right" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('History')}>
          <View style={styles.menuIconText}>
            <FontAwesome name="history" size={20} color="black" />
            <Text style={styles.menuText}>{t.history}</Text>
          </View>
          <FontAwesome name="chevron-right" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Language')}>
          <View style={styles.menuIconText}>
            <FontAwesome name="language" size={20} color="black" />
            <Text style={styles.menuText}>{t.language}</Text>
          </View>
          <FontAwesome name="chevron-right" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ResetPassword')}>
          <View style={styles.menuIconText}>
            <FontAwesome name="lock" size={20} color="black" />
            <Text style={styles.menuText}>{t.changePassword}</Text>
          </View>
          <FontAwesome name="chevron-right" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AboutUs')}>
          <View style={styles.menuIconText}>
            <FontAwesome name="info-circle" size={20} color="black" />
            <Text style={styles.menuText}>{t.aboutUs}</Text>
          </View>
          <FontAwesome name="chevron-right" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t.logout}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    height: 180,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
    width: '70%',
  },
  userInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  userLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    width: 90,
  },
  userDetails: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    padding: 15,
    backgroundColor: '#ff4d4d',
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;

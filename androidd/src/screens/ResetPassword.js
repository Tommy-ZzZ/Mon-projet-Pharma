import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'bcryptjs'; // Assurez-vous que bcryptjs est installé

const ResetPassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOldPasswordValid, setIsOldPasswordValid] = useState(false); // État pour gérer la validation de l'ancien mot de passe
  const [matricule, setMatricule] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Récupère le matricule de l'utilisateur dans AsyncStorage
    const getMatricule = async () => {
      try {
        const storedMatricule = await AsyncStorage.getItem('matricule');
        if (storedMatricule) {
          setMatricule(storedMatricule);
          console.log('Matricule récupéré:', storedMatricule); // Log du matricule récupéré
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du matricule:', error);
      }
    };

    getMatricule();
  }, []);

  const handleOldPasswordValidation = async () => {
    console.log("Vérification de l'ancien mot de passe...");
    
    if (!oldPassword) {
      console.log("Aucun ancien mot de passe fourni.");
      Alert.alert('Erreur', 'Veuillez entrer votre ancien mot de passe');
      return;
    }

    try {
      console.log(`Vérification de l'ancien mot de passe pour le matricule: ${matricule}`);

      // Requête pour récupérer l'utilisateur par matricule
      const response = await fetch(`http://192.168.67.25:4000/api/utilisateur/matricule/${matricule}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log("Réponse de l'API pour la validation de l'ancien mot de passe:", data);

      if (data.success) {
        console.log("Utilisateur trouvé dans la base de données.");
        
        // Comparaison avec bcrypt pour vérifier l'ancien mot de passe
        const isPasswordValid = await bcrypt.compare(oldPassword, data.password); // Comparaison avec le mot de passe haché

        if (isPasswordValid) {
          console.log("Ancien mot de passe valide.");
          setIsOldPasswordValid(true); // Permet d'afficher les champs pour le nouveau mot de passe
        } else {
          console.log("Ancien mot de passe incorrect.");
          Alert.alert('Erreur', 'L\'ancien mot de passe est incorrect');
        }
      } else {
        console.log("Utilisateur non trouvé pour ce matricule.");
        Alert.alert('Erreur', 'Utilisateur non trouvé');
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'ancien mot de passe:", error);
      Alert.alert('Erreur', 'Erreur lors de la vérification de l\'ancien mot de passe');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      console.log('Les mots de passe ne correspondent pas.');
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      console.log(`Envoi de la requête pour la réinitialisation du mot de passe pour le matricule: ${matricule}`);
      const response = await fetch(`http://192.168.67.25:4000/api/utilisateur/matricule/${matricule}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      console.log("Réponse de l'API pour la réinitialisation du mot de passe:", data);

      if (data.success) {
        console.log("Réinitialisation du mot de passe réussie !");
        Alert.alert('Succès', 'Mot de passe réinitialisé avec succès.');
      } else {
        console.log("Échec de la réinitialisation du mot de passe:", data.message);
        Alert.alert('Erreur', 'Échec de la réinitialisation du mot de passe.');
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      Alert.alert('Erreur', 'Erreur lors de la réinitialisation du mot de passe');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réinitialiser le mot de passe</Text>

      {/* Champ pour l'ancien mot de passe */}
      {!isOldPasswordValid ? (
        <View>
          <TextInput
            placeholder="Ancien mot de passe"
            secureTextEntry
            onChangeText={setOldPassword}
            value={oldPassword}
            style={styles.input}
          />
          {/* Affichage dynamique de l'ancien mot de passe tapé */}
          <Text style={styles.preview}>Ancien mot de passe tapé: {oldPassword}</Text>

          <TouchableOpacity onPress={handleOldPasswordValidation} style={styles.button}>
            <Text style={styles.buttonText}>Vérifier l'ancien mot de passe</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {/* Champs pour le nouveau mot de passe et la confirmation */}
          <TextInput
            placeholder="Nouveau mot de passe"
            secureTextEntry
            onChangeText={setNewPassword}
            value={newPassword}
            style={styles.input}
          />
          {/* Affichage dynamique du nouveau mot de passe tapé */}
          <Text style={styles.preview}>Nouveau mot de passe tapé: {newPassword}</Text>

          <TextInput
            placeholder="Confirmer le mot de passe"
            secureTextEntry
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            style={styles.input}
          />
          {/* Affichage dynamique de la confirmation du mot de passe */}
          <Text style={styles.preview}>Confirmation mot de passe: {confirmPassword}</Text>

          <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
            <Text style={styles.buttonText}>Réinitialiser le mot de passe</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Affichage des erreurs */}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  preview: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
});

export default ResetPassword;

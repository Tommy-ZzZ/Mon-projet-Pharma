import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/globalStyles';

const LoginScreen = ({ navigation }) => {
    const [identifier, setIdentifier] = useState('');
    const [motdepasse, setMotdepasse] = useState('');

    // Vérifie si un matricule est déjà stocké et effectue un fetch automatique
    useEffect(() => {
        const fetchUserData = async () => {
            const matricule = await AsyncStorage.getItem('matricule');
            if (matricule) {
                console.log('Matricule trouvé dans AsyncStorage:', matricule);
                try {
                    const response = await fetch(`http://192.168.209.25:4000/api/compteclient/${matricule}`);
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Données récupérées automatiquement:', data);
                        // Naviguez directement vers l'écran principal si nécessaire
                        navigation.navigate('Main', { userData: data });
                    } else {
                        console.error('Erreur lors de la récupération automatique:', response.status);
                    }
                } catch (error) {
                    console.error('Erreur de récupération automatique:', error);
                }
            }
        };
        fetchUserData();
    }, []);

    const handleLogin = async () => {
        console.log("Tentative de connexion...");
        if (!identifier || !motdepasse) {
            Alert.alert("Erreur", "Tous les champs doivent être remplis.");
            console.log("Erreur: Tous les champs doivent être remplis.");
            return;
        }

        try {
            console.log("Envoi de la requête de connexion...");
            const response = await fetch('http://192.168.209.25:4000/api/compteclient/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, motdepasse }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Données reçues après connexion:", data);

                if (data.success && data.matricule) {
                    Alert.alert("Succès", "Connexion réussie !");
                    // Stocker le matricule dans AsyncStorage
                    await AsyncStorage.setItem('matricule', data.matricule);
                    console.log('Matricule stocké dans AsyncStorage:', data.matricule);
                    
                    // Navigation vers l'écran principal
                    navigation.navigate('Main', { userData: data });
                } else {
                    Alert.alert("Erreur", data.error || "Erreur lors de la connexion.");
                }
            } else {
                const data = await response.json();
                console.log("Erreur dans la réponse:", data);
                Alert.alert("Erreur", data.error || "Erreur lors de la connexion.");
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            Alert.alert("Erreur", "Une erreur s'est produite lors de la connexion.");
        }
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Connectez-vous !</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="Email ou Numéro de Téléphone"
                value={identifier}
                onChangeText={setIdentifier}
            />
            <TextInput
                style={globalStyles.input}
                placeholder="Mot de passe"
                secureTextEntry
                value={motdepasse}
                onChangeText={setMotdepasse}
            />
            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
                <Text style={globalStyles.linkText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
                <Text style={globalStyles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={globalStyles.linkText}>Pas encore de compte ? S'inscrire</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;

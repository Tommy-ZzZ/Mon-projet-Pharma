import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { globalStyles } from '../styles/globalStyles'; 

const LoginForm = ({ navigation }) => {
    const [form, setForm] = useState({
        phoneNumber: '',
        motdepasse: '', // Change le nom en motdepasse
    });

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleForgotPassword = () => {
        navigation.navigate('ResetPassword');
    };

    const handleLogin = async () => {
        if (!form.phoneNumber || !form.motdepasse) { // Vérifie les champs
            Alert.alert("Erreur", "Tous les champs doivent être remplis.");
            return;
        }

        try {
            const response = await fetch('http://192.168.136.1:4000/api/compteclient/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier: form.phoneNumber, motdepasse: form.motdepasse }), // Utiliser les valeurs du formulaire
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert("Succès", "Connexion réussie !");
                await AsyncStorage.setItem('userToken', data.token);
                navigation.navigate('Main');
            } else {
                const data = await response.json();
                Alert.alert("Erreur", data.error || "Erreur lors de la connexion.");
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            Alert.alert("Erreur", "Une erreur s'est produite lors de la connexion.");
        }
    };

    return (
        <View style={globalStyles.formContainer}>
            <Image source={require('../../assets/images/pharma.png')} style={globalStyles.logo} />
            <Text style={globalStyles.formTitle}>Connectez-vous !</Text>

            <TextInput
                placeholder="Numéro de téléphone"
                style={globalStyles.input}
                onChangeText={(value) => handleChange('phoneNumber', value)}
                value={form.phoneNumber}
                keyboardType="phone-pad"
            />
            <TextInput
                placeholder="Mot de passe"
                style={globalStyles.input}
                secureTextEntry
                onChangeText={(value) => handleChange('motdepasse', value)} // Change le nom en motdepasse
                value={form.motdepasse} // Utiliser le nom mis à jour
            />
            <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={globalStyles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={globalStyles.loginButton} onPress={handleLogin}>
                <Text style={globalStyles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.loginButton}>
                <Text style={globalStyles.buttonText}>Pas encore de compte ? S'inscrire</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginForm;

import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import globalStyles from '../styles/globalStyles';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [prenom, setPrenom] = useState('');
    const [dateNaissance, setDateNaissance] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [adresse, setAdresse] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateNaissance;
        setShowPicker(false);
        setDateNaissance(currentDate);
    };

    const showDatePicker = () => {
        setShowPicker(true);
    };

    const validateEmail = (email) => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    };

    const handleRegister = async () => {
        if (!name || !prenom || !telephone || !email || !adresse || !password) {
            Alert.alert("Erreur", "Tous les champs sont obligatoires.");
            return;
        }

        if (telephone.length !== 10 || isNaN(telephone)) {
            Alert.alert("Erreur", "Le numéro de téléphone doit comporter 10 chiffres.");
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert("Erreur", "L'adresse e-mail n'est pas valide.");
            return;
        }

        setLoading(true);

        const userData = {
            nom: name,
            prenom,
            adresse,
            telephone,
            email,
            motdepasse: password,
            datenaissance: dateNaissance.toISOString().split('T')[0],
        };

        try {
            const response = await fetch('http://192.168.88.14:4000/api/utilisateur', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Succès", "Inscription réussie, redirection vers la page de connexion.");
                navigation.navigate('LoginScreen');
                setName('');
                setPrenom('');
                setTelephone('');
                setEmail('');
                setAdresse('');
                setPassword('');
                setDateNaissance(new Date());
            } else {
                Alert.alert("Erreur", data.error || "Une erreur s'est produite lors de l'inscription.");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi des données:", error);
            Alert.alert("Erreur", "Une erreur s'est produite lors de l'envoi des données.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Veuillez remplir les champs</Text>
            <TextInput style={globalStyles.input} placeholder="Nom" value={name} onChangeText={setName} />
            <TextInput style={globalStyles.input} placeholder="Prénom" value={prenom} onChangeText={setPrenom} />
            <TouchableOpacity style={globalStyles.input} onPress={showDatePicker}>
                <Text style={globalStyles.inputText}>
                    {dateNaissance ? dateNaissance.toLocaleDateString() : 'Date de naissance'}
                </Text>
            </TouchableOpacity>
            {showPicker && (
                <DateTimePicker
                    value={dateNaissance}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            <TextInput
                style={globalStyles.input}
                placeholder="Téléphone"
                value={telephone}
                onChangeText={setTelephone}
                keyboardType="numeric"
                maxLength={10}
            />
            <TextInput style={globalStyles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput
                style={globalStyles.input}
                placeholder="Adresse"
                value={adresse}
                onChangeText={setAdresse}
            />
            <TextInput
                style={globalStyles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
                    <Text style={globalStyles.buttonText}>S'inscrire</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={globalStyles.linkText}>Annuler</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RegisterScreen;

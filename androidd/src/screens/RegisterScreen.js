import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import globalStyles from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

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
  const [matricule, setMatricule] = useState('');

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

  const generateMatricule = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
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
    const generatedMatricule = generateMatricule();
    setMatricule(generatedMatricule);
    console.log("Matricule généré:", generatedMatricule); 

    const userData = {
      nom: name,
      prenom,
      adresse,
      telephone,
      email,
      motdepasse: password,
      datenaissance: dateNaissance.toISOString().split('T')[0],
      matricule: generatedMatricule,
    };

    try {
      const response = await fetch('http://192.168.209.25:4000/api/utilisateur', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        await AsyncStorage.setItem('matricule', generatedMatricule);  // Stockage du matricule

        Alert.alert("Succès", "Inscription réussie !");
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      } else {
        const errorData = await response.json();
        Alert.alert("Erreur", errorData.error || "Une erreur s'est produite lors de l'inscription.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de l'envoi des données. Veuillez vérifier votre connexion et réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
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
        <TextInput
          style={globalStyles.input}
          placeholder="Matricule"
          value={matricule}
          editable={false}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Animatable.View animation="fadeIn" duration={500}>
            <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
              <Text style={globalStyles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={globalStyles.linkText}>Annuler</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

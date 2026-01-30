import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const AlarmChoiceScreen = ({ navigation }) => {
  useFocusEffect(
     React.useCallback(() => {
       console.log("vous êtes dans l'interface Alarme");
     }, [])
   );
  return (
    <ImageBackground
      source={require('../../assets/images/3doc.png')} // Utilise l'image du docteur en arrière-plan
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Où préfériez-vous diriger ?</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
            <Image source={require('../../assets/images/3cala.png')} style={styles.imageButton} />
            <Text style={styles.buttonText}>Agenda</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Reminders')}>
            <Image source={require('../../assets/images/3ala.png')} style={styles.imageButton} />
            <Text style={styles.buttonText}>Rappel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
 background: {
    flex: 1,
    position: 'absolute', // Pour s'assurer que l'image est derrière le conteneur
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Pour s'assurer que l'image couvre tout l'écran
  },
  container: {
    flex: 1,
    margin: 0, 
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  imageButton: {
    width: 100, // Taille de l'image bouton
    height: 100,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AlarmChoiceScreen;

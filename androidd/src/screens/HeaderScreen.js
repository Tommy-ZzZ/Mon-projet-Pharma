import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Header from '../components/Header'; 
import { useFocusEffect } from '@react-navigation/native';

const HeaderScreen = ({ navigation }) => {
    useFocusEffect(
     React.useCallback(() => {
       console.log("vous êtes dans l'interface HeaderScreen");
     }, [])
   );
    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <Text style={styles.welcomeText}>Bienvenue</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // Couleur de fond
    },
    welcomeText: {
        textAlign: 'center',
        marginTop: 20, // Espace au-dessus du texte de bienvenue
    },
});

export default HeaderScreen;


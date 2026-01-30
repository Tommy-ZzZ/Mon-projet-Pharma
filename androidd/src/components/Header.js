import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import HeaderStyles from '../styles/HeaderStyles';

const Header = ({ navigation }) => {
    if (!navigation) {
        console.error("La navigation n'est pas définie");
        return null;
    }

    const handleProvisionalLogin = () => {
        navigation.navigate('Main'); // Rediriger vers l'écran principal
    };

    // Redirige vers le tableau de bord admin ou un écran approprié
    const handleAdminProvisionalLogin = () => {
        navigation.navigate('AdminDashboard'); // Ou un écran existant pour tester
    };

    return (
        <View style={HeaderStyles.headerContainer}>
            <Image
                source={require('../../assets/images/pharma.png')}
                style={HeaderStyles.logo}
                resizeMode="contain"
            />

            <View style={HeaderStyles.buttonsContainer}>
                <TouchableOpacity
                    style={HeaderStyles.patientButton}  
                    onPress={() => navigation.navigate('Login')} // Redirige vers la page de connexion client
                >
                    <Text style={HeaderStyles.buttonText}>Commencer </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Header;

import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LanguageProvider } from './src/context/LanguageContext'; 
import HeaderScreen from './src/screens/HeaderScreen'; 
import RegisterScreen from './src/screens/RegisterScreen'; 
import LoginScreen from './src/screens/LoginScreen';   
import HomeScreen from './src/screens/HomeScreen'; 
import MapsScreen from './src/screens/MapsScreen'; 
import ProductListScreen from './src/screens/ProductListScreen'; 
import OrderScreen from './src/screens/OrderScreen'; 
import ProfileScreen from './src/screens/ProfileScreen'; 
import RemindersScreen from './src/screens/RemindersScreen'; 
import CalendarScreen from './src/screens/CalendarScreen'; 
import AlarmChoiceScreen from './src/screens/AlarmChoiceScreen'; 
import LanguageScreen from './src/screens/LanguageScreen'; 
import ResetPassword from './src/screens/ResetPassword'; 
import HistoryScreen from './src/screens/HistoryScreen';
import UserScreen from './src/screens/UserScreen'; 
import AboutUsScreen from './src/screens/AboutUsScreen';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { navigationStyles } from './src/styles/navigationStyles';

// Stack and Tab Navigator setup (as is in your code)

// ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to display fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an external service
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Text>Oops, something went wrong.</Text>;
    }

    return this.props.children; 
  }
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator for ProductList and Order screens
const ProductStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProductList"
      component={ProductListScreen}
      options={{ title: 'Produits' }} 
    />
    <Stack.Screen
      name="OrderScreen"
      component={OrderScreen}
      options={{ title: 'Commander' }}
    />
  </Stack.Navigator>
);

// Stack Navigator for Alarm-related screens
const AlarmStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="AlarmChoice" 
      component={AlarmChoiceScreen} 
      options={{ title: 'Choix Alarme', headerShown: false }} 
    />
    <Stack.Screen 
      name="Reminders" 
      component={RemindersScreen} 
      options={{ title: 'Rappels' }} 
    />
    <Stack.Screen 
      name="Calendar" 
      component={CalendarScreen} 
      options={{ title: 'Calendrier' }} 
    />
  </Stack.Navigator>
);

// Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Accueil':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Pharmacie Proche':
            iconName = focused ? 'map' : 'map-outline';
            break;
          case 'Produits':
            iconName = focused ? 'list' : 'list-outline';
            break;
          case 'Réservation':
            iconName = focused ? 'cart' : 'cart-outline';
            break;
          case 'Alarme':
            iconName = focused ? 'alarm' : 'alarm-outline';
            break;
          case 'Profil':
            iconName = focused ? 'person' : 'person-outline';
            break;         
          default:
            iconName = 'help-circle'; 
            break;
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: navigationStyles.tabLabelActive.color,
      tabBarInactiveTintColor: navigationStyles.tabLabel.color,
      tabBarStyle: navigationStyles.tabBar,
    })}
  >
    <Tab.Screen 
      name="Accueil" 
      component={HomeScreen} 
      options={{ tabBarLabel: 'Accueil' }} 
    />
    <Tab.Screen 
      name="Pharmacie Proche" 
      component={MapsScreen}
      options={{ tabBarLabel: 'Cartes' }} 
    />
    <Tab.Screen 
      name="Produits" 
      component={ProductStack}  
      options={{ tabBarLabel: 'Produits' }} 
    />
    <Tab.Screen 
      name="Réservation" 
      component={OrderScreen}
      options={{ tabBarLabel: 'Réservation' }} 
    />
    <Tab.Screen 
      name="Alarme" 
      component={AlarmStack} 
      options={{ tabBarLabel: 'Alarme' }} 
    />
    <Tab.Screen 
      name="Profil" 
      component={ProfileScreen}
      options={{ tabBarLabel: 'Profil' }} 
    />
  </Tab.Navigator>
);

const App = () => {
  console.log('App.js Loaded'); // Log pour vérifier que l'app se charge correctement

  return (
    <ErrorBoundary>
      <LanguageProvider> 
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Header">
            <Stack.Screen
              name="Header"
              component={HeaderScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen} 
              options={{ title: 'Connexion', headerShown: false }} 
            />
            <Stack.Screen
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Inscription', headerShown: false }} 
            />
            <Stack.Screen
              name="ResetPassword" 
              component={ResetPassword} 
              options={{ title: 'Réinitialiser le mot de passe', headerShown: true }} 
            />
            <Stack.Screen
              name="Main" 
              component={TabNavigator} 
              options={{ title: 'Accueil', headerShown: false }} 
            />
            <Stack.Screen
              name="Language"
              component={LanguageScreen}
              options={{ title: 'Langue', headerShown: true }} 
            />
            <Stack.Screen
              name="User"
              component={UserScreen}
              options={{ title: 'Utilisateur' }} 
            />
            <Stack.Screen
              name="History"
              component={HistoryScreen}
              options={{ title: 'Historique' }} 
            />
            <Stack.Screen
              name="AboutUs"
              component={AboutUsScreen}
              options={{ title: 'À Propos de Nous' }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;

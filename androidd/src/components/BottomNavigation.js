import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MapsScreen from '../screens/MapsScreen';
import ProductListScreen from '../screens/ProductListScreen';
import OrderScreen from '../screens/OrderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color = 'black', size = 24 }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
          tabBarLabel: 'Accueil',
        }}
      />
      <Tab.Screen
        name="MapsTab"
        component={MapsScreen}
        options={{
          tabBarIcon: ({ color = 'black', size = 24 }) => (
            <FontAwesome name="map" color={color} size={size} />
          ),
          tabBarLabel: 'Cartes',
        }}
      />
      <Tab.Screen
        name="ProductListTab"
        component={ProductListScreen}
        options={{
          tabBarIcon: ({ color = 'black', size = 24 }) => (
            <FontAwesome name="list" color={color} size={size} />
          ),
          tabBarLabel: 'Produits',
        }}
      />
      <Tab.Screen
        name="OrderTab"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ color = 'black', size = 24 }) => (
            <FontAwesome name="shopping-cart" color={color} size={size} />
          ),
          tabBarLabel: 'Commander',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color = 'black', size = 24 }) => (
            <FontAwesome name="user" color={color} size={size} />
          ),
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

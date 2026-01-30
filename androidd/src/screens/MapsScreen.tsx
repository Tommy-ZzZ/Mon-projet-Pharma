import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { format, toZonedTime } from 'date-fns-tz';

const MapsScreen = () => {
  const [userLocation, setUserLocation] = useState(null);

  const initialRegion = {
    latitude: -18.777192499999998,
    longitude: 46.85432800000001,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("Vous êtes dans l'interface MapsScreen");
    }, [])
  );

  useEffect(() => {
    const getUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Permission de localisation non accordée");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };

    getUserLocation();
  }, []);

  const getPharmacyHours = () => {
    return {
      monday: [['07:30', '12:30'], ['13:30', '18:00']],
      tuesday: [['07:30', '12:30'], ['13:30', '18:00']],
      wednesday: [['07:30', '12:30'], ['13:30', '18:00']],
      thursday: [['07:30', '12:30'], ['13:30', '18:00']],
      friday: [['07:30', '12:30'], ['13:30', '18:00']],
      saturday: [['07:30', '12:30']],
      sunday: [],
    };
  };

  const markers = [
    {
      coordinate: { latitude: -18.9107553, longitude: 47.5259551 },
      title: "Pharmacie Métropole",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.9799726, longitude: 47.5330307 },
      title: "Arrêt de bus Pharmacie",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.8456516, longitude: 47.4739485 },
      title: "Pharmacie d'Ambohibao",
      hours: {
        monday: [['00:00', '24:00']],
        tuesday: [['00:00', '24:00']],
        wednesday: [['00:00', '24:00']],
        thursday: [['00:00', '24:00']],
        friday: [['00:00', '24:00']],
        saturday: [['00:00', '24:00']],
        sunday: [['00:00', '24:00']],
      },
    },
    {
      coordinate: { latitude: -18.8412090, longitude: 47.4641345 },
      title: "Pharmacie Tiana",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.8394105, longitude: 47.4619431 },
      title: "Pharmacie Nasolo Talatamaty",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.8212727, longitude: 47.4655004 },
      title: "Pharmacie Mandrosoa",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.9075670, longitude: 47.5078813 },
      title: "Pharmacie 67ha",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.9296869, longitude: 47.5087265 },
      title: "Pharmacie Volahanta",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.9114617, longitude: 47.5184548 },
      title: "Pharmacie Miaro",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.9044289, longitude: 47.5072834 },
      title: "Pharmacie Havana",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.9099099, longitude: 47.5038502 },
      title: "Pharmacie Andohatapenaka",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.9021959, longitude: 47.5114462 },
      title: "Pharmacie Mamy",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.9078433, longitude: 47.5211040 },
      title: "Pharmacie de Tana",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.8993578, longitude: 47.5207607 },
      title: "Pharmacie Croix du Sud Antanimena",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.9011036, longitude: 47.5253955 },
      title: "Pharmacie Santé",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.8911823, longitude: 47.5258982 },
      title: "Pharmacie du RoiTana WaterFront",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.8912992, longitude: 47.4924105 },
      title: "Pharmacie de la Digue",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.9125638, longitude: 47.4916418 },
      title: "Pharmacie Grazia",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.8311979, longitude: 47.4921393 },
      title: "Pharmacie Mihaja",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.811974769897184, longitude: 47.4855022857763 },
      title: "Pharmacie Jade",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.8040124956637, longitude: 47.481039089944633 },
      title: "Pharmacie d'Ivato",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -18.845932072962302, longitude: 47.4846439790436 },
      title: "Pharmacie Finoana",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -21.444261078468323, longitude:47.08884459219909 },
      title: "Pharmacie Plateau",
      hours: getPharmacyHours(),
    },
    {
      coordinate: { latitude: -21.449893140236963, longitude:47.085583026014405 },
      title: "Pharmacie Centrale du Sud",
      hours: getPharmacyHours(),
    },    
  ];

  const isOpen = (hours) => {
    const now = new Date();
    const timeZone = 'Indian/Antananarivo';
    const zonedDate = toZonedTime(now, timeZone);
    const day = format(zonedDate, 'EEEE', { timeZone }).toLowerCase();
    const currentTime = format(zonedDate, 'HH:mm', { timeZone });

    if (!hours[day] || hours[day].length === 0) {
      return false;
    }

    return hours[day].some(([open, close]) => {
      return currentTime >= open && currentTime < close;
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={userLocation || initialRegion}
        showsUserLocation={true}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={isOpen(marker.hours) ? "Ouvert" : "Fermé"}
            pinColor={isOpen(marker.hours) ? "green" : "red"}
          />
        ))}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Votre position"
            description="Vous êtes ici"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapsScreen;

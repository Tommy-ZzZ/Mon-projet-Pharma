import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Importation de l'icône

const CalendarScreen = ({ navigation }) => {
  const [medicationData, setMedicationData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [newMedication, setNewMedication] = useState('');
  const [calendarExpanded, setCalendarExpanded] = useState(true);

  useEffect(() => {
    const fetchedData = {
      '2024-09-26': [{ name: 'Médicament A', time: '08:00' }, { name: 'Médicament B', time: '20:00' }],
      '2024-09-27': [{ name: 'Médicament C', time: '09:00' }],
    };
    setMedicationData(fetchedData);
  }, []);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const addMedication = () => {
    if (!newMedication.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom de médicament.');
      return;
    }

    setMedicationData((prev) => {
      const updatedData = { ...prev };
      if (!updatedData[selectedDate]) {
        updatedData[selectedDate] = [];
      }
      updatedData[selectedDate].push({ name: newMedication, time: new Date().toLocaleTimeString() });
      return updatedData;
    });

    setNewMedication('');
    Alert.alert('Succès', `Le médicament a été ajouté pour la date ${selectedDate}.`);
  };

  const deleteMedication = (date, index) => {
    setMedicationData((prev) => {
      const updatedData = { ...prev };
      updatedData[date].splice(index, 1);
      if (updatedData[date].length === 0) {
        delete updatedData[date];
      }
      return updatedData;
    });
  };

  const toggleCalendar = () => {
    setCalendarExpanded(!calendarExpanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Calendrier des Médicaments</Text>
      
      {/* Calendar with toggle icon */}
      {calendarExpanded && (
        <View>
          <Calendar
            onDayPress={onDayPress}
            markedDates={Object.keys(medicationData).reduce((acc, date) => {
              acc[date] = { marked: true };
              return acc;
            }, {})}
            theme={{
              todayTextColor: 'red',
              arrowColor: 'blue',
              monthTextColor: 'blue',
            }}
          />
        </View>
      )}

      {/* Icon to toggle calendar */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleCalendar}>
        <Icon name={calendarExpanded ? 'expand-less' : 'expand-more'} size={24} color="blue" />
      </TouchableOpacity>

      {selectedDate && (
        <View style={styles.addSection}>
          <Text style={styles.selectedDate}>Date sélectionnée : {selectedDate}</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le nom du médicament"
            value={newMedication}
            onChangeText={setNewMedication}
          />
          <TouchableOpacity style={styles.addButton} onPress={addMedication}>
            <Text style={styles.addButtonText}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.allMedicationsSection}>
        <Text style={styles.subtitle}>Prises de médicaments pour {selectedDate || 'toutes les dates'} :</Text>
        {selectedDate && medicationData[selectedDate] ? (
          <FlatList
            data={medicationData[selectedDate]}
            keyExtractor={(item, index) => `${selectedDate}-${index}`}
            renderItem={({ item, index }) => (
              <View style={styles.medicationItem}>
                <Text>{`${item.name} à ${item.time}`}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteMedication(selectedDate, index)}
                >
                  <Text style={styles.deleteButtonText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noMedicationsText}>Aucune prise de médicament pour cette date.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  addSection: {
    marginTop: 20,
  },
  selectedDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    borderWidth: 1,
    borderColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  addButtonText: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
  allMedicationsSection: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#e8e8e8',
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
  },
  noMedicationsText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  toggleButton: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default CalendarScreen;

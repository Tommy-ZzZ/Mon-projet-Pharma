import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Alert, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

const RemindersScreen = ({ addNotification }) => {
  const [reminders, setReminders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReminder, setNewReminder] = useState({ time: new Date(), medication: '' });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState(null);

  // Configuration des notifications
  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        Alert.alert('Permission refusée', "L'application nécessite l'autorisation pour envoyer des notifications.");
      }
    })();
  }, []);

  // Planification des notifications
  const scheduleNotification = async (reminder) => {
    const trigger = new Date(reminder.time);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Rappel de Médicament',
        body: `Il est temps de prendre votre médicament : ${reminder.medication}`,
      },
      trigger,
    });
  };

  // Ajout ou modification de rappel
  const addReminder = () => {
    if (!newReminder.medication) {
      Alert.alert('Erreur', 'Veuillez entrer un nom de médicament.');
      return;
    }

    const reminderWithId = {
      id: editingReminderId || Date.now().toString(),
      ...newReminder,
      time: new Date(newReminder.time),
      isExpired: false,
    };

    // Modification
    if (editingReminderId) {
      setReminders(reminders.map((reminder) => (reminder.id === editingReminderId ? reminderWithId : reminder)));
    } else {
      setReminders([reminderWithId, ...reminders]);
      scheduleNotification(reminderWithId); // Planifier la notification pour le nouveau rappel
    }

    resetForm();
  };

  // Réinitialisation du formulaire
  const resetForm = () => {
    setModalVisible(false);
    setNewReminder({ time: new Date(), medication: '' });
    setEditingReminderId(null);
  };

  // Supprimer un rappel
  const deleteReminder = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rappels de Médicaments</Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reminderItem}>
            <View style={styles.reminderContent}>
              <Text style={styles.reminderTime}>{new Date(item.time).toLocaleTimeString()}</Text>
              <Text style={styles.reminderMedication}>{item.medication}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setEditingReminderId(item.id)}>
                <Text style={styles.editButton}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteReminder(item.id)}>
                <Text style={styles.deleteButton}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Ajouter un Rappel</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editingReminderId ? 'Modifier le Rappel' : 'Ajouter un Nouveau Rappel'}</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeButtonText}>Choisir Heure</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={newReminder.time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || newReminder.time;
                  setShowTimePicker(false);
                  const updatedTime = new Date(newReminder.time);
                  updatedTime.setHours(currentDate.getHours());
                  updatedTime.setMinutes(currentDate.getMinutes());
                  setNewReminder({ ...newReminder, time: updatedTime });
                }}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Médicament"
              value={newReminder.medication}
              onChangeText={(text) => setNewReminder({ ...newReminder, medication: text })}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={addReminder}
            >
              <Text style={styles.saveButtonText}>{editingReminderId ? 'Mettre à jour' : 'Enregistrer'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={resetForm}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  reminderItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  reminderContent: {
    flexDirection: 'column',
  },
  reminderTime: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reminderMedication: {
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    color: 'blue',
    marginRight: 10,
  },
  deleteButton: {
    color: 'red',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  timeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    width: '100%',
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16,
  },
});

export default RemindersScreen;

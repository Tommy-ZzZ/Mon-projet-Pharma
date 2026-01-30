import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage(); // Récupérer la langue actuelle
  const languages = [
    { title: 'Français', code: 'fr' },
    { title: 'English', code: 'en' },
    { title: 'Malagasy', code: 'mg' },
    { title: '中文', code: 'zh' },
  ];

  return (
    <View style={styles.selectorContainer}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => setLanguage(lang.code)}
          style={[
            styles.button,
            language === lang.code && styles.selectedButton, // Appliquer le style sélectionné
          ]}
        >
          <Text style={styles.buttonText}>{lang.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  selectorContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: '#6200EE',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#D1E0FF', 
  },
  buttonText: {
    color: '#6200EE',
    fontSize: 16,
  },
});

export default LanguageSelector;

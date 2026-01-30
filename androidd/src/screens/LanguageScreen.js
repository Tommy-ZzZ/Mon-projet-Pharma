import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import translations from '../translations/translations';

const LanguageScreen = () => {
  const { language, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = React.useState(language);
  const t = translations[selectedLanguage].profile;

  useEffect(() => {
    setSelectedLanguage(language); // Update selected language if it changes
  }, [language]);

  const handleLanguageChange = () => {
    setLanguage(selectedLanguage); // Update the language in the context
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t.languageTitle || 'Language'}</Text>
      <View style={styles.languageOptions}>
        {/* Custom LanguageSelector for radio button style */}
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',  // White background to match the image
  },
  title: {
    fontSize: 22,  // Text size similar to the image
    fontWeight: 'bold',
    color: '#4D4D4D', // Gray text color
    textAlign: 'left',  // Align title to the left
    marginBottom: 10,
  },
  languageOptions: {
    backgroundColor: '#F8F8F8', // Light gray background
    borderRadius: 10,
    paddingVertical: 10,
  },
  updateButton: {
    backgroundColor: '#A57C58',  // Brown button to match the image
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF', // White text for the button
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LanguageScreen;

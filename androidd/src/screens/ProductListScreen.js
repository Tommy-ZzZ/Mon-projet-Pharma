import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, Dimensions, ActivityIndicator, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importer les icônes

const { width } = Dimensions.get('window');

const ProductListScreen = () => {
  const navigation = useNavigation();
  const [medicaments, setMedicaments] = useState([]); // Liste des médicaments affichée
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [pageLoading, setPageLoading] = useState(false); // Indicateur de changement de page
  const [error, setError] = useState(null); // Message d'erreur
  const [searchQuery, setSearchQuery] = useState(''); // Requête de recherche
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle pour la pagination
  const [limit] = useState(15); // Limite des médicaments par page
  const [selectedMedicaments, setSelectedMedicaments] = useState([]); // Médicaments sélectionnés

  // Fonction pour récupérer les médicaments avec recherche
  const fetchMedicaments = async (page = currentPage, query = searchQuery) => {
    try {
      console.log(`Fetching medicines for page ${page} with query: ${query}`);
      setLoading(page === currentPage); // Si c'est la page initiale, affichage du loader
      setError(null);

      // Requête d'authentification
      const authResponse = await fetch('https://produits.datapharm.space/api/Auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: 'datapharm-2897',
          password: 'b3IhFlA',
        }),
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        throw new Error(`Authentication failed: ${authResponse.status}, Details: ${JSON.stringify(errorData)}`);
      }

      const authData = await authResponse.json();
      const token = authData.token;

      // Récupérer les médicaments avec la pagination et la recherche
      const medResponse = await fetch('https://produits.datapharm.space/api/article/labo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search: query, // Utiliser la recherche côté serveur
          page: page,
          limit: limit,
        }),
      });

      if (!medResponse.ok) {
        throw new Error('Failed to fetch medicines');
      }

      const medData = await medResponse.json();
      if (!Array.isArray(medData.articles)) {
        throw new Error('Medicines response is not an array');
      }

      // Mettre à jour la liste des médicaments avec les résultats de la recherche et de la pagination
      if (page === 1) {
        setMedicaments(medData.articles); // Réinitialiser les médicaments pour la première page
      } else {
        setMedicaments(prev => [...prev, ...medData.articles]); // Ajouter les résultats suivants
      }

      console.log(`Page ${page} chargée: ${medData.articles.length} éléments reçus`);
    } catch (err) {
      console.error('Erreur attrapée:', err);
      setError(err);
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  // Lancer la requête à chaque changement de page ou recherche
  useEffect(() => {
    fetchMedicaments(currentPage, searchQuery);
  }, [currentPage, searchQuery]); // Rafraîchir chaque fois que `currentPage` ou `searchQuery` change

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
    setPageLoading(true);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setPageLoading(true);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Recharger à partir de la première page lors de la recherche
  };

  const toggleSelection = (medicament) => {
    setSelectedMedicaments((prevSelected) => {
      if (prevSelected.some(item => item.id === medicament.id)) {
        return prevSelected.filter(item => item.id !== medicament.id);
      } else {
        return [...prevSelected, medicament];
      }
    });
  };

  const handleOrder = () => {
    if (selectedMedicaments.length > 0) {
      navigation.navigate('OrderScreen', { selectedMedicaments });
    } else {
      Alert.alert('Aucune sélection', 'Veuillez sélectionner des médicaments avant de passer la commande.', [{ text: 'OK' }]);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>Erreur : {error.message}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Rechercher un médicament"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <Text style={styles.sectionTitle}>Médicaments disponibles</Text>
      {medicaments.map((med, index) => (
        <View key={index} style={styles.medBox}>
          <Image
            source={{ uri: med.imageUrl || 'https://via.placeholder.com/100' }}
            style={styles.medImage}
          />
          <View style={styles.medInfoContainer}>
            <Text style={styles.medTitle}>{med.libelle}</Text>
            <Text style={styles.medInfo}>Indication : {med.indication || 'N/A'}</Text>
            <Text style={styles.medInfo}>Posologie : {med.posologie || 'N/A'}</Text>
            <Text style={styles.medInfo}>Prix indicatif : {med.priceMadagascar} MGA</Text>
            <Button
              title={
                selectedMedicaments.some(item => item.id === med.id)
                  ? 'Retirer de la commande'
                  : 'Ajouter à la commande'
              }
              onPress={() => toggleSelection(med)}
              color={selectedMedicaments.some(item => item.id === med.id) ? 'red' : '#000'}
              icon={
                <Icon
                  name={selectedMedicaments.some(item => item.id === med.id) ? 'remove-shopping-cart' : 'add-shopping-cart'}
                  size={20}
                  color={selectedMedicaments.some(item => item.id === med.id) ? 'red' : 'black'}
                />
              }
            />
          </View>
        </View>
      ))}

      {selectedMedicaments.length > 0 && (
        <View style={styles.orderButtonContainer}>
          <Button title="Passer la commande ?" onPress={handleOrder} />
        </View>
      )}

      <View style={styles.paginationContainer}>
        {pageLoading && <ActivityIndicator size="small" color="#0000ff" />}
        <Button title="Précédent" onPress={handlePreviousPage} disabled={currentPage === 1 || pageLoading} />
        <Text style={styles.pageInfo}>Page {currentPage}</Text>
        <Button title="Suivant" onPress={handleNextPage} disabled={pageLoading} />
      </View>

      <View style={styles.helpContainer}>
        <Text style={styles.helpText}>Besoin d'aide ? Contactez-nous !</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#ccc',
    paddingLeft: 40,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  medBox: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  medInfoContainer: {
    flex: 1,
  },
  medTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  medInfo: {
    fontSize: 14,
    marginTop: 5,
  },
  orderButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  pageInfo: {
    fontSize: 16,
  },
  helpContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProductListScreen;

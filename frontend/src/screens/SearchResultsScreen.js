import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';

const SearchResultsScreen = ({ route }) => {
  const { nearbyBeaches } = route.params;
  const [filteredBeaches, setFilteredBeaches] = useState(nearbyBeaches);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    const filtered = nearbyBeaches.filter(beach => 
      beach.name?.toLowerCase().includes(text.toLowerCase()) ||
      beach.city?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBeaches(filtered);
  };

  const renderBeachItem = ({ item }) => (
    <View style={styles.beachItem}>
      <Text style={styles.beachName}>{item.name || 'Unnamed Beach'}</Text>
      <Text style={styles.beachCity}>{item.city}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar nearbyBeaches={nearbyBeaches} onSearch={handleSearch} />
      <FlatList
        data={filteredBeaches}
        renderItem={renderBeachItem}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
  },
  beachItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  beachName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  beachCity: {
    fontSize: 14,
    color: '#666',
  },
});

export default SearchResultsScreen;
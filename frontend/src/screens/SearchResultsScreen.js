import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import { NearbyBeachesContext } from '../context/NearByBeachesContext';

const activityIcons = {
  surfing: 'water',
  swimming: 'swim',
  fishing: 'fish',
  'beach combing': 'search',
  sunbathing: 'sunny',
  'bird watching': 'eye',
  picnicking: 'cafe',
  'kite flying': 'airplane',
  kayaking: 'boat',
  'beach yoga': 'fitness',
  'sand castle building': 'construct',
};

const safetyColors = {
  Safe: '#4CAF50',
  Moderate: '#FFC107',
  Caution: '#FF9800',
  Dangerous: '#F44336',
};

const SearchResultsScreen = () => {
  const { nearbyBeaches } = useContext(NearbyBeachesContext);
  const [filteredBeaches, setFilteredBeaches] = useState(nearbyBeaches);

  const handleSearch = (text) => {
    const filtered = nearbyBeaches.filter(beach => 
      beach.name?.toLowerCase().includes(text.toLowerCase()) ||
      beach.city?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBeaches(filtered);
  };

  const renderBeachItem = ({ item }) => (
    <View style={styles.beachItem}>
      <View style={styles.beachInfo}>
        <View style={styles.nameAndSafety}>
          <View style={[styles.safetyDot, { backgroundColor: safetyColors[item.safety_status] }]} />
          <Text style={styles.beachName}>{item.name || 'Unnamed Beach'}</Text>
        </View>
        <Text style={styles.beachCity}>{item.city}</Text>
        <Text>{item.distance.toFixed(2)} km away</Text>
      </View>
      <View style={styles.activityIcons}>
        {item.activities.slice(0, 3).map((activity, index) => (
          <Ionicons key={index} name={activityIcons[activity] || 'help-circle-outline'} size={14} color="#666" style={styles.icon} />
        ))}
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  beachInfo: {
    flex: 1,
  },
  nameAndSafety: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  beachName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  beachCity: {
    fontSize: 14,
    color: '#666',
  },
  activityIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 8,
  },
});

export default SearchResultsScreen;
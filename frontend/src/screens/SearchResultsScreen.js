import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import { NearbyBeachesContext } from '../context/NearByBeachesContext';
import axios from 'axios';
import { NEARBY_BASE_URL } from '@env';
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from '@react-navigation/native';

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
  const { userToken } = useContext(AuthContext);
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const searchAPIForBeach = async () => {
    try {
      const response = await axios.get(
        `${NEARBY_BASE_URL}api/v1/beaches/search?query=${searchText}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          }
        }
      );
      if (response.data && response.data.length > 0) {
        // Update filteredBeaches with the API results
        setFilteredBeaches(response.data);
      } else {
        alert('No beaches found matching your search.');
        setFilteredBeaches([]);
      }
    } catch (error) {
      console.error('Error searching for beach:', error);
      alert('An error occurred while searching for the beach.');
      setFilteredBeaches([]);
    }
  };

  const handleSearchSubmit = () => {
    searchAPIForBeach();
  };

  const navigateToBeachDetail = (beach) => {
    navigation.navigate('BeachDetail', { beach });
  };

  const renderBeachItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToBeachDetail(item)}>
      <View style={styles.beachItem}>
        <View style={styles.beachInfo}>
          <View style={styles.nameAndSafety}>
            <View style={[styles.safetyDot, { backgroundColor: safetyColors[item.safety_status] }]} />
            <Text style={styles.beachName}>{item.name || 'Unnamed Beach'}</Text>
          </View>
          <Text style={styles.beachCity}>{item.city}</Text>
          <Text>{item.distance ? `${item.distance.toFixed(2)} km away` : 'Distance unknown'}</Text>
        </View>
        <View style={styles.activityIcons}>
          {item.activities && item.activities.slice(0, 3).map((activity, index) => (
            <Ionicons key={index} name={activityIcons[activity] || 'help-circle-outline'} size={14} color="#666" style={styles.icon} />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchBar 
        onSearch={handleSearch} 
        onSubmit={handleSearchSubmit}
      />
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
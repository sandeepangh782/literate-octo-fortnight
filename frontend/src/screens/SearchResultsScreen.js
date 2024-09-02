import React, { useState, useContext } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import { NearbyBeachesContext } from '../context/NearByBeachesContext';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { LocationContext } from '../context/LocationContext';
import { NEARBY_BASE_URL } from '@env';
import { RecentBeachesContext } from '../context/RecentBeachesContext';


const activityIcons = {
  surfing: 'water',
  swimming: 'fish',
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

const removeDuplicatesById = (arr) => {
  const uniqueIds = new Set();
  return arr.filter(item => {
    const isDuplicate = uniqueIds.has(item.id);
    uniqueIds.add(item.id);
    return !isDuplicate;
  });
};

const SearchResultsScreen = () => {
  const { userToken } = useContext(AuthContext);
  const { latitude, longitude } = useContext(LocationContext); 
  const { nearbyBeaches, setNearbyBeaches } = useContext(NearbyBeachesContext);
  const { recentBeaches, addRecentBeach } = useContext(RecentBeachesContext);
  const [filteredBeaches, setFilteredBeaches] = useState(nearbyBeaches);
  const navigation = useNavigation();

  const handleSearch = async (text) => {
    if (text.length > 3) {
      try {
        const response = await axios.get(`${NEARBY_BASE_URL}api/v1/beaches/search?query=${text}&lat=${latitude}&lon=${longitude}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
  
        const fetchedBeaches = response.data.beaches;
        const uniqueFetchedBeaches = removeDuplicatesById(fetchedBeaches);
        setFilteredBeaches(removeDuplicatesById([...filteredBeaches, ...uniqueFetchedBeaches]));
        setNearbyBeaches(removeDuplicatesById([...nearbyBeaches, ...uniqueFetchedBeaches]));
      } catch (error) {
        console.error('Error fetching beaches:', error);
      }
    }
    
    const filtered = nearbyBeaches.filter(beach =>
      beach.name?.toLowerCase().includes(text.toLowerCase()) ||
      beach.city?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBeaches(filtered);
  };

  const navigateToBeachDetails = (beach) => {
    addRecentBeach(beach);
    navigation.navigate('BeachDetails', { beach });
  };

  const renderBeachItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToBeachDetails(item)}>
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
      <SearchBar initialValue="" onSearch={handleSearch} />
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

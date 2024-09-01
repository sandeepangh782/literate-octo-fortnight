import React, { useContext } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import MapSection from '../components/MapSection';
import { NearbyBeachesContext } from '../context/NearByBeachesContext';

const HomeScreen = ({ navigation }) => {

  const { nearbyBeaches } = useContext(NearbyBeachesContext);
  const firstFourBeaches = nearbyBeaches.slice(0, 4);
  const handleClick = () => {
    navigation.navigate('SearchResults');
  }
  const safetyColors = {
    Safe: '#4CAF50',
    Moderate: '#FFC107',
    Caution: '#FF9800',
    Dangerous: '#F44336',
  };

  const renderBeachItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('BeachDetails', { beach: item })} >
      <Text style={styles.beachName}>{item.name || 'Unnamed Beach'}</Text>
      <View style={styles.nameandSafety}>
        <Text style={styles.beachCity}>{item.city}</Text>
        <View style={[styles.safetyDot, { backgroundColor: safetyColors['Safe'] }]} />
      </View>

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.searchContainer}>
        <Text style={styles.searchBarText} onPress={handleClick}>
          Search...
        </Text>
      </View>
      <View style={styles.nearby}><Text style={styles.nearbytext}>Beaches Near You</Text></View>
      <FlatList
        data={firstFourBeaches}
        renderItem={renderBeachItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} 
        columnWrapperStyle={styles.columnWrapper} 
        key={(2).toString()} 
        style={styles.list}
      />
      <MapSection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    height: 45,
    margin: 30,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  searchBarText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
    marginTop: 10,
  },
  list: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',  // Ensure columns are spaced evenly
  },
  listItem: {
    flex: 1,
    padding: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  beachName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  beachCity: {
    fontSize: 14,
    color: '#666',
  },
  nameandSafety: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  safetyDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginRight: 10,
    marginLeft: 10,
    mmrgginTop: 8,
    padding: 5,
  },
  nearbytext: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 35,
    marginTop: 10,
  },
});

export default HomeScreen;

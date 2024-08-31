import React,{useContext} from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import MapSection from '../components/MapSection';
import { NearbyBeachesContext } from '../context/NearByBeachesContext';

const HomeScreen = ({ navigation }) => {
  
  const { nearbyBeaches } = useContext(NearbyBeachesContext);
  const firstFourBeaches = nearbyBeaches.slice(0, 4);

  // const nearbyBeaches = [
  //   {"name":"Marina Beach","state":"Goa","state_district":null,"city":"Chennai","latitude":15.500038649966278,"longitude":73.82062025701819,"formatted_address":null,"activities":["surfing","beach yoga","snorkeling"],"id":111,"created_at":"2024-08-30T18:02:26.711866+05:30","updated_at":null},
  //   {"name":"Kegdole Beach","state":"Goa","state_district":"North Goa District","city":"Reis Magos","latitude":15.496590699999999,"longitude":73.80998966699704,"formatted_address":"Kegdole Beach, Verem, Reis Magos, Bardez, India","activities":["snorkeling","picnicking","swimming"],"id":72,"created_at":"2024-08-30T18:02:26.711866+05:30","updated_at":null},
  //   {"name":"Marina Beach","state":"Goa","state_district":null,"city":"Chennai","latitude":15.500038649966278,"longitude":73.82062025701819,"formatted_address":null,"activities":["surfing","beach yoga","snorkeling"],"id":111,"created_at":"2024-08-30T18:02:26.711866+05:30","updated_at":null},
  //   {"name":"Kegdole Beach","state":"Goa","state_district":"North Goa District","city":"Reis Magos","latitude":15.496590699999999,"longitude":73.80998966699704,"formatted_address":"Kegdole Beach, Verem, Reis Magos, Bardez, India","activities":["snorkeling","picnicking","swimming"],"id":72,"created_at":"2024-08-30T18:02:26.711866+05:30","updated_at":null}
  
  // ];

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
    <TouchableOpacity style={styles.listItem}>
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
        numColumns={2}  // Display items in 2 columns
        columnWrapperStyle={styles.columnWrapper}  // Style for wrapping the columns
        key={(2).toString()}  // Force re-render by changing key when numColumns is used
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

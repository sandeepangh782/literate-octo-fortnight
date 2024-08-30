import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import Header from '../components/Header';
import { AuthContext } from "../context/AuthContext";
import { NEARBY_BASE_URL } from '@env';
import SearchBar from '../components/SearchBar';

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nearbyBeaches, setNearbyBeaches] = useState([]);
  const [mapReady, setMapReady] = useState(false);
  const { userToken } = useContext(AuthContext);
  const mapRef = useRef(null);
  console.log(userToken);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        
        await fetchNearbyBeaches(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error('Error:', error);
        setErrorMsg('An error occurred while fetching location or beaches');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchNearbyBeaches = useCallback(async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `${NEARBY_BASE_URL}api/v1/beaches/nearby?lat=${latitude}&lon=${longitude}&radius=15&limit=25`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          }
        }
      );
      setNearbyBeaches(response.data);
      console.log('Nearby beaches:', response.data);
      if (nearbyBeaches.length > 0 || mapReady) {
        const coordinates = [
          { latitude, longitude },
          ...response.data.map(beach => ({ latitude: beach.latitude, longitude: beach.longitude }))
        ];
        
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      console.error('Error fetching nearby beaches:', error);
    }
  }, [mapReady, userToken]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleClick = () => {
    console.log('SearchBar clicked');
    navigation.navigate('SearchResults', { nearbyBeaches });  
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <Text style={styles.searchBar} onPress={handleClick}>
        Search...
      </Text>
      <View style={styles.map_container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onMapReady={() => setMapReady(true)}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
          />
          {nearbyBeaches.map((beach) => (
            <Marker
              key={beach.id}
              coordinate={{
                latitude: beach.latitude,
                longitude: beach.longitude,
              }}
              title={beach.name || 'Unnamed Beach'}
              description={beach.city}
              pinColor='green'
            />
          ))}
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  searchBar: {
    height: 45,
    margin: 30,
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f2f2f2',
  },
  map: {
    height: 500,         
    margin: 30,          
    borderRadius: 20,    
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  map_container: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#D8EFD3',
  },
});

export default HomeScreen;
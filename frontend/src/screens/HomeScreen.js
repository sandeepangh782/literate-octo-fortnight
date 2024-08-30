import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Header from '../components/Header';

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
      setLoading(false);
    })();
  }, []);

  const nearbyBeaches = [
    { id: 1, name: 'Beach 1', latitude: 37.7749, longitude: -122.4194 },
    { id: 2, name: 'Beach 2', latitude: 37.7849, longitude: -122.4094 },
    // Add more beaches here
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <TextInput style={styles.searchBar} placeholder="Search..." />
      <View style={styles.map_container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
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
              title={beach.name}
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
    margin: 50,
    borderRadius: 18,
    paddingHorizontal: 10,
    backgroundColor: '#f2f2f2',
  },
  map: {
    height: 500,         // Set the desired height for the MapView
    margin: 30,          // Optional: Add margin if needed
    borderRadius: 20,    // Apply the border radius for rounded corners
    overflow: 'hidden',
    backgroundColor: '#000000',
    // Ensure content within the border radius is clipped
  },
  map_container: {
    // flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#D8EFD3',
  },

});

export default HomeScreen;
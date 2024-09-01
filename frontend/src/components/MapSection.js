import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import { NearbyBeachesContext } from "../context/NearByBeachesContext";
import { NEARBY_BASE_URL } from '@env';
import { LocationContext } from '../context/LocationContext';


const MapSection = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const { nearbyBeaches, setNearbyBeaches} = useContext(NearbyBeachesContext);
  const { latitude, setLatitude, longitude, setLongitude } = useContext(LocationContext); 
  const [mapReady, setMapReady] = useState(false);

  const { userToken } = useContext(AuthContext);
  const mapRef = useRef(null);
  const hasFitToCoordinates = useRef(false);

  const fetchLocationAndBeaches = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLatitude(locationData.coords.latitude);  
      setLongitude(locationData.coords.longitude); 
      setLocation(locationData);

      const response = await axios.get(
        `${NEARBY_BASE_URL}api/v1/beaches/nearby?lat=${locationData.coords.latitude}&lon=${locationData.coords.longitude}&radius=100&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          }
        }
      );

      setNearbyBeaches(response.data);
      console.log('Nearby beaches:', nearbyBeaches);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg('An error occurred while fetching location or beaches');
      setLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    fetchLocationAndBeaches();
  }, [fetchLocationAndBeaches]);

  const fitMapToCoordinates = useCallback(() => {
    if (location && nearbyBeaches.length > 0 && mapRef.current && mapReady && !hasFitToCoordinates.current) {
      const coordinates = [
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
        ...nearbyBeaches.map(beach => ({ latitude: beach.latitude, longitude: beach.longitude }))
      ];

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
      hasFitToCoordinates.current = true;
    }
  }, [location, nearbyBeaches, mapReady]);

  useEffect(() => {
    fitMapToCoordinates();
  }, [fitMapToCoordinates]);

  const handleMapReady = useCallback(() => {
    setMapReady(true);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return null;
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.5900,
          longitudeDelta: 0.4400,
        }}
        onMapReady={handleMapReady}
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
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    marginBottom: 90,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#D8EFD3',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapSection;
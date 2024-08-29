import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
// import MapboxGL from '@react-native-mapbox-gl/maps';

const HomePage = () => {
    return (
        <View style={styles.container}>
            <TextInput style={styles.searchBar} placeholder="Search..." />
            <View style={styles.mapContainer}>
                {/* <MapboxGL.MapView style={styles.map} /> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBar: {
        height: 40,
        margin: 10,
        borderRadius: 20,
        paddingHorizontal: 10,
        backgroundColor: '#f2f2f2',
    },
    mapContainer: {
        flex: 1,
        margin: 10,
        borderRadius: 20,
        overflow: 'hidden',
    },
    map: {
        flex: 1,
    },
});

export default HomePage;
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Header from '../components/Header';
import MapSection from '../components/MapSection';

const HomeScreen = ({ navigation }) => {
  const handleClick = () => {
    navigation.navigate('SearchResults');  
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.searchContainer}>
        <Text style={styles.searchBarText} onPress={handleClick}>
          Search...
        </Text>
      </View>
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
    color: '#000',
  },
});

export default HomeScreen;

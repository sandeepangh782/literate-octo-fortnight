import React from 'react';
import { View, StyleSheet,TextInput} from 'react-native';
import Header from '../components/Header';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <TextInput style={styles.searchBar} placeholder="Search..." />
      <View style={styles.mapPlaceholder}>
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
    height: 40,
    margin: 50,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f2f2f2',
  },
  mapPlaceholder: {
    flex: 1,
    borderBlockColor: '#000000',
    backgroundColor: '#f0f0f0', // Match with the wireframe color scheme
  },
});

export default HomeScreen;

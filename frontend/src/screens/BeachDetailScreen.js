import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';


const BeachDetailScreen = ({ route }) => {
  const { beach } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
    <Header navigation={navigation} />
      <Text style={styles.title}>{beach.name || 'Unnamed Beach'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default BeachDetailScreen;
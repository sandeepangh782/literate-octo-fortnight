import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BeachDetailScreen = ({ route }) => {
  const { beach } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{beach.name || 'Unnamed Beach'}</Text>
      <Text>Details coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default BeachDetailScreen;
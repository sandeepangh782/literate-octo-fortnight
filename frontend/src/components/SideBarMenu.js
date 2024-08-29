import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SidebarMenu = () => {
  return (
    <View style={styles.container}>
      <Text>Menu Item 1</Text>
      <Text>Menu Item 2</Text>
      <Text>Menu Item 3</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default SidebarMenu;

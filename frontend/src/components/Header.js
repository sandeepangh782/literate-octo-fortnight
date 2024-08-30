import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={34} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        {/* <Ionicons name="person-circle" size={34} color="black" /> */}
        <Image
          source={require('../../assets/profile-image.png')}
          style={styles.avatar}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffff',
  },
  searchBox: {
    fontSize: 16,
  },
  avatar: {
    marginTop: 10,
    width: 30,
    height: 30,
    borderRadius: 20,
    marginBottom: 10,
  },
});

export default Header;
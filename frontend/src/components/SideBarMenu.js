import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SidebarMenu = () => {
  const navigation = useNavigation();
  const { logout, userInfo } = useContext(AuthContext);

  const menuItems = [
    { name: 'Home', icon: 'home-outline', screen: 'Home' },
    { name: 'Profile', icon: 'person-outline', screen: 'Profile' },
    { name: 'Favourites', icon: 'heart-outline', screen: 'Favourites' },
    { name: 'Map Forecast', icon: 'fish-outline', screen: 'WindyMapForecast' },
    { name: 'Settings', icon: 'settings-outline', screen: 'Settings' },
  ];

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={require('../../assets/profile-image.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userInfo.full_name}</Text>
        <Text style={styles.name}></Text>
      </View>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => handleNavigation(item.screen)}
        >
          <Ionicons name={item.icon} size={20} color="black" />
          <Text style={styles.menuText}>{item.name}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.bottomSection}>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => { logout() }}
        >
          <Ionicons name="log-out-outline" size={20} color="black" />
          <Text style={styles.menuText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    padding: 20,
  },
  profileSection: {
    alignItems: 'left',
    padding: 25,
    borderRadius: 20,
    backgroundColor: '#C0C78C',
    marginBottom: 20,
  },
  avatar: {
    marginTop: 20,
    width: 60,
    height: 60,
    borderRadius: 40,
    marginBottom: 40,
  },
  name: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    color: 'black',
    marginLeft: 10,
    fontSize: 16,
  },
  bottomSection: {
    marginTop: 'auto',
  },
});

export default SidebarMenu;
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';

const Header = ({ navigation }) => {
  const handleMenuPress = () => {
    const drawerNavigation = navigation.getParent('DrawerParent');
    if (drawerNavigation) {
      drawerNavigation.dispatch(DrawerActions.toggleDrawer());
    } else {
      // Fallback navigation
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleMenuPress}>
        <Ionicons name="menu" size={34} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
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
  avatar: {
    marginTop: 10,
    width: 30,
    height: 30,
    borderRadius: 20,
    marginBottom: 10,
  },
});

export default Header;
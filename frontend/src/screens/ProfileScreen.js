import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  // const navigation = useNavigation();

  // Placeholder user details
  const userDetails = {
    name: 'Sandeepan Ghosh',
    email: 'sandeepan782@gmail.com',
    mobile: '+91-8101596976',
    location: 'Chennai, India',
  };

  return (
    <View style={styles.container}>
      {/* User Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={require('../../assets/profile-image.png')}
          style={styles.avatar}
        />
        <Text style={styles.label_location}>{userDetails.location}</Text>
      </View>
      <View style={styles.user_details}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name='person-outline' size={20} color="black" />
          <Text style={styles.label}>Name</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{userDetails.name}</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name='mail-outline' size={20} color="black" />
          <Text style={styles.label}>Email</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{userDetails.email}</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name='home-outline' size={20} color="black" />
          <Text style={styles.label}>Mobile</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{userDetails.mobile}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 20,
    flexDirection: 'row',

  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#f2f2f2',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginLeft: 10,
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  user_details: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#C0C78C',
  },
  label_location: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginLeft: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default ProfileScreen;

import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from "../context/AuthContext";
import Header from '../components/Header';
import { RecentBeachesContext } from '../context/RecentBeachesContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  const { recentBeaches } = useContext(RecentBeachesContext);

  const renderBeachItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('BeachDetails', { beach: item })}>
      <View style={styles.beachItem}>
      <View style={styles.nameanddot}>
        <Icon name="circle" size={10} color="#00FF00" />
      <Text style={styles.beachName}>
        {item.name || 'Unnamed Beach'}</Text>
      </View>
      <Text style={styles.beachCity}>{item.city}</Text>     
      </View>
    </TouchableOpacity>
  );

  const renderRecentBeaches = () => (
    <View style={styles.recentBeachesContainer}>
      <Text style={styles.sectionTitle}>Recent Beaches</Text>
      <FlatList
        data={recentBeaches}
        renderItem={renderBeachItem}
        keyExtractor={item => `recent-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.avatarContainer}>
        <Image
          source={require('../../assets/profile-image.png')}
          style={styles.avatar}
        />
        <Text style={styles.label_location}>Chennai, India</Text>
      </View>
      <View style={styles.user_details}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name='person-outline' size={20} color="black" />
          <Text style={styles.label}>Name</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{userInfo.full_name}</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name='mail-outline' size={20} color="black" />
          <Text style={styles.label}>Email</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{userInfo.email}</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name='home-outline' size={20} color="black" />
          <Text style={styles.label}>Mobile</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{userInfo.phone_number}</Text>
      </View>
      {recentBeaches.length > 0 && renderRecentBeaches()}
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
  recentBeachesContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  beachItem: {
    padding: 10,
    marginLeft: 15,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
  },
  beachName:{
    paddingLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  beachCity: {
    paddingLeft: 15,
    fontSize: 12,
    color: '#666',
  },
  nameanddot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProfileScreen;
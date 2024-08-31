import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';


const BeachDetailScreen = ({ route }) => {
//   const { beach } = route.params;
  const navigation = useNavigation();
  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };


  return (
    <View style={styles.container}>
    <Header navigation={navigation} onMenuPress={handleOpenDrawer} />
    {/* <View style={styles.image_ontainer}>
        <Image source={{ uri: beach.image_url }} style={{ width: '100%', height: 200, borderRadius: 10 }}
        />
    </View> */}
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
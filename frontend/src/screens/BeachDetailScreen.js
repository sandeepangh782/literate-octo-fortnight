import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';


const BeachDetailScreen = ({ route }) => {
//   const { beach } = route.params;
  const navigation = useNavigation();
  const beach= [{"name":"Soneca Cola Beach Resort","state":"Goa","state_district":"South Goa District","city":"Parven","latitude":15.0605725,"longitude":73.9702025,"formatted_address":"Soneca Cola Beach Resort, MDR49, Parven - 503702, Goa, India","activities":["surfing","jet skiing","bird watching"],"id":1,"created_at":"2024-08-30T18:02:26.711866+05:30","updated_at":null,"image_url":"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AXCi2Q6A0ZIlpaUJUdtLRUlVanU9hJB_N-sAks1VybumzlHS4qXQ90CY4uoOEJWMtSkO5TpDYGIw42JM2SLOnxQRq7maLD5b4OlKocRgyijehQHAUGM9z7ufrYCJNB7ATkiRYatrIIq-fVSnZtjGPuowxPxV-lTqZwM2bW3aC_JSRAdHiQ6g&key=AIzaSyAg_WDxdTzogOXGj6w2bKTVdyySQOrrkTM"}];
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
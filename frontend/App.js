import React from "react";
import { StyleSheet, Alert, Button, Linking } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { registerRootComponent } from 'expo';
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthContextProvider } from "./src/context/AuthContext";
import { NearbyBeachesProvider } from "./src/context/NearByBeachesContext";
import { LocationProvider } from './src/context/LocationContext';
import { RecentBeachesProvider } from "./src/context/RecentBeachesContext";
import { FavoriteProvider } from "./src/context/FavoriteContext";
import { NotificationProvider } from "./src/context/NotificationContext";

function App() {
  const sendAlertMessage = () => {
    Alert.alert(
      'Emergency Helpline',
      'Choose a helpline number to call:',
      [
        { text: 'Disaster Helpline', onPress: () => Linking.openURL('tel:1077') },
        { text: 'Tourism Office of Govt. of Tamil Nadu', onPress: () => Linking.openURL('tel:25368538') },
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: true }
    );
  };

  return (
    <FavoriteProvider>
      <RecentBeachesProvider>
        <LocationProvider>
          <NearbyBeachesProvider>
            <AuthContextProvider>
              <NotificationProvider>
                <SafeAreaProvider style={styles.ios}>
                  <SafeAreaView style={styles.container}>
                    <AppNavigator />
                    <Button title="Send SOS" color={"red"} onPress={sendAlertMessage} />
                  </SafeAreaView>
                </SafeAreaProvider>
              </NotificationProvider>
            </AuthContextProvider>
          </NearbyBeachesProvider>
        </LocationProvider>
      </RecentBeachesProvider>
    </FavoriteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  ios: {
    margin: 0,
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },

});

registerRootComponent(App);
export default App;
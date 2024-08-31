import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { registerRootComponent } from 'expo';
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthContextProvider } from "./src/context/AuthContext";
import { NearbyBeachesProvider } from "./src/context/NearByBeachesContext";
import { LocationProvider } from './src/context/LocationContext';


function App() {
  return (
    <LocationProvider>
    <NearbyBeachesProvider>
      <AuthContextProvider>
        <SafeAreaProvider style={styles.ios}>
          <SafeAreaView style={styles.container}>
            <AppNavigator />
          </SafeAreaView>
        </SafeAreaProvider>
      </AuthContextProvider>
    </NearbyBeachesProvider>
    </LocationProvider>
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
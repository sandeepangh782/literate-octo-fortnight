import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { registerRootComponent } from 'expo'; // Import registerRootComponent
import { AuthContextProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator"; // Adjusted import path
import { NearbyBeachesProvider } from "./src/context/NearByBeachesContext";


function App() {
  return (
    <NearbyBeachesProvider>
      <AuthContextProvider>
        <SafeAreaProvider style={styles.ios}>
          <SafeAreaView style={styles.container}>
            <AppNavigator />
          </SafeAreaView>
        </SafeAreaProvider>
      </AuthContextProvider>
    </NearbyBeachesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  ios:{
    margin: 0,
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});

registerRootComponent(App); // Register the root component
export default App;
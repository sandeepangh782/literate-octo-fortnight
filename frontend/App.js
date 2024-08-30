import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerRootComponent } from 'expo'; // Import registerRootComponent
import { AuthContextProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator"; // Adjusted import path

function App() {
  return (
    <AuthContextProvider>
      <SafeAreaView style={styles.container}>
        <AppNavigator />
      </SafeAreaView>
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});

registerRootComponent(App); // Register the root component
export default App;
import React from "react";
import { StyleSheet, View } from "react-native";
import { registerRootComponent } from 'expo'; // Import registerRootComponent
import AppNavigator from "./src/navigation/AppNavigator"; // Adjusted import path
import { SafeAreaView} from 'react-native-safe-area-context';

function App() {
  return (
    
    <SafeAreaView style={styles.container}>
      <AppNavigator />
    </SafeAreaView>
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
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Handle login logic here
    console.log("Login pressed");
    // Navigate to HomeScreen after successful login
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity
        onPress={() => console.log("Navigate to Signup screen")}
      >
        <Text style={styles.signupText}>New user? Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => console.log("Navigate to Forgot Password screen")}
      >
        <Text style={styles.signupText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => console.log("Login as guest")}>
        <Text style={styles.signupText}>Login as guest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  signupText: {
    marginTop: 20,
    color: "#007bff",
    textAlign: "center",
  },
});

import React, { useState } from "react";
import axios from "axios";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { BASE_URL } from "@env";

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/auth/register`, {
                email,
                password,
                full_name: name,
                phone_number: phoneNumber,
                // preferred_language: preferredLanguage,
                // notification_preferences: notificationPreferences
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log("Registration successful:", response.data);
            // Navigate to HomeScreen after successful registration
            navigation.navigate("Main");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.detail) {
                // Handle specific error message from the server
                Alert.alert("Registration Error", error.response.data.detail);
            } else {
                // Handle generic error
                console.error("Registration error:", error);
                Alert.alert("Registration Error", "An error occurred during registration. Please try again.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />

            <TextInput
                style={styles.input}
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Set New Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button title="Register" onPress={handleRegister} />

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "#fff",
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
    loginText: {
        marginTop: 20,
        color: "#007bff",
        textAlign: "center",
    },
});

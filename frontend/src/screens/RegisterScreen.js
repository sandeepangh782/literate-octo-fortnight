import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
    const { register, registerError } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleRegister = async () => {
        if (email === "" || password === "" || name === "" || phoneNumber === "") {
            Alert.alert("Validation Error", "All fields are required");
            return;
        }

        try {
            await register(email, password, name, phoneNumber);
            if (registerError) {
                Alert.alert("Registration Error", registerError);
            }
        } catch (error) {
            Alert.alert("Registration Error", "An unexpected error occurred");
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

            {registerError && <Text style={styles.errorText}>{registerError}</Text>}

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
    errorText: {
        color: "red",
        marginBottom: 12,
        textAlign: "center",
    },
    loginText: {
        marginTop: 20,
        color: "#007bff",
        textAlign: "center",
    },
});

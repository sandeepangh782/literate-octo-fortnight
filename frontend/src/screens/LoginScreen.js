import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

export default function LoginScreen({ navigation }) {
    const { login, loginError } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
            />

            <Text style={styles.errorText}>{loginError}</Text>

            <Button title="Login" onPress={() => { login(email, password) }} />

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.signupText}>New user? Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log("Navigate to Forgot Password screen")}>
                <Text style={styles.signupText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Main")}>
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
    signupText: {
        marginTop: 20,
        color: "#007bff",
        textAlign: "center",
    },
});

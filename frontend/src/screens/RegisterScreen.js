import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
    const { register, registerError } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <LinearGradient
                colors={['#C0C78C', '#A8AF7A', '#90976A']}
                // colors={['white', 'white', 'white']}
                style={styles.gradient}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.box}>
                        <Text style={styles.title}>Create Account</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={24} color="#C0C78C" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="#999"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={24} color="#C0C78C" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={24} color="#C0C78C" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                placeholderTextColor="#999"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={24} color="#C0C78C" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.showPasswordButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={24}
                                    color="#C0C78C"
                                />
                            </TouchableOpacity>
                        </View>

                        {registerError && <Text style={styles.errorText}>{registerError}</Text>}

                        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                            <Text style={styles.registerButtonText}>Register</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.loginText}>Already have an account? Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    box: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
        color: "#C0C78C",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#C0C78C",
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: "#333",
    },
    showPasswordButton: {
        padding: 10,
    },
    errorText: {
        color: "#ff3b30",
        marginBottom: 20,
        textAlign: "center",
    },
    registerButton: {
        backgroundColor: "#C0C78C",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    registerButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    loginText: {
        marginTop: 20,
        color: "#90976A",
        textAlign: "center",
        fontSize: 14,
    },
});
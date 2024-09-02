import React, { useState, useContext, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Alert,

} from "react-native";
// import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from "../context/AuthContext";

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
    const { login, loginError } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleLogin = () => {
        if (email === "" || password === "") {
            Alert.alert("Validation Error", "Email and password are required");
            return;
        }
        login(email, password);
    };
    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0],
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <LinearGradient
                // colors={['#E5E8CF', '#A8AF7A', '#90976A']}
                colors={['white', 'white', 'white']}
                style={styles.gradient}
            >
                <Animated.View style={[styles.box, { transform: [{ translateY }] }]}>
                    <Text style={styles.title}>Welcome Back</Text>

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

                    {loginError && <Text style={styles.errorText}>{loginError}</Text>}

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                            <Text style={styles.footerText}>New user? Sign up</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => console.log("Navigate to Forgot Password screen")}>
                            <Text style={styles.footerText}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
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
        justifyContent: "center",
        alignItems: "center",
    },
    box: {
        width: width * 0.9,
        padding: 30,
        borderRadius: 20,
        backgroundColor: "white",
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
    loginButton: {
        backgroundColor: "#C0C78C",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    loginButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    errorText: {
        color: "#ff3b30",
        marginBottom: 20,
        textAlign: "center",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
    },
    footerText: {
        color: "#90976A",
        fontSize: 14,
    },
});
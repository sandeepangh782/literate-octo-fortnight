import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@env";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loginError, setLoginError] = useState(null);
    const [registerError, setRegisterError] = useState(null);

    const login = (username, password) => {
        setIsLoading(true);
        setLoginError(null);
        axios.post(`${BASE_URL}/api/v1/auth/login`, `username=${username}&password=${password}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(res => {
                let userInfo = res.data.user;
                let token = res.data.access_token;
                setUserInfo(userInfo);
                setUserToken(token);

                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                AsyncStorage.setItem('userToken', token);
                console.log("Successfully Logged In");
            })
            .catch(err => {
                setLoginError(err.response?.data?.detail || 'Login failed');
                console.log(`login error: ${err.response?.data?.detail}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const register = async (email, password, name, phoneNumber) => {
        setIsLoading(true);
        setRegisterError(null);
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/auth/register`, {
                email,
                password,
                full_name: name,
                phone_number: phoneNumber,
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log("Registration successful:", response.data);
            login(email, password);
        } catch (error) {
            const errorMsg = error.response?.data?.detail[0]?.msg || 'Registration failed';
            setRegisterError(errorMsg);
            console.log(`registration error: ${errorMsg}`);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userInfo');
        AsyncStorage.removeItem('userToken');
        console.log("Successfully Logged Out");
        setIsLoading(false);
    };

    const isLoggedIn = async () => {
        setIsLoading(true);
        try {
            let userInfo = await AsyncStorage.getItem('userInfo');
            let userToken = await AsyncStorage.getItem('userToken');
            userInfo = JSON.parse(userInfo);
            if (userInfo) {
                setUserInfo(userInfo);
                setUserToken(userToken);
            }
            setIsLoading(false);
        } catch (e) {
            console.log(`isLoggedIn error: ${e}`);
        }
    };

    const updateExpoPushToken = async (token) => {
        if (userToken) {
            try {
                const response = await axios.post(
                    `${BASE_URL}/api/v1/notifications/update-expo-token`,
                    { expo_push_token: token },
                    {
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log('Expo push token updated on backend:', response.data);
            } catch (error) {
                console.error('Failed to update Expo push token on backend:', error);
            }
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            login, 
            register, 
            logout, 
            isLoading, 
            userToken, 
            userInfo, 
            loginError, 
            registerError,
            updateExpoPushToken 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
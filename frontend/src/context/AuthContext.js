import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@env";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loginError, setLoginError] = useState(null);  // Add a state for login error

    const login = (username, password) => {
        setIsLoading(true);
        setLoginError(null);  // Reset error before a new login attempt
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
                setLoginError(`${err.response.data.detail}*` || 'Login failed');
                console.log(`login error: ${err.response.data.detail}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userInfo');
        AsyncStorage.removeItem('userToken');
        console.log("Successfully Logged Out");
        setIsLoading(false);
    }

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
        }
        catch (e) {
            console.log(`isLoggedIn error: ${e}`);
        }
    }

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ login, logout, isLoading, userToken, userInfo, loginError }}>
            {children}
        </AuthContext.Provider>
    );
}

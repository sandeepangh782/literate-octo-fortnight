import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const { userToken, updateExpoPushToken } = useContext(AuthContext);

    async function registerForPushNotificationsAsync() {
        let token;
    
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return;
            }
            
            try {
                if (Constants.expoConfig?.extra?.eas?.projectId) {
                    token = (await Notifications.getExpoPushTokenAsync({
                        projectId: Constants.expoConfig.extra.eas.projectId
                    })).data;
                } else {
                    // Fallback to getExpoPushTokenAsync without projectId
                    token = (await Notifications.getExpoPushTokenAsync()).data;
                }
                console.log("Expo Push Token:", token);
            } catch (error) {
                console.error("Error getting push token:", error);
            }
        } else {
            console.log('Must use physical device for Push Notifications');
        }
    
        return token;
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            if (token) {
                setExpoPushToken(token);
                if (userToken) {
                    updateExpoPushToken(token);
                }
            }
        });

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            console.log(notification);
            // Handle received notification
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
            // Handle notification response (e.g., when user taps on the notification)
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, [userToken]);

    return (
        <NotificationContext.Provider value={{ expoPushToken }}>
            {children}
        </NotificationContext.Provider>
    );
};
// src/services/NotificationService.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, Button, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { AuthContext } from './AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
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

        if (Constants.isDevice) {
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
            setModalVisible(true);
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.modal_heading}>
                            <Text style={styles.heading}>Alert</Text>
                            <Icon name="alert-circle" size={30} color="#FF231F7C" style={styles.icon}/>
                        </View>
                        <Text style={styles.modalText}>
                            High Wave Watch for the coast of KANNIYAKUMARI, TAMIL NADU from Neerodi To Arockiyapuram. {'\n'}{'\n'}
                            High waves in the range of 2.3 - 2.7 meters are forecasted during 17:30 hours on 02-09-2024 to 23:30 hours on 04-09-2024. {'\n'}{'\n'}
                            <Text style={styles.boldText}>It is advised that no immediate action is required. Check for updates.</Text>
                        </Text>
                        <Button
                            title="Close"
                            onPress={() => setModalVisible(!modalVisible)}
                        />
                    </View>
                </View>
            </Modal>
        </NotificationContext.Provider>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 0, // Remove bottom margin
        marginRight: 10, // Add space between the text and icon
    },
    icon: {
        marginLeft: 5, // Adjust the spacing between the text and the icon
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'justify',
    },
    boldText: {
        fontWeight: 'bold',
    },
    modal_heading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center items horizontally
        marginBottom: 15, // Add space below the heading and icon
    },
});

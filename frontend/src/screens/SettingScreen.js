import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';


const SettingScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <Text>Settings Screen</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffff',
    },
});

export default SettingScreen;
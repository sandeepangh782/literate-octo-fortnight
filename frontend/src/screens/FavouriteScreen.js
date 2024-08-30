import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';


const FavouriteScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <Text>Favourites Screen</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffff',
    },
});

export default FavouriteScreen
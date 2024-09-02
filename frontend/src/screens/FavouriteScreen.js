import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { NEARBY_BASE_URL } from '@env';
import { AuthContext } from '../context/AuthContext'; 
import { FavoriteContext } from '../context/FavoriteContext';


const FavouriteScreen = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const { userToken } = useContext(AuthContext);
    const { isFavorite, setIsFavorite } = useContext(FavoriteContext);
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`${NEARBY_BASE_URL}api/v1/favorites/`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setFavorites(response.data.beaches);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [userToken]);

    // const toggleFavorite = async (id) => {
    //     if (id) {
    //         try {
    //             if (isFavorite) {
    //                 await axios.delete(`${NEARBY_BASE_URL}api/v1/favorites/${id}`, {
    //                     headers: {
    //                         Authorization: `Bearer ${userToken}`,
    //                     }
    //                 });
    //                 setIsFavorite(false);
    //             } else {
    //                 await axios.post(`${NEARBY_BASE_URL}api/v1/favorites/${id}`, {}, {
    //                     headers: {
    //                         Authorization: `Bearer ${userToken}`,
    //                     }
    //                 });
    //                 setIsFavorite(true);
    //             }
    //         } catch (err) {
    //             setError('Failed to update favorites');
    //             console.error(err);
    //         }
    //     }
    // };

    const renderFavoriteCard = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BeachDetails', { beach: item })}>
            {/* <View style={styles.cardImageContainer}>
                <Icon name="image-outline" size={40} color="#3498db" />
            </View> */}
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDescription}>{item.city}</Text>
                <Text style={styles.cardDescription}>{item.state}</Text>
            </View>
            <TouchableOpacity style={styles.favoriteIcon} onPress={() => {}}>
                    <Icon name={"heart"} size={24} color= "#EF4B4B" />
                </TouchableOpacity>

        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <FlatList
                data={favorites}
                renderItem={renderFavoriteCard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    list: {
        padding: 15,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardImageContainer: {
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
    },
});

export default FavouriteScreen;
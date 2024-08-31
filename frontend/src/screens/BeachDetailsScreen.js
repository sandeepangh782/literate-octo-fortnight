import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { NEARBY_BASE_URL } from "@env";
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const safetyColors = {
    Safe: '#4CAF50',
    Moderate: '#FFC107',
    Caution: '#FF9800',
    Dangerous: '#F44336',
    Unknown: '#9E9E9E',
};

const BeachDetailsScreen = ({ route }) => {
    const { beach } = route.params;
    const [beachDetails, setBeachDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userToken } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchBeachDetails = async () => {
            if (beach && beach.id) {
                try {
                    const response = await axios.get(`${NEARBY_BASE_URL}api/v1/beaches/${beach.id}`, {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        }
                    });
                    setBeachDetails(response.data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBeachDetails();
    }, [beach, userToken]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    if (!beachDetails) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No details available</Text>
            </View>
        );
    }

    const renderMarineCondition = (label, value, unit) => (
        <Text style={styles.text}>{label}: {value} {unit}</Text>
    );

    return (
        <ScrollView style={styles.container}>
            <Header navigation={navigation} />

            <View style={styles.imageContainer}>
                {beachDetails.image_url && (
                    <Image source={{ uri: beachDetails.image_url }} style={styles.image} />
                )}
                <View style={styles.overlay}>
                    <View style={[styles.safetyDot, { backgroundColor: safetyColors[beachDetails.safety_status] || safetyColors.Unknown }]} />
                    <Text style={styles.title}>{beachDetails.name || 'Unnamed Beach'}</Text>
                </View>
            </View>

            <View style={styles.detailContainer}>
                <Text style={styles.subTitle}>Location</Text>
                <Text style={styles.text}>{beachDetails.formatted_address || 'Address not available'}</Text>
                <Text style={styles.text}>{beachDetails.city ? `${beachDetails.city},` : ''} {beachDetails.state_district ? `${beachDetails.state_district},` : ''} {beachDetails.state || ''}</Text>
            </View>

            <View style={styles.detailContainer}>
                <Text style={styles.subTitle}>Activities</Text>
                {beachDetails.activities && beachDetails.activities.length > 0 ? (
                    beachDetails.activities.map((activity, index) => (
                        <Text key={index} style={styles.text}>- {activity}</Text>
                    ))
                ) : (
                    <Text style={styles.text}>No activities listed</Text>
                )}
            </View>

            <View style={styles.detailContainer}>
                <Text style={styles.subTitle}>Safety Status</Text>
                <Text style={styles.text}>{beachDetails.safety_status || 'No data available'}</Text>
            </View>

            {beachDetails.marine_conditions ? (
                <View style={styles.detailContainer}>
                    <Text style={styles.subTitle}>Marine Conditions</Text>
                    <Text style={styles.text}>As of: {new Date(beachDetails.marine_conditions.timestamp).toLocaleString()}</Text>
                    {renderMarineCondition('Wave Height', beachDetails.marine_conditions.wave_height.value, beachDetails.marine_conditions.wave_height.unit)}
                    {renderMarineCondition('Wave Direction', beachDetails.marine_conditions.wave_direction.value, beachDetails.marine_conditions.wave_direction.unit)}
                    {renderMarineCondition('Wave Period', beachDetails.marine_conditions.wave_period.value, beachDetails.marine_conditions.wave_period.unit)}
                    {renderMarineCondition('Wind Wave Height', beachDetails.marine_conditions.wind_wave_height.value, beachDetails.marine_conditions.wind_wave_height.unit)}
                    {renderMarineCondition('Wind Wave Direction', beachDetails.marine_conditions.wind_wave_direction.value, beachDetails.marine_conditions.wind_wave_direction.unit)}
                    {renderMarineCondition('Wind Wave Period', beachDetails.marine_conditions.wind_wave_period.value, beachDetails.marine_conditions.wind_wave_period.unit)}
                    {renderMarineCondition('Swell Wave Height', beachDetails.marine_conditions.swell_wave_height.value, beachDetails.marine_conditions.swell_wave_height.unit)}
                    {renderMarineCondition('Swell Wave Direction', beachDetails.marine_conditions.swell_wave_direction.value, beachDetails.marine_conditions.swell_wave_direction.unit)}
                    {renderMarineCondition('Swell Wave Period', beachDetails.marine_conditions.swell_wave_period.value, beachDetails.marine_conditions.swell_wave_period.unit)}
                </View>
            ) : (
                <View style={styles.detailContainer}>
                    <Text style={styles.subTitle}>Marine Conditions</Text>
                    <Text style={styles.text}>No marine conditions data available</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        padding: 20,
    },
    errorText: {
        color: '#F44336',
        fontSize: 18,
    },
    imageContainer: {
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
        margin: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    overlay: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 40,
        paddingHorizontal: 15,
        paddingVertical: 4,
    },
    safetyDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        color: '#fff',
    },
    detailContainer: {
        borderRadius: 8,
        padding: 15,
        marginHorizontal: 10,
        marginBottom: 15,
        borderWidth: .5,
        borderColor: '#ddd',
    },
    subTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
});

export default BeachDetailsScreen;

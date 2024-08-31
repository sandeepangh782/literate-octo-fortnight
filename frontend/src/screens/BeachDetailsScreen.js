import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NEARBY_BASE_URL } from "@env";
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';

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
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Icon name="alert-circle-outline" size={50} color="#e74c3c" />
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    if (!beachDetails) {
        return (
            <View style={styles.errorContainer}>
                <Icon name="information-circle-outline" size={50} color="#95a5a6" />
                <Text style={styles.errorText}>No details available</Text>
            </View>
        );
    }

    const renderCondition = (icon, label, value, unit) => (
        <View style={styles.conditionRow}>
            <Icon name={icon} size={18} color="#3498db" style={styles.conditionIcon} />
            <Text style={styles.conditionText}>{label}: {value} {unit}</Text>
        </View>
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderSafetyPoint = (point, index) => (
        <View style={styles.safetyPointRow} key={index}>
            <Icon name="checkmark-circle-outline" size={18} color="#3498db" style={styles.safetyPointIcon} />
            <Text style={styles.safetyPointText}>{point}</Text>
        </View>
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
                <View style={styles.sectionHeader}>
                    <Icon name="location-outline" size={24} color="#3498db" />
                    <Text style={styles.subTitle}>Location</Text>
                </View>
                <Text style={styles.text}>{beachDetails.formatted_address || 'Address not available'}</Text>
                <Text style={styles.text}>{beachDetails.city ? `${beachDetails.city},` : ''} {beachDetails.state_district ? `${beachDetails.state_district},` : ''} {beachDetails.state || ''}</Text>
            </View>

            <View style={styles.detailContainer}>
                <View style={styles.sectionHeader}>
                    <Icon name="bicycle-outline" size={24} color="#3498db" />
                    <Text style={styles.subTitle}>Activities</Text>
                </View>
                {beachDetails.activities && beachDetails.activities.length > 0 ? (
                    beachDetails.activities.map((activity, index) => (
                        <Text key={index} style={styles.text}>• {activity}</Text>
                    ))
                ) : (
                    <Text style={styles.text}>No activities listed</Text>
                )}
            </View>

            <View style={styles.detailContainer}>
                <View style={styles.sectionHeader}>
                    <Icon name="shield-checkmark-outline" size={24} color="#3498db" />
                    <Text style={styles.subTitle}>Safety Status</Text>
                </View>
                <Text style={styles.text}>
                    {beachDetails.safety_status || 'No data available'}
                </Text>
                {beachDetails.safety_points && beachDetails.safety_points.length > 0 && (
                    <View style={styles.safetyPointsContainer}>
                        <Text style={styles.safetyPointsTitle}>Safety Points:</Text>
                        {beachDetails.safety_points.map((point, index) => renderSafetyPoint(point, index))}
                    </View>
                )}
            </View>

            {beachDetails.marine_conditions && (
                <View style={styles.detailContainer}>
                    <View style={styles.sectionHeader}>
                        <Icon name="water-outline" size={24} color="#3498db" />
                        <Text style={styles.subTitle}>Marine Conditions</Text>
                    </View>
                    {renderCondition("fish-outline", "Wave Height", beachDetails.marine_conditions.wave_height.value, beachDetails.marine_conditions.wave_height.unit)}
                    {renderCondition("compass-outline", "Wave Direction", beachDetails.marine_conditions.wave_direction.value, beachDetails.marine_conditions.wave_direction.unit)}
                    {renderCondition("timer-outline", "Wave Period", beachDetails.marine_conditions.wave_period.value, beachDetails.marine_conditions.wave_period.unit)}
                    {renderCondition("speedometer-outline", "Ocean Current Velocity", beachDetails.marine_conditions.ocean_current_velocity.value, beachDetails.marine_conditions.ocean_current_velocity.unit)}
                    <Text style={styles.lastUpdated}>Last updated: {formatDate(beachDetails.marine_conditions.timestamp)}</Text>
                </View>
            )}

            {beachDetails.weather_conditions && (
                <View style={styles.detailContainer}>
                    <View style={styles.sectionHeader}>
                        <Icon name="partly-sunny-outline" size={24} color="#3498db" />
                        <Text style={styles.subTitle}>Weather Conditions</Text>
                    </View>
                    {renderCondition("thermometer-outline", "Temperature", beachDetails.weather_conditions.temperature.value, beachDetails.weather_conditions.temperature.unit)}
                    {renderCondition("body-outline", "Feels Like", beachDetails.weather_conditions.feels_like.value, beachDetails.weather_conditions.feels_like.unit)}
                    {renderCondition("water-outline", "Humidity", beachDetails.weather_conditions.humidity.value, beachDetails.weather_conditions.humidity.unit)}
                    {renderCondition("cloud-outline", "Weather", beachDetails.weather_conditions.weather_description, '')}
                    {renderCondition("eye-outline", "Visibility", beachDetails.weather_conditions.visibility.value, beachDetails.weather_conditions.visibility.unit)}
                    {renderCondition("sunny-outline", "Sunrise", new Date(beachDetails.weather_conditions.sunrise).toLocaleTimeString(), '')}
                    {renderCondition("moon-outline", "Sunset", new Date(beachDetails.weather_conditions.sunset).toLocaleTimeString(), '')}
                    <Text style={styles.lastUpdated}>Last updated: {formatDate(beachDetails.weather_conditions.timestamp)}</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
    },
    imageContainer: {
        position: 'relative',
        borderRadius: 15,
        overflow: 'hidden',
        margin: 15,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 15,
    },
    overlay: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    safetyDot: {
        width: 10,
        height: 10,
        borderRadius: 6,
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'light',
        color: '#ffffff',
    },
    detailContainer: {
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#ffffff',
        elevation: 0.5,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#2c3e50',
    },
    text: {
        fontSize: 16,
        marginBottom: 8,
        color: '#34495e',
    },
    conditionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    conditionIcon: {
        marginRight: 10,
    },
    conditionText: {
        fontSize: 16,
        color: '#34495e',
    },
    lastUpdated: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 10,
        fontStyle: 'italic',
    },
    safetyPointsContainer: {
        marginTop: 10,
    },
    safetyPointsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    safetyPointRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    safetyPointIcon: {
        marginRight: 10,
        marginTop: 2,
    },
    safetyPointText: {
        fontSize: 16,
        color: '#34495e',
        flex: 1,
    },
});

export default BeachDetailsScreen;
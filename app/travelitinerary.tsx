import { useEffect, useState, useRef } from 'react';
import { Text, View, TouchableOpacity, Animated, StyleSheet, ImageBackground } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';

export default function TravelItinerary() {
    const { key, destination, startDate, endDate, selectedImage, title, data } = useLocalSearchParams();
    const [tripData, setTripData] = useState(null); // State to hold trip data
    const [isRefreshing, setIsRefreshing] = useState(false); // State to trigger refresh
    const [isMenuExpanded, setIsMenuExpanded] = useState(false); // Track whether the menu is expanded
    const animation = useRef(new Animated.Value(0)).current;
    console.log('tripData in travel itenary', JSON.stringify(tripData,null,2));
    console.log("data in travel iteinerrary", data)
    const toggleMenu = () => {
        setIsMenuExpanded(prevState => !prevState); // Toggle the expanded state

        Animated.timing(animation, {
            toValue: isMenuExpanded ? 0 : 1, // Animate based on whether the menu is expanded
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // Load trip data
    useEffect(() => {
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                setTripData(parsedData);
            } catch (error) {
                console.error('Failed to parse trip data:', error);
            }
        }
    }, [data]);

    // Refresh UI after data loads
    useEffect(() => {
        if (tripData) {
            setIsRefreshing(true);
            setTimeout(() => setIsRefreshing(false), 500); // Simulate a refresh delay
        }
    }, [tripData]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const tripTitle = tripData?.title || title;
    const tripDestination = tripData?.destination || destination;
    const imageUrl = tripData?.imageUrl || selectedImage;
    const tripStartDate = formatDate(tripData?.startDate || startDate);
    const tripEndDate = formatDate(tripData?.endDate || endDate);

    // Show a loading screen until trip data is available or while refreshing
    if (!tripData || isRefreshing) {
        return (
            <View style={styles.centered}>
                <Text>{isRefreshing ? 'Refreshing trip details...' : 'Loading trip details...'}</Text>
            </View>
        );
    }

    const options = [
        'Trip Highlights',
        'Packing List',
        'Outfits',
        'Transportation',
        'Restaurants',
        'Places to Explore',
        'Itinerary',
        'Hotels',
        'Flights',
        'Trip Overview',
    ];

    return (
        <ImageBackground
            source={{ uri: imageUrl }}
            style={{ flex: 1, justifyContent: 'center', padding: 20 }}
            imageStyle={{ opacity: 0.3 }}
        >
            <Text>{tripTitle}</Text>
            <View style={styles.optionsContainer}>
                {options.map((option, index) => (
                    <Animated.View
                        key={option}
                        style={[
                            styles.option,
                            {
                                transform: [
                                    {
                                        translateY: animation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -60 * (index + 1)],
                                        }),
                                    },
                                    { scale: animation },
                                ],
                                opacity: animation,
                            },
                        ]}
                    >
                        <Link
                            href={{
                                pathname: `/${option.replace(/\s+/g, '')}`,
                                params: { startDate, endDate, data, key },
                            }}
                            style={styles.linkButton}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                        </Link>
                    </Animated.View>
                ))}
                <TouchableOpacity style={styles.toggleButton} onPress={toggleMenu}>
                    <Text style={styles.toggleButtonText}>{isMenuExpanded ? 'X' : '+'}</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 10 }}>
                Travel Itinerary
            </Text>
            <Text>{`${tripStartDate} - ${tripEndDate}`}</Text>
            <Text>{tripDestination}</Text>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 250,
    },
    option: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    optionText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        flexWrap: 'wrap',
        width: '100%',
    },
    toggleButton: {
        backgroundColor: '#007bff',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: 10,
    },
    toggleButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    linkButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
    },
});

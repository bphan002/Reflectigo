import { Text, View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useState, useRef } from 'react';

export default function AboutScreen() {
    const { message } = useLocalSearchParams();
    const [expanded, setExpanded] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        // Toggle the expanded state
        setExpanded(!expanded);
        Animated.timing(animation, {
          toValue: expanded ? 0 : 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      };

    const options = [
        'Trip Overview',
        'Flights',
        'Hotel',
        'Itinerary',
        'Places to Explore',
        'Restaurants',
        'Transportation',
        'Outfits',
        'Packing List',
        'Trip Highlights',
    ];
    
    return (
        <>
            <View style={styles.container}>
                <Text>Travel Itinerary</Text>
            </View>

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
                        <TouchableOpacity style={styles.button} onPress={() => console.log(`${option} clicked`)}>
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}

                {/* Main toggle button */}
                <TouchableOpacity style={styles.toggleButton} onPress={toggleMenu}>
                    <Text style={styles.toggleButtonText}>{expanded ? 'X' : '+'}</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 30,
        right: 30,
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 250, // Limiting the width to test wrapping
    },
    option: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
    },
    optionText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        flexWrap: 'wrap', // Ensures text wraps inside the container
        width: '100%', // Make sure the text wraps when necessary
    },
    toggleButton: {
        backgroundColor: '#007bff',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        position: 'absolute', // Make it position absolute within the parent
        bottom: 0, // Align to bottom
        right: 0, // Align to right
        margin: 10, // Optional: add margin to give space from the edges
    },
    toggleButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

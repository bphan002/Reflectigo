import { Text, View, TouchableOpacity, Animated, StyleSheet, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Link } from 'expo-router';  // Import the Link component
import { useState, useRef } from 'react';

export default function TravelItinerary() {
    const { destination, startDate, endDate, selectedImage } = useLocalSearchParams();
    const [expanded, setExpanded] = useState(false);
    const [tripData, setTripData] = useState(null) //this will be what we get from DB

    //will be used once we implement database
    // useEffect(() => {
    //     if (!selectedImage) {
    //       // If no data in params, fetch from the database
    //       const fetchTripData = async () => {
    //         const docRef = doc(db, 'trips', 'user-trip-id');  // Fetch data for the user
    //         const docSnap = await getDoc(docRef);
    //         if (docSnap.exists()) {
    //           setTripData(docSnap.data());
    //         } else {
    //           console.log("No such document!");
    //         }
    //       };
    //       fetchTripData();
    //     }
    //   }, [selectedImage]);
    
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',  // 'short' will give the abbreviated month (e.g., Jan, Feb)
            day: 'numeric',  // Day of the month (e.g., 1, 2, 3)
            year: 'numeric', // Full year (e.g., 2024)
        });
    };
    const tripDestination = destination || tripData?.destination
    const imageUrl = selectedImage || tripData?.imageUrl; // Use param if available, otherwise fallback to database data
    const tripStartDate = formatDate(startDate) || tripData?.startDate;
    const tripEndDate = formatDate(endDate) || tripData?.endDate;
    
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
        <>
        <ImageBackground
      source={{ uri: selectedImage }} // Set the selected image as the background
      style={{ flex: 1, justifyContent: 'center', padding: 20 }}
      imageStyle={{ opacity: 0.3 }} // Optional: Make the background slightly transparent
    >


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
                        {/* Use Link for navigation */}
                        <Link href={`/${option.replace(/\s+/g, '')}`} style={styles.linkButton}>
                            <Text style={styles.optionText}>{option}</Text>
                        </Link>
                    </Animated.View>
                ))}

                {/* Main toggle button */}
                <TouchableOpacity style={styles.toggleButton} onPress={toggleMenu}>
                    <Text style={styles.toggleButtonText}>{expanded ? 'X' : '+'}</Text>
                </TouchableOpacity>
            </View>
            <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10
      }}>
        Travel Itinerary
      </Text>
      <Text>
        {`${tripStartDate} - ${tripEndDate}`}
      </Text>
      <Text>
        {destination}
      </Text>

            </ImageBackground>
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
    linkButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
    }
});

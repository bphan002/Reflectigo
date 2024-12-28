import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Transportation() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state

  // Function to load trips from AsyncStorage
  const loadTrips = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const tripKeys = allKeys.filter((key) => key.startsWith('trip_'));
  
      const tripDataArray = await AsyncStorage.multiGet(tripKeys);
      const trips = tripDataArray.map(([key, value]) => JSON.parse(value));
      
      return trips;
    } catch (error) {
      console.error('Error loading trips:', error);
      return [];
    }
  };

  // Load trips when the component mounts
  useEffect(() => {
    const fetchTrips = async () => {
      const tripsData = await loadTrips();
      setTrips(tripsData);
      setLoading(false);
    };
    fetchTrips();
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  // Display the first trip's image or fallback if no trips exist
  const trip = trips[0]; // Example: Show the first trip in the list
  console.log('what is trips????', trips)
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Transportation</Text>
      {trip && trip.imageUrl ? (
        <Image
          source={{ uri: trip.imageUrl }} // Use the URL to display the image
          style={{ width: 100, height: 100 }}
        />
      ) : (
        <Text style={styles.text}>No trips available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});

import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Index() {
  const [user, setUser] = useState('Billy');
  const [trips, setTrips] = useState([]);
  const router = useRouter();

  // Function to retrieve all trips from AsyncStorage
  const getAllTrips = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const tripKeys = allKeys.filter(key => key.startsWith('trip_')); // Filter only trip-related keys
      const tripData = await AsyncStorage.multiGet(tripKeys); // Retrieve all trips
      const trips = tripData.map(([key, value]) => ({
        key,
        data: JSON.parse(value),
      }));
      console.log('Retrieved Trips:', trips);
      return trips;
    } catch (error) {
      console.error('Error retrieving trips:', error);
      return [];
    }
  };

  // Function to delete a trip from AsyncStorage
  const deleteTrip = async (tripKey) => {
    try {
      // Remove the trip from AsyncStorage
      await AsyncStorage.removeItem(tripKey);
      
      // Update the state to remove the deleted trip from the list
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.key !== tripKey));

      console.log(`Trip ${tripKey} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  useEffect(() => {
    const fetchTrips = async () => {
      const retrievedTrips = await getAllTrips();
      setTrips(retrievedTrips);
    };
    fetchTrips();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>Hi {user},</Text>
        <Text style={styles.text}>Let's Travel!</Text>
        <Button label="Create new trip" onPress={() => router.push('/createnewtrip')} />
        <Text>Sample Trip Plan</Text>
      </View>
      <ScrollView>
        {trips.map((trip) => (
          <TouchableOpacity
            key={trip.key}
            onPress={() => router.push({ pathname: '/travelitinerary', params: { key: trip.key, data: JSON.stringify(trip.data) } })}
          >
            <View style={{ marginBottom: 10 }}>
              <Text>{trip.data.title}</Text>
              <Text>Destination: {trip.data.destination}</Text>
              <Text>Start Date: {trip.data.startDate}</Text>
              <Text>End Date: {trip.data.endDate}</Text>
              <Image
                source={{ uri: trip.data.imageUrl }}
                style={styles.tripImage}
                resizeMode="cover"
              />
              {/* Delete button for each trip */}
              <TouchableOpacity onPress={() => deleteTrip(trip.key)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
  tripImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

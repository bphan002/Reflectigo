import { Text, View, StyleSheet, ScrollView, Image } from 'react-native';
import { useState, useEffect } from 'react'
import Button from '@/components/Button';
import { useRouter, Link } from 'expo-router'; 
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [ user, setUser] = useState('Billy')
  const [trips, setTrips] = useState([]);
  const router = useRouter(); // Use useRouter for navigation
  //will need useEffect probably to get username
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
      <View key={trip.key} style={{ marginBottom: 10 }}>
        <Text>Destination: {trip.data.destination}</Text>
        <Text>Start Date: {trip.data.startDate}</Text>
        <Text>End Date: {trip.data.endDate}</Text>
        <Image
            source={{ uri: trip.data.imageUrl }}
            style={styles.tripImage}
            resizeMode="cover"
          />
      </View>
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
  /* @tutinfo Add the style of <CODE>fontSize</CODE>, <CODE>textDecorationLine</CODE>, and <CODE>color</CODE> to <CODE>Link</CODE> component. */
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
  tripContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  tripImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  tripDetails: {
    flex: 1,
  },
  destination: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

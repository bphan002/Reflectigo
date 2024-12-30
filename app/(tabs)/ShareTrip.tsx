import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image,TouchableOpacity } from 'react-native';
import { useEffect } from 'react'
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import db from '../firebaseConfig'; // Ensure this points to your Firebase config file
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShareTrip = ({ tripData }) => {
  const [trips, setTrips] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null)

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


  const handleShareTrip = async () => {
    if (!recipient.trim()) {
      Alert.alert('Error', 'Please enter a valid recipient.');
      return;
    }
    if (!selectedTrip) {
      Alert.alert('Error', 'Please select a trip to share.');
      return;
    }
  
    try {
      setIsLoading(true);
        console.log("selectedTrip", selectedTrip)
      // Create a new shared trip in Firebase under "trips"
      const sharedTripRef = collection(db, 'trips');
      console.log("sharedTripRef", sharedTripRef)
      const docRef = await addDoc(sharedTripRef, { 
        recipient,
        tripData: selectedTrip.data,
        sharedAt: new Date().toISOString(),    
    });
    
  
      Alert.alert('Success', `Trip successfully shared with ${recipient}!`);
      setRecipient(''); // Clear the input field
      setSelectedTrip(null); // Reset selected trip
    } catch (error) {
      Alert.alert('Error', `Failed to share trip: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Share Trip</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter recipient's email or username"
          value={recipient}
          onChangeText={setRecipient}
        />
        <Button
          title={isLoading ? 'Sending...' : 'Send'}
          onPress={handleShareTrip}
          disabled={isLoading || !selectedTrip}
        />
      </View>

      <ScrollView>
        {trips.map((trip) => (
          <TouchableOpacity
            key={trip.key}
            onPress={() => setSelectedTrip(trip)}
            style={[
              styles.tripContainer,
              selectedTrip?.key === trip.key && styles.selectedTrip, // Apply selected style
            ]}
          >
            <Image
              source={{ uri: trip.data.imageUrl }}
              style={styles.tripImage}
              resizeMode="cover"
            />
            <View style={styles.tripDetails}>
              <Text style={styles.destination}>{trip.data.destination}</Text>
              <Text>Start Date: {trip.data.startDate}</Text>
              <Text>End Date: {trip.data.endDate}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
};

export default ShareTrip;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
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
  selectedTrip: {
    backgroundColor: '#f0f8ff', // Highlight color for selected trip
    borderColor: '#add8e6', // Border color when selected
  },
});

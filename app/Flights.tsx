import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const airlineCodes = {
  "American Airlines": "AA",
  "Delta Air Lines": "DL",
  "United Airlines": "UA",
  "Southwest Airlines": "WN",
};

const FlightInput = () => {
  const [flights, setFlights] = useState([{ airline: '', flightNumber: '' }]);
  const [flightInfoList, setFlightInfoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { key, data } = useLocalSearchParams();

    // Save and load outfits from AsyncStorage
    useEffect(() => {
      const loadFlights = async () => {
        try {
          const savedFlights = await AsyncStorage.getItem(key);
          const parsedsavedFlights = JSON.parse(savedFlights);
          if (parsedsavedFlights?.outfits) {
            setFlights(parsedsavedFlights.outfits);
          }
        } catch (error) {
          console.error('Failed to load outfits:', error);
        }
      };
  
      loadFlights();
    }, [key]);
  
    useEffect(() => {
      const saveFlights = async () => {
        try {
          const existingTripData = await AsyncStorage.getItem(key);
          if (existingTripData) {
            const tripData = JSON.parse(existingTripData);
            tripData.flights = flights;
            if (tripData.flights) {
              console.log("what is tripData.flights becaue its hitting", tripData.flights)
              await AsyncStorage.setItem(key, JSON.stringify(tripData));
            }
          }
        } catch (error) {
          console.error('Failed to save outfits:', error);
        }
      };
  
      saveFlights();
    }, [flights]);

  const handleInputChange = (index, field, value) => {
    const updatedFlights = [...flights];
    updatedFlights[index][field] = value;
    setFlights(updatedFlights);
  };

  const addFlightInput = () => {
    setFlights([...flights, { airline: '', flightNumber: '' }]);
  };

  const fetchFlightDetails = async () => {
    setLoading(true);
    setError('');
    setFlightInfoList([]);

    try {
      const results = [];
      for (const flight of flights) {
        const airlineCode = airlineCodes[flight.airline.trim()];
        const flightNumber = flight.flightNumber.trim();

        if (!airlineCode || !flightNumber) {
          setError('Please enter valid airline and flight numbers for all entries.');
          setLoading(false);
          return;
        }

        const url = `https://api.aviationstack.com/v1/flights?access_key=YOUR_ACCESS_KEY&airline_iata=${airlineCode}&flight_iata=${flightNumber}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
          results.push(data.data[0]);
        } else {
          results.push({ error: `No flight info found for ${flight.airline} ${flight.flightNumber}` });
        }
      }
      setFlightInfoList(results);
    } catch (error) {
      console.error('Error fetching flight details:', error);
      setError('Failed to fetch flight details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Enter Your Flight Details</Text>

      {flights.map((flight, index) => (
        <View key={index} style={styles.flightInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Airline (e.g., Southwest Airlines)"
            value={flight.airline}
            onChangeText={(text) => handleInputChange(index, 'airline', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Flight Number (e.g., 100)"
            value={flight.flightNumber}
            onChangeText={(text) => handleInputChange(index, 'flightNumber', text)}
            keyboardType="numeric"
          />
        </View>
      ))}

      <Button title="Add Another Flight" onPress={addFlightInput} />
      <Button title="Get Flight Details" onPress={fetchFlightDetails} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {flightInfoList.length > 0 && (
        <View style={styles.flightInfoList}>
          <Text style={styles.infoHeader}>Flight Information</Text>
          {flightInfoList.map((info, index) => (
            <View key={index} style={styles.flightInfo}>
              {info.error ? (
                <Text style={styles.error}>{info.error}</Text>
              ) : (
                <>
                  <Text>Airline: {info.airline.name}</Text>
                  <Text>Flight Number: {info.flight.iata}</Text>
                  <Text>Departure: {info.departure.scheduled}</Text>
                  <Text>Arrival: {info.arrival.scheduled}</Text>
                  <Text>Status: {info.flight_status}</Text>
                </>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  flightInputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  loading: {
    marginVertical: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  flightInfoList: {
    marginTop: 20,
  },
  flightInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  infoHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default FlightInput;

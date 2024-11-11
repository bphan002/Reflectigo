import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';

// Example dictionary of airline names to IATA codes
const airlineCodes = {
  "American Airlines": "AA",
  "Delta Air Lines": "DL",
  "United Airlines": "UA",
  "Southwest Airlines": "WN", // Added Southwest Airlines
  // Add more airlines as needed
};

const FlightInput = () => {
  const [airline, setAirline] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [flightInfo, setFlightInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAirlineChange = (text) => setAirline(text);
  const handleFlightNumberChange = (text) => setFlightNumber(text);

  const fetchFlightDetails = async (airlineCode, flightNumber) => {
    console.log("airline code", airlineCode, 'flightNumber', flightNumber)
    const accessToken = '/////';
    const url = `https://api.aviationstack.com/v1/flights?access_key=${accessToken}&airline_iata=${airlineCode}&flight_iata=${flightNumber}`;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        console.log("Flight details:", data.data[0]);
        setFlightInfo(data.data[0]);
      } else {
        setError("No flight information found.");
      }
    } catch (error) {
      console.error("Error fetching flight details:", error);
      setError("Failed to fetch flight details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    // Convert the airline name to its IATA code
    const airlineCode = airlineCodes[airline.trim()];

    if (airlineCode && flightNumber) {
      // Fetch flight details with the airline IATA code and flight number
      fetchFlightDetails(airlineCode, flightNumber);
    } else {
      setError('Please enter a valid airline and flight number');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Your Flight Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Airline (e.g., Southwest Airlines)"
        value={airline}
        onChangeText={handleAirlineChange}
      />

      <TextInput
        style={styles.input}
        placeholder="Flight Number (e.g., 100)"
        value={flightNumber}
        onChangeText={handleFlightNumberChange}
        keyboardType="numeric"
      />

      <Button title="Get Flight Details" onPress={handleSubmit} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {flightInfo && (
        <View style={styles.flightInfo}>
          <Text style={styles.infoHeader}>Flight Information</Text>
          <Text>Airline: {flightInfo.airline.name}</Text>
          <Text>Flight Number: {flightInfo.flight.iata}</Text>
          <Text>Departure: {flightInfo.departure.scheduled}</Text>
          <Text>Arrival: {flightInfo.arrival.scheduled}</Text>
          <Text>Status: {flightInfo.flight_status}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
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
  flightInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  infoHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default FlightInput;

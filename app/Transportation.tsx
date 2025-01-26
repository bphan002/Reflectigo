import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // For transportation icons

export default function Transportation() {
  const { key, data } = useLocalSearchParams();
  const [transportation, setTransportation] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null); // Selected transportation method
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  console.log('data', data)
  // Load transportation data
  useEffect(() => {
    const loadTransportation = async () => {
      try {
        const savedTrip = await AsyncStorage.getItem(key);
        const parsedSavedTrip = JSON.parse(savedTrip);
        if (parsedSavedTrip?.transportation) {
          setTransportation(parsedSavedTrip.transportation);
        }
      } catch (error) {
        console.error('Failed to load transportation', error);
      }
    };
    loadTransportation();
  }, [key]);

  // Save transportation data
  useEffect(() => {
    const saveTransportation = async () => {
      try {
        const existingTripData = await AsyncStorage.getItem(key);
        if (existingTripData) {
          const tripData = JSON.parse(existingTripData);
          tripData.transportation = transportation;
          await AsyncStorage.setItem(key, JSON.stringify(tripData));
          console.log('Transportation data overwritten successfully!');
        }
      } catch (error) {
        console.error('Failed to save transportation', error);
      }
    };
    saveTransportation();
  }, [transportation, key]);

  // Handle method selection
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  // Save inputs
  const handleSave = () => {
    const newEntry = { method: selectedMethod, to, from, date, time };
    setTransportation((prev) => [...prev, newEntry]);
    setSelectedMethod(null);
    setTo('');
    setFrom('');
    setDate('');
    setTime('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transportation</Text>
  
      {/* Display Existing Transportation Data */}
      {transportation.length > 0 && (
        <View style={styles.existingDataContainer}>
          <Text style={styles.subtitle}>Existing Transportation Records:</Text>
          {transportation.map((entry, index) => (
            <View key={index} style={styles.record}>
              <Text>Method: {entry.method}</Text>
              <Text>To: {entry.to}</Text>
              <Text>From: {entry.from}</Text>
              <Text>Date: {entry.date}</Text>
              <Text>Time: {entry.time}</Text>
            </View>
          ))}
        </View>
      )}
  
      {/* Transportation Method Selection */}
      {!selectedMethod && (
        <View style={styles.iconContainer}>
          {['bus', 'train', 'car'].map((method) => (
            <TouchableOpacity
              key={method}
              style={styles.iconButton}
              onPress={() => handleMethodSelect(method)}
            >
              <Ionicons name={`md-${method}`} size={40} color="blue" />
              <Text style={styles.iconText}>{method.charAt(0).toUpperCase() + method.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
  
      {/* Input Fields for Selected Method */}
      {selectedMethod && (
        <View style={styles.inputContainer}>
          <Text style={styles.subtitle}>{selectedMethod.toUpperCase()}</Text>
          <TextInput
            style={styles.input}
            placeholder="To"
            value={to}
            onChangeText={setTo}
          />
          <TextInput
            style={styles.input}
            placeholder="From"
            value={from}
            onChangeText={setFrom}
          />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Time (HH:MM)"
            value={time}
            onChangeText={setTime}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
  
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

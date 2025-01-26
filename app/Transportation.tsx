import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Transportation() {
  const { key } = useLocalSearchParams();
  const [transportation, setTransportation] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [editIndex, setEditIndex] = useState(null); // Track the record being edited

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

  // Save new or edited record
  const handleSave = () => {
    const newEntry = { method: selectedMethod, to, from, date, time };
    if (editIndex !== null) {
      // Edit existing record
      const updatedTransportation = [...transportation];
      updatedTransportation[editIndex] = newEntry;
      setTransportation(updatedTransportation);
      setEditIndex(null);
    } else {
      // Add new record
      setTransportation((prev) => [...prev, newEntry]);
    }
    resetForm();
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditIndex(null);
    resetForm();
  };

  // Populate input fields for editing
  const handleEdit = (index) => {
    const record = transportation[index];
    setSelectedMethod(record.method);
    setTo(record.to);
    setFrom(record.from);
    setDate(record.date);
    setTime(record.time);
    setEditIndex(index);
  };

  // Reset input fields
  const resetForm = () => {
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
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(index)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Transportation Method Selection */}
      {!selectedMethod && editIndex === null && (
        <View style={styles.iconContainer}>
          {['bus', 'train', 'car'].map((method) => (
            <TouchableOpacity
              key={method}
              style={styles.iconButton}
              onPress={() => handleMethodSelect(method)}
            >
              <Ionicons name={`md-${method}`} size={40} color="blue" />
              <Text style={styles.iconText}>
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Input Fields for Selected Method */}
      {(selectedMethod || editIndex !== null) && (
        <View style={styles.inputContainer}>
          <Text style={styles.subtitle}>{selectedMethod?.toUpperCase() || transportation[editIndex]?.method.toUpperCase()}</Text>
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
          {editIndex !== null && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // (styles remain unchanged; add styles for cancel button if needed)
  cancelButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

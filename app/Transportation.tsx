import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Transportation() {
  const { key } = useLocalSearchParams();
  const [transportation, setTransportation] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [editIndex, setEditIndex] = useState(null); // Track the record being edited
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);


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

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time; // If selectedTime is undefined, use the previous time
    setShowTimePicker(false); // Hide the picker after selecting time
    setTime(currentTime); // Set the selected time
  };
  
  const handleTimePickerDisplay = () => {
    setShowDatePicker(showTimePicker);
  };
  

  const showCalendar = () => setShowDatePicker(true);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transportation Methods</Text>

      {/* Transportation Method Selection */}
      {!selectedMethod && editIndex === null && (
        <View style={styles.iconContainer}>
          {['bus', 'train', 'car', 'bicycle', 'walk', 'boat'].map((method) => (
            <TouchableOpacity
              key={method}
              style={styles.iconButton}
              onPress={() => handleMethodSelect(method)}
            >
              <Ionicons name={`${method}`} size={40} color="blue" />
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
    <Text style={styles.subtitle}>
      {selectedMethod?.toUpperCase() || transportation[editIndex]?.method.toUpperCase()}
    </Text>
    
    <View style={styles.datePickerContainer}>
  <TouchableOpacity style={styles.datePicker} onPress={showCalendar}>
    <Text style={styles.datePickerText}>
      Select Date: {date.toISOString().split('T')[0]}
    </Text>
  </TouchableOpacity>
  {showDatePicker && (
    <DateTimePicker
      value={date}
      mode="date"
      display="default"
      onChange={handleDateChange}
    />
  )}
</View>

    <View style={styles.inputGroup}>
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
      </View>



      <View style={styles.timeDisplayContainer}>
  <Text style={styles.timeText}>
    Selected Time: {time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time selected'}
  </Text>
  <TouchableOpacity style={styles.datePicker} onPress={handleTimePickerDisplay}>
    <Text style={styles.datePickerText}>
      {time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pick Time'}
    </Text>
  </TouchableOpacity>
</View>

{showTimePicker && (
  <DateTimePicker
    value={time}
    mode="time"
    display="default"
    onChange={handleTimeChange}
  />
)}



    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
      <Text style={styles.saveButtonText}>Save</Text>
    </TouchableOpacity>
    {editIndex === null && (
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setSelectedMethod(null)}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    )}
    {editIndex !== null && (
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    )}
  </View>
)}

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
    </View>

    
  );
}

const styles = StyleSheet.create({
  timeDisplayContainer: {
    marginBottom: 15, // Add spacing below the time container
  },
  timeText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  inputContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 10,
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
iconContainer: {
  flexDirection: 'row', // Arrange items in a horizontal row
  justifyContent: 'space-around', // Space out the icons evenly
  alignItems: 'center', // Center items vertically
  marginVertical: 20, // Add spacing above and below the row
},
datePickerContainer: {
  marginBottom: 15, // Add spacing below the container
  alignItems: 'flex-start', // Align the text and button to the start
},
datePicker: {
  padding: 10,
  backgroundColor: '#f0f0f0',
  borderRadius: 5,
},
datePickerText: {
  color: '#333',
  fontSize: 16,
},
});

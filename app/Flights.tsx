import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FlightInput = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { key } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const loadFlights = async () => {
      try {
        const stored = await AsyncStorage.getItem(key);
        const parsed = stored ? JSON.parse(stored) : {};
        if (parsed?.flights) {
          setFlights(parsed.flights.map(f => ({ ...f, isEditing: false })));
        }
      } catch (e) {
        console.error('Load error', e);
      }
    };
    loadFlights();
  }, [key]);

  const addFlight = () => {
    setFlights(prev => [
      ...prev,
      { airline: '', flightNumber: '', isEditing: true },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...flights];
    updated[index][field] = value;
    setFlights(updated);
  };

  const saveFlight = (index) => {
    const updated = [...flights];
    updated[index].isEditing = false;
    setFlights(updated);
  };

  const editFlight = (index) => {
    const updated = [...flights];
    updated[index].isEditing = true;
    setFlights(updated);
  };

  const deleteFlight = (index) => {
    const updated = [...flights];
    updated.splice(index, 1);
    setFlights(updated);
  };

  const completeFlights = async () => {
    try {
      const stored = await AsyncStorage.getItem(key);
      const parsed = stored ? JSON.parse(stored) : {};
      parsed.flights = flights.map(({ isEditing, ...rest }) => rest);
      await AsyncStorage.setItem(key, JSON.stringify(parsed));
      alert('Flights saved!');
      router.back();
    } catch (e) {
      console.error('Save error', e);
      alert('Failed to save flights.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Flights</Text>

      {flights.length === 0 ? (
        <Text style={styles.placeholder}>No flight information has been saved</Text>
      ) : (
        flights.map((flight, index) => (
          <View key={index} style={styles.card}>
            {flight.isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Airline (e.g., Delta)"
                  value={flight.airline}
                  onChangeText={(text) => handleChange(index, 'airline', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Flight Number (e.g., 123)"
                  value={flight.flightNumber}
                  onChangeText={(text) => handleChange(index, 'flightNumber', text)}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => saveFlight(index)}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.itemText}>
                  ✈️ {flight.airline} {flight.flightNumber}
                </Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => editFlight(index)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteFlight(index)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        ))
      )}

      <TouchableOpacity style={styles.addButton} onPress={addFlight}>
        <Text style={styles.addButtonText}>+ Add Flight</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.completeButton} onPress={completeFlights}>
        <Text style={styles.completeButtonText}>Complete Flights</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  placeholder: { textAlign: 'center', color: '#777', fontSize: 16, marginBottom: 20 },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  itemText: { fontSize: 16, marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#17a2b8',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  completeButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  completeButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});

export default FlightInput;

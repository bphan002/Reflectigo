import { GOOGLE_API_KEY } from '@env';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function PlacesToExplore() {
  const [places, setPlaces] = useState([]);
  const [place, setPlace] = useState('');
  const [note, setNote] = useState('');
  const [editIndex, setEditIndex] = useState(null); // To keep track of the place being edited

  // Function to add or update a place in the list
  const handleAddPlace = () => {
    if (!place || !note) {
      Alert.alert('Please enter both a place and a note');
      return;
    }

    // If editing, update the existing place
    if (editIndex !== null) {
      const updatedPlaces = [...places];
      updatedPlaces[editIndex] = { id: Date.now(), place, note }; // Replace the place at the editIndex
      setPlaces(updatedPlaces);
      setEditIndex(null); // Reset editIndex after updating
    } else {
      // Otherwise, add a new place to the list
      const newPlace = { id: Date.now(), place, note };
      setPlaces((prevPlaces) => [...prevPlaces, newPlace]);
    }

    // Clear the note and place inputs after adding/updating
    setPlace('');  // Reset the place input field
    setNote('');   // Reset the note input field
    console.log('place', place)
    console.log('note', note)
  };

  // Function to handle editing a place
  const handleEditPlace = (index) => {
    setPlace(places[index].place);
    setNote(places[index].note);
    setEditIndex(index); // Set the index to be edited
  };

  // Function to handle deleting a place
  const handleDeletePlace = (index) => {
    const updatedPlaces = places.filter((_, i) => i !== index); // Remove place by index
    setPlaces(updatedPlaces);
  };

  // Render each place item with edit and delete buttons
  const renderPlace = ({ item, index }) => (
    <View style={styles.placeContainer}>
      <Text style={styles.text}>{item.place}</Text>
      <Text style={styles.text}>{item.note}</Text>

      {/* Edit and Delete buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleEditPlace(index)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleDeletePlace(index)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Places to Explore</Text>

      {/* Google Places Autocomplete for place */}
      <GooglePlacesAutocomplete
        placeholder="Enter place"
        value={place}
        onChangeText={(text) => setPlace(text)}  // Use onChangeText to update the place as user types
        onPress={(data) => {
          setPlace(data.description); // Set the place when a user selects from the list
        }}
        query={{
          key: `${GOOGLE_API_KEY}`, // Replace with your actual Google API key
          language: 'en',
          types: 'establishment',
        }}
        styles={{
          textInput: styles.textInput,
          container: styles.inputContainer,
        }}
      />

      {/* Note input */}
      <TextInput
        placeholder="Enter a note"
        value={note}
        onChangeText={setNote}
        style={styles.textInput}
      />

      {/* Add/Update Place button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddPlace}>
        <Text style={styles.addButtonText}>{editIndex === null ? '+ Add Place' : 'Update Place'}</Text>
      </TouchableOpacity>

      {/* Display the list of places */}
      <FlatList
        data={places}
        renderItem={renderPlace}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 20 }}
      />
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
    textAlign: 'center',
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  text: {
    fontSize: 16,
  },
});

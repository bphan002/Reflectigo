import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GOOGLE_API_KEY } from '@env';


export default function Hotel() {
  const [lodgings, setLodgings] = useState([
    { id: Date.now(), hotel: '', startDate: new Date(), endDate: new Date(), isEditing: true },
  ]);

  const [isPickerVisible, setPickerVisible] = useState({ id: null, type: '' });

  // Open the date picker
  const showPicker = (id, type) => setPickerVisible({ id, type });
  const hidePicker = () => setPickerVisible({ id: null, type: '' });

  // Handle date selection
  const handleDateChange = (id, type, date) => {
    setLodgings((prevLodgings) =>
      prevLodgings.map((l) =>
        l.id === id ? { ...l, [type]: date } : l
      )
    );
    hidePicker();
  };

  // Add new lodging entry
  const addLodging = () => {
    setLodgings((prevLodgings) => [
      ...prevLodgings,
      { id: Date.now(), hotel: '', startDate: new Date(), endDate: new Date(), isEditing: true }, 
    ]);
  };

  // Update the selected hotel name
  const updateHotel = (id, hotelName) => {
    setLodgings((prevLodgings) =>
      prevLodgings.map((l) =>
        l.id === id ? { ...l, hotel: hotelName } : l
      )
    );
  };

  // Complete lodging saving (just a placeholder function)
  const completeLodging = (lodging) => {
    console.log('Saving lodging to database:', lodging);
    alert(`Lodging for ${lodging.hotel} saved!`);
  };

  // Toggle editing mode for a lodging entry
  const toggleEdit = (id) => {
    setLodgings((prevLodgings) =>
      prevLodgings.map((l) =>
        l.id === id ? { ...l, isEditing: !l.isEditing } : l
      )
    );
  };

  // Delete a lodging entry
  const deleteLodging = (id) => {
    setLodgings((prevLodgings) => prevLodgings.filter((l) => l.id !== id));
  };

  // Render each lodging item
  const renderLodging = ({ item }) => (
    <View style={styles.lodgingContainer}>
      {item.isEditing ? (
        <>
          {/* Google Places Autocomplete */}
          <GooglePlacesAutocomplete
            placeholder="Enter hotel name"
            value={item.hotel}
            onPress={(data, details = null) => {
              updateHotel(item.id, data.description);
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: 'en',
              types: 'establishment',
            }}
            fetchDetails={true}
            styles={{
              textInput: styles.textInput,
              container: styles.inputContainer,
            }}
            debounce={200}
          />
          <Button title="Select Start Date" onPress={() => showPicker(item.id, 'startDate')} />
          <Button title="Select End Date" onPress={() => showPicker(item.id, 'endDate')} />
          <Text style={styles.text}>Start Date: {item.startDate.toDateString()}</Text>
          <Text style={styles.text}>End Date: {item.endDate.toDateString()}</Text>
          <Button title="Save Changes" onPress={() => toggleEdit(item.id)} />
        </>
      ) : (
        <>
          <Text style={styles.text}>Selected Place: {item.hotel || "Not Selected"}</Text>
          <Text style={styles.text}>Start Date: {item.startDate.toDateString()}</Text>
          <Text style={styles.text}>End Date: {item.endDate.toDateString()}</Text>
      
          {item.hotel && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => toggleEdit(item.id)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteLodging(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => completeLodging(item)}
      >
        <Text style={styles.completeButtonText}>Complete Lodging</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Lodging</Text>
      <FlatList
        data={lodgings}
        renderItem={renderLodging}
        keyExtractor={(item) => item.id.toString()}
        style={{ width: '100%' }}
      />
      <TouchableOpacity style={styles.addButton} onPress={addLodging}>
        <Text style={styles.addButtonText}>+ Add Another Lodging</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isPickerVisible.id !== null}
        mode="date"
        onConfirm={(date) => handleDateChange(isPickerVisible.id, isPickerVisible.type, date)}
        onCancel={hidePicker}
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  lodgingContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#ffc107',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Transportation() {
  const { key } = useLocalSearchParams();
  const [transportation, setTransportation] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [date, setDate] = useState(new Date());
  const [departureTime, setDepartureTime] = useState(new Date());
  const [arrivalTime, setArrivalTime] = useState(new Date());
  const [timePickerMode, setTimePickerMode] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState(""); // Notes state

  useEffect(() => {
    const loadTransportation = async () => {
      try {
        const savedTrip = await AsyncStorage.getItem(key);
        const parsedSavedTrip = JSON.parse(savedTrip);
        if (parsedSavedTrip?.transportation) {
          setTransportation(parsedSavedTrip.transportation);
        }
      } catch (error) {
        console.error("Failed to load transportation", error);
      }
    };
    loadTransportation();
  }, [key]);

  useEffect(() => {
    const saveTransportation = async () => {
      try {
        const existingTripData = await AsyncStorage.getItem(key);
        if (existingTripData) {
          const tripData = JSON.parse(existingTripData);
          tripData.transportation = transportation;
          await AsyncStorage.setItem(key, JSON.stringify(tripData));
          console.log("Transportation data saved!");
        }
      } catch (error) {
        console.error("Failed to save transportation", error);
      }
    };
    saveTransportation();
  }, [transportation, key]);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleSave = () => {
    const newEntry = {
      method: selectedMethod,
      to,
      from,
      date,
      departureTime,
      arrivalTime,
      notes, // Save notes along with other data
    };
    if (editIndex !== null) {
      const updated = [...transportation];
      updated[editIndex] = newEntry;
      setTransportation(updated);
      setEditIndex(null);
    } else {
      setTransportation((prev) => [...prev, newEntry]);
    }
    resetForm();
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    resetForm();
  };

  const handleEdit = (index) => {
    const record = transportation[index];
    setSelectedMethod(record.method);
    setTo(record.to);
    setFrom(record.from);
    setDate(new Date(record.date));
    setDepartureTime(new Date(record.departureTime));
    setArrivalTime(new Date(record.arrivalTime));
    setNotes(record.notes); // Set notes from the existing record
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedTransportation = transportation.filter((_, i) => i !== index);
    setTransportation(updatedTransportation);
  };

  const resetForm = () => {
    setSelectedMethod(null);
    setTo("");
    setFrom("");
    setDate(new Date());
    setDepartureTime(new Date());
    setArrivalTime(new Date());
    setNotes(""); // Reset notes
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      if (timePickerMode === "departure") {
        setDepartureTime(selectedTime);
      } else if (timePickerMode === "arrival") {
        setArrivalTime(selectedTime);
      }
    }
    setShowTimePicker(false);
    setTimePickerMode(null);
  };

  const showCalendar = () => setShowDatePicker(true);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transportation Methods</Text>

      {!selectedMethod && editIndex === null && (
        <View style={styles.iconContainer}>
          {["bus", "train", "car", "bicycle", "walk", "boat"].map((method) => (
            <TouchableOpacity
              key={method}
              style={styles.iconButton}
              onPress={() => handleMethodSelect(method)}
            >
              <Ionicons name={method} size={40} color="blue" />
              <Text style={styles.iconText}>
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {(selectedMethod || editIndex !== null) && (
        <View style={styles.inputContainer}>
          <Text style={styles.subtitle}>
            {selectedMethod?.toUpperCase() ||
              transportation[editIndex]?.method.toUpperCase()}
          </Text>

          <View style={styles.datePickerContainer}>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={showCalendar}
            >
              <Text style={styles.datePickerText}>
                Select Date: {date.toISOString().split("T")[0]}
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
              Departure Time:{" "}
              {departureTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => {
                setTimePickerMode("departure");
                setShowTimePicker(true);
              }}
            >
              <Text style={styles.datePickerText}>Set Departure Time</Text>
            </TouchableOpacity>

            <Text style={[styles.timeText, { marginTop: 10 }]}>
              Arrival Time:{" "}
              {arrivalTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => {
                setTimePickerMode("arrival");
                setShowTimePicker(true);
              }}
            >
              <Text style={styles.datePickerText}>Set Arrival Time</Text>
            </TouchableOpacity>
          </View>

          {["train", "bus", "boat"].includes(selectedMethod) && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.notesInput]} // Added notesInput style
                placeholder="Enter any details..."
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>
          )}

          {showTimePicker && (
            <DateTimePicker
              value={
                timePickerMode === "departure" ? departureTime : arrivalTime
              }
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          {editIndex === null ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedMethod(null)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {transportation.length > 0 && (
        <View style={styles.existingDataContainer}>
          <Text style={styles.subtitle}>Existing Transportation Records:</Text>
          {transportation.map((entry, index) => (
            <View key={index} style={styles.record}>
              <Text>Method: {entry.method}</Text>
              <Text>To: {entry.to}</Text>
              <Text>From: {entry.from}</Text>
              <Text>Date: {new Date(entry.date).toLocaleDateString()}</Text>
              <Text>
                Departure:{" "}
                {new Date(entry.departureTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text>
                Arrival:{" "}
                {new Date(entry.arrivalTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text>Notes: {entry.notes}</Text> {/* Display Notes */}
              <View style={styles.recordButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(index)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(index)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  iconButton: {
    alignItems: "center",
  },
  iconText: {
    marginTop: 5,
    fontSize: 14,
  },
  inputContainer: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    elevation: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  inputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 5,
  },
  datePickerContainer: {
    marginBottom: 15,
  },
  datePicker: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginTop: 5,
  },
  datePickerText: {
    color: "#333",
    fontSize: 16,
  },
  timeDisplayContainer: {
    marginBottom: 15,
  },
  timeText: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 5,
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 10,
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  record: {
    padding: 10,
    marginVertical: 5,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
  },
  editButton: {
    marginTop: 5,
    backgroundColor: "#FFC107",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  editButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  deleteButton: {
    marginTop: 5,
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  recordButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  notesInput: {
    height: 120, // Larger height for the text input
    textAlignVertical: "top", // Aligns text to the top of the input box
    fontSize: 16, // Match the font size to that of the time text
  },
});

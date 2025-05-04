import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { GOOGLE_API_KEY } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useLocalSearchParams, useRouter } from "expo-router"

export default function Hotel() {
  const router = useRouter()
  const { key, data } = useLocalSearchParams()
  const parsedData = JSON.parse(data || "{}") // Parsing 'data' to handle possible undefined
  const { startDate, endDate } = parsedData || {}

  const [lodgings, setLodgings] = useState([
    {
      id: Date.now(),
      hotel: "",
      startDate: new Date(),
      endDate: new Date(),
      isEditing: true,
      isPlaceValid: true, // Adding this to track if place name is valid
    },
  ])
  const [isPickerVisible, setPickerVisible] = useState({ id: null, type: "" })
  const [errorMessage, setErrorMessage] = useState("")

  const showPicker = (id, type) => setPickerVisible({ id, type })
  const hidePicker = () => setPickerVisible({ id: null, type: "" })

  const handleDateChange = (id, type, date) => {
    setLodgings((prevLodgings) =>
      prevLodgings.map((l) => (l.id === id ? { ...l, [type]: date } : l))
    )
    hidePicker()
  }

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const savedTrip = await AsyncStorage.getItem(key)
        const parsedSavedTrip = JSON.parse(savedTrip)
        if (parsedSavedTrip?.lodgings) {
          // Ensure startDate and endDate are converted to Date objects
          const updatedLodgings = parsedSavedTrip.lodgings.map((l) => ({
            ...l,
            startDate: new Date(l.startDate),
            endDate: new Date(l.endDate),
          }))
          setLodgings(updatedLodgings)
        }
      } catch (error) {
        console.error("Failed to load hotels:", error)
      }
    }
    loadHotels()
  }, [key])

  const addLodging = () => {
    const newLodging = {
      id: Date.now(), // Make sure the id is unique
      hotel: "", // Empty hotel name
      inputValue: "", // Empty input value for the user to type
      startDate: new Date(),
      endDate: new Date(),
      isEditing: true, // Start in editing mode
      isPlaceValid: true,
    }

    // Add the new lodging to the lodgings array
    setLodgings((prevLodgings) => [...prevLodgings, newLodging])
  }

  const updateHotel = (id, hotelName) => {
    setLodgings((prevLodgings) =>
      prevLodgings.map((l) =>
        l.id === id
          ? { ...l, hotel: hotelName, isPlaceValid: hotelName !== "" }
          : l
      )
    )
    if (hotelName === "") {
      setErrorMessage("Place name is required!")
    } else {
      setErrorMessage("")
    }
  }

  const toggleEdit = (id) => {
    setLodgings((prevLodgings) =>
      prevLodgings.map((l) =>
        l.id === id ? { ...l, isEditing: !l.isEditing } : l
      )
    )
  }

  const deleteLodging = (id) => {
    setLodgings((prevLodgings) => prevLodgings.filter((l) => l.id !== id))
  }

  const completeLodging = async () => {
    // Check if all lodging items have valid hotel names
    const allValid = lodgings.every((lodging) => lodging.hotel.trim() !== "")
    if (!allValid) {
      setErrorMessage("All lodging entries must have a valid place name.")
      return
    }

    try {
      const existingTripData = await AsyncStorage.getItem(key)
      const tripData = JSON.parse(existingTripData) || {}
      tripData.lodgings = lodgings

      await AsyncStorage.setItem(key, JSON.stringify(tripData))
      alert("All lodgings have been saved!")
      router.back()
    } catch (error) {
      console.error("Failed to save lodgings:", error)
      alert("An error occurred while saving. Please try again.")
    }
  }


  /*
	const goToTravelItinerary = (tripData) => {
		router.push({
			pathname: "/travelitinerary",
			params: {
        data: JSON.stringify(tripData)
      }
		})
	}
  */

  const renderLodging = ({ item }) => (
    <View style={styles.lodgingContainer}>
      {item.isEditing ? (
        <>
          <TextInput
            style={styles.textInput}
            value={item.hotel}
            onChangeText={(text) => updateHotel(item.id, text)}
            placeholder="Enter hotel name"
          />
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          <Button
            title="Select Start Date"
            onPress={() => showPicker(item.id, "startDate")}
          />
          <Button
            title="Select End Date"
            onPress={() => showPicker(item.id, "endDate")}
          />
          <Text style={styles.text}>
            Start Date: {item.startDate.toDateString()}
          </Text>
          <Text style={styles.text}>
            End Date: {item.endDate.toDateString()}
          </Text>
          <Button
            title="Save Changes"
            onPress={() => toggleEdit(item.id)}
            disabled={!item.hotel || item.hotel.trim() === ""}
            style={styles.saveButton}
          />
        </>
      ) : (
        <>
          <Text style={styles.text}>
            Selected Place: {item.hotel || "Not Selected"}
          </Text>
          <Text style={styles.text}>
            Start Date: {item.startDate.toDateString()}
          </Text>
          <Text style={styles.text}>
            End Date: {item.endDate.toDateString()}
          </Text>
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
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Lodging</Text>
      {lodgings.length === 0 ? (
        <Text style={styles.text}>No lodging added yet</Text>
      ) : (
        <FlatList
          data={lodgings}
          renderItem={renderLodging}
          keyExtractor={(item) => item.id.toString()}
          style={{ width: "100%" }}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={addLodging}>
        <Text style={styles.addButtonText}>+ Add Lodging</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.completeButton}
        onPress={completeLodging}
      >
        <Text style={styles.completeButtonText}>Complete Lodging</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isPickerVisible.id !== null}
        mode="date"
        onConfirm={(date) =>
          handleDateChange(isPickerVisible.id, isPickerVisible.type, date)
        }
        onCancel={hidePicker}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  lodgingContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  completeButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#ffc107",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
})
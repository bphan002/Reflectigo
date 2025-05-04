import { useState } from "react"
import {
	View,
	Text,
	Alert,
	Image,
	TouchableOpacity,
	ScrollView,
	TextInput,
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import * as ImagePicker from "expo-image-picker"
import Button from "@/components/Button"
import { useRouter } from "expo-router"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { GOOGLE_API_KEY } from "@env"
import db from "../firebaseConfig"
import { getFirestore } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { v4 as uuidv4 } from "uuid"

export default function CreateTrip() {
	const router = useRouter()
	const [title, setTitle] = useState("")
	const [destination, setDestination] = useState("")
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(new Date())
	const [photos, setPhotos] = useState([]) // Store photos from Google Places API
	const [placeImage, setPlaceImage] = useState(null) // Single source of truth for image selection

	const fetchPlaceDetails = async (placeId) => {
		try {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`
			)
			const data = await response.json()

			if (data.result && data.result.photos) {
				setPhotos(data.result.photos)
				console.log("Place photos:", data.result.photos)
			} else {
				alert("No photos available for this location.")
			}
		} catch (error) {
			console.error("Error fetching place details:", error)
			alert("Failed to load photos.")
		}
	}

	const pickImageAsync = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync()
		if (!permissionResult.granted) {
			Alert.alert(
				"Permission required",
				"Please allow access to select images."
			)
			return
		}

		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			quality: 1,
		})

		if (!result.canceled) {
			setPlaceImage(result.assets[0].uri) // Set the local image URI
			console.log("Selected Image URI:", result.assets[0].uri)
		} else {
			alert("You did not select any image.")
		}
	}

	const handleGoogleImageSelect = (imageUrl) => {
		setPlaceImage(imageUrl) // Set Google image URL
		console.log("Google Image URL selected:", imageUrl)
	}

	const saveTrip = async () => {
		try {
			const tripKey = `trip_${uuidv4()}`

			const tripData = {
				title,
				destination,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
				imageUrl: placeImage, // Single source of truth for the image
			}

			// Save the trip details locally
			await AsyncStorage.setItem(tripKey, JSON.stringify(tripData))
			Alert.alert(
				"Trip Saved",
				"Your trip has been successfully saved locally!"
			)

			// Navigate to the travel itinerary page
			goToTravelItinerary(tripData)
		} catch (error) {
			console.error("Error saving trip:", error)
			Alert.alert("Error", "Failed to save the trip locally.")
		}
	}

	const handleConfirmStart = (e) => {
		const selectedDate = new Date(e.nativeEvent.timestamp)
		setStartDate(selectedDate)
	}

	const handleConfirmEnd = (e) => {
		const selectedDate = new Date(e.nativeEvent.timestamp)
		setEndDate(selectedDate)
	}

	const goToTravelItinerary = (tripData) => {
		router.push({
			pathname: "/travelitinerary",
			params: {
        data: JSON.stringify(tripData)
      }
		})
	}

	return (
		<ScrollView>
			<View style={{ padding: 20 }}>
				<Text style={{ fontSize: 18 }}> Trip Title</Text>
				<TextInput
					placeholder="Enter trip title"
					value={title}
					onChangeText={setTitle}
					style={{
						height: 40,
						borderColor: "gray",
						borderWidth: 1,
						paddingLeft: 10,
						borderRadius: 5,
						marginBottom: 10,
					}}
				/>
			</View>
			<View style={{ padding: 20 }}>
				<Text style={{ fontSize: 18 }}>Where to?</Text>
				<GooglePlacesAutocomplete
					placeholder="Enter destination"
					onPress={(data, details = null) => {
						setDestination(data.description)
						const placeId = data.place_id
						console.log("Selected place ID:", placeId)
						fetchPlaceDetails(placeId)
					}}
					query={{
						key: GOOGLE_API_KEY,
						language: "en",
						types: "geocode",
					}}
					styles={{
						container: {
							flex: 0,
							marginVertical: 10,
						},
						textInput: {
							height: 40,
							borderColor: "gray",
							borderWidth: 1,
							paddingLeft: 10,
							borderRadius: 5,
						},
						listView: {
							backgroundColor: "white",
							borderRadius: 5,
						},
					}}
				/>

				<View>
					<Text>Start of Trip</Text>
					<DateTimePicker
						value={startDate}
						mode="date"
						display="default"
						onChange={handleConfirmStart}
					/>
				</View>

				<View>
					<Text>End of Trip</Text>
					<DateTimePicker
						value={endDate}
						mode="date"
						display="default"
						onChange={handleConfirmEnd}
					/>
				</View>

				<Button
					label="Choose your own picture for your trip"
					onPress={pickImageAsync}
				/>
			</View>

			<View style={{ padding: 10 }}>
				<Text>Choose an image for your trip:</Text>
				<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
					{photos.map((photo, index) => {
						const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
						return (
							<TouchableOpacity
								key={index}
								onPress={() =>
									handleGoogleImageSelect(photoUrl)
								}
								style={{
									borderWidth:
										placeImage === photoUrl ? 3 : 0,
									borderColor:
										placeImage === photoUrl
											? "#007BFF"
											: "transparent",
									borderRadius: 10,
									margin: 5,
								}}
							>
								<Image
									source={{ uri: photoUrl }}
									style={{
										width: 100,
										height: 100,
										borderRadius: 10,
									}}
								/>
							</TouchableOpacity>
						)
					})}
				</View>

				<Button label="Start Planning" onPress={saveTrip} />
			</View>
		</ScrollView>
	)
}

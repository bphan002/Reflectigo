import { useState } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from "expo-image-picker";
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_API_KEY } from '@env';

export default function CreateTrip() {
  const router = useRouter(); 
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [placeImage, setPlaceImage] = useState(null)
  const [photos, setPhotos] = useState([]);  // Store photos array in state


  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
  
      if (data.result && data.result.photos) {
        setPhotos(data.result.photos);  // Set photos from the API response
        console.log("Place photos:", data.result.photos);
      } else {
        alert('No photos available for this location.');
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      alert('Failed to load photos.');
    }
  };

  const pickImageAsync = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
        Alert.alert("Permission required", "Please allow access to select images.");
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
    });

    if (!result.canceled) {
        console.log('Selected Image URI:', result.assets[0].uri);
    } else {
        alert("You did not select any image.");
    }
  };

  
  const handleImageSelect = (imageUrl) => {
    console.log('Selected image URL:', imageUrl);
    setPlaceImage(imageUrl);  // Save the selected image URL in state
    Alert.alert("Image Selected", "You have successfully selected an image for your trip.");
  };
  
  const handleConfirmStart = (e) => {
    const selectedDate = new Date(e.nativeEvent.timestamp);
    console.log("selectedDate", selectedDate)
    setStartDate(selectedDate);
  };
  const handleConfirmEnd = (e) => {
    const selectedDate = new Date(e.nativeEvent.timestamp);
  // const handleConfirmEnd = (event: React.SyntheticEvent, selectedDate : Date) => {
    // const currentDate = selectedDate || endDate;
    setEndDate(selectedDate);
  };

  const goToTravelItinerary = () => {
    //put information in params when ready, name, date of trip, name of trip
    router.push({ 
      pathname: '/travelitinerary', 
        params: { 
          destination: destination,
          startDate: startDate,
          endDate: endDate,
          selectedImage: placeImage
        } 
    });
  };

  return (
    <>
    <ScrollView>


    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Where to?</Text>
      <GooglePlacesAutocomplete
  placeholder="Enter destination"
  onPress={(data, details = null) => {
    setDestination(data.description);  // Set the selected destination
    const placeId = data.place_id;  // Get the place_id
    console.log('Selected place ID:', placeId);

    // Now, call the Place Details API to get more details (including photos)
    fetchPlaceDetails(placeId);
  }}
        query={{
          key: `${GOOGLE_API_KEY}`, 
          language: 'en',
          types: 'geocode', 
        }}
        styles={{
          container: {
            flex: 0,
            marginVertical: 10,
          },
          textInput: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            paddingLeft: 10,
            borderRadius: 5,
          },
          listView: {
            backgroundColor: 'white',
            borderRadius: 5,
          }
        }}
      />

      {/* Display the selected place image this might be used later.  not sure yet
      {placeImage && (
        <View style={{ marginVertical: 20 }}>
          <Text>Image of {destination}</Text>
          <Image
            source={{ uri: placeImage }}
            style={{ width: 300, height: 200, borderRadius: 10 }}
          />
        </View>
      )} */}

      {/* Start Date Picker */}
      {/* <Button
        title={`Start Date: ${startDate.toLocaleDateString()}`}
        onPress={() => setShowStartPicker(true)}
      /> */}
      <View>
        <Text>Start of Trip</Text>
        <DateTimePicker
          required
          value={startDate}
          mode="date"
          display="default"
          onChange={handleConfirmStart}
        />

      </View>

      {/* End Date Picker */}
      {/* <Button
        title={`End Date: ${endDate.toLocaleDateString()}`}
        onPress={() => setShowEndPicker(true)}
      /> */}
        <View>
          <Text>End of Trip</Text>
        <DateTimePicker
          required
          value={endDate}
          mode="date"
          display="default"
          onChange={handleConfirmEnd}
        />
        </View>

      <Text>(Optional)</Text>
      <Button
        onPress={pickImageAsync}
        label="Choose your own picture for your trip"
      />
    </View>
    <View style={{ padding: 10 }}>
    <Text>Choose an image for your trip:</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {photos.map((photo, index) => {
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`;
        return (
          <TouchableOpacity key={index} onPress={() => handleImageSelect(photoUrl)}>
            <Image
              source={{ uri: photoUrl }}
              style={{ width: 100, height: 100, margin: 5 }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  <Button label="Start Planning" onPress={goToTravelItinerary} />
  </View>
  </ScrollView>
  </>
  );
}

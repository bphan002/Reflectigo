import { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from "expo-image-picker";
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'; // Import the Google Places Autocomplete component
import { GOOGLE_API_KEY } from '@env';

export default function CreateTrip() {
  const router = useRouter(); 
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

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

  const handleConfirmStart = (event: React.SyntheticEvent, selectedDate: Date) => {
    const currentDate: Date = selectedDate || startDate;
    setShowStartPicker(false);
    setStartDate(currentDate);
  };

  const handleConfirmEnd = (event: React.SyntheticEvent, selectedDate : Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(false);
    setEndDate(currentDate);
  };

  const goToTravelItinerary = () => {
    //put information in params when ready, name, date of trip, name of trip
    router.push({ pathname: '/travelitinerary', params: { message: 'Hello from createnewtrip!' } });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Where to?</Text>
      {/* Google Places Autocomplete */}
      <GooglePlacesAutocomplete
        placeholder="Enter destination"
        onPress={(data, details = null) => {
          setDestination(data.description);  // Set the selected destination
          console.log('Selected place:', data, details);
        }}
        query={{
          key: `${GOOGLE_API_KEY}`, 
          language: 'en',
          components: 'country:us'  // Optional: Restrict search to specific country
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

      {/* Start Date Picker */}
      <Button
        title={`Start Date: ${startDate.toLocaleDateString()}`}
        onPress={() => setShowStartPicker(true)}
      />
      {showStartPicker && (
        <DateTimePicker
          required
          value={startDate}
          mode="date"
          display="default"
          onChange={handleConfirmStart}
        />
      )}

      {/* End Date Picker */}
      <Button
        title={`End Date: ${endDate.toLocaleDateString()}`}
        onPress={() => setShowEndPicker(true)}
      />
      {showEndPicker && (
        <DateTimePicker
          required
          value={endDate}
          mode="date"
          display="default"
          onChange={handleConfirmEnd}
        />
      )}

      <Text>(Optional)</Text>
      <Button
        onPress={pickImageAsync}
        label="Choose a photo"
      />
      <Button label="Start Planning" onPress={goToTravelItinerary} />
    </View>
  );
}

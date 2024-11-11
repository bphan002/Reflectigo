import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'
// import CloseButton from '../../components/CloseButton';
import * as ImagePicker from "expo-image-picker"
import Button from '@/components/Button';
import { useRouter, Link } from 'expo-router'; 

export default function CreateTrip() {
  const router = useRouter(); // Use useRouter for navigation
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
    {/* <CloseButton/> */}
      <Text style={{ fontSize: 18 }}>Where toooooo?</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: 'red',
          padding: 10,
          marginVertical: 10,
          borderRadius: 5,
        }}
        placeholder="Enter destination"
        value={destination}
        onChangeText={setDestination}
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
      <Button label="Start Planning" onPress={goToTravelItinerary} 
        />
        { /* Handle saving trip and redirect */ }
    </View>
  );
}
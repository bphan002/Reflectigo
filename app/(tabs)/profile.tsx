import { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    // Request permissions when the app is loaded
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted' || cameraStatus.status !== 'granted') {
        Alert.alert(
          'Permission required',
          'We need permission to access your media library and camera.'
        );
      }
    };

    requestPermissions();
  }, []);

  const handleChoosePhoto = async () => {
    // Open the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);  // Update the image URI to show the selected image
    } else {
      Alert.alert('Image Selection', 'You did not select any image.');
    }
  };

  const handleTakePhoto = async () => {
    // Open the camera for taking a photo
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);  // Update the image URI to show the taken image
    } else {
      Alert.alert('Image Selection', 'You did not take any photo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Image
        source={{
          uri: profilePicture || 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png',
        }}
        style={styles.profileImage}
      />
      <View style={styles.buttonContainer}>
        <Button title="Choose from Camera Roll" onPress={handleChoosePhoto} />
        <Button title="Take a Selfie" onPress={handleTakePhoto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
});

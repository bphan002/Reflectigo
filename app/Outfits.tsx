import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import trashcan icon

export default function Outfits() {
  const { startDate, endDate } = useLocalSearchParams();

  // Convert the startDate and endDate to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in time (milliseconds) and then convert to days
  const timeDifference = end - start;
  const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24)) + 1;

  // State to manage the outfit data (outfit bullet points and image for each day)
  const [outfits, setOutfits] = useState(
    Array.from({ length: daysDifference }).map(() => ({
      bullets: [''],
      imageUri: null,
    }))
  );

  // Request permission to access image picker (gallery)
  const requestImagePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  // Request permission to use camera
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  // Function to handle picking an image from the gallery
  const pickImage = async (index) => {
    const permissionGranted = await requestImagePermission();
    if (!permissionGranted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const updatedOutfits = [...outfits];
      updatedOutfits[index].imageUri = result.assets[0].uri; // Set the picked image URI
      setOutfits(updatedOutfits);
    }
  };

  // Function to handle taking a picture with the camera
  const takePicture = async (index) => {
    const permissionGranted = await requestCameraPermission();
    if (!permissionGranted) {
      alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const updatedOutfits = [...outfits];
      updatedOutfits[index].imageUri = result.assets[0].uri; // Set the captured image URI
      setOutfits(updatedOutfits);
    }
  };

  // Function to update the outfit bullet points for a specific day
  const updateBullet = (index, text, bulletIndex) => {
    const updatedOutfits = [...outfits];
    updatedOutfits[index].bullets[bulletIndex] = text;
    setOutfits(updatedOutfits);
  };

  // Function to add a new bullet point for a specific day
  const addBullet = (index) => {
    const updatedOutfits = [...outfits];
    updatedOutfits[index].bullets.push('');
    setOutfits(updatedOutfits);
  };

  // Function to delete a specific bullet point
  const deleteBullet = (index, bulletIndex) => {
    const updatedOutfits = [...outfits];
    updatedOutfits[index].bullets.splice(bulletIndex, 1); // Remove the bullet at the specified index
    setOutfits(updatedOutfits);
  };

  // Render function for each day
  const renderItem = ({ item, index }) => {
    const day = new Date(start.getTime() + index * 24 * 60 * 60 * 1000); // Increment each day
    const formattedDate = day.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    return (
      <View style={styles.dayContainer}>
        <View style={styles.leftColumn}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          {item.bullets.map((bullet, bulletIndex) => (
            <View key={bulletIndex} style={styles.bulletContainer}>
              <Text style={styles.bullet}>•</Text>
              <TextInput
                style={styles.textInput}
                placeholder="What are you wearing?"
                value={bullet}
                onChangeText={(text) => updateBullet(index, text, bulletIndex)}
              />
              {/* Trashcan icon for deleting the bullet */}
              <TouchableOpacity onPress={() => deleteBullet(index, bulletIndex)}>
                <Ionicons name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={() => addBullet(index)}>
            <Text style={styles.addButtonText}>+ Add Bullet</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightColumn}>
          <Image
            source={{
              uri: item.imageUri || 'https://img.icons8.com/?size=100&id=53386&format=png&color=000000'
            }}
            style={styles.imagePlaceholder}
          />
          <Button title="Pick Image" onPress={() => pickImage(index)} />
          <Button title="Take Picture" onPress={() => takePicture(index)} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Outfit Planner</Text>
      <FlatList
        data={outfits}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  header: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
  },
  leftColumn: {
    flex: 1,
    marginRight: 10,
  },
  rightColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bullet: {
    color: '#fff',
    fontSize: 18,
    marginRight: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#555',
    padding: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
});

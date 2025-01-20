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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Outfits() {
  const { key, data } = useLocalSearchParams();
  const { startDate, endDate } = JSON.parse(data);

  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    // Generate outfits dynamically based on the date range
    const generateOutfits = () => {
      const start = new Date(startDate);
      const end = new Date(endDate);

       // Reset time to 00:00:00 for both start and end dates
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      const outfitsArray = [];

      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        outfitsArray.push({
          id: date.toISOString(),
          date: date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }),
          bullets: [],
          imageUri: null,
        });
      }
      setOutfits(outfitsArray);
    };

    generateOutfits();
  }, [startDate, endDate]);

  // Save and load outfits from AsyncStorage
  useEffect(() => {
    const loadOutfits = async () => {
      try {
        const savedItems = await AsyncStorage.getItem(key);
        const parsedSavedItems = JSON.parse(savedItems);
        if (parsedSavedItems?.outfits) {
          setOutfits(parsedSavedItems.outfits);
        }
      } catch (error) {
        console.error('Failed to load outfits:', error);
      }
    };

    loadOutfits();
  }, [key]);

  useEffect(() => {
    const saveOutfits = async () => {
      try {
        const existingTripData = await AsyncStorage.getItem(key);
        if (existingTripData) {
          const tripData = JSON.parse(existingTripData);
          tripData.outfits = outfits;
          if (tripData.outfits) {
            console.log('hit???')
            console.log("what is tripData.outfits becaue its hitting", tripData.outfits)
            await AsyncStorage.setItem(key, JSON.stringify(tripData));
          }
        }
      } catch (error) {
        console.error('Failed to save outfits:', error);
      }
    };

    saveOutfits();
  }, [outfits]);

  // Image and bullet management functions
  const requestImagePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  const pickImage = async (index) => {
    const permissionGranted = await requestImagePermission();
    if (!permissionGranted) {
      alert('Permission to access the gallery is required!');
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
      updatedOutfits[index].imageUri = result.assets[0].uri;
      setOutfits(updatedOutfits);
    }
  };

  const takePicture = async (index) => {
    const permissionGranted = await requestCameraPermission();
    if (!permissionGranted) {
      alert('Permission to access the camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const updatedOutfits = [...outfits];
      updatedOutfits[index].imageUri = result.assets[0].uri;
      setOutfits(updatedOutfits);
    }
  };

  const updateBullet = (index, text, bulletIndex) => {
    const updatedOutfits = [...outfits];
    updatedOutfits[index].bullets[bulletIndex] = text;
    setOutfits(updatedOutfits);
  };

  const addBullet = (index) => {
    const updatedOutfits = [...outfits];
    updatedOutfits[index].bullets.push('');
    setOutfits(updatedOutfits);
  };

  const deleteBullet = (index, bulletIndex) => {
    const updatedOutfits = [...outfits];
    updatedOutfits[index].bullets.splice(bulletIndex, 1);
    setOutfits(updatedOutfits);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.dayContainer}>
      <View style={styles.leftColumn}>
        <Text style={styles.dateText}>{item.date}</Text>
        {item.bullets.map((bullet, bulletIndex) => (
          <View key={bulletIndex} style={styles.bulletContainer}>
            <Text style={styles.bullet}>•</Text>
            <TextInput
              style={styles.textInput}
              placeholder="What are you wearing?"
              value={bullet}
              onChangeText={(text) => updateBullet(index, text, bulletIndex)}
            />
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
            uri: item.imageUri || 'https://img.icons8.com/?size=100&id=53386&format=png&color=000000',
          }}
          style={styles.imagePlaceholder}
        />
        <Button title="Pick Image" onPress={() => pickImage(index)} />
        <Button title="Take Picture" onPress={() => takePicture(index)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Outfit Planner</Text>
      <FlatList
        data={outfits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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

import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; // For icon use

const ImagePickerComponent = ({ onImageSelected }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    // Ask for permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "You need to grant permission to access photos.");
      return;
    }

    // Open image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Set the selected image URI
      onImageSelected(result.assets[0].uri);  // Call the parent function if provided
    }
  };

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      ) : (
        <TouchableOpacity onPress={pickImage} style={styles.placeholder}>
          <Ionicons name="camera" size={40} color="#aaa" />
          <Text style={styles.placeholderText}>Add Image</Text>
        </TouchableOpacity>
      )}

      {selectedImage && (
        <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.removeButton}>
          <Ionicons name="close-circle" size={24} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  placeholder: {
    width: 150,
    height: 150,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 5,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default ImagePickerComponent;

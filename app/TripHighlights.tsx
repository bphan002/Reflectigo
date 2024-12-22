import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Animated,
  Modal,
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const TripHighlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  // Add a new highlight (text, image, or both)
  const addHighlight = (type) => {
    const newHighlight = {
      id: Date.now().toString(),
      type,
      content: { text: '', image: null }, // Initialize content with empty text and null image
    };
    setHighlights((prev) => [...prev, newHighlight]);
    setModalVisible(false);
  };

  // Update a highlight's content (either text or image)
  const updateHighlight = (id, content) => {
    const updatedHighlights = highlights.map((item) =>
      item.id === id ? { ...item, content } : item
    );
    setHighlights(updatedHighlights);
  };

  // Delete a highlight by its ID
  const deleteHighlight = (id) => {
    setHighlights((prev) => prev.filter((item) => item.id !== id));
  };

  // Pick an image from the gallery
  const pickImage = async (id) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('Permission result:', permissionResult);
    if (permissionResult.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        console.log('Image URI:', result.uri);  // This will log the image URI
        const updatedHighlights = highlights.map((item) =>
          item.id === id
            ? { ...item, content: { ...item.content, image: result.uri } }
            : item
        );
        setHighlights(updatedHighlights);
      }
    } else {
      alert('Permission to access camera roll is required!');
    }
  };

  // Render each highlight (text or image or both)
  const renderHighlight = ({ item }) => {
    const panX = new Animated.Value(0);

    const onGestureEvent = Animated.event([{ nativeEvent: { translationX: panX } }], {
      useNativeDriver: true,
    });

    const trashcanOpacity = panX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const handleRelease = ({ nativeEvent }) => {
      if (nativeEvent.translationX < -100) {
        deleteHighlight(item.id);
      } else {
        Animated.spring(panX, { toValue: 0, useNativeDriver: true }).start();
      }
    };

    return (
      <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={handleRelease}>
        <Animated.View style={[styles.highlightContainer, { transform: [{ translateX: panX }] }]}>
          {item.type === 'text' && (
            <TextInput
              style={styles.input}
              placeholder="Write your highlight..."
              value={item.content.text}
              onChangeText={(text) =>
                updateHighlight(item.id, { ...item.content, text })
              }
            />
          )}
          {item.type === 'image' && (
            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={() => pickImage(item.id)}>
              <Text>Add Image</Text>
                <Image source={{ 
                  // uri: item.content.image || 'https://img.icons8.com/?size=100&id=53386&format=png&color=000000' }} style={styles.image} />
                  uri: 'https://img.icons8.com/?size=100&id=53386&format=png&color=000000' }} style={styles.image} />
            </TouchableOpacity>
          )}
          {item.type === 'both' && (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Write your highlight..."
                value={item.content.text}
                onChangeText={(text) =>
                  updateHighlight(item.id, { ...item.content, text })
                }
              />
              <TouchableOpacity
                style={styles.imagePlaceholder}
                onPress={() => pickImage(item.id)}>
                <Text>Add Image</Text>
                {item.content.image && (
                  <Image source={{ uri: item.content.image }} style={styles.image} />
                )}
              </TouchableOpacity>
            </View>
          )}
          <Animated.View
            style={[
              styles.trashcanContainer,
              { opacity: trashcanOpacity, position: 'absolute', right: 20 },
            ]}>
            <Ionicons name="trash-outline" size={30} color="red" />
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>Trip Highlights</Text>
        <FlatList
          data={highlights}
          keyExtractor={(item) => item.id}
          renderItem={renderHighlight}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={24} color="blue" />
          <Text style={styles.addButtonText}>Add a Highlight</Text>
        </TouchableOpacity>

        {/* Modal for Selecting Highlight Type */}
        <Modal visible={isModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Highlight Type</Text>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => addHighlight('text')}>
                <Ionicons name="text-outline" size={24} color="black" />
                <Text style={styles.optionText}>Text</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => addHighlight('image')}>
                <Ionicons name="image-outline" size={24} color="black" />
                <Text style={styles.optionText}>Image</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => addHighlight('both')}>
                <Ionicons name="copy-outline" size={24} color="black" />
                <Text style={styles.optionText}>Both</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  highlightContainer: {
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    fontSize: 16,
    padding: 5,
  },
  imagePlaceholder: {
    height: 100,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 16,
    color: 'blue',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
  trashcanContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -20 }],
  },
});

export default TripHighlights;

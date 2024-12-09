import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import ImagePicker from '@/components/imagePicker';

const TripHighlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const addHighlight = (type) => {
    const newHighlight = { type, text: '', imageUri: null };
    setHighlights([...highlights, newHighlight]);
    setIsModalVisible(false);
  };

  const deleteHighlight = (index) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  const renderHighlight = ({ item, index }) => (
    <PanGestureHandler
      onGestureEvent={() => {}}
      onEnded={() => deleteHighlight(index)} // Delete on swipe
    >
      <View style={styles.highlightContainer}>
        {/* Render Text Input */}
        {(item.type === 'text' || item.type === 'both') && (
          <TextInput
            style={styles.input}
            placeholder="Write your highlight..."
            value={item.text || ''}
            onChangeText={(text) =>
              setHighlights((prev) => {
                const updated = [...prev];
                updated[index].text = text;
                return updated;
              })
            }
          />
        )}

        {/* Render Image Picker */}
        {(item.type === 'image' || item.type === 'both') && (
          <ImagePicker
            onImageSelected={(uri) =>
              setHighlights((prev) => {
                const updated = [...prev];
                updated[index].imageUri = uri;
                return updated;
              })
            }
          />
        )}
      </View>
    </PanGestureHandler>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>Trip Highlights</Text>

        <FlatList
          data={highlights}
          renderItem={renderHighlight}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={
            <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
              <Ionicons name="add-circle-outline" size={24} color="blue" />
              <Text style={styles.addButtonText}>Add a Highlight</Text>
            </TouchableOpacity>
          }
        />

        {/* Modal for Selecting Highlight Type */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Choose Highlight Type</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => addHighlight('text')}
            >
              <Ionicons name="text-outline" size={24} color="black" />
              <Text>Text</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => addHighlight('image')}
            >
              <Ionicons name="image-outline" size={24} color="black" />
              <Text>Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => addHighlight('both')}
            >
              <Ionicons name="copy-outline" size={24} color="black" />
              <Text>Both</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  highlightContainer: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
    width: 200,
    justifyContent: 'center',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
});

export default TripHighlights;

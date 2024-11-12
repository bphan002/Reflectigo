import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For plus icon
import ImagePicker from '@/components/imagePicker'

const TripHighlights = () => {
    const [highlights, setHighlights] = useState([]);
  
    const addHighlight = () => {
      setHighlights([...highlights, { type: null, content: null }]);
    };
  
    const updateHighlight = (index, type, content) => {
      const newHighlights = [...highlights];
      newHighlights[index] = { type, content };
      setHighlights(newHighlights);
    };
  
    const renderHighlight = ({ item, index }) => {
      if (item.type === 'text') {
        return (
          <View style={styles.highlightContainer}>
            <TextInput
              style={styles.input}
              placeholder="Write your highlight..."
              value={item.content || ''}
              onChangeText={(text) => updateHighlight(index, 'text', text)}
            />
          </View>
        );
      } else if (item.type === 'image') {
        return (
          <View style={styles.highlightContainer}>
            <ImagePicker onImageSelected={(uri) => updateHighlight(index, 'image', uri)} />
          </View>
        );
      } else {
        return (
          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Woul you like to add text or an image?:</Text>
            <TouchableOpacity style={styles.optionButton} onPress={() => updateHighlight(index, 'text', '')}>
              <Ionicons name="text-outline" size={24} color="black" />
              <Text>Text</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => updateHighlight(index, 'image', null)}>
              <Ionicons name="image-outline" size={24} color="black" />
              <Text>Image</Text>
            </TouchableOpacity>
          </View>
        );
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Trip Highlights</Text>
        
        <FlatList
          data={highlights}
          renderItem={renderHighlight}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={
            <TouchableOpacity style={styles.addButton} onPress={addHighlight}>
              <Ionicons name="add-circle-outline" size={24} color="blue" />
              <Text style={styles.addButtonText}>Add a Highlight</Text>
            </TouchableOpacity>
          }
        />
      </View>
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
    },
    input: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      paddingHorizontal: 10,
      borderRadius: 5,
      fontSize: 16,
    },
    optionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
      alignItems: 'center',
    },
    optionText: {
      fontSize: 16,
    },
    optionButton: {
      alignItems: 'center',
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
  });
  
  export default TripHighlights;
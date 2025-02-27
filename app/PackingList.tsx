import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

const PackingList = () => {
  const { key, data } = useLocalSearchParams();
  const [packingItems, setPackingItems] = useState([
    { id: '1', title: 'Toiletries', items: [], newItem: '' },
    { id: '2', title: 'Clothing', items: [], newItem: '' },
    { id: '3', title: 'Electronics', items: [], newItem: '' },
    { id: '4', title: 'Documents', items: [], newItem: '' },
  ]);

  const [newCategory, setNewCategory] = useState(''); // State for the new category input
  const [editingItemId, setEditingItemId] = useState(null); // State for tracking the item being edited
  const [editedItemText, setEditedItemText] = useState(''); // State for the edited text

  // Load packing items from AsyncStorage
  useEffect(() => {
    const loadPackingItems = async () => {
      try {
        const savedItems = await AsyncStorage.getItem(key);
          const parsedSavedItems = JSON.parse(savedItems);
          if (parsedSavedItems.packingItems) {

            // Create a deep copy of packingItems to avoid reference issues
            const deepCopyPackingItems = JSON.parse(JSON.stringify(parsedSavedItems)).packingItems;   
          setPackingItems(deepCopyPackingItems);
        }
      } catch (error) {
        console.error('Failed to load packing items:', error);
      }
    };

    loadPackingItems();
  }, [key]);

  // Save packing items to AsyncStorage whenever they change
  useEffect(() => {
    console.log('this should trigger when packing items change')

    const savePackingItems = async () => {
      try {
        // Step 1: Retrieve existing data from AsyncStorage
        const existingTripData = await AsyncStorage.getItem(key);
        console.log('existingtripdata', JSON.stringify(existingTripData,null,2))
        // Step 2: Check if data exists and parse it
        if (existingTripData) {
          const tripData = JSON.parse(existingTripData);
          console.log("what is the tripdata after parase", tripData)
          // Step 3: Overwrite the packingItems property with the new packingItems
          console.log('Packing Items:', JSON.stringify(packingItems, null, 2));
          tripData.packingItems = packingItems;
          console.log('what is new tripdata with the packingitems', JSON.stringify(tripData,null,2))
          // Step 4: Save the updated object back to AsyncStorage
          await AsyncStorage.setItem(key, JSON.stringify(tripData));
          console.log('Packing items overwritten successfully!');
        } 
      } catch (error) {
        console.error('Failed to save packing items:', error);
      }
    };
    savePackingItems()
  }, [packingItems, key]);

  // Add a new category
  const addNewTitle = (newTitle) => {
    if (newTitle.trim() !== '') {
      setPackingItems([
        ...packingItems,
        { id: Date.now().toString(), title: newTitle, items: [], newItem: '' },
      ]);
      setNewCategory(''); // Clear input after adding the category
    }
  };

  // Add a new item to a category
  const addNewItem = (categoryId) => {
    const newItemValue = packingItems.find(item => item.id === categoryId).newItem;
    if (newItemValue.trim() !== '') {
      setPackingItems((prevItems) =>
        prevItems.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                items: [...category.items, { id: Date.now().toString(), name: newItemValue, checked: false }],
                newItem: '', // Clear the input field after adding the item
              }
            : category
        )
      );
    }
  };

  // Toggle a checklist item
  const toggleItem = (categoryId, itemId) => {
    setPackingItems((prevItems) =>
      prevItems.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : category
      )
    );
  };

  // Handle new item input change for specific category
  const handleNewItemChange = (categoryId, value) => {
    setPackingItems((prevItems) =>
      prevItems.map((category) =>
        category.id === categoryId
          ? { ...category, newItem: value }
          : category
      )
    );
  };

  // Delete a category
  const deleteCategory = (categoryId) => {
    setPackingItems((prevItems) => prevItems.filter(category => category.id !== categoryId));
  };

  // Edit a category title
  const editCategoryTitle = (categoryId, newTitle) => {
    setPackingItems((prevItems) =>
      prevItems.map((category) =>
        category.id === categoryId
          ? { ...category, title: newTitle }
          : category
      )
    );
  };

  // Delete an item from a category
  const deleteItem = (categoryId, itemId) => {
    setPackingItems((prevItems) =>
      prevItems.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.filter(item => item.id !== itemId),
            }
          : category
      )
    );
  };

  // Edit an item in the category
  const editItem = (categoryId, itemId, newName) => {
    setPackingItems((prevItems) =>
      prevItems.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId ? { ...item, name: newName } : item
              ),
            }
          : category
      )
    );
    setEditingItemId(null); // Reset editing state after saving
  };

  // Set the item for editing
  const startEditing = (itemId, currentName) => {
    setEditingItemId(itemId);
    setEditedItemText(currentName);
  };

  // Cancel editing state
  const cancelEditing = () => {
    setEditingItemId(null);
    setEditedItemText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Packing List</Text>

      {/* Display pre-populated categories and checklists */}
      <FlatList
        data={packingItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item: category }) => (
          <View style={styles.category}>
            <View style={styles.categoryHeader}>
              <TextInput
                style={styles.categoryTitle}
                value={category.title}
                onChangeText={(text) => editCategoryTitle(category.id, text)}
              />
              <TouchableOpacity onPress={() => deleteCategory(category.id)}>
                <Text style={styles.deleteButton}>Delete Category</Text>
              </TouchableOpacity>
            </View>

            {category.items.map((item) => (
              <View key={item?.id} style={styles.checklistItem}>
                <Checkbox
                  value={item?.checked}
                  onValueChange={() => toggleItem(category.id, item.id)}
                />
                {editingItemId === item.id ? (
                  <TextInput
                    value={editedItemText}
                    onChangeText={setEditedItemText}
                    onSubmitEditing={() => editItem(category.id, item.id, editedItemText)}
                    style={styles.input}
                  />
                ) : (
                  <Text style={item?.checked ? styles.checkedText : styles.itemText}>{item.name}</Text>
                )}
                {editingItemId === item.id ? (
                  <>
                    <TouchableOpacity onPress={() => editItem(category.id, item.id, editedItemText)}>
                      <Text style={styles.saveButton}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={cancelEditing}>
                      <Text style={styles.cancelButton}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity onPress={() => startEditing(item.id, item.name)}>
                    <Text style={styles.editButton}>Edit</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => deleteItem(category?.id, item?.id)}>
                  <Text style={styles.deleteButton}>Delete Item</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Add new item to this category */}
            <TextInput
              placeholder="Add item"
              style={styles.input}
              value={category.newItem}
              onChangeText={(text) => handleNewItemChange(category.id, text)}
            />
            <Button title="Add Item" onPress={() => addNewItem(category.id)} />
          </View>
        )}
      />

      {/* Input field to add new category */}
      <TextInput
        placeholder="New category title"
        style={styles.input}
        value={newCategory}
        onChangeText={setNewCategory} // Update the newCategory state on text change
      />
      <TouchableOpacity style={styles.addButton} onPress={() => addNewTitle(newCategory)}>
        <Text style={styles.addButtonText}>+ Add Category</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  category: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
  },
  checkedText: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  deleteButton: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
  },
  editButton: {
    color: 'blue',
    fontSize: 12,
    marginLeft: 10,
  },
  saveButton: {
    color: 'green',
    fontSize: 12,
    marginLeft: 10,
  },
  cancelButton: {
    color: 'gray',
    fontSize: 12,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default PackingList;

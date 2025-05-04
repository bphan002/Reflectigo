import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
} from 'react-native';

export default function LodgingItem({
  item,
  onChange,
  onToggleEdit,
  onDelete,
  onShowPicker,
}) {
  if (!item) return null;

  return (
    <View style={styles.container}>
      {item.isEditing ? (
        <>
          <TextInput
            placeholder="Enter place name"
            value={item.hotel}
            onChangeText={(text) => onChange(item.id, text)}
            style={styles.input}
          />
          <Button title="Select Start Date" onPress={() => onShowPicker(item.id, 'startDate')} />
          <Button title="Select End Date" onPress={() => onShowPicker(item.id, 'endDate')} />
          <Text style={styles.text}>Start: {item.startDate.toDateString()}</Text>
          <Text style={styles.text}>End: {item.endDate.toDateString()}</Text>
          <TouchableOpacity style={styles.saveButton} onPress={() => onToggleEdit(item.id)}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.text}>Place: {item.hotel || 'Not Set'}</Text>
          <Text style={styles.text}>Start: {item.startDate.toDateString()}</Text>
          <Text style={styles.text}>End: {item.endDate.toDateString()}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => onToggleEdit(item.id)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  text: { fontSize: 16, marginVertical: 5 },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
  editButton: {
    backgroundColor: '#ffc107',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: { color: '#fff', fontWeight: 'bold' },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
});

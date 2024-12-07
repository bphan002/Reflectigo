import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState(null); // Profile picture from Google or user upload

  const handleChoosePhoto = () => {
    console.log('hi')
    // launchImageLibrary({ mediaType: 'photo', maxWidth: 300, maxHeight: 300 }, (response) => {
    //   if (response.didCancel) {
    //     Alert.alert('Cancelled', 'No photo selected.');
    //   } else if (response.errorMessage) {
    //     Alert.alert('Error', response.errorMessage);
    //   } else {
    //     setProfilePicture(response.assets[0].uri);
    //   }
    // });
  };

  const handleTakePhoto = () => {
    console.log('handletakephoto')
    // launchCamera({ mediaType: 'photo', maxWidth: 300, maxHeight: 300 }, (response) => {
    //   if (response.didCancel) {
    //     Alert.alert('Cancelled', 'No photo taken.');
    //   } else if (response.errorMessage) {
    //     Alert.alert('Error', response.errorMessage);
    //   } else {
    //     setProfilePicture(response.assets[0].uri);
    //   }
    // });
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default Profile;

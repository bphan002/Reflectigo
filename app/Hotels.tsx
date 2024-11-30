import { Text, View, StyleSheet } from 'react-native';
import { API_URL, GOOGLE_API_KEY } from '@env';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';



console.log('API URL:', API_URL);  // Outputs: https://api.example.com
console.log('Google API Key:', GOOGLE_API_KEY);  // Outputs: your-api-key

export defauldfasdt function Hotel() {

  console.log('API URL:', API_URL);  // Outputs: https://api.example.com
  console.log('Google API Key:', GOOGLE_API_KEY);  // Outputs: your-api-key
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add hotel or lodging</Text>
      <Text style={styles.text}>Google Places Autocomplete</Text>
      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        onPress={(data, details = null) => {
          console.log(data, details); // 'data' contains the search result, 'details' contains place details if available
        }}
        query={{
          key: 'YOUR_GOOGLE_API_KEY', // Replace with your API Key
          language: 'en', // Set language for results
          types: 'geocode', // Optional, filter the result types (places, geocode, etc.)
        }}
        fetchDetails={true} // Whether or not to fetch details for selected place
        debounce={200} // Delay between typing and results showing
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

import { Text, View, StyleSheet } from 'react-native';
import { API_URL, GOOGLE_API_KEY } from '@env';

console.log('API URL:', API_URL);  // Outputs: https://api.example.com
console.log('Google API Key:', GOOGLE_API_KEY);  // Outputs: your-api-key

export default function Hotel() {

  console.log('API URL:', API_URL);  // Outputs: https://api.example.com
  console.log('Google API Key:', GOOGLE_API_KEY);  // Outputs: your-api-key
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add hotel or lodging</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});

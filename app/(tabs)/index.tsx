import { Text, View, StyleSheet } from 'react-native';
import { useState } from 'react'
import Button from '@/components/Button';
import { useRouter, Link } from 'expo-router'; 
import 'react-native-get-random-values';

export default function Index() {
  const [ user, setUser] = useState('Billy')
  const router = useRouter(); // Use useRouter for navigation
  //will need useEffect probably to get username
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hi {user},</Text>
      <Text style={styles.text}>Let's Travel!</Text>
      <Button label="Create new trip" onPress={() => router.push('/createnewtrip')} />
      <Text>Sample Trip Plan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  /* @tutinfo Add the style of <CODE>fontSize</CODE>, <CODE>textDecorationLine</CODE>, and <CODE>color</CODE> to <CODE>Link</CODE> component. */
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});

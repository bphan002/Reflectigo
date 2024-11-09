import { Text, View, StyleSheet } from 'react-native';
import Button from '@/components/Button';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Table of Contents</Text>
      <Button label="Flights" />
      <Button label="Hotels" />
      <Button label="Itinerary" />
      <Button label="Places to Explore" />
      <Button label="Restaurants" />
      <Button label="Transportation" />
      <Button label="Outfits" />
      <Button label="Packing List" />
      <Button label="Trip Highlights" />
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

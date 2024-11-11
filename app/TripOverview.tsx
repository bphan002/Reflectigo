import { Text, View, StyleSheet } from 'react-native';

export default function TripOverview() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Trip Overview</Text>
      <Text>Flight Details</Text>
      <Text>Hotels</Text>
      <Text>Itinerary</Text>
      <Text>Places to Explore</Text>
      <Text>Daily Schedule</Text>
      <Text>Restaurants</Text>
      <Text>Transportation</Text>
      <Text>Outfits</Text>
      <Text>Packing List</Text>
      <Text>Trip Highlights</Text>
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

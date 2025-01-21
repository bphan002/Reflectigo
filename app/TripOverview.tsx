import { Text, View, StyleSheet } from 'react-native';
import Button from '@/components/Button';
import { useRouter, Link } from 'expo-router';
import app from './firebaseConfig'
import { useLocalSearchParams } from 'expo-router';
// <Link href={`/${option.replace(/\s+/g, '')}`} style={styles.linkButton}>
// <Text style={styles.optionText}>{option}</Text>
// </Link>
export default function TripOverview() {
  const { key, data } = useLocalSearchParams();
  console.log("data in trip overview", data)
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Trip Overview</Text>
      <Link href={`/Flights`}>Flight Details</Link>
      <Link href={`/Hotels`}>Hotels</Link>
      <Link href={`/Itinerary`}>Itinerary</Link>
      <Link href={`/PlacestoExplore`}>Places to Explore</Link>
      <Link href={`/Restaurants`}>Restaurants</Link>
      <Link href={`/Transportation`}>Transportation</Link>
      <Link href={`/Outfits`}>Outfits</Link>
      <Link href={`/PackingList`}>Packing List</Link>
      <Link href={`/TripHighlights`}>Trip Highlights</Link>
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

import { Text, View, StyleSheet } from 'react-native';
import Button from '@/components/Button';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Table of Contents</Text>
      <Button label="Trip Overview" />
      <Button label="Flight Details" />
      <Button label="Daily Schedule" />
      <Button label="Tours & Attractions" />
      <Button label="Restaurants" />
      <Button label="Hotels" />
      <Button label="Transportation" />
      <Button label="Outfits" />
      <Button label="Packing List" />
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

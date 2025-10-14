import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../FlowerPlantNursery/App';
import { Plant } from '../../FlowerPlantNursery/types';

const API_URL = 'http://10.0.2.2:3000';
type Props = StackScreenProps<RootStackParamList, 'PlantDetails'>;

const PlantDetailsScreen = ({ route }: Props) => {
  const { plant } = route.params;

  const handleAddToCart = async () => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (!token) {
        Alert.alert('Please log in to add items to your cart.');
        return;
      }
      const response = await axios.post(
        `${API_URL}/api/cart`,
        { plantId: plant._id, quantity: 1 },
        { headers: { 'x-auth-token': token } }
      );
      Alert.alert('Success', `${plant.name} has been added to your cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      Alert.alert('Error', 'Could not add item to cart.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{plant.name}</Text>
      <Text>Price: ₹{plant.price}</Text>
      <Text style={{marginVertical: 20}}>{plant.description}</Text>
      <Button title="Add to Cart" onPress={handleAddToCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 }
});

export default PlantDetailsScreen;
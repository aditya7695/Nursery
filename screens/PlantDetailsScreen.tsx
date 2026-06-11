import React from 'react';
import { View, Text, Button, Alert, StyleSheet, Image, ScrollView } from 'react-native'; // Import Image and ScrollView
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Nursery/App';
import { Plant } from '../../Nursery/types';

const API_URL = 'http://10.168.93.181:3000'; // Make sure this is your computer's IP if on a physical device
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
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: plant.imageUrl || 'https://via.placeholder.com/400' }} 
        style={styles.image} 
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{plant.name}</Text>
        <Text style={styles.price}>₹{plant.price}</Text>
        <Text style={styles.description}>{plant.description}</Text>
        <Button title="Add to Cart" onPress={handleAddToCart} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  image: {
    width: '100%',
    height: 300,
  },
  detailsContainer: {
    padding: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  price: {
    fontSize: 22,
    color: '#2d5016',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginVertical: 20
  }
});

export default PlantDetailsScreen;
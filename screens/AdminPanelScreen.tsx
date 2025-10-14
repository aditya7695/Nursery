import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack'; // New: Import StackScreenProps
import { RootStackParamList } from '../App';
import { Plant } from '../types'; // New: Corrected path for Plant type

const API_URL = 'http://10.0.2.2:3000';

// New: Define a type for the screen's props
type AdminPanelScreenProps = StackScreenProps<RootStackParamList, 'AdminPanel'>;

const AdminPanelScreen = ({ navigation }: AdminPanelScreenProps) => { // New: Receive the navigation prop
  const [plants, setPlants] = useState<Plant[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const fetchPlants = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/plants`);
      setPlants(response.data);
    } catch (error) {
      console.error("Failed to fetch plants:", error);
    }
  };

  useFocusEffect(useCallback(() => {
    fetchPlants();
  }, []));

  const handleAddPlant = async () => {
    if (!name || !category || !price) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('user_token');
      const newPlant = { name, category, price: Number(price), description };
      
      await axios.post(`${API_URL}/api/admin/plants`, newPlant, {
        headers: { 'x-auth-token': token },
      });
      
      Alert.alert('Success', 'Plant added successfully!');
      fetchPlants();
      setName('');
      setCategory('');
      setPrice('');
      setDescription('');
    } catch (error) {
      console.error('Failed to add plant:', error);
      Alert.alert('Error', 'Could not add plant.');
    }
  };
  
  const handleDeletePlant = async (plantId: string) => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      await axios.delete(`${API_URL}/api/admin/plants/${plantId}`, {
        headers: { 'x-auth-token': token },
      });
      Alert.alert('Success', 'Plant deleted successfully!');
      fetchPlants();
    } catch (error) {
      console.error('Failed to delete plant:', error);
      Alert.alert('Error', 'Could not delete plant.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Add New Plant</Text>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />
        <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
        <Button title="Add Plant" onPress={handleAddPlant} />
      </View>
      
      <View style={styles.listContainer}>
        <Text style={styles.title}>Existing Plants</Text>
        <FlatList
          data={plants}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.plantItem}>
              <View>
                <Text style={styles.plantName}>{item.name}</Text>
                <Text>₹{item.price}</Text>
              </View>
              <Button title="Delete" color="red" onPress={() => handleDeletePlant(item._id)} />
            </View>
          )}
          ListEmptyComponent={<Text>No plants found.</Text>}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  formContainer: { padding: 20, backgroundColor: 'white', marginBottom: 10 },
  listContainer: { padding: 20, backgroundColor: 'white' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { height: 40, borderColor: '#ddd', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, borderRadius: 5 },
  plantItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  plantName: { fontSize: 16, fontWeight: '500' },
});

export default AdminPanelScreen;
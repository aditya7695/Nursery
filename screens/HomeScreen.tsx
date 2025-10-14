import React, { useState, useEffect } from 'react';
import { Plant } from '../../FlowerPlantNursery/types';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../FlowerPlantNursery/App';

const API_URL = 'http://10.0.2.2:3000/api/plants';
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlantDetails'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setPlants(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the plants:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Featured Plants</Text>
      <FlatList
        data={plants}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('PlantDetails', { plant: item })}>
            <View style={styles.plantItem}>
              <Text style={styles.plantName}>{item.name}</Text>
              <Text>{item.category} - ₹{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, paddingTop: 50, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 10 },
  plantItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  plantName: { fontSize: 18, fontWeight: '500' },
});

export default HomeScreen;
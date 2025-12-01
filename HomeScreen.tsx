import React, { useState, useCallback } from 'react';
import { Plant } from '../../Nursery/types';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../Nursery/App';

// REPLACE with your computer's IP
const API_URL = 'http://10.0.2.2:3000/api/plants';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlantDetails'>;

const { width } = Dimensions.get('window');

// Layout Calculations
const spacing = 15; 
const padding = 20; 
const recommendationCardWidth = width * 0.4;
const featuredCardWidth = (width - (padding * 2) - spacing) / 2;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      axios.get(API_URL)
        .then(response => {
          setPlants(response.data);
        })
        .catch(error => {
          console.error("Error fetching plants:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [])
  );

  const renderRecommendationItem = ({ item }: { item: Plant }) => (
    <TouchableOpacity
      style={styles.recommendationCard}
      onPress={() => navigation.navigate('PlantDetails', { plant: item })}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://reactnative.dev/img/tiny_logo.png' }}
        style={styles.recommendationImage}
        resizeMode="cover"
      />
      <Text style={styles.recommendationName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.recommendationPrice}>₹{item.price}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedItem = ({ item }: { item: Plant }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => navigation.navigate('PlantDetails', { plant: item })}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://reactnative.dev/img/tiny_logo.png' }}
        style={styles.featuredImage}
        resizeMode="cover"
      />
      <View style={styles.featuredTextContainer}>
        <Text style={styles.featuredName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.featuredCategory} numberOfLines={1}>{item.category}</Text>
        <Text style={styles.featuredPrice}>₹{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Recommendations</Text>
      <FlatList
        data={plants.slice(0, 5)}
        keyExtractor={(item) => item._id}
        renderItem={renderRecommendationItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recommendationList}
      />
      <Text style={styles.title}>Featured Plants</Text>
    </View>
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        key={'#'} 
        data={plants}
        keyExtractor={(item) => item._id}
        renderItem={renderFeaturedItem}
        ListHeaderComponent={ListHeader}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.featuredListContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  headerContainer: {
    marginBottom: 10,
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    paddingHorizontal: 20, 
    marginTop: 20, 
    marginBottom: 15 
  },
  recommendationList: { 
    paddingHorizontal: 20, 
    paddingBottom: 10 
  },
  recommendationCard: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    width: recommendationCardWidth, 
    marginRight: 15, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3.84, 
    elevation: 5 
  },
  recommendationImage: { 
    width: '100%', 
    height: 120, 
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10 
  },
  recommendationName: { 
    fontSize: 16, 
    fontWeight: '500', 
    paddingHorizontal: 10, 
    paddingTop: 8 
  },
  recommendationPrice: { 
    fontSize: 14, 
    color: '#2d5016', 
    fontWeight: 'bold', 
    paddingHorizontal: 10, 
    paddingBottom: 10 
  },
  featuredListContent: {
    paddingHorizontal: padding,
    paddingBottom: 100,
    paddingTop: 50, // <--- THIS FIXED THE ISSUE
  },
  row: {
    justifyContent: 'space-between', 
    marginBottom: 15, 
  },
  featuredCard: { 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    width: featuredCardWidth, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3.84, 
    elevation: 5, 
    overflow: 'hidden' 
  },
  featuredImage: { 
    width: '100%', 
    height: 150, 
  },
  featuredTextContainer: { 
    padding: 10 
  },
  featuredName: { 
    fontSize: 16, 
    fontWeight: 'bold',
    marginBottom: 2
  },
  featuredCategory: { 
    fontSize: 12, 
    color: 'gray', 
    marginBottom: 4 
  },
  featuredPrice: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#2d5016' 
  },
});

export default HomeScreen;
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Plant } from '../types';
import RazorpayCheckout from 'react-native-razorpay';

const API_URL = 'http://10.0.2.2:3000';

interface CartItem {
  plantId: Plant;
  quantity: number;
  _id: string;
}

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
        const token = await AsyncStorage.getItem('user_token');
        if (!token) {
            Alert.alert('Please log in to view your cart.');
            setLoading(false);
            return;
        }
        const response = await axios.get(`${API_URL}/api/cart`, {
            headers: { 'x-auth-token': token },
        });
        setCartItems(response.data);
    } catch (error) {
        console.error('Failed to fetch cart:', error);
    } finally {
        setLoading(false);
    }
  };
  
  const handleCheckout = async () => {
    try {
        const token = await AsyncStorage.getItem('user_token');
        const { data: order } = await axios.post(`${API_URL}/api/checkout/create`, {}, {
            headers: { 'x-auth-token': token },
        });
        const options = {
            description: 'Payment for plants from Pallawankur Nursery',
            currency: 'INR',
            key:'rzp_test_RTRB3MvhlMvmtz', // IMPORTANT: Add your Key ID
            amount: order.amount,
            name: 'Pallawankur Nursery',
            order_id: order.id,
            theme: { color: '#2d5016' }
        };
        RazorpayCheckout.open(options).then(async (data: any) => {
            await axios.post(`${API_URL}/api/checkout/verify`, {}, { 
                headers: { 'x-auth-token': token } 
            });
            Alert.alert('Success', 'Your order has been placed!');
            fetchCartItems();
        }).catch((error:any) => {
            Alert.alert('Payment Failed', `Error: ${error.code} | ${error.description}`);
        });
    } catch (error) {
        console.error('Checkout error:', error);
        Alert.alert('Error', 'Could not initiate checkout.');
    }
  };

  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((sum, item) => {
        if (item && item.plantId) {
            return sum + item.plantId.price * item.quantity;
        }
        return sum;
    }, 0);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCartItems();
    }, [])
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.plantId.name} (x{item.quantity})</Text>
            <Text>₹{item.plantId.price * item.quantity}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₹{calculateTotal()}</Text>
        <Button title="Proceed to Checkout" onPress={handleCheckout} disabled={cartItems.length === 0} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 20 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemName: { fontSize: 16 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' },
  totalText: { fontSize: 18, fontWeight: 'bold', textAlign: 'right' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
});

export default CartScreen;
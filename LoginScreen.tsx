import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import axios from 'axios';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Nursery/App';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Make sure to use your specific IP address
const API_URL = 'http://10.0.2.2:3000'; 
type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    axios.post(`${API_URL}/api/login`, { email, password })
      .then(async (response) => {
        const { token, role } = response.data;
        await AsyncStorage.setItem('user_token', token);
        await AsyncStorage.setItem('user_role', role);
        Alert.alert('Success', 'You are logged in!');
        navigation.navigate('MainTabs');
      })
      .catch(error => {
        console.error(error);
        if (error.response) {
          Alert.alert('Login Failed', error.response.data.message || 'Invalid credentials');
        } else {
          Alert.alert('Error', 'Network error. Check your connection.');
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#666"
      />

      {/* Login Button (Primary) */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Divider Text */}
      <Text style={styles.orText}>— OR —</Text>

      {/* Register Button (Secondary) */}
      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerButtonText}>Create New Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 40, 
    color: '#2d5016' // Using your app's green theme
  },
  input: { 
    height: 50, 
    borderColor: '#ddd', 
    borderWidth: 1, 
    marginBottom: 15, 
    paddingHorizontal: 15, 
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fafafa'
  },
  // Primary Button Style
  loginButton: {
    backgroundColor: '#2d5016',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#999',
    fontWeight: '500'
  },
  // Secondary Button Style
  registerButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2d5016',
  },
  registerButtonText: {
    color: '#2d5016',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Nursery/App'; // Make sure this path is correct
import AsyncStorage from '@react-native-async-storage/async-storage';

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

        // Check for a response object from the server
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 500) {
            Alert.alert('Login Failed', 'Something went wrong on our end. Please try again later.');
          } else if (error.response.status === 401 || error.response.status === 404) {
            // 401 Unauthorized or 404 Not Found are common for bad credentials
            Alert.alert('Login Failed', 'Invalid email or password.');
          } else {
            Alert.alert('Login Failed', `An error occurred: ${error.response.data.message || 'Please try again.'}`);
          }
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          Alert.alert('Network Error', 'Unable to connect to the server. Please check your connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Don't have an account? Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 8 },
});

export default LoginScreen;
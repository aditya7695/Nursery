import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../Nursery/App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('user_token');
        const role = await AsyncStorage.getItem('user_role');
        
        setIsLoggedIn(!!token); // Convert token existence to boolean
        setUserRole(role);
      };
      checkLoginStatus();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    // Optional: Navigate to Home or stay on Profile (which now shows Guest view)
  };

  // --- GUEST VIEW (Not Logged In) ---
  if (!isLoggedIn) {
    return (
      <View style={styles.guestContainer}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2919/2919600.png' }} // Generic plant icon
          style={styles.guestImage}
        />
        <Text style={styles.guestTitle}>Welcome to Pallawankur!</Text>
        <Text style={styles.guestSubtitle}>
          Log in to manage your orders, see your favorites, and access special offers.
        </Text>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerButtonText}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- USER VIEW (Logged In) ---
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.avatar}>🧑‍🌿</Text>
        <Text style={styles.name}>Pallawankur Nursery</Text>
        <Text style={styles.email}>Pallawankur@gmail.com</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Favorites')}>
          <Text style={styles.menuIcon}>❤️</Text>
          <Text style={styles.menuText}>My Favorites</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('History')}>
          <Text style={styles.menuIcon}>⏰</Text>
          <Text style={styles.menuText}>Purchase History</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Following')}>
          <Text style={styles.menuIcon}>👥</Text>
          <Text style={styles.menuText}>Following</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        
        {userRole === 'admin' && (
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AdminPanel')}>
            <Text style={styles.menuIcon}>🛡️</Text>
            <Text style={styles.menuText}>Admin Panel</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>Help & Support</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#2d5016', padding: 30, alignItems: 'center' },
  avatar: { fontSize: 80, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  email: { fontSize: 16, color: '#E0F2E9' },
  menuContainer: { marginTop: 20, backgroundColor: '#FFF' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  menuIcon: { fontSize: 22, marginRight: 20 },
  menuText: { flex: 1, fontSize: 16, color: '#333' },
  menuArrow: { fontSize: 20, color: '#CCC' },
  logoutButton: { margin: 20, backgroundColor: '#FF6347', padding: 15, borderRadius: 10, alignItems: 'center' },
  logoutButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  
  // Guest Styles
  guestContainer: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  guestImage: { width: 100, height: 100, marginBottom: 20, tintColor: '#2d5016' },
  guestTitle: { fontSize: 24, fontWeight: 'bold', color: '#2d5016', marginBottom: 10, textAlign: 'center' },
  guestSubtitle: { fontSize: 16, color: 'gray', textAlign: 'center', marginBottom: 40, paddingHorizontal: 20 },
  loginButton: { backgroundColor: '#2d5016', paddingVertical: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 15 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  registerButton: { backgroundColor: '#fff', paddingVertical: 15, borderRadius: 10, width: '100%', alignItems: 'center', borderWidth: 2, borderColor: '#2d5016' },
  registerButtonText: { color: '#2d5016', fontSize: 18, fontWeight: 'bold' },
});

export default ProfileScreen;
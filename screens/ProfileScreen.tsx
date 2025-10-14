import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../FlowerPlantNursery/App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const getRole = async () => {
      const role = await AsyncStorage.getItem('user_role');
      setUserRole(role);
    };
    getRole();
  }, []);

  const handleLogout = () => {
    AsyncStorage.clear();
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.avatar}>🧑‍🌿</Text>
        <Text style={styles.name}>Pallawankur Nursery</Text>
        <Text style={styles.email}>Pallawankur@example.com</Text>
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
});

export default ProfileScreen;
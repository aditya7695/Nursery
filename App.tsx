import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Import types
import { Plant } from './types';

// Import all screens
import HomeScreen from './screens/HomeScreen';
//import CategoriesScreen from './screens/CategoriesScreen';
import CartScreen from './screens/CartScreen';
//import AlertsScreen from './screens/AlertsScreen';
import ProfileScreen from './screens/ProfileScreen';
import PlantDetailsScreen from './screens/PlantDetailsScreen';
//import FavoritesScreen from './screens/FavoritesScreen';
//import HistoryScreen from './screens/HistoryScreen';
//import FollowingScreen from './screens/FollowingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  AdminPanel: undefined;
  PlantDetails: { plant: Plant };
  Favorites: undefined;
  History: undefined;
  Following: undefined;
};

export type TabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Alerts: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          if (route.name === 'Home') iconName = '🏠';
          else if (route.name === 'Categories') iconName = '📑';
          else if (route.name === 'Cart') iconName = '🛒';
          else if (route.name === 'Alerts') iconName = '🔔';
          else if (route.name === 'Profile') iconName = '👤';
          return <Text style={{ fontSize: size, color: color }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: '#2d5016',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="PlantDetails" component={PlantDetailsScreen} options={{ title: 'Plant Details' }} />
        <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
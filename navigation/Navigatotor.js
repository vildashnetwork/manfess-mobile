import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import MarksScreen from '../screens/MarksScreen';
import TimetableScreen from '../screens/TimetableScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import MockOlevel from '../screens/MockOlevel';
import MockAlevel from '../screens/MockAlevel';
import PremockAlevel from '../screens/PremockAlevel';
import PremockOlevel from "../screens/PremockOlevel";
import FilledPremock from '../screens/FilledPremock';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Create a Stack for Dashboard
function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="MockOlevel" component={MockOlevel} />
      <Stack.Screen name="MockAlevel" component={MockAlevel} />
      <Stack.Screen name="PremockAlevel" component={PremockAlevel} />
      <Stack.Screen name="PremockOlevelclass" component={PremockOlevel} />
      <Stack.Screen name="FilledPremock" component={FilledPremock} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 70 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 5,
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack} // use the stack here
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Marks" 
        component={MarksScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="clipboard-outline" color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Timetable" 
        component={TimetableScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isTeacher, setIsTeacher] = useState(null); // null = loading

  useEffect(() => {
    const loadTeacher = async () => {
      const data = await AsyncStorage.getItem('teacher');
      setIsTeacher(!!data); // true if teacher exists
    };
    loadTeacher();
  }, []);

  if (isTeacher === null) return null; // optional splash

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isTeacher ? (
        <Stack.Screen name="Home" component={AppTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

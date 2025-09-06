import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

export default function DashboardScreen({ navigation }) {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const loadTeacher = async () => {
      const data = await AsyncStorage.getItem('teacher');
      if(data) setTeacher(JSON.parse(data));
    };
    loadTeacher();
  }, []);

  const cards = [
    { title:'Enter Marks', screen:'Marks', color:'#4CAF50' },
    { title:'View Timetable', screen:'Timetable', color:'#03A9F4' },
    { title:'Profile', screen:'Profile', color:'#FF9800' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* StatusBar style */}
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Welcome, {teacher?.email}</Text>
        <Animatable.View animation="fadeInUp" style={styles.cardsContainer}>
          {cards.map((card, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.card, { backgroundColor: card.color }]}
              onPress={() => navigation.navigate(card.screen)}
            >
              <Text style={styles.cardText}>{card.title}</Text>
            </TouchableOpacity>
          ))}
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0ff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // <-- fix for Android
  },
  container: {
    padding: 20,
    paddingBottom: 30, // ensures bottom content doesn’t overlap tab bar
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    width: '48%',
    height: 140,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const [teacher, setTeacher] = useState({ email: '' });

  useEffect(() => {
    const loadTeacher = async () => {
      const data = await AsyncStorage.getItem('teacher');
      if (data) setTeacher(JSON.parse(data));
    };
    loadTeacher();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem('teacher', JSON.stringify(teacher));
    Alert.alert('Success', 'Profile updated!');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('teacher');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          value={teacher.email}
          placeholder="Email"
          placeholderTextColor="#aaa"
          onChangeText={email => setTeacher({ ...teacher, email })}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    color: '#000',
    fontSize: 16,
  },
  button: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#4CAF50',
  },
  logoutButton: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 15,
  },
});

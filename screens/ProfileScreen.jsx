import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DevSettings } from 'react-native';
import axios from 'axios';

export default function ProfileScreen() {
  const [teacher, setTeacher] = useState({ Number: '', Name: '' });
  const [loading, setLoading] = useState(false);

  // Load teacher data from AsyncStorage on mount
  useEffect(() => {
    const loadTeacher = async () => {
      try {
        const data = await AsyncStorage.getItem('teacher');
        if (data) setTeacher(JSON.parse(data));
      } catch (error) {
        console.error('Error loading teacher:', error);
      }
    };
    loadTeacher();
  }, []);

  // Save updated teacher profile
  const handleSave = async () => {
    if (!teacher.Number || !teacher.Name) {
      return Alert.alert('Error', 'Please fill in all fields.');
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "https://manfess-backend.onrender.com/api/teachers/updateteacher",
        {
          Number: teacher.Number,
           Name: teacher.Name,
           localid: teacher.localid
        }
      );

      if (res.data) {
        await AsyncStorage.setItem('teacher', JSON.stringify(teacher));
        Alert.alert('Success', 'Profile updated!');
      }

    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Could not save profile.');
    } finally {
      setLoading(false);
    }
  };

  // Logout and clear AsyncStorage
  const handleLogout = async () => {
    await AsyncStorage.removeItem('teacher');
    DevSettings.reload(); // 🚀 restart app in dev
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.card}>
        {/* Avatar */}
        <View style={styles.profile}>
          <Text style={styles.avatarText}>
            {teacher.Name ? teacher.Name.charAt(0).toUpperCase() : 'M'}
          </Text>
        </View>

        {/* Number */}
        <Text style={styles.label}>Number</Text>
        <TextInput
          style={styles.input}
          value={teacher?.Number}
          placeholder="Enter your number"
          placeholderTextColor="#aaa"
          onChangeText={text => setTeacher({ ...teacher, Number: text })}
        />

        {/* Password / Name */}
        <Text style={styles.label}>Password / Name</Text>
        <TextInput
          style={styles.input}
          value={teacher?.Name}
          placeholder="Enter Name*"
          placeholderTextColor="#aaa"
          onChangeText={text => setTeacher({ ...teacher, Name: text })}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Saving..." : "Save"}</Text>
        </TouchableOpacity>

        {/* Logout Button */}
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
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    alignSelf: 'flex-start',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#fafafa',
    color: '#000',
    fontSize: 16,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#4CAF50',
  },
  logoutButton: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 14,
  },
});

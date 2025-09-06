import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [teacher, setTeacher] = useState({ email:'' });

  useEffect(() => {
    const loadTeacher = async () => {
      const data = await AsyncStorage.getItem('teacher');
      if(data) setTeacher(JSON.parse(data));
    };
    loadTeacher();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem('teacher', JSON.stringify(teacher));
    Alert.alert('Success', 'Profile updated!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        style={styles.input}
        value={teacher.email}
        onChangeText={email => setTeacher({ ...teacher, email })}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:20,justifyContent:'center'},
  title:{fontSize:24,fontWeight:'bold',marginBottom:20},
  input:{borderWidth:1,padding:12,borderRadius:8,marginBottom:15},
  button:{padding:15,backgroundColor:'#4CAF50',borderRadius:8},
  buttonText:{color:'#fff',textAlign:'center',fontWeight:'bold'}
});

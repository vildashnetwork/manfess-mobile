import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MarksScreen() {
  const [marks, setMarks] = useState({});
  const [students, setStudents] = useState([
    { id:1, name:'Student 1' },
    { id:2, name:'Student 2' },
    { id:3, name:'Student 3' },
    { id:4, name:'Student 4' }
  ]);

  useEffect(()=>{
    const loadMarks = async ()=>{
      const saved = await AsyncStorage.getItem('marks');
      if(saved) setMarks(JSON.parse(saved));
    };
    loadMarks();
  },[]);

  const handleChange = (id, value)=>setMarks(prev=>({...prev,[id]:value}));

  const handleSave = async ()=>{
    await AsyncStorage.setItem('marks', JSON.stringify(marks));
    Alert.alert('Saved Offline');
  };

  const handleSubmit = async ()=>{
    Alert.alert('Submitted','Marks sent to admin');
    await AsyncStorage.removeItem('marks');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Enter Marks</Text>
      {students.map(student=>(
        <View key={student.id} style={styles.studentRow}>
          <Text style={styles.studentName}>{student.name}</Text>
          <TextInput style={styles.input} placeholder="Marks" keyboardType="numeric" value={marks[student.id]||''} onChangeText={val=>handleChange(student.id,val)} />
        </View>
      ))}
      <TouchableOpacity style={[styles.button,{backgroundColor:'#4CAF50'}]} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Offline</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button,{backgroundColor:'#03A9F4'}]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:20, backgroundColor:'#f5f5f5'},
  title:{fontSize:24,fontWeight:'bold',marginBottom:20},
  studentRow:{flexDirection:'row', alignItems:'center', marginBottom:15, backgroundColor:'#fff', padding:15, borderRadius:15, elevation:5},
  studentName:{flex:1,fontSize:16,fontWeight:'600'},
  input:{flex:1,padding:10,borderWidth:1,borderColor:'#ccc',borderRadius:10, backgroundColor:'#fafafa'},
  button:{padding:15,borderRadius:12,marginVertical:10},
  buttonText:{color:'#fff', fontWeight:'bold', textAlign:'center'}
});

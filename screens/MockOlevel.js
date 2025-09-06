import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function MockOlevel() {
  const [marks, setMarks] = useState({});
  const [students, setStudents] = useState([
    { id:1, name:'Student 1' },
    { id:2, name:'Student 2' },
    { id:3, name:'Student 3' },
    { id:4, name:'Student 4' }
  ]);
  const [selectedValue, setSelectedValue] = useState('java');

  useEffect(() => {
    const loadMarks = async () => {
      const saved = await AsyncStorage.getItem('marks');
      if(saved) setMarks(JSON.parse(saved));
    };
    loadMarks();
  }, []);

  const handleChange = (id, value) => setMarks(prev => ({ ...prev, [id]: value }));

  const handleSave = async () => {
    await AsyncStorage.setItem('marks', JSON.stringify(marks));
    Alert.alert('Saved Offline');
  };

  const handleSubmit = async () => {
    Alert.alert('Submitted','Marks sent to admin');
    await AsyncStorage.removeItem('marks');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
   <View style={styles.pickerContainer}>
      <Text style={styles.label}>Select a Subject</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => setSelectedValue(itemValue)}
          style={styles.picker}
          dropdownIconColor="#4CAF50"
        >
          <Picker.Item label="Maths" value="Maths" />
          <Picker.Item label="Physics" value="Physics" />
          <Picker.Item label="Chemistry" value="Chemistry" />
        </Picker>
      </View>
      <Text style={styles.selectedText}>Subject Title: {selectedValue}</Text>
       <Text style={styles.selectedText}>Subject Code: 0590</Text>
    </View>


        <Text style={styles.title}> Marks For Mock Olevel</Text>
        
        {students.map(student => (
          <View key={student.id} style={styles.studentRow}>
            <Text style={styles.studentName}>{student.name}</Text>
            <TextInput
              style={styles.input}
              placeholder="Marks"
              keyboardType="numeric"
              value={marks[student.id] || ''}
              onChangeText={val => handleChange(student.id, val)}
            />
          </View>
        ))}

        <TouchableOpacity style={[styles.button,{backgroundColor:'#4CAF50'}]} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Offline</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button,{backgroundColor:'#03A9F4'}]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, backgroundColor:'#f5f5f5',
  marginTop: 30,
   },
    pickerContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 5, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  selectedText: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
  container1: { marginBottom: 20 },
  picker: { height: 50, width: '100%' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  studentRow: { flexDirection:'row', alignItems:'center', marginBottom:15, backgroundColor:'#fff', padding:15, borderRadius:15, elevation:5 },
  studentName: { flex:1, fontSize:16, fontWeight:'600' },
  input: { flex:1, padding:10, borderWidth:1, borderColor:'#ccc', borderRadius:10, backgroundColor:'#fafafa' },
  button: { padding:15, borderRadius:12, marginVertical:10 },
  buttonText: { color:'#fff', fontWeight:'bold', textAlign:'center' }
});

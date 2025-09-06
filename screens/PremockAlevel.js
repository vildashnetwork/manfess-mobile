import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, 
  KeyboardAvoidingView, Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { DevSettings } from 'react-native';
export default function PremockAlevel() {
  const [marks, setMarks] = useState({});
  const [grades, setGrades] = useState({});
  const [students, setStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculate grade
  const calculateGrade = (score) => {
    const numericScore = parseInt(score);
    if (isNaN(numericScore)) return '';
    if (numericScore >= 90) return 'A+';
    if (numericScore >= 80) return 'A';
    if (numericScore >= 60) return 'B';
    if (numericScore >= 45) return 'C';
    if (numericScore >= 35) return 'E';
    return 'U';
  };

  // Load students and subjects
  useEffect(() => {
    const loadData = async () => {
      try {
        const state = await NetInfo.fetch();
        const isOnline = state.isConnected;

        // Subjects
        if (isOnline) {
          const subjectsResponse = await axios.get('https://manfess-backend.onrender.com/api/students/alevel/subjects');
          if (subjectsResponse.data) {
            setAllSubjects(subjectsResponse.data);
            await AsyncStorage.setItem('subjectsalevelpremock', JSON.stringify(subjectsResponse.data));
          }
        } else {
          const localSubjects = await AsyncStorage.getItem('subjectsalevelpremock');
          if (localSubjects) setAllSubjects(JSON.parse(localSubjects));
        }

        // Students
        if (isOnline) {
          const studentsResponse = await axios.get('https://manfess-backend.onrender.com/api/students/alevel');
          if (studentsResponse.data) {
            setStudents(studentsResponse.data);
            await AsyncStorage.setItem('studentsalevelpremock', JSON.stringify(studentsResponse.data));
          }
        } else {
          const localStudents = await AsyncStorage.getItem('studentsalevelpremock');
          if (localStudents) setStudents(JSON.parse(localStudents));
        }

        // Restore saved marks
        const savedMarks = await AsyncStorage.getItem('marksalevelpremock');
        if (savedMarks) setMarks(JSON.parse(savedMarks));
      } catch (error) {
        console.error('Error loading data:', error);
        Alert.alert('Error', 'Failed to load students or subjects.');
      }
    };
    loadData();
  }, []);

  // Filter subjects based on selected code
  useEffect(() => {
    if (selectedSubjectCode) {
      const filtered = allSubjects.filter(
        (sub) => sub.subjectCode === selectedSubjectCode
      );
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects(allSubjects);
    }
  }, [selectedSubjectCode, allSubjects]);

  const handleChange = (id, value) => {
    setMarks(prev => ({ ...prev, [id]: value }));
    setGrades(prev => ({ ...prev, [id]: calculateGrade(value) }));
  };

  // Save or update offline
  const handleSaveOffline = async () => {
    if (!selectedSubjectCode) {
      Alert.alert('Error', 'Please select a subject before saving.');
      return;
    }

    try {
      const localHistory = await AsyncStorage.getItem('mockResultsHistoryalevelpremock');
      const history = localHistory ? JSON.parse(localHistory) : [];

      const updatedHistory = [...history];

      students.forEach(student => {
        const existingIndex = updatedHistory.findIndex(
          item => item.studentname === `${student.FirstName} ${student.LastName}` &&
                  item.Subject_Code === selectedSubjectCode
        );

        const newEntry = {
          studentname: `${student.FirstName} ${student.LastName}`,
          Class: student.Class || 'uppersixth',
          Subject: filteredSubjects[0]?.subjectTitle || 'Unknown',
          Subject_Code: selectedSubjectCode,
          Mark: marks[student.id] || 0,
          Grade: grades[student.id] || calculateGrade(marks[student.id] || 0),
          savedAt: new Date().toISOString()
        };

        if (existingIndex >= 0) {
          updatedHistory[existingIndex] = newEntry;
        } else {
          updatedHistory.push(newEntry);
        }
      });

      await AsyncStorage.setItem('mockResultsHistoryalevelpremock', JSON.stringify(updatedHistory));
      await AsyncStorage.setItem('marksalevelpremock', JSON.stringify(marks));
      Alert.alert('Saved Offline', 'Results saved/updated locally.');
      DevSettings.reload()
      console.log('Offline History:', updatedHistory);
    } catch (error) {
      console.error('Error saving results locally:', error);
      Alert.alert('Error', 'Failed to save results locally.');
    }
  };

  // Push online
  const handleSaveOnline = async () => {
    try {
      setLoading(true);
      const savedResults = await AsyncStorage.getItem('mockResultsHistoryalevelpremock');
      const resultsToSend = savedResults ? JSON.parse(savedResults) : [];

      if (!resultsToSend.length) {
        Alert.alert('No results to send');
        return;
      }

      const response = await axios.post(
        'https://manfess-backend.onrender.com/api/students/alevelpremock',
        resultsToSend
      );

      Alert.alert('Success', `Results pushed online.\nInserted: ${response.data.insertedCount}, Updated: ${response.data.updatedCount}`);
      
      // Clear offline cache
      await AsyncStorage.removeItem('mockResultsHistoryalevelpremock');
      await AsyncStorage.removeItem('marksalevelpremock');
      await AsyncStorage.removeItem('mockResultsalevelpremock');
        DevSettings.reload();
    } catch (error) {
      console.error('Error sending results online:', error);
      Alert.alert('Error', 'Failed to push results online.');
      setLoading(false);
    }finally{
      setLoading(false);

    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select a Subject</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedSubjectCode}
              onValueChange={(itemValue) => setSelectedSubjectCode(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="-- Select Subject --" value="" />
              {allSubjects.map(sub => (
                <Picker.Item 
                  key={sub.subjectCode} 
                  label={sub.subjectTitle} 
                  value={sub.subjectCode} 
                />
              ))}
            </Picker>
          </View>
        </View>

        <Text style={styles.title}>Marks For PreMock A-Level</Text>
        
        {students.map(student => (
          <View key={student.id} style={styles.studentRow}>
            <Text style={styles.studentName}>{student.FirstName} {student.LastName}</Text>
            <TextInput
              style={styles.input}
              placeholder="Marks"
              keyboardType="numeric"
              value={marks[student.id] || ''}
              onChangeText={val => handleChange(student.id, val)}
            />
            <Text style={styles.gradeText}>{grades[student.id]}</Text>
          </View>
        ))}

        <TouchableOpacity style={[styles.button,{backgroundColor:'#649666ff'}]} onPress={handleSaveOffline}>
          <Text style={styles.buttonText}>Save Offline</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button,{backgroundColor:'#3f474bff'}]} onPress={handleSaveOnline} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Loading..." : "Save Online"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, backgroundColor:'#f5f5f5', marginTop: 30 },
  pickerContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 5
  },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, overflow: 'hidden' },
  picker: { height: 50, width: '100%' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  studentRow: { flexDirection:'row', alignItems:'center', marginBottom:15, backgroundColor:'#fff', padding:15, borderRadius:15 },
  studentName: { flex:1, fontSize:16, fontWeight:'600' },
  input: { flex:1, padding:10, borderWidth:1, borderColor:'#ccc', borderRadius:10, backgroundColor:'#fafafa', marginRight:10 },
  gradeText: { fontSize:16, fontWeight:'bold', color:'#1e6921ff' },
  button: { padding:15, borderRadius:12, marginVertical:10 },
  buttonText: { color:'#fff', fontWeight:'bold', textAlign:'center' }
});

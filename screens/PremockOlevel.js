import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, 
  KeyboardAvoidingView, Platform, DevSettings 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function PremockOlevel() {
  const [marks, setMarks] = useState({});
  const [grades, setGrades] = useState({});
  const [students, setStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple online check
  const isOnline = async () => {
    try {
      await axios.get('https://manfess-backend.onrender.com/api/ping'); 
      return true;
    } catch (err) {
      return false;
    }
  };

  // Load students & subjects (online first, then fallback offline)
  useEffect(() => {
    const loadData = async () => {
      const online = await isOnline();
      try {
        if (online) {
          // Fetch subjects and students online
          const subjectsResponse = await axios.get('https://manfess-backend.onrender.com/api/subjects');
          if (subjectsResponse.data) {
            setAllSubjects(subjectsResponse.data);
            await AsyncStorage.setItem('subjects', JSON.stringify(subjectsResponse.data));
          }

          const studentsResponse = await axios.get('https://manfess-backend.onrender.com/api/students');
          if (studentsResponse.data) {
            setStudents(studentsResponse.data);
            await AsyncStorage.setItem('students', JSON.stringify(studentsResponse.data));
          }
        } else {
          // Offline fallback
          const localSubjects = await AsyncStorage.getItem('subjects');
          if (localSubjects) setAllSubjects(JSON.parse(localSubjects));

          const localStudents = await AsyncStorage.getItem('students');
          if (localStudents) setStudents(JSON.parse(localStudents));
        }

        // Restore saved marks
        const savedMarks = await AsyncStorage.getItem('marks');
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
      const filtered = allSubjects.filter(sub => sub.subjectCode === selectedSubjectCode);
      setFilteredSubjects(filtered);
    } else setFilteredSubjects(allSubjects);
  }, [selectedSubjectCode, allSubjects]);

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

  const handleChange = (id, value) => {
    setMarks(prev => ({ ...prev, [id]: value }));
    setGrades(prev => ({ ...prev, [id]: calculateGrade(value) }));
  };

  // Save offline with update logic
  const handleSaveOffline = async () => {
    if (!selectedSubjectCode) {
      Alert.alert('Error', 'Please select a subject.');
      return;
    }

    let existingHistory = await AsyncStorage.getItem('mockResultsHistoryp');
    existingHistory = existingHistory ? JSON.parse(existingHistory) : [];

    const resultsToSave = students.map(student => {
      const existingIndex = existingHistory.findIndex(
        r => r.studentname === `${student.FirstName} ${student.LastName}` && r.Subject_Code === selectedSubjectCode
      );

      const record = {
        studentname: `${student.FirstName} ${student.LastName}`,
        Class: student.Class || 'Level 5',
        Subject: filteredSubjects[0]?.subjectTitle || 'Level 5',
        Subject_Code: selectedSubjectCode,
        Mark: marks[student.id] || 0,
        Grade: grades[student.id] || calculateGrade(marks[student.id] || 0),
        Datepushed: new Date().toISOString(),
        savedAt: new Date().toISOString(),
      };

      if (existingIndex > -1) {
        // Update existing record
        existingHistory[existingIndex] = record;
      } else {
        existingHistory.push(record);
      }

      return record;
    });

    try {
      await AsyncStorage.setItem('mockResultsHistoryp', JSON.stringify(existingHistory));
      await AsyncStorage.setItem('mockResultsp', JSON.stringify(existingHistory));
      Alert.alert('Saved Offline', 'Results updated locally.');
      DevSettings.reload()
      console.log('Saved results:', existingHistory);
    } catch (error) {
      console.error('Error saving results locally:', error);
      Alert.alert('Error', 'Failed to save results locally.');
    }
  };

  // Push online
  const handleSaveOnline = async () => {
    try {
      setLoading(true);
      const savedResults = await AsyncStorage.getItem('mockResultsp');
      const resultsToSend = savedResults ? JSON.parse(savedResults) : [];

      if (resultsToSend.length === 0) {
        Alert.alert('No results to send');
        return;
      }

      const response = await axios.post('https://manfess-backend.onrender.com/api/students/olevelpremock', resultsToSend);

      Alert.alert('Success', `Results pushed online.\nInserted: ${response.data.insertedCount}, Updated: ${response.data.updatedCount}`);
      await AsyncStorage.removeItem('mockResultsp');
      await AsyncStorage.removeItem('mockResultsHistoryp');
      await AsyncStorage.removeItem('marksp');
      DevSettings.reload();

    } catch (error) {
      console.error('Error sending results online:', error);
      Alert.alert('Error', 'Failed to push results online.');
    } finally {
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
              dropdownIconColor="#4CAF50"
            >
              <Picker.Item label="-- Select Subject --" value="" />
              {allSubjects.map(sub => (
                <Picker.Item key={sub.subjectCode} label={sub.subjectTitle} value={sub.subjectCode} />
              ))}
            </Picker>
          </View>
          {selectedSubjectCode && filteredSubjects.length > 0 && (
            <>
              <Text style={styles.selectedText}>Subject Title: {filteredSubjects[0].subjectTitle}</Text>
              <Text style={styles.selectedText}>Subject Code: {filteredSubjects[0].subjectCode}</Text>
            </>
          )}
        </View>

        <Text style={styles.title}>Marks For Mock O-Level</Text>
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

        <TouchableOpacity style={[styles.button,{backgroundColor:'#4CAF50'}]} onPress={handleSaveOffline}>
          <Text style={styles.buttonText}>Save Offline</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button,{backgroundColor:'#03A9F4'}]} onPress={handleSaveOnline} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Loading..." : "Save Online"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, backgroundColor:'#f5f5f5', marginTop: 30 },
  pickerContainer: { marginVertical: 20, padding: 15, backgroundColor: '#fff', borderRadius: 15, elevation: 5 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333' },
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, overflow: 'hidden' },
  picker: { height: 50, width: '100%', color: '#333' },
  selectedText: { marginTop: 10, fontSize: 14, color: '#555' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  studentRow: { flexDirection:'row', alignItems:'center', marginBottom:15, backgroundColor:'#fff', padding:15, borderRadius:15, elevation:5 },
  studentName: { flex:1, fontSize:16, fontWeight:'600' },
  input: { flex:1, padding:10, borderWidth:1, borderColor:'#ccc', borderRadius:10, backgroundColor:'#fafafa', marginRight:10 },
  gradeText: { fontSize:16, fontWeight:'bold', color:'#4CAF50' },
  button: { padding:15, borderRadius:12, marginVertical:10 },
  buttonText: { color:'#fff', fontWeight:'bold', textAlign:'center' }
});

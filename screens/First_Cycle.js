// First_Cycle.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, 
  KeyboardAvoidingView, Platform, DevSettings
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

export default function First_Cycle() {
  const [marks, setMarks] = useState({});
  const [grades, setGrades] = useState({});
  const [students, setStudents] = useState([]);           // visible students (filtered or all)
  const [allStudents, setAllStudents] = useState([]);     // all cached students
  const [allSubjects, setAllSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [allClasses, setAllClasses] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const netInfoUnsubscribeRef = useRef(null);
   const [selectedSequence, setSelectedSequence] = useState("");

  const BASE = 'https://manfess-backend.onrender.com';

  // utility: check online via NetInfo
  const checkOnline = async () => {
    try {
      const state = await NetInfo.fetch();
      return state.isConnected === true;
    } catch {
      return false;
    }
  };

  // --------------------------
  // Load subjects (online => replace cache, offline => load cache)
  // --------------------------
  const fetchSubjectsAndCache = async (online) => {
    try {
      if (online) {
        const res = await axios.get(`${BASE}/api/subjects/all`);
        if (res?.data) {
          setAllSubjects(res.data);
          await AsyncStorage.setItem('offlineSubjects', JSON.stringify(res.data));
        }
      } else {
        const local = await AsyncStorage.getItem('offlineSubjects');
        if (local) setAllSubjects(JSON.parse(local));
      }
    } catch (err) {
      console.error('fetchSubjectsAndCache error', err);
      // try to load local if exists
      try {
        const local = await AsyncStorage.getItem('offlineSubjects');
        if (local) setAllSubjects(JSON.parse(local));
      } catch (e) { /* ignore */ }
    }
  };

  // --------------------------
  // Fetch ALL students (online => replace cache, offline => load cache)
  // --------------------------
  const fetchAllStudentsAndCache = async (online) => {
    try {
      let all = [];
      if (online) {
        const res = await axios.get(`${BASE}/api/students/all/students`);
        if (res?.data) {
          all = res.data;
          // replace old cache completely
          await AsyncStorage.removeItem('offlineStudentsAll');
          await AsyncStorage.setItem('offlineStudentsAll', JSON.stringify(all));
        }
      } else {
        const local = await AsyncStorage.getItem('offlineStudentsAll');
        if (local) all = JSON.parse(local);
      }

      setAllStudents(all);
      setStudents(all); // show all students first
      // extract dynamic classes & departments
      const levels = [...new Set(all.map(s => s.level).filter(Boolean))];
      const departments = [...new Set(all.map(s => s.Department).filter(Boolean))];
      setAllClasses(levels);
      setAllDepartments(departments);
    } catch (err) {
      console.error('fetchAllStudentsAndCache error', err);
      // fallback to local
      try {
        const local = await AsyncStorage.getItem('offlineStudentsAll');
        if (local) {
          const all = JSON.parse(local);
          setAllStudents(all);
          setStudents(all);
          const levels = [...new Set(all.map(s => s.level).filter(Boolean))];
          const departments = [...new Set(all.map(s => s.Department).filter(Boolean))];
          setAllClasses(levels);
          setAllDepartments(departments);
        }
      } catch (e) { /* ignore */ }
    }
  };

  // initial load on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      const online = await checkOnline();
      await Promise.all([
        fetchSubjectsAndCache(online),
        fetchAllStudentsAndCache(online)
      ]);
    })();

    // subscribe to connectivity changes: when we go online, refresh students & subjects and replace cache
    netInfoUnsubscribeRef.current = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        console.log('Device came online — refreshing server data and replacing cache');
        await fetchSubjectsAndCache(true);
        await fetchAllStudentsAndCache(true);
      } else {
        console.log('Device offline');
      }
    });

    return () => {
      // cleanup
      if (netInfoUnsubscribeRef.current) netInfoUnsubscribeRef.current();
      mounted = false;
    };
  }, []);

  // --------------------------
  // Filtering students locally when filters change
  // --------------------------
  useEffect(() => {
    if (selectedClass || selectedDepartment) {
      const filtered = allStudents.filter(
        s => (!selectedClass || s.level === selectedClass) &&
             (!selectedDepartment || s.Department === selectedDepartment)
      );
      setStudents(filtered);
    } else {
      setStudents(allStudents);
    }
  }, [selectedClass, selectedDepartment, allStudents]);

  // --------------------------
  // Filter subjects list (but you said you don't want subject filtering by default)
  // We'll still limit displayed subjects to match class+dept when both are set, otherwise show all.
  // --------------------------
  useEffect(() => {
    if (selectedClass && selectedDepartment) {
      setFilteredSubjects(allSubjects.filter(
        sub => (!sub.level || sub.level === selectedClass) && (!sub.departmentName || sub.departmentName === selectedDepartment)
      ));
    } else {
      setFilteredSubjects(allSubjects);
    }
  }, [selectedClass, selectedDepartment, allSubjects]);

  // --------------------------
  // Grade calculator
  // --------------------------
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

  // Handle marks input
  const handleChange = (id, value) => {
    setMarks(prev => ({ ...prev, [id]: value }));
    setGrades(prev => ({ ...prev, [id]: calculateGrade(value) }));
  };

  // --------------------------
  // Save offline (per class+department). If class/department not chosen we use 'ALL' placeholder.
  // --------------------------
  const handleSaveOffline = async () => {
    if (!selectedSubjectCode) return Alert.alert('Error', 'Please select a subject.');

    // fallback keys if teacher hasn't picked class/dep
    const clsKey = selectedClass || 'ALL';
    const depKey = selectedDepartment || 'ALL';

    // load existing history
    const histKey = `offlineResultsHistory_${clsKey}_${depKey}`;
    let history = [];
    try {
      const stored = await AsyncStorage.getItem(histKey);
      history = stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('load history error', err);
      history = [];
    }

    // upsert each student in current visible list
    students.forEach(student => {
      const existingIndex = history.findIndex(
        r => r.studentname === `${student.FirstName} ${student.LastName}` && r.Subject_Code === selectedSubjectCode
      );

      const selectedSubject = allSubjects.find(s => String(s.subjectCode) === String(selectedSubjectCode));
      const record = {
        studentname: `${student.FirstName} ${student.LastName}`,
        localid: student.localid ?? null,
        studentId: student.id ?? null,
        Class: student.level || clsKey,
        Department: student.Department || depKey,
        Subject: selectedSubject?.subjectTitle || 'N/A',
        Subject_Code: selectedSubjectCode,
        Mark: marks[student.id] ?? 0,
        Grade: grades[student.id] ?? calculateGrade(marks[student.id] ?? 0),
        Sequence: selectedSequence,
        Datepushed: new Date().toISOString()
      };

      if (existingIndex > -1) history[existingIndex] = record;
      else history.push(record);
    });

    try {
      await AsyncStorage.setItem(histKey, JSON.stringify(history));
      await AsyncStorage.setItem(`offlineResults_${clsKey}_${depKey}`, JSON.stringify(history));
      await AsyncStorage.setItem(`offlineMarks_${clsKey}_${depKey}`, JSON.stringify(marks));
      Alert.alert('Saved Offline', 'Results updated locally.');
      // optional: reload dev menu to reflect changes immediately during development
      // DevSettings.reload();
    } catch (err) {
      console.error('save offline error', err);
      Alert.alert('Error', 'Failed to save results locally.');
    }
  };

const handleSaveOnline = async () => {
  try {
    setLoading(true);

    const allKeys = await AsyncStorage.getAllKeys();

    // filter only offlineResults keys
    const resultKeys = allKeys.filter(k => k.startsWith('offlineResults'));

    if (!resultKeys.length) {
      Alert.alert("No results to send");
      return;
    }

    for (const key of resultKeys) {
      const stored = await AsyncStorage.getItem(key);
      if (!stored) continue;

      try {
        const offlineData = JSON.parse(stored);

        if (!Array.isArray(offlineData)) {
          console.warn(`Skipped key ${key} because data is not an array`);
          continue;
        }

        const payload = offlineData.map((rec) => ({
          studentname: rec.studentname,
          Class: rec.Class,
          Department: rec.Department,
          Subject: rec.Subject,
          Subject_Code: rec.Subject_Code,
          Mark: rec.Mark,
          sequence: rec.Sequence,
        }));

        await axios.post(`${BASE}/api/terminalresults`, payload);
        console.log(`Pushed results for ${key}`);

        // remove key after successful push
        await AsyncStorage.removeItem(key);

      } catch (err) {
        console.error(`Failed to push results for ${key}`, err.response?.data || err.message);
      }
    }

    Alert.alert("Success", "All offline results pushed online.");
  } catch (err) {
    console.error("handleSaveOnline error", err);
    Alert.alert("Error", "Failed to push results online. Check logs.");
  } finally {
    setLoading(false);
  }
};




  // --------------------------
  // UI
  // --------------------------
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Filter Students</Text>

        {/* Class Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Class</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={selectedClass} onValueChange={(v) => setSelectedClass(v)} style={styles.picker}>
              <Picker.Item label="-- All Classes --" value="" style={{color: "#333"}} />
              {allClasses.map((cls, idx) => <Picker.Item key={idx} label={cls} value={cls} />)}
            </Picker>
          </View>
        </View>

        {/* Department Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Department</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={selectedDepartment} onValueChange={(v) => setSelectedDepartment(v)} style={styles.picker}>
              <Picker.Item label="-- All Departments --" value="" style={{color: "#333"}}/>
              {allDepartments.map((dep, idx) => <Picker.Item key={idx} label={dep} value={dep} />)}
            </Picker>
          </View>
        </View>

        {/* Subject Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Subject</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={selectedSubjectCode} onValueChange={(v) => setSelectedSubjectCode(v)} style={styles.picker}>
              <Picker.Item label="-- Select Subject --" value="" style={{color: "#333"}}/>
              {filteredSubjects.map(sub => (
                <Picker.Item key={String(sub.subjectCode)} label={sub.subjectTitle} value={String(sub.subjectCode)} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Sequence</Text>
          <Picker
            selectedValue={selectedSequence}
            onValueChange={(v) => setSelectedSequence(v)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Sequence --" value="" style={{color: "#333"}}/>
            <Picker.Item label="First Sequence" value="First Sequence" style={{color: "#333"}}/>
            <Picker.Item label="Second Sequence" value="Second Sequence" style={{color: "#333"}}/>
            <Picker.Item label="Third Sequence" value="Third Sequence" style={{color: "#333"}}/>
            <Picker.Item label="Fourth Sequence" value="Fourth Sequence" style={{color: "#333"}}/>
            <Picker.Item label="Fifth Sequence" value="Fifth Sequence" style={{color: "#333"}}/>
            <Picker.Item label="Sixth Sequence" value="Sixth Sequence" style={{color: "#333"}}/>
          
          </Picker>
        </View>

        <Text style={styles.title}>Marks Entry ({students.length} students shown)</Text>

        {students.length === 0 && <Text style={{ textAlign: 'center', marginBottom: 12 }}>No students to show.</Text>}

        {students.map(student => (
          <View key={student.id ?? student.localid ?? student.studentId} style={styles.studentRow}>
            <Text style={styles.studentName}>
              {student.FirstName} {student.LastName}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Marks"
              keyboardType="numeric"
              value={String(marks[student.id] ?? '')}
              onChangeText={val => handleChange(student.id, val)}
            />

            <Text style={styles.gradeText}>{grades[student.id] ?? ''}</Text>
          </View>
        ))}

        <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={handleSaveOffline}>
          <Text style={styles.buttonText}>Save Offline</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#03A9F4' }]} onPress={handleSaveOnline} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Save Online'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  scrollContainer: { padding: 16, backgroundColor: '#f5f5f5', paddingBottom: 60, marginTop: 45 },
  pickerContainer: { marginVertical: 12, padding: 12, backgroundColor: '#fff', borderRadius: 12, elevation: 3 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#333' },
  pickerWrapper: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden' },
  picker: { height: 56, width: '100%', color: "#333" },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  studentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#fff', padding: 12, borderRadius: 10, elevation: 2 },
  studentName: { flex: 1, fontSize: 15, fontWeight: '600' },
  input: { width: 90, padding: 8, borderWidth: 1, borderColor: '#ccc', color: "#333", borderRadius: 8, marginRight: 8, textAlign: 'center' },
  gradeText: { width: 48, textAlign: 'center', fontWeight: '700', color: '#4CAF50' },
  button: { padding: 12, borderRadius: 10, marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' }
});













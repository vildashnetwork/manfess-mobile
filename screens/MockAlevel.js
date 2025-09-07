// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, 
//   KeyboardAvoidingView, Platform 
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Picker } from '@react-native-picker/picker';
// import axios from 'axios';
// import NetInfo from '@react-native-community/netinfo';
// import { DevSettings } from 'react-native';
// export default function MockAlevel() {
//   const [marks, setMarks] = useState({});
//   const [grades, setGrades] = useState({});
//   const [students, setStudents] = useState([]);
//   const [allSubjects, setAllSubjects] = useState([]);
//   const [filteredSubjects, setFilteredSubjects] = useState([]);
//   const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Calculate grade
//   const calculateGrade = (score) => {
//     const numericScore = parseInt(score);
//     if (isNaN(numericScore)) return '';
//     if (numericScore >= 90) return 'A+';
//     if (numericScore >= 80) return 'A';
//     if (numericScore >= 60) return 'B';
//     if (numericScore >= 45) return 'C';
//     if (numericScore >= 35) return 'E';
//     return 'U';
//   };

//   // Load students and subjects
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const state = await NetInfo.fetch();
//         const isOnline = state.isConnected;

//         // Subjects
//         if (isOnline) {
//           const subjectsResponse = await axios.get('https://manfess-backend.onrender.com/api/students/alevel/subjects');
//           if (subjectsResponse.data) {
//             setAllSubjects(subjectsResponse.data);
//             await AsyncStorage.setItem('subjectsalevel', JSON.stringify(subjectsResponse.data));
//           }
//         } else {
//           const localSubjects = await AsyncStorage.getItem('subjectsalevel');
//           if (localSubjects) setAllSubjects(JSON.parse(localSubjects));
//         }

//         // Students
//         if (isOnline) {
//           const studentsResponse = await axios.get('https://manfess-backend.onrender.com/api/students/alevel');
//           if (studentsResponse.data) {
//             setStudents(studentsResponse.data);
//             await AsyncStorage.setItem('studentsalevel', JSON.stringify(studentsResponse.data));
//           }
//         } else {
//           const localStudents = await AsyncStorage.getItem('studentsalevel');
//           if (localStudents) setStudents(JSON.parse(localStudents));
//         }

//         // Restore saved marks
//         const savedMarks = await AsyncStorage.getItem('marksalevel');
//         if (savedMarks) setMarks(JSON.parse(savedMarks));
//       } catch (error) {
//         console.error('Error loading data:', error);
//         Alert.alert('Error', 'Failed to load students or subjects.');
//       }
//     };
//     loadData();
//   }, []);

//   // Filter subjects based on selected code
//   useEffect(() => {
//     if (selectedSubjectCode) {
//       const filtered = allSubjects.filter(
//         (sub) => sub.subjectCode === selectedSubjectCode
//       );
//       setFilteredSubjects(filtered);
//     } else {
//       setFilteredSubjects(allSubjects);
//     }
//   }, [selectedSubjectCode, allSubjects]);

//   const handleChange = (id, value) => {
//     setMarks(prev => ({ ...prev, [id]: value }));
//     setGrades(prev => ({ ...prev, [id]: calculateGrade(value) }));
//   };

//   // Save or update offline
//   const handleSaveOffline = async () => {
//     if (!selectedSubjectCode) {
//       Alert.alert('Error', 'Please select a subject before saving.');
//       return;
//     }

//     try {
//       const localHistory = await AsyncStorage.getItem('mockResultsHistoryalevel');
//       const history = localHistory ? JSON.parse(localHistory) : [];

//       const updatedHistory = [...history];

//       students.forEach(student => {
//         const existingIndex = updatedHistory.findIndex(
//           item => item.studentname === `${student.FirstName} ${student.LastName}` &&
//                   item.Subject_Code === selectedSubjectCode
//         );

//         const newEntry = {
//           studentname: `${student.FirstName} ${student.LastName}`,
//           Class: student.Class || 'uppersixth',
//           Subject: filteredSubjects[0]?.subjectTitle || 'Unknown',
//           Subject_Code: selectedSubjectCode,
//           Mark: marks[student.id] || 0,
//           Grade: grades[student.id] || calculateGrade(marks[student.id] || 0),
//           savedAt: new Date().toISOString()
//         };

//         if (existingIndex >= 0) {
//           updatedHistory[existingIndex] = newEntry;
//         } else {
//           updatedHistory.push(newEntry);
//         }
//       });

//       await AsyncStorage.setItem('mockResultsHistoryalevel', JSON.stringify(updatedHistory));
//       await AsyncStorage.setItem('marksalevel', JSON.stringify(marks));
//       Alert.alert('Saved Offline', 'Results saved/updated locally.');
//       DevSettings.reload()
//       console.log('Offline History:', updatedHistory);
//     } catch (error) {
//       console.error('Error saving results locally:', error);
//       Alert.alert('Error', 'Failed to save results locally.');
//     }
//   };

//   // Push online
//   const handleSaveOnline = async () => {
//     try {
//       setLoading(true);
//       const savedResults = await AsyncStorage.getItem('mockResultsHistoryalevel');
//       const resultsToSend = savedResults ? JSON.parse(savedResults) : [];

//       if (!resultsToSend.length) {
//         Alert.alert('No results to send');
//         return;
//       }

//       const response = await axios.post(
//         'https://manfess-backend.onrender.com/api/students/alevelmock',
//         resultsToSend
//       );

//       Alert.alert('Success', `Results pushed online.\nInserted: ${response.data.insertedCount}, Updated: ${response.data.updatedCount}`);
      
//       // Clear offline cache
//       await AsyncStorage.removeItem('mockResultsHistoryalevel');
//       await AsyncStorage.removeItem('marksalevel');
//       await AsyncStorage.removeItem('mockResultsalevel');
//         DevSettings.reload();
//     } catch (error) {
//       console.error('Error sending results online:', error);
//       Alert.alert('Error', 'Failed to push results online.');
//       setLoading(false);
//     }finally{
//       setLoading(false);

//     }
//   };

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.pickerContainer}>
//           <Text style={styles.label}>Select a Subject</Text>
//           <View style={styles.pickerWrapper}>
//             <Picker
//               selectedValue={selectedSubjectCode}
//               onValueChange={(itemValue) => setSelectedSubjectCode(itemValue)}
//               style={styles.picker}
//             >
//               <Picker.Item label="-- Select Subject --" value="" />
//               {allSubjects.map(sub => (
//                 <Picker.Item 
//                   key={sub.subjectCode} 
//                   label={sub.subjectTitle} 
//                   value={sub.subjectCode} 
//                 />
//               ))}
//             </Picker>
//           </View>
//         </View>

//         <Text style={styles.title}>Marks For Mock A-Level</Text>
        
//         {students.map(student => (
//           <View key={student.id} style={styles.studentRow}>
//             <Text style={styles.studentName}>{student.FirstName} {student.LastName}</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Marks"
//               keyboardType="numeric"
//               value={marks[student.id] || ''}
//               onChangeText={val => handleChange(student.id, val)}
//             />
//             <Text style={styles.gradeText}>{grades[student.id]}</Text>
//           </View>
//         ))}

//         <TouchableOpacity style={[styles.button,{backgroundColor:'#1f5e21ff'}]} onPress={handleSaveOffline}>
//           <Text style={styles.buttonText}>Save Offline</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.button,{backgroundColor:'#1c3744ff'}]} onPress={handleSaveOnline} disabled={loading}>
//           <Text style={styles.buttonText}>{loading ? "Loading..." : "Save Online"}</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: { padding: 20, backgroundColor:'#f5f5f5', marginTop: 30 },
//   pickerContainer: {
//     marginVertical: 20,
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     elevation: 5
//   },
//   label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
//   pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, overflow: 'hidden' },
//   picker: { height: 50, width: '100%' },
//   title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
//   studentRow: { flexDirection:'row', alignItems:'center', marginBottom:15, backgroundColor:'#fff', padding:15, borderRadius:15 },
//   studentName: { flex:1, fontSize:16, fontWeight:'600' },
//   input: { flex:1, padding:10, borderWidth:1, borderColor:'#ccc', borderRadius:10, backgroundColor:'#fafafa', marginRight:10 },
//   gradeText: { fontSize:16, fontWeight:'bold', color:'#1e6921ff' },
//   button: { padding:15, borderRadius:12, marginVertical:10 },
//   buttonText: { color:'#fff', fontWeight:'bold', textAlign:'center' }
// });


// MockAlevel.js
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { DevSettings } from 'react-native';

export default function MockAlevel() {
  const [marks, setMarks] = useState({});
  const [grades, setGrades] = useState({});
  const [students, setStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [lastError, setLastError] = useState(null);
  const [rawPreview, setRawPreview] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Offline keys (namespaced)
  const KEY_SUBJECTS = 'offline_subjects_alevel';
  const KEY_STUDENTS = 'offline_students_alevel';
  const KEY_MARKS = 'offline_marks_alevel';
  const KEY_RESULTS = 'offline_results_alevel';
  const KEY_HISTORY = 'offline_results_history_alevel';

  // Backend endpoints (adjust if necessary)
  const BASE = 'https://manfess-backend.onrender.com';
  const SUBJECTS_ENDPOINT = `${BASE}/api/students/alevel/subjects`;
  const STUDENTS_ENDPOINT = `${BASE}/api/students/alevel`;
  const PUSH_ENDPOINT = `${BASE}/api/students/alevelmock`;
  const PING_ENDPOINT = `${BASE}/api/ping`;

  // monitor network connectivity
  useEffect(() => {
    const sub = NetInfo.addEventListener(state => {
      if (mountedRef.current) setIsConnected(Boolean(state.isConnected));
    });
    NetInfo.fetch().then(s => { if (mountedRef.current) setIsConnected(Boolean(s.isConnected)); });
    return () => sub();
  }, []);

  const safeSetProgress = useCallback((n) => {
    if (!mountedRef.current) return;
    setProgress(Math.max(0, Math.min(100, Math.round(n))));
  }, []);

  const extractAxiosErrorInfo = (err) => ({
    message: String(err?.message || err),
    status: err?.response?.status || null,
    data: err?.response?.data || null,
  });

  // lightweight ping to check backend reachability
  const pingOnline = async (timeout = 3000) => {
    try {
      const resp = await axios.get(PING_ENDPOINT, { timeout, validateStatus: () => true });
      return !!resp;
    } catch (err) {
      return false;
    }
  };

  // load data (online-first, write cache when online)
  const loadData = useCallback(async (opts = {}) => {
    setLastError(null);
    setRawPreview(null);
    setLoading(true);
    safeSetProgress(0);

    try {
      const online = await pingOnline();
      safeSetProgress(10);

      if (online) {
        // fetch subjects
        try {
          const r = await axios.get(SUBJECTS_ENDPOINT, { timeout: 10000 });
          if (Array.isArray(r.data)) {
            setAllSubjects(r.data);
            await AsyncStorage.setItem(KEY_SUBJECTS, JSON.stringify(r.data));
            setRawPreview(prev => ({ ...(prev || {}), subjects: r.data.slice(0, 6) }));
          } else {
            console.warn('MockAlevel: subjects response unexpected', r?.data);
            setLastError(prev => prev ? `${prev}\nSubjects: unexpected shape` : 'Subjects: unexpected shape');
          }
        } catch (err) {
          const info = extractAxiosErrorInfo(err);
          setLastError(prev => prev ? `${prev}\nSubjects fetch: ${info.message}` : `Subjects fetch: ${info.message}`);
          console.warn('MockAlevel subjects fetch error', info);
        }
        safeSetProgress(45);

        // fetch students
        try {
          const r2 = await axios.get(STUDENTS_ENDPOINT, { timeout: 12000 });
          if (Array.isArray(r2.data)) {
            setStudents(r2.data);
            await AsyncStorage.setItem(KEY_STUDENTS, JSON.stringify(r2.data));
            setRawPreview(prev => ({ ...(prev || {}), students: r2.data.slice(0, 6) }));
          } else {
            console.warn('MockAlevel: students response unexpected', r2?.data);
            setLastError(prev => prev ? `${prev}\nStudents: unexpected shape` : 'Students: unexpected shape');
          }
        } catch (err) {
          const info = extractAxiosErrorInfo(err);
          setLastError(prev => prev ? `${prev}\nStudents fetch: ${info.message}` : `Students fetch: ${info.message}`);
          console.warn('MockAlevel students fetch error', info);
        }
        safeSetProgress(85);
      } else {
        // offline fallback: read caches
        try {
          const subRaw = await AsyncStorage.getItem(KEY_SUBJECTS);
          if (subRaw) setAllSubjects(JSON.parse(subRaw));
        } catch (err) {
          console.warn('MockAlevel read subjects cache failed', err);
          setLastError(prev => prev ? `${prev}\nCached subjects read error` : 'Cached subjects read error');
        }
        safeSetProgress(40);

        try {
          const stdRaw = await AsyncStorage.getItem(KEY_STUDENTS);
          if (stdRaw) setStudents(JSON.parse(stdRaw));
        } catch (err) {
          console.warn('MockAlevel read students cache failed', err);
          setLastError(prev => prev ? `${prev}\nCached students read error` : 'Cached students read error');
        }
        safeSetProgress(70);
      }

      // restore saved marks
      try {
        const m = await AsyncStorage.getItem(KEY_MARKS);
        if (m) setMarks(JSON.parse(m));
      } catch (err) {
        console.warn('MockAlevel restore marks failed', err);
      }
      safeSetProgress(100);
    } catch (err) {
      console.error('MockAlevel loadData unexpected error', err);
      setLastError(String(err?.message || err));
    } finally {
      setTimeout(() => {
        if (mountedRef.current) {
          setLoading(false);
          safeSetProgress(0);
        }
      }, 500);
    }
  }, [safeSetProgress]);

  useEffect(() => { loadData(); }, [loadData]);

  // auto-refresh when connection recovers
  useEffect(() => {
    if (isConnected) loadData({ forceRefresh: true });
  }, [isConnected, loadData]);

  // Keep filteredSubjects in sync (useful for subject details)
  useEffect(() => {
    if (selectedSubjectCode) {
      const matches = allSubjects.filter(sub => String(sub.subjectCode) === String(selectedSubjectCode));
      setFilteredSubjects(matches);
    } else {
      setFilteredSubjects(allSubjects);
    }
  }, [selectedSubjectCode, allSubjects]);

  // grade calculation
  const calculateGrade = (score) => {
    const numericScore = parseInt(score, 10);
    if (Number.isNaN(numericScore)) return '';
    if (numericScore >= 90) return 'A+';
    if (numericScore >= 80) return 'A';
    if (numericScore >= 60) return 'B';
    if (numericScore >= 45) return 'C';
    if (numericScore >= 35) return 'E';
    return 'U';
  };

  // persist while typing
  const handleChange = (id, value) => {
    const sid = String(id);
    setMarks(prev => {
      const next = { ...prev, [sid]: value };
      AsyncStorage.setItem(KEY_MARKS, JSON.stringify(next)).catch(e => console.warn('MockAlevel save marks err', e));
      return next;
    });
    setGrades(prev => ({ ...prev, [sid]: calculateGrade(value) }));
  };

  // Save offline/upsert
  const handleSaveOffline = async () => {
    if (!selectedSubjectCode) {
      Alert.alert('Error', 'Please select a subject before saving.');
      return;
    }
    try {
      const rawHist = await AsyncStorage.getItem(KEY_HISTORY);
      const history = rawHist ? JSON.parse(rawHist) : [];

      const subject = filteredSubjects.find(s => String(s.subjectCode) === String(selectedSubjectCode)) || {};
      const newRecords = [];

      for (const student of students) {
        const studentName = `${student.FirstName ?? ''} ${student.LastName ?? ''}`.trim();
        const idKey = String(student.id ?? student.localid ?? studentName);
        const idx = history.findIndex(r => r.studentname === studentName && String(r.Subject_Code) === String(subject.subjectCode ?? selectedSubjectCode));
        const record = {
          studentname: studentName,
          Class: student.level ?? '',
          Department: student.Department ?? '',
          Subject: subject.subjectTitle ?? '',
          Subject_Code: subject.subjectCode ?? selectedSubjectCode,
          Mark: marks[idKey] ?? marks[String(student.id)] ?? 0,
          Grade: grades[idKey] ?? grades[String(student.id)] ?? calculateGrade(marks[idKey] ?? marks[String(student.id)] ?? 0),
          Datepushed: new Date().toISOString(),
          savedAt: new Date().toISOString(),
        };
        if (idx > -1) history[idx] = record; else history.push(record);
        newRecords.push(record);
      }

      await AsyncStorage.setItem(KEY_HISTORY, JSON.stringify(history));
      await AsyncStorage.setItem(KEY_RESULTS, JSON.stringify(history));
      await AsyncStorage.setItem(KEY_MARKS, JSON.stringify(marks));

      Alert.alert('Saved Offline', `Saved ${newRecords.length} record(s) locally.`);
      console.log('MockAlevel saved offline entries:', newRecords.length);
      DevSettings.reload()
    } catch (err) {
      console.error('MockAlevel saveOffline error', err);
      Alert.alert('Error', 'Failed to save results locally.');
    }
  };

  // Push offline results online
  const handleSaveOnline = async () => {
    try {
      setLoading(true);
      safeSetProgress(5);

      const raw = await AsyncStorage.getItem(KEY_RESULTS);
      const results = raw ? JSON.parse(raw) : [];

      if (!results.length) {
        Alert.alert('No results to send', 'There are no offline results to push.');
        setLoading(false);
        return;
      }

      safeSetProgress(30);

      const resp = await axios.post(PUSH_ENDPOINT, results, { timeout: 20000 });
      safeSetProgress(85);

      console.log('MockAlevel push response:', resp?.data);
      Alert.alert('Success', 'Results pushed online successfully.');

      // clear local caches after successful push
      await AsyncStorage.removeItem(KEY_RESULTS);
      await AsyncStorage.removeItem(KEY_HISTORY);
      await AsyncStorage.removeItem(KEY_MARKS);

      safeSetProgress(100);
      setTimeout(() => {
        if (mountedRef.current) {
          setLoading(false);
          safeSetProgress(0);
        }
      }, 700);
       DevSettings.reload()
    } catch (err) {
      const info = extractAxiosErrorInfo(err);
      console.error('MockAlevel push error', info);
      setLastError(`Push error: ${info.message} status:${info.status}`);
      Alert.alert('Error', 'Failed to push results online. See console for details.');
      setLoading(false);
      safeSetProgress(0);
    }
  };

  const selectedSubject = filteredSubjects.length ? filteredSubjects[0] : null;

  // Debug block
  const DebugBlock = () => (
    <View style={styles.debugBox}>
      <Text style={{ fontWeight: '700' }}>Debug</Text>
      <Text>Connected: {String(isConnected)}</Text>
      <Text>Progress: {progress}%</Text>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <TouchableOpacity style={styles.smallBtn} onPress={() => loadData({ forceRefresh: true })}>
          <Text style={styles.smallBtnText}>Force Fetch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.smallBtn, { marginLeft: 8 }]} onPress={async () => {
          const keys = await AsyncStorage.getAllKeys();
          const debug = keys.filter(k => k.toLowerCase().includes('offline') || k.toLowerCase().includes('alevel'));
          Alert.alert('Cached keys', debug.join('\n') || '(none)');
        }}>
          <Text style={styles.smallBtnText}>Show Keys</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ marginTop: 8, fontWeight: '700' }}>Last error</Text>
      <Text style={{ color: '#b71c1c' }}>{lastError ?? '(none)'}</Text>

      <Text style={{ marginTop: 8, fontWeight: '700' }}>Raw preview</Text>
      <Text numberOfLines={6}>{rawPreview ? JSON.stringify(rawPreview, null, 2) : '(none)'}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Mock A-Level</Text>
          {loading && <ActivityIndicator size="small" color="#1976d2" />}
        </View>

        {loading && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}

        <DebugBlock />

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
                <Picker.Item
                  key={`${sub.subjectCode}-${sub.Subject_Id ?? ''}`}
                  label={`${sub.subjectTitle} ${sub.level ? `(${sub.level})` : ''}`}
                  value={String(sub.subjectCode)}
                />
              ))}
            </Picker>
          </View>

          {selectedSubject && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.selectedText}>Title: {selectedSubject.subjectTitle}</Text>
              <Text style={styles.selectedText}>Code: {selectedSubject.subjectCode}</Text>
              <Text style={styles.selectedText}>Level: {selectedSubject.level}</Text>
              <Text style={styles.selectedText}>Department: {selectedSubject.departmentName}</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>Marks For Mock A-Level ({students?.length ?? 0} students)</Text>

        {students.length === 0 ? (
          <View style={{ paddingVertical: 20 }}>
            <Text style={{ textAlign: 'center', color: '#666' }}>
              No students found (offline cache empty). Try Force Fetch while online.
            </Text>
          </View>
        ) : (
          students.map(student => {
            const sid = String(student.id ?? student.localid ?? `${student.FirstName}_${student.LastName}`);
            return (
              <View key={sid} style={styles.studentRow}>
                <Text style={styles.studentName}>{student.FirstName} {student.LastName}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Marks"
                  keyboardType="numeric"
                  value={marks[sid] ?? ''}
                  onChangeText={val => handleChange(sid, val)}
                />
                <Text style={styles.gradeText}>{grades[sid] ?? ''}</Text>
              </View>
            );
          })
        )}

        <TouchableOpacity style={[styles.button, { backgroundColor: '#1f5e21' }]} onPress={handleSaveOffline}>
          <Text style={styles.buttonText}>Save Offline</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#1c3744' }]} onPress={handleSaveOnline} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Submit Online'}</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 16, backgroundColor: '#f6f6f6', paddingBottom: 120, marginTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  debugBox: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 12 },
  progressContainer: { height: 28, backgroundColor: '#eee', borderRadius: 14, overflow: 'hidden', marginVertical: 8 },
  progressBar: { height: '100%', backgroundColor: '#4CAF50' },
  progressText: { position: 'absolute', alignSelf: 'center', fontWeight: '700', color: '#222' },
  pickerContainer: { marginVertical: 12, padding: 12, backgroundColor: '#fff', borderRadius: 12, elevation: 3 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
  pickerWrapper: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden' },
  picker: { height: 46, width: '100%', color: '#333' },
  selectedText: { marginTop: 6, fontSize: 13, color: '#555' },
  title: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 10, color: '#222' },
  studentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#fff', padding: 10, borderRadius: 10 },
  studentName: { flex: 1, fontSize: 15, fontWeight: '600' },
  input: { width: 90, padding: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fafafa', marginRight: 10, textAlign: 'center' },
  gradeText: { width: 48, textAlign: 'center', fontSize: 14, fontWeight: '700', color: '#4CAF50' },
  button: { padding: 12, borderRadius: 10, marginVertical: 8 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  smallBtn: { backgroundColor: '#1976d2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  smallBtnText: { color: '#fff', fontWeight: '700' },
});

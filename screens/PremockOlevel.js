// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, 
//   KeyboardAvoidingView, Platform, DevSettings 
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Picker } from '@react-native-picker/picker';
// import axios from 'axios';

// export default function PremockOlevel() {
//   const [marks, setMarks] = useState({});
//   const [grades, setGrades] = useState({});
//   const [students, setStudents] = useState([]);
//   const [allSubjects, setAllSubjects] = useState([]);
//   const [filteredSubjects, setFilteredSubjects] = useState([]);
//   const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Simple online check
//   const isOnline = async () => {
//     try {
//       await axios.get('https://manfess-backend.onrender.com/api/ping'); 
//       return true;
//     } catch (err) {
//       return false;
//     }
//   };

//   // Load students & subjects (online first, then fallback offline)
//   useEffect(() => {
//     const loadData = async () => {
//       const online = await isOnline();
//       try {
//         if (online) {
//           // Fetch subjects and students online
//           const subjectsResponse = await axios.get('https://manfess-backend.onrender.com/api/subjects');
//           if (subjectsResponse.data) {
//             setAllSubjects(subjectsResponse.data);
//             await AsyncStorage.setItem('subjects', JSON.stringify(subjectsResponse.data));
//           }

//           const studentsResponse = await axios.get('https://manfess-backend.onrender.com/api/students');
//           if (studentsResponse.data) {
//             setStudents(studentsResponse.data);
//             await AsyncStorage.setItem('students', JSON.stringify(studentsResponse.data));
//           }
//         } else {
//           // Offline fallback
//           const localSubjects = await AsyncStorage.getItem('subjects');
//           if (localSubjects) setAllSubjects(JSON.parse(localSubjects));

//           const localStudents = await AsyncStorage.getItem('students');
//           if (localStudents) setStudents(JSON.parse(localStudents));
//         }

//         // Restore saved marks
//         const savedMarks = await AsyncStorage.getItem('marks');
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
//       const filtered = allSubjects.filter(sub => sub.subjectCode === selectedSubjectCode);
//       setFilteredSubjects(filtered);
//     } else setFilteredSubjects(allSubjects);
//   }, [selectedSubjectCode, allSubjects]);

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

//   const handleChange = (id, value) => {
//     setMarks(prev => ({ ...prev, [id]: value }));
//     setGrades(prev => ({ ...prev, [id]: calculateGrade(value) }));
//   };

//   // Save offline with update logic
//   const handleSaveOffline = async () => {
//     if (!selectedSubjectCode) {
//       Alert.alert('Error', 'Please select a subject.');
//       return;
//     }

//     let existingHistory = await AsyncStorage.getItem('mockResultsHistoryp');
//     existingHistory = existingHistory ? JSON.parse(existingHistory) : [];

//     const resultsToSave = students.map(student => {
//       const existingIndex = existingHistory.findIndex(
//         r => r.studentname === `${student.FirstName} ${student.LastName}` && r.Subject_Code === selectedSubjectCode
//       );

//       const record = {
//         studentname: `${student.FirstName} ${student.LastName}`,
//         Class: student.Class || 'Level 5',
//         Subject: filteredSubjects[0]?.subjectTitle || 'Level 5',
//         Subject_Code: selectedSubjectCode,
//         Mark: marks[student.id] || 0,
//         Grade: grades[student.id] || calculateGrade(marks[student.id] || 0),
//         Datepushed: new Date().toISOString(),
//         savedAt: new Date().toISOString(),
//       };

//       if (existingIndex > -1) {
//         // Update existing record
//         existingHistory[existingIndex] = record;
//       } else {
//         existingHistory.push(record);
//       }

//       return record;
//     });

//     try {
//       await AsyncStorage.setItem('mockResultsHistoryp', JSON.stringify(existingHistory));
//       await AsyncStorage.setItem('mockResultsp', JSON.stringify(existingHistory));
//       Alert.alert('Saved Offline', 'Results updated locally.');
//       DevSettings.reload()
//       console.log('Saved results:', existingHistory);
//     } catch (error) {
//       console.error('Error saving results locally:', error);
//       Alert.alert('Error', 'Failed to save results locally.');
//     }
//   };

//   // Push online
//   const handleSaveOnline = async () => {
//     try {
//       setLoading(true);
//       const savedResults = await AsyncStorage.getItem('mockResultsp');
//       const resultsToSend = savedResults ? JSON.parse(savedResults) : [];

//       if (resultsToSend.length === 0) {
//         Alert.alert('No results to send');
//         return;
//       }

//       const response = await axios.post('https://manfess-backend.onrender.com/api/students/olevelpremock', resultsToSend);

//       Alert.alert('Success', `Results pushed online.\nInserted: ${response.data.insertedCount}, Updated: ${response.data.updatedCount}`);
//       await AsyncStorage.removeItem('mockResultsp');
//       await AsyncStorage.removeItem('mockResultsHistoryp');
//       await AsyncStorage.removeItem('marksp');
//       DevSettings.reload();

//     } catch (error) {
//       console.error('Error sending results online:', error);
//       Alert.alert('Error', 'Failed to push results online.');
//     } finally {
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
//               dropdownIconColor="#4CAF50"
//             >
//               <Picker.Item label="-- Select Subject --" value="" />
//               {allSubjects.map(sub => (
//                 <Picker.Item key={sub.subjectCode} label={sub.subjectTitle} value={sub.subjectCode} />
//               ))}
//             </Picker>
//           </View>
//           {selectedSubjectCode && filteredSubjects.length > 0 && (
//             <>
//               <Text style={styles.selectedText}>Subject Title: {filteredSubjects[0].subjectTitle}</Text>
//               <Text style={styles.selectedText}>Subject Code: {filteredSubjects[0].subjectCode}</Text>
//             </>
//           )}
//         </View>

//         <Text style={styles.title}>Marks For Mock O-Level</Text>
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

//         <TouchableOpacity style={[styles.button,{backgroundColor:'#4CAF50'}]} onPress={handleSaveOffline}>
//           <Text style={styles.buttonText}>Save Offline</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.button,{backgroundColor:'#03A9F4'}]} onPress={handleSaveOnline} disabled={loading}>
//           <Text style={styles.buttonText}>{loading ? "Loading..." : "Save Online"}</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: { padding: 20, backgroundColor:'#f5f5f5', marginTop: 30 },
//   pickerContainer: { marginVertical: 20, padding: 15, backgroundColor: '#fff', borderRadius: 15, elevation: 5 },
//   label: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333' },
//   pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, overflow: 'hidden' },
//   picker: { height: 50, width: '100%', color: '#333' },
//   selectedText: { marginTop: 10, fontSize: 14, color: '#555' },
//   title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
//   studentRow: { flexDirection:'row', alignItems:'center', marginBottom:15, backgroundColor:'#fff', padding:15, borderRadius:15, elevation:5 },
//   studentName: { flex:1, fontSize:16, fontWeight:'600' },
//   input: { flex:1, padding:10, borderWidth:1, borderColor:'#ccc', borderRadius:10, backgroundColor:'#fafafa', marginRight:10 },
//   gradeText: { fontSize:16, fontWeight:'bold', color:'#4CAF50' },
//   button: { padding:15, borderRadius:12, marginVertical:10 },
//   buttonText: { color:'#fff', fontWeight:'bold', textAlign:'center' }
// });




























// PremockOlevel.js
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


export default function PremockOlevel() {
  const [marks, setMarks] = useState({});
  const [grades, setGrades] = useState({});
  const [students, setStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastError, setLastError] = useState(null);
  const [rawResponsePreview, setRawResponsePreview] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  const mountedRef = useRef(true);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  // Keys (distinct for premock)
  const KEY_SUBJECTS = 'offline_subjects_premock';
  const KEY_STUDENTS = 'offline_students_premock';
  const KEY_MARKS = 'offline_marks_premock';
  const KEY_RESULTS = 'offline_results_premock';
  const KEY_HISTORY = 'offline_results_history_premock';

  // Endpoints (adjust if backend paths differ)
  const BASE = 'https://manfess-backend.onrender.com';
  const SUBJECTS_ENDPOINT = `${BASE}/api/subjects`;
  const STUDENTS_ENDPOINT = `${BASE}/api/students`;
  const PUSH_ENDPOINT = `${BASE}/api/students/olevelpremock`;
  const PING_ENDPOINT = `${BASE}/api/ping`;

  // connectivity listener
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

  // ping: treat any HTTP response as reachable; only network-level failures count as offline
  const pingOnline = async (timeout = 3000) => {
    try {
      const resp = await axios.get(PING_ENDPOINT, { timeout, validateStatus: () => true });
      return !!resp;
    } catch (err) {
      return false;
    }
  };

  const extractAxiosErrorInfo = (err) => ({
    message: String(err?.message || err),
    code: err?.code || null,
    status: err?.response?.status || null,
    data: err?.response?.data || null,
  });

  // load data: online-first, fallback to cached
  const loadData = useCallback(async (opts = {}) => {
    setLastError(null);
    setRawResponsePreview(null);
    setLoading(true);
    safeSetProgress(0);

    try {
      const online = await pingOnline();
      safeSetProgress(10);

      if (online) {
        // fetch subjects
        try {
          const resp = await axios.get(SUBJECTS_ENDPOINT, { timeout: 10000 });
          if (Array.isArray(resp.data)) {
            setAllSubjects(resp.data);
            await AsyncStorage.setItem(KEY_SUBJECTS, JSON.stringify(resp.data));
            setRawResponsePreview(prev => ({ ...(prev || {}), subjects: resp.data.slice(0, 6) }));
          } else {
            throw new Error('Subjects: unexpected response shape');
          }
        } catch (err) {
          const info = extractAxiosErrorInfo(err);
          setLastError(prev => prev ? `${prev}\nSubjects fetch: ${info.message} status:${info.status}` : `Subjects fetch: ${info.message} status:${info.status}`);
          console.warn('Premock subjects fetch error', info);
        }
        safeSetProgress(45);

        // fetch students
        try {
          const resp2 = await axios.get(STUDENTS_ENDPOINT, { timeout: 12000 });
          if (Array.isArray(resp2.data)) {
            setStudents(resp2.data);
            await AsyncStorage.setItem(KEY_STUDENTS, JSON.stringify(resp2.data));
            setRawResponsePreview(prev => ({ ...(prev || {}), students: resp2.data.slice(0, 6) }));
          } else {
            throw new Error('Students: unexpected response shape');
          }
        } catch (err) {
          const info = extractAxiosErrorInfo(err);
          setLastError(prev => prev ? `${prev}\nStudents fetch: ${info.message} status:${info.status}` : `Students fetch: ${info.message} status:${info.status}`);
          console.warn('Premock students fetch error', info);
        }
        safeSetProgress(85);
      } else {
        // offline fallback: read cached
        try {
          const subRaw = await AsyncStorage.getItem(KEY_SUBJECTS);
          if (subRaw) setAllSubjects(JSON.parse(subRaw));
        } catch (err) {
          setLastError(prev => prev ? `${prev}\nCached subjects read error` : 'Cached subjects read error');
        }
        safeSetProgress(40);

        try {
          const stdRaw = await AsyncStorage.getItem(KEY_STUDENTS);
          if (stdRaw) setStudents(JSON.parse(stdRaw));
        } catch (err) {
          setLastError(prev => prev ? `${prev}\nCached students read error` : 'Cached students read error');
        }
        safeSetProgress(70);
      }

      // restore saved marks
      try {
        const m = await AsyncStorage.getItem(KEY_MARKS);
        if (m) setMarks(JSON.parse(m));
      } catch (err) { console.warn('Premock restore marks failed', err); }

      safeSetProgress(100);
    } catch (err) {
      console.error('Premock loadData unexpected error', err);
      setLastError(String(err?.message || err));
    } finally {
      setTimeout(() => { if (mountedRef.current) { setLoading(false); safeSetProgress(0); } }, 500);
    }
  }, [safeSetProgress]);

  useEffect(() => { loadData(); }, [loadData]);

  // auto refresh when back online
  useEffect(() => {
    if (isConnected) loadData({ forceRefresh: true });
  }, [isConnected, loadData]);

  // keep selected subject details (if needed)
  const selectedSubject = allSubjects.find(s => String(s.subjectCode) === String(selectedSubjectCode)) || null;

  // grade calculator & input handler (persist while typing)
  const calculateGrade = (score) => {
    const n = parseInt(score, 10);
    if (Number.isNaN(n)) return '';
    if (n >= 90) return 'A+';
    if (n >= 80) return 'A';
    if (n >= 60) return 'B';
    if (n >= 45) return 'C';
    if (n >= 35) return 'E';
    return 'U';
  };

  const handleChange = (id, value) => {
    const sid = String(id);
    setMarks(prev => {
      const next = { ...prev, [sid]: value };
      AsyncStorage.setItem(KEY_MARKS, JSON.stringify(next)).catch(e => console.warn('Premock save marks err', e));
      return next;
    });
    setGrades(prev => ({ ...prev, [sid]: calculateGrade(value) }));
  };

  // Save offline/upsert
  const handleSaveOffline = async () => {
    if (!selectedSubjectCode) {
      Alert.alert('Error', 'Please select a subject.');
      return;
    }
    try {
      const rawHist = await AsyncStorage.getItem(KEY_HISTORY);
      const existingHistory = rawHist ? JSON.parse(rawHist) : [];

      const subj = selectedSubject || {};
      const newRecords = [];

      for (const student of students) {
        const studentName = `${student.FirstName ?? ''} ${student.LastName ?? ''}`.trim();
        const idKey = String(student.id ?? student.localid ?? studentName);
        const idx = existingHistory.findIndex(r => r.studentname === studentName && String(r.Subject_Code) === String(subj.subjectCode ?? selectedSubjectCode));

        const record = {
          studentname: studentName,
          Class: student.level ?? '',
          Department: student.Department ?? '',
          Subject: subj.subjectTitle ?? '',
          Subject_Code: subj.subjectCode ?? selectedSubjectCode,
          Mark: marks[idKey] ?? marks[String(student.id)] ?? 0,
          Grade: grades[idKey] ?? grades[String(student.id)] ?? calculateGrade(marks[idKey] ?? marks[String(student.id)] ?? 0),
          Datepushed: new Date().toISOString(),
          savedAt: new Date().toISOString(),
        };

        if (idx > -1) existingHistory[idx] = record; else existingHistory.push(record);
        newRecords.push(record);
      }

      await AsyncStorage.setItem(KEY_HISTORY, JSON.stringify(existingHistory));
      await AsyncStorage.setItem(KEY_RESULTS, JSON.stringify(existingHistory));
      await AsyncStorage.setItem(KEY_MARKS, JSON.stringify(marks));

      Alert.alert('Saved Offline', `Saved ${newRecords.length} record(s) locally.`);
       
    } catch (err) {
      console.error('Premock saveOffline error', err);
      Alert.alert('Error', 'Failed to save results locally.');
    }
  };

  // Push results to backend
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

      Alert.alert('Push result', JSON.stringify(resp.data).slice(0, 400));

      await AsyncStorage.removeItem(KEY_RESULTS);
      await AsyncStorage.removeItem(KEY_HISTORY);
      await AsyncStorage.removeItem(KEY_MARKS);

      setMarks({});
      setGrades({});
      safeSetProgress(100);
      setTimeout(() => { if (mountedRef.current) { setLoading(false); safeSetProgress(0); } }, 700);
  
    } catch (err) {
      const info = extractAxiosErrorInfo(err);
      console.error('Premock push error', info);
      setLastError(`Push error: ${info.message} status:${info.status} data:${JSON.stringify(info.data)}`);
      Alert.alert('Error pushing results', info.message);
      setLoading(false);
      safeSetProgress(0);
    }
  };

  // Debug block for Dev
  const DebugBlock = () => (
    <View style={styles.debugBox}>
      <Text style={{ fontWeight: '700' }}>Debug</Text>
      <Text>Connected: {String(isConnected)}</Text>
      <Text>Progress: {progress}%</Text>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <TouchableOpacity style={styles.smallBtn} onPress={() => loadData({ forceRefresh: true })}><Text style={styles.smallBtnText}>Force Fetch</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.smallBtn, { marginLeft: 8 }]} onPress={async () => {
          const keys = await AsyncStorage.getAllKeys();
          const debug = keys.filter(k => k.toLowerCase().includes('offline') || k.toLowerCase().includes('mock'));
          Alert.alert('Cached keys', debug.join('\n') || '(none)');
        }}><Text style={styles.smallBtnText}>Show Keys</Text></TouchableOpacity>
      </View>

      <Text style={{ marginTop: 8, fontWeight: '700' }}>Last error</Text>
      <Text style={{ color: '#b71c1c' }}>{lastError ?? '(none)'}</Text>
     
    </View>
  );
//  <Text style={{ marginTop: 8, fontWeight: '700' }}>Raw preview</Text>
//       <Text numberOfLines={6}>{rawResponsePreview ? JSON.stringify(rawResponsePreview, null, 2) : '(none)'}</Text>
   
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Pre Mock O-Level (debug)</Text>
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
                <Picker.Item key={`${sub.subjectCode}-${sub.Subject_Id ?? ''}`} label={`${sub.subjectTitle} ${sub.level ? `(${sub.level})` : ''}`} value={String(sub.subjectCode)} />
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

        <Text style={styles.title}>Marks For Pre Mock O-Level ({students?.length ?? 0} students)</Text>

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

        <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={handleSaveOffline}>
          <Text style={styles.buttonText}>Save Offline</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#03A9F4' }]} onPress={handleSaveOnline} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Submit Online'}</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 16, backgroundColor: '#f6f6f6', paddingBottom: 120, marginTop: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  debugBox: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 12 },
  progressContainer: { height: 28, backgroundColor: '#eee', borderRadius: 14, overflow: 'hidden', marginVertical: 8 },
  progressBar: { height: '100%', backgroundColor: '#4CAF50' },
  progressText: { position: 'absolute', alignSelf: 'center', fontWeight: '700', color: '#222' },
  pickerContainer: { marginVertical: 12, padding: 12, backgroundColor: '#fff', borderRadius: 12, elevation: 3 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
  pickerWrapper: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden' },
  picker: { height: 56 , color: '#333' },
  selectedText: { marginTop: 6, fontSize: 13, color: '#555' },
  title: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 10 },
  studentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#fff', padding: 10, borderRadius: 10 },
  studentName: { flex: 1, fontSize: 15, fontWeight: '600' },
  input: { width: 90, padding: 8, borderWidth: 1, borderColor: '#ddd', color: "#333", borderRadius: 8, backgroundColor: '#fafafa', marginRight: 10, textAlign: 'center' },
  gradeText: { width: 48, textAlign: 'center', fontSize: 14, fontWeight: '700', color: '#4CAF50' },
  button: { padding: 12, borderRadius: 10, marginVertical: 8 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  smallBtn: { backgroundColor: '#1976d2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  smallBtnText: { color: '#fff', fontWeight: '700' },
});

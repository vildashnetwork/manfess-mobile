// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, 
//   KeyboardAvoidingView, Platform, DevSettings 
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Picker } from '@react-native-picker/picker';
// import axios from 'axios';

// export default function MockOlevel() {
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

//     let existingHistory = await AsyncStorage.getItem('mockResultsHistory');
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
//       await AsyncStorage.setItem('mockResultsHistory', JSON.stringify(existingHistory));
//       await AsyncStorage.setItem('mockResults', JSON.stringify(existingHistory));
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
//       const savedResults = await AsyncStorage.getItem('mockResults');
//       const resultsToSend = savedResults ? JSON.parse(savedResults) : [];

//       if (resultsToSend.length === 0) {
//         Alert.alert('No results to send');
//         return;
//       }

//       const response = await axios.post('https://manfess-backend.onrender.com/api/students/olevelmock', resultsToSend);

//       Alert.alert('Success', `Results pushed online.\nInserted: ${response.data.insertedCount}, Updated: ${response.data.updatedCount}`);
//       await AsyncStorage.removeItem('mockResults');
//      await AsyncStorage.removeItem('mockResultsHistory');
//       await AsyncStorage.removeItem('marks');
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










// MockOlevel.debug.js
import React, { useEffect, useState, useRef, useCallback } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import { DevSettings } from "react-native";
export default function MockOlevelDebug() {
  const [marks, setMarks] = useState({});
  const [grades, setGrades] = useState({});
  const [students, setStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastError, setLastError] = useState(null);
  const [rawResponsePreview, setRawResponsePreview] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  const mountedRef = useRef(true);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const BASE = "https://manfess-backend.onrender.com";
  const SUBJECTS_ENDPOINT = `${BASE}/api/subjects`;
  const STUDENTS_ENDPOINT = `${BASE}/api/students`;
  const PUSH_ENDPOINT = `${BASE}/api/students/olevelmock`;
  const PING_ENDPOINT = `${BASE}/api/ping`; // may 404 on your server — handled below

  const KEY_SUBJECTS = "offline_subjects_olevel";
  const KEY_STUDENTS = "offline_students_olevel";
  const KEY_MARKS = "offline_marks_olevel";
  const KEY_RESULTS = "offline_results_olevel";
  const KEY_HISTORY = "offline_results_history_olevel";

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

  // ping: consider server reachable if we get ANY response (2xx,3xx,4xx,5xx)
  const pingOnline = async (timeout = 3000) => {
    try {
      // validateStatus allows any response through (so even 404 yields a response object)
      const resp = await axios.get(PING_ENDPOINT, { timeout, validateStatus: () => true });
      // if resp exists we can reach the server (even 404)
      return !!resp;
    } catch (err) {
      // network error / no response -> offline
      // err.response present would already have been handled above; here we treat as network error
      return false;
    }
  };

  // helper to format axios error details
  const extractAxiosErrorInfo = (err) => {
    const info = {
      message: String(err?.message || err),
      code: err?.code || null,
      status: err?.response?.status || null,
      data: err?.response?.data || null,
    };
    return info;
  };

  // loadData: online-first, fallback to cached
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
            setRawResponsePreview(prev => ({ ...(prev||{}), subjects: resp.data.slice(0,6) }));
          } else {
            throw new Error("Subjects: unexpected response shape");
          }
        } catch (err) {
          const info = extractAxiosErrorInfo(err);
          setLastError(prev => prev ? `${prev}\nSubjects fetch: ${info.message} status:${info.status}` : `Subjects fetch: ${info.message} status:${info.status}`);
          console.warn("subjects fetch error", info);
        }
        safeSetProgress(45);

        // fetch students
        try {
          const resp2 = await axios.get(STUDENTS_ENDPOINT, { timeout: 12000 });
          if (Array.isArray(resp2.data)) {
            setStudents(resp2.data);
            await AsyncStorage.setItem(KEY_STUDENTS, JSON.stringify(resp2.data));
            setRawResponsePreview(prev => ({ ...(prev||{}), students: resp2.data.slice(0,6) }));
          } else {
            throw new Error("Students: unexpected response shape");
          }
        } catch (err) {
          const info = extractAxiosErrorInfo(err);
          setLastError(prev => prev ? `${prev}\nStudents fetch: ${info.message} status:${info.status}` : `Students fetch: ${info.message} status:${info.status}`);
          console.warn("students fetch error", info);
        }
        safeSetProgress(85);
      } else {
        // offline fallback - read cached
        try {
          const subjRaw = await AsyncStorage.getItem(KEY_SUBJECTS);
          if (subjRaw) setAllSubjects(JSON.parse(subjRaw));
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

      // restore marks
      try {
        const m = await AsyncStorage.getItem(KEY_MARKS);
        if (m) setMarks(JSON.parse(m));
      } catch (err) { console.warn("restore marks failed", err); }

      safeSetProgress(100);
    } catch (err) {
      console.error("loadData unexpected error:", err);
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

  // grade calc & input handler
  const calculateGrade = (score) => {
    const n = parseInt(score,10);
    if (Number.isNaN(n)) return "";
    if (n >= 90) return "A+";
    if (n >= 80) return "A";
    if (n >= 60) return "B";
    if (n >= 45) return "C";
    if (n >= 35) return "E";
    return "U";
  };
  const handleChange = (id, value) => {
    const sid = String(id);
    setMarks(prev => {
      const next = { ...prev, [sid]: value };
      AsyncStorage.setItem(KEY_MARKS, JSON.stringify(next)).catch(e => console.warn("save marks err", e));
      return next;
    });
    setGrades(prev => ({ ...prev, [sid]: calculateGrade(value) }));
  };

  // Save offline (upsert)
  const handleSaveOffline = async () => {
    if (!selectedSubjectCode) return Alert.alert("Please select a subject");
    try {
      const raw = await AsyncStorage.getItem(KEY_HISTORY);
      const history = raw ? JSON.parse(raw) : [];
      const subj = allSubjects.find(s => String(s.subjectCode) === String(selectedSubjectCode)) || {};
      const newRecords = [];
      students.forEach(st => {
        const name = `${st.FirstName ?? ""} ${st.LastName ?? ""}`.trim();
        const sid = String(st.id ?? st.localid ?? name);
        const rec = {
          studentname: name,
          Class: st.level ?? "",
          Department: st.Department ?? "",
          Subject: subj.subjectTitle ?? "",
          Subject_Code: subj.subjectCode ?? selectedSubjectCode,
          Mark: marks[sid] ?? 0,
          Grade: grades[sid] ?? calculateGrade(marks[sid] ?? 0),
          savedAt: new Date().toISOString(),
        };
        const idx = history.findIndex(r => r.studentname === name && String(r.Subject_Code) === String(rec.Subject_Code));
        if (idx > -1) history[idx] = rec; else history.push(rec);
        newRecords.push(rec);
      });
      await AsyncStorage.setItem(KEY_HISTORY, JSON.stringify(history));
      await AsyncStorage.setItem(KEY_RESULTS, JSON.stringify(history));
      await AsyncStorage.setItem(KEY_MARKS, JSON.stringify(marks));
      Alert.alert("Saved Offline", `Saved ${newRecords.length} records locally.`);
       DevSettings.reload()
    } catch (err) {
      console.error("save offline error", err);
      Alert.alert("Error", "Failed to save results locally.");
    }
  };

  // Push online
  const handleSaveOnline = async () => {
    try {
      setLoading(true); safeSetProgress(5);
      const raw = await AsyncStorage.getItem(KEY_RESULTS);
      const results = raw ? JSON.parse(raw) : [];
      if (!results.length) { Alert.alert("No results to send"); setLoading(false); return; }
      safeSetProgress(25);
      const resp = await axios.post(PUSH_ENDPOINT, results, { timeout: 20000 });
      safeSetProgress(85);
      Alert.alert("Push response", JSON.stringify(resp.data).slice(0, 400));
      await AsyncStorage.removeItem(KEY_RESULTS);
      await AsyncStorage.removeItem(KEY_HISTORY);
      await AsyncStorage.removeItem(KEY_MARKS);
      setMarks({}); setGrades({});
      safeSetProgress(100);
       DevSettings.reload()
    } catch (err) {
      const info = extractAxiosErrorInfo(err);
      console.error("push failed:", info);
      setLastError(`Push error: ${info.message} status:${info.status} data:${JSON.stringify(info.data)}`);
      Alert.alert("Push failed", info.message);
    } finally {
      setTimeout(() => { if (mountedRef.current) { setLoading(false); safeSetProgress(0); } }, 700);
    }
  };

  // Debug UI
  const DebugBlock = () => (
    <View style={{ backgroundColor: "#fff", padding: 10, borderRadius: 8, marginVertical: 8 }}>
      <Text style={{ fontWeight: "700" }}>Debug</Text>
      <Text>Connected: {String(isConnected)}</Text>
      <Text>Progress: {progress}%</Text>
      <View style={{ flexDirection: "row", marginTop: 6 }}>
        <TouchableOpacity onPress={() => loadData({ forceRefresh: true })} style={{ backgroundColor: "#1976d2", padding: 6, borderRadius: 6, marginRight: 8 }}>
          <Text style={{ color: "#fff" }}>Force Fetch</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => {
          const keys = await AsyncStorage.getAllKeys();
          const debug = keys.filter(k => k.toLowerCase().includes('offline') || k.toLowerCase().includes('mock'));
          Alert.alert('Cached keys', debug.join('\n') || '(none)');
        }} style={{ backgroundColor: "#555", padding: 6, borderRadius: 6 }}>
          <Text style={{ color: "#fff" }}>Show Keys</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ marginTop: 8, fontWeight: "700" }}>Last error</Text>
      <Text style={{ color: "#b71c1c" }}>{lastError ?? "(none)"}</Text>
      <Text style={{ marginTop: 8, fontWeight: "700" }}>Raw preview</Text>
      <Text selectable numberOfLines={6}>{rawResponsePreview ? JSON.stringify(rawResponsePreview, null, 2) : "(none)"}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Mock O-Level (debug)</Text>
          {loading && <ActivityIndicator size="small" color="#1976d2" />}
        </View>

        {loading && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}

        <DebugBlock />

        <View style={styles.pickerBox}>
          <Text style={styles.label}>Subject</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={selectedSubjectCode} onValueChange={setSelectedSubjectCode} style={styles.picker}>
              <Picker.Item label="-- Select subject --" value="" />
              {allSubjects.map(s => (
                <Picker.Item key={`${s.subjectCode}-${s.Subject_Id ?? ""}`} label={`${s.subjectTitle} ${s.level ? `(${s.level})` : ""}`} value={String(s.subjectCode)} />
              ))}
            </Picker>
          </View>
        </View>

        <Text style={styles.title}>Students ({students.length})</Text>

        {students.length === 0 ? (
          <View style={{ padding: 20 }}>
            <Text>No students loaded. Try Force Fetch or open the endpoints in the phone browser.</Text>
          </View>
        ) : (
          students.map(st => {
            const sid = String(st.id ?? st.localid ?? `${st.FirstName}_${st.LastName}`);
            return (
              <View key={sid} style={styles.studentRow}>
                <Text style={styles.studentName}>{st.FirstName} {st.LastName}</Text>
                <TextInput style={styles.input} keyboardType="numeric" placeholder="Mark" value={marks[sid] ?? ""} onChangeText={(v)=>handleChange(sid, v)} />
                <Text style={styles.grade}>{grades[sid] ?? ""}</Text>
              </View>
            );
          })
        )}

        <TouchableOpacity style={[styles.btn, { backgroundColor: "#4caf50" }]} onPress={handleSaveOffline}><Text style={styles.btnText}>Save Offline</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: "#0288d1" }]} onPress={handleSaveOnline}><Text style={styles.btnText}>Submit Online</Text></TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 120, backgroundColor: "#f6f6f6", marginTop: 40 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  progressContainer: { height: 28, backgroundColor: "#eee", borderRadius: 14, overflow: "hidden", marginVertical: 8 },
  progressBar: { height: "100%", backgroundColor: "#4caf50" },
  progressText: { position: "absolute", alignSelf: "center", fontWeight: "700", color: "#222" },
  pickerBox: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 12 },
  label: { fontWeight: "700", marginBottom: 6 },
  pickerWrap: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, overflow: "hidden" },
  picker: { height: 44 },
  title: { fontWeight: "700", marginVertical: 10 },
  studentRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 10, borderRadius: 8, marginBottom: 8 },
  studentName: { flex: 1, fontWeight: "600" },
  input: { width: 90, borderWidth: 1, borderColor: "#ddd", padding: 8, borderRadius: 6, textAlign: "center", marginRight: 8 },
  grade: { width: 56, textAlign: "center", fontWeight: "700", color: "#2e7d32" },
  btn: { padding: 12, borderRadius: 10, marginTop: 10 },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});

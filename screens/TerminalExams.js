import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TerminalExams() {
  const [historyAll, setHistoryAll] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  // Load all AsyncStorage keys that start with "offlineResults"
  const loadHistory = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      // find keys that begin with offlineResults
      const offlineKeys = keys.filter(k => k && k.startsWith("offlineResults"));
      if (offlineKeys.length === 0) {
        setHistoryAll([]);
        return;
      }

      const pairs = await AsyncStorage.multiGet(offlineKeys);
      // pairs is [[key, value], ...]
      const merged = [];
      for (const [, value] of pairs) {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            merged.push(...parsed);
          } else if (parsed) {
            // single object case
            merged.push(parsed);
          }
        } catch (e) {
          console.warn("Failed parsing local offlineResults entry", e);
        }
      }

      // optional: sort by saved date (newest first) if savedAt/Datepushed exists
      merged.sort((a, b) => {
        const da = a.savedAt ? new Date(a.savedAt) : a.Datepushed ? new Date(a.Datepushed) : null;
        const db = b.savedAt ? new Date(b.savedAt) : b.Datepushed ? new Date(b.Datepushed) : null;
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return db - da;
      });

      setHistoryAll(merged);
    } catch (error) {
      console.error("Error loading offline results:", error);
      Alert.alert("Error", "Failed to load offline results.");
    }
  };

  // Remove all offlineResults* keys
  const clearAllOfflineResults = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const offlineKeys = keys.filter(k => k && k.startsWith("offlineResults"));
      if (offlineKeys.length === 0) {
        Alert.alert("Nothing to clear", "No offline results were found.");
        return;
      }
      await AsyncStorage.multiRemove(offlineKeys);
      setHistoryAll([]);
      Alert.alert("Cleared", "All offline results have been deleted.");
    } catch (error) {
      console.error("Error clearing offline results:", error);
      Alert.alert("Error", "Failed to clear offline results.");
    }
  };

const renderHeader = () => (
  <View style={[styles.row, styles.headerRow]}>
    <Text style={[styles.cell, styles.headerText, { minWidth: 140 }]}>Student</Text>
    <Text style={[styles.cell, styles.headerText, { minWidth: 80 }]}>Class</Text>
    <Text style={[styles.cell, styles.headerText, { minWidth: 120 }]}>Subject</Text>
    <Text style={[styles.cell, styles.headerText, { minWidth: 80 }]}>Code</Text>
    <Text style={[styles.cell, styles.headerText, { minWidth: 80 }]}>Mark</Text>
    <Text style={[styles.cell, styles.headerText, { minWidth: 80 }]}>Grade</Text>
    <Text style={[styles.cell, styles.headerText, { minWidth: 160 }]}>Sequence</Text>
  </View>
);

const renderRow = (item, index) => {
  const savedAt = item.savedAt || item.Datepushed || item.saved_on || item.savedOn;
  return (
    <View key={index} style={[styles.row, { backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }]}>
      <Text style={[styles.cell, { minWidth: 140 }]}>{item.studentname ?? `${item.FirstName ?? ""} ${item.LastName ?? ""}`}</Text>
      <Text style={[styles.cell, { minWidth: 80 }]}>{item.Class ?? item.level ?? "N/A"}</Text>
      <Text style={[styles.cell, { minWidth: 120 }]}>{item.Subject ?? item.subject ?? item.subjectTitle ?? "N/A"}</Text>
      <Text style={[styles.cell, { minWidth: 80 }]}>{item.Subject_Code ?? item.subjectCode ?? "N/A"}</Text>
      <Text style={[styles.cell, { minWidth: 80 }]}>{item.Mark ?? item.mark ?? "N/A"}</Text>
      <Text style={[styles.cell, { minWidth: 80 }]}>{item.Grade ?? item.grade ?? "N/A"}</Text>
      <Text style={[styles.cell, { minWidth: 160 }]}>{item.Sequence ?? item.sequence ?? "N/A"}</Text>
      <Text style={[styles.cell, { minWidth: 160 }]}>
        {savedAt ? `${new Date(savedAt).toLocaleDateString()} ${new Date(savedAt).toLocaleTimeString()}` : "N/A"}
      </Text>
    </View>
  );
};


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📥 Offline Results (merged)</Text>

      {historyAll.length === 0 ? (
        <Text style={styles.noData}>No offline results found.</Text>
      ) : (
        <ScrollView horizontal>
          <View style={{ maxHeight: 520, borderWidth: 1, borderColor: "#ccc", borderRadius: 8 }}>
            {renderHeader()}
            <ScrollView style={{ maxHeight: 450 }}>
              {historyAll.map((item, idx) => renderRow(item, idx))}
            </ScrollView>
          </View>
        </ScrollView>
      )}

      <TouchableOpacity style={[styles.clearButton, { backgroundColor: "#FF3B30" }]} onPress={clearAllOfflineResults}>
        <Text style={styles.clearText}>🗑️ Clear Offline Results</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.clearButton, { backgroundColor: "#007AFF", marginTop: 12 }]} onPress={loadHistory}>
        <Text style={styles.clearText}>🔄 Refresh</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff", marginTop: 50 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  noData: { fontSize: 16, color: "gray", textAlign: "center", marginVertical: 20 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ddd", paddingVertical: 10, alignItems: "center" },
  headerRow: { backgroundColor: "#007BFF" },
  cell: { fontSize: 14, textAlign: "center", paddingHorizontal: 6 },
  headerText: { color: "#fff", fontWeight: "bold" },
  clearButton: { backgroundColor: "#FF3B30", padding: 12, borderRadius: 8, marginTop: 20, alignItems: "center" },
  clearText: { color: "#fff", textAlign: "center", fontWeight: "bold" }
});


// });
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

export default function MarksScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem("mockResults");
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error("Error loading history:", error);
        Alert.alert("Error", "Failed to load history.");
      }
    };
    loadHistory();
  }, []);

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem("mockResultsHistory");
      setHistory([]);
      Alert.alert("Cleared", "All history has been deleted.");
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.headerText, { minWidth: 120 }]}>Student</Text>
      <Text style={[styles.cell, styles.headerText, { minWidth: 80 }]}>Class</Text>
      <Text style={[styles.cell, styles.headerText, { minWidth: 120 }]}>Subject</Text>
      <Text style={[styles.cell, styles.headerText, { minWidth: 80 }]}>Code</Text>
      <Text style={[styles.cell, styles.headerText, { minWidth: 80 }]}>Mark</Text>
      <Text style={[styles.cell, styles.headerText, { minWidth: 80 }]}>Grade</Text>
      <Text style={[styles.cell, styles.headerText, { minWidth: 160 }]}>Saved At</Text>
    </View>
  );

  const renderRow = (item, index) => (
    <View key={index} style={[styles.row, { backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }]}>
      <Text style={[styles.cell, { minWidth: 120 }]}>{item.studentname}</Text>
      <Text style={[styles.cell, { minWidth: 80 }]}>{item.Class}</Text>
      <Text style={[styles.cell, { minWidth: 120 }]}>{item.Subject}</Text>
      <Text style={[styles.cell, { minWidth: 80 }]}>{item.Subject_Code}</Text>
      <Text style={[styles.cell, { minWidth: 80 }]}>{item.Mark}</Text>
      <Text style={[styles.cell, { minWidth: 80 }]}>{item.Grade}</Text>
      <Text style={[styles.cell, { minWidth: 160 }]}>
        {item.savedAt 
          ? `${new Date(item.savedAt).toLocaleDateString()} ${new Date(item.savedAt).toLocaleTimeString()}`
          : "N/A"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Olevel Mock History</Text>

      {history.length === 0 ? (
        <Text style={styles.noData}>No history available</Text>
      ) : (
        <ScrollView horizontal>
          <View style={{ maxHeight: 400, borderWidth: 1, borderColor: "#ccc", borderRadius: 8 }}>
            {renderHeader()}
            <ScrollView style={{ maxHeight: 350 }}>
              {history.map((item, index) => renderRow(item, index))}
            </ScrollView>
          </View>
        </ScrollView>
      )}

      <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
        <Text style={styles.clearText}>🗑️ Clear History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff", marginTop: 100 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  noData: { fontSize: 16, color: "gray", textAlign: "center", marginTop: 20 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ddd", paddingVertical: 10 },
  headerRow: { backgroundColor: "#007BFF" },
  cell: { fontSize: 14, textAlign: "center", paddingHorizontal: 6 },
  headerText: { color: "#fff", fontWeight: "bold" },
  clearButton: { backgroundColor: "#FF3B30", padding: 12, borderRadius: 8, marginTop: 20 },
  clearText: { color: "#fff", textAlign: "center", fontWeight: "bold" }
});

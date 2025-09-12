import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";

export default function TimetableScreen() {













  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch timetable from API
  const fetchTimetableOnline = async (name) => {
    try {
      const response = await axios.post(
        "https://manfess-backend.onrender.com/api/teachers/timetable",
        { teacherName: name }
      );

      if (response.data) {
        await AsyncStorage.setItem("timetable", JSON.stringify(response.data));
        setTimetable(response.data);
      }
    } catch (err) {
   return;
    }
  };

  // Load timetable from local storage
  const loadLocalTimetable = async () => {
    try {
      const storedData = await AsyncStorage.getItem("timetable");
      if (storedData) {
        setTimetable(JSON.parse(storedData));
      }
    } catch (err) {
      console.error("Error loading local timetable:", err);
    }
  };

  const setup = async () => {
    try {
      const teacherData = await AsyncStorage.getItem("teacher");
      if (teacherData) {
        const teacher = JSON.parse(teacherData);
        setTeacherName(teacher.Name);

        const unsubscribe = NetInfo.addEventListener((state) => {
          if (state.isConnected) {
            fetchTimetableOnline(teacher.Name);
          } else {
            loadLocalTimetable();
          }
        });

        const netState = await NetInfo.fetch();
        if (netState.isConnected) {
          fetchTimetableOnline(teacher.Name);
        } else {
          loadLocalTimetable();
        }

        return () => unsubscribe();
      }
    } catch (err) {
      console.error("Error setting up timetable:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setup();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await setup();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading your premium timetable...</Text>
      </View>
    );
  }
  const openWebsite = () => {
    const url = `https://manfess-backend.onrender.com/download/${teacherName}`; 
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 {teacherName}'s Timetable 🏆</Text>

      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshText}>{refreshing ? "Refreshing..." : "Refresh Timetable"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
  style={[styles.refreshButton, { backgroundColor: "#256627", marginTop: 10 }]}
onPress={openWebsite}
>
  <Text style={styles.refreshText}>Download PDF</Text>
</TouchableOpacity>


      <ScrollView horizontal>
        <ScrollView>
          <View style={styles.table}>
            {/* Header */}
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.headerCell]}>Day</Text>
              <Text style={[styles.cell, styles.headerCell]}>04:30-05:20</Text>
              <Text style={[styles.cell, styles.headerCell]}>05:20-06:10</Text>
              <Text style={[styles.cell, styles.headerCell]}>06:10-07:00</Text>
              <Text style={[styles.cell, styles.headerCell]}>07:00-07:50</Text>
              <Text style={[styles.cell, styles.headerCell]}>07:50-09:00</Text>
            </View>

            {/* Body */}
            {timetable.length > 0 ? (
              timetable.map((item, index) => (
                <View key={index} style={styles.row}>
                  <Text style={[styles.cell, styles.dayCell]}>{item.Day}</Text>
                  <Text style={styles.cell}>{item["04:30-05:20"] || "Free"}</Text>
                  <Text style={styles.cell}>{item["05:20-06:10"] || "Free"}</Text>
                  <Text style={styles.cell}>{item["06:10-07:00"] || "Free"}</Text>
                  <Text style={styles.cell}>{item["07:00-07-50"] || "Free"}</Text>
                  <Text style={styles.cell}>{item["07-50-09-00"] || "Free"}</Text>
                </View>
              ))
            ) : (
              <View style={styles.row}>
                <Text style={styles.cell}>No timetable available</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f0f4f8",
    marginTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
    color: "#0d47a1",
  },
  refreshButton: {
    backgroundColor: "#0d47a1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "center",
    marginBottom: 20,
  },
  refreshText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerRow: {
    backgroundColor: "#0d47a1",
  },
  cell: {
    minWidth: 120,
    padding: 15,
    textAlign: "center",
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  headerCell: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dayCell: {
    fontWeight: "bold",
    backgroundColor: "#e3f2fd",
  },
});

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import io from "socket.io-client";
import axios from "axios";

// Replace with your backend URL
const SOCKET_URL = "https://manfess-backend.onrender.com"; 
const API_URL = "https://manfess-backend.onrender.com/api/notifications";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch existing notifications
    axios.get(API_URL)
      .then(res => setNotifications(res.data))
      .catch(err => console.error("Error fetching notifications:", err));

    // Connect to Socket.IO
    const socket = io(SOCKET_URL);

    socket.on("connect", () => console.log("Connected to Socket.IO", socket.id));

    socket.on("notification", (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingHorizontal: 15, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 15, textAlign: "center" },
  notificationCard: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  message: { fontSize: 16, fontWeight: "500", color: "#333" },
  time: { fontSize: 12, color: "#999", marginTop: 6, textAlign: "right" },
});

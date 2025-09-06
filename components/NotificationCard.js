import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotificationCard({ title, message }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:{padding:15,backgroundColor:'#e0f7fa',borderRadius:8,marginVertical:5},
  title:{fontWeight:'bold',marginBottom:5}
});

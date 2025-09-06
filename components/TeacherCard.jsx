// components/TeacherCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TeacherCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.left}>
        <Ionicons name="school-outline" size={36} color="#0b7cff" />
      </View>
      <View style={styles.mid}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.subject}>{item.subject} • {item.studentsCount} students</Text>
        <Text style={styles.bio} numberOfLines={1}>{item.bio}</Text>
      </View>
      <View style={styles.right}>
        <View style={styles.ratingWrap}>
          <Ionicons name="star" size={14} color="#f5a623" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  left: {
    marginRight: 12
  },
  mid: {
    flex: 1
  },
  right: {
    alignItems: 'flex-end'
  },
  name: { fontWeight: '700', fontSize: 16, marginBottom: 4 },
  subject: { fontSize: 13, color: '#6b6b6b', marginBottom: 6 },
  bio: { fontSize: 12, color: '#8a8a8a' },
  ratingWrap: {
    backgroundColor: '#f3f7ff',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: { marginLeft: 6, fontWeight: '700' }
});

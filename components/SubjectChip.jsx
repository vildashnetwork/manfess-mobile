// components/SubjectChip.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SubjectChip({ title, onPress, active }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active ? styles.active : styles.inactive]}
    >
      <Text style={[styles.text, active ? styles.textActive : styles.textInactive]}> {title} </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1
  },
  active: { backgroundColor: '#0b7cff', borderColor: '#0b7cff' },
  inactive: { backgroundColor: 'transparent', borderColor: '#e2e8f0' },
  text: { fontSize: 13 },
  textActive: { color: 'white' },
  textInactive: { color: '#333' }
});

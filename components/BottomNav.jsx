
// components/BottomNav.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNav({ navigation, activeRoute }) {
  const isActive = (name) => activeRoute === name;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" size={22} color={isActive('Home') ? '#0b7cff' : '#666'} />
        <Text style={[styles.label, { color: isActive('Home') ? '#0b7cff' : '#666' }]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Messages')}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={22} color={isActive('Messages') ? '#0b7cff' : '#666'} />
        <Text style={[styles.label, { color: isActive('Messages') ? '#0b7cff' : '#666' }]}>Messages</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="person-outline" size={22} color={isActive('Profile') ? '#0b7cff' : '#666'} />
        <Text style={[styles.label, { color: isActive('Profile') ? '#0b7cff' : '#666' }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee'
  },
  tab: { alignItems: 'center' },
  label: { fontSize: 12, marginTop: 4 }
});

// components/Header.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ title, onProfilePress, navigation  }) {
  const login = ()=>{
    const rootNav = navigation.getParent(); 
  rootNav.reset({
    index: 0,
    routes: [{ name: 'Login' }],
  });
  }
  return (
    <View style={styles.container}>
       <TouchableOpacity
        onPress={login}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
       
       
        <Text style={styles.subtitle}>Welcome back</Text>

      </View>
        </TouchableOpacity>

      <TouchableOpacity style={styles.avatarWrap} onPress={onProfilePress}>
        <Ionicons name="person-circle-outline" size={40} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  left: {},
  title: { fontSize: 20, fontWeight: '700', color: '#111' },
  subtitle: { fontSize: 12, color: '#6b6b6b', marginTop: 4 },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if(email && password){
      await AsyncStorage.setItem('teacher', JSON.stringify({ email }));
      navigation.replace('Home');
    } else {
      Alert.alert('Error', 'Please enter email and password');
    }
  };

  return (
    <ImageBackground source={{uri:'https://images.unsplash.com/photo-1596496058981-6d3e3fef3676?auto=format&fit=crop&w=800&q=80'}} style={styles.background}>
      <Animatable.View animation="fadeInUp" style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to manage your classes</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </Animatable.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background:{flex:1, justifyContent:'center'},
  container:{backgroundColor:'rgba(255,255,255,0.9)', margin:20, padding:30, borderRadius:20, elevation:10, shadowColor:'#000', shadowOffset:{width:0,height:5}, shadowOpacity:0.3},
  title:{fontSize:28, fontWeight:'bold', marginBottom:10, color:'#333'},
  subtitle:{fontSize:16, marginBottom:20, color:'#555'},
  input:{borderWidth:1, borderColor:'#ccc', padding:12, borderRadius:10, marginBottom:15, backgroundColor:'#fff'},
  button:{backgroundColor:'#4CAF50', padding:15, borderRadius:12, marginTop:10},
  buttonText:{color:'#fff', fontWeight:'bold', textAlign:'center', fontSize:16},
});

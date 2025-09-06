import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { DevSettings } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Please enter email and password');
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://manfess-backend.onrender.com/api/teachers/login",
        {
          number: email,
          password: password
        }
      );

      if (res.status === 200 && res.data.user) {
        await AsyncStorage.setItem('teacher', JSON.stringify(res.data.user));
      DevSettings.reload();
      } else {
        Alert.alert('Error', res.data.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image 
          source={require('../assets/public.jpg')} 
          style={styles.image} 
        />
        <Text style={styles.title}>Teacher Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Teacher Number / Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="default"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>MANFESS STAFF</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex:1, 
    justifyContent:'center', 
    alignItems:'center', 
    backgroundColor:'#f2f5f9' 
  },
  card: { 
    width:'90%', 
    backgroundColor:'#fff', 
    borderRadius:20, 
    padding:25, 
    alignItems:'center',
    shadowColor:'#000',
    shadowOpacity:0.15,
    shadowOffset:{ width:0, height:4 },
    shadowRadius:8,
    elevation:5
  },
  image: { 
    width:100, 
    height:100, 
    borderRadius:50, 
    marginBottom:15, 
    borderWidth:2, 
    borderColor:'#4CAF50' 
  },
  title: { 
    fontSize:26, 
    marginBottom:20, 
    fontWeight:'bold', 
    color:'#333' 
  },
  input: { 
    width:'100%', 
    padding:12, 
    borderWidth:1, 
    borderColor:'#ccc',
    borderRadius:10, 
    marginVertical:8, 
    backgroundColor:'#fafafa' 
  },
  button: { 
    width:'100%', 
    padding:15, 
    backgroundColor:'#4CAF50', 
    borderRadius:12, 
    marginTop:12 
  },
  buttonText: { 
    color:'#fff', 
    textAlign:'center', 
    fontWeight:'bold',
    fontSize:16 
  },
  footerText: {
    marginTop:15,
    fontSize:14,
    color:'#4CAF50',
    fontWeight:'600'
  }
});

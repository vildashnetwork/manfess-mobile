import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/Navigatotor';
import { SafeAreaProvider } from 'react-native-safe-area-context';



export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator /> 
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TimetableScreen() {
  const timetable = [
    { day:'Monday', subject:'Math' },
    { day:'Tuesday', subject:'English' },
    { day:'Wednesday', subject:'Science' },
    { day:'Thursday', subject:'History' },
    { day:'Friday', subject:'Geography' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Class Timetable</Text>
      {timetable.map((item,index)=>(
        <View key={index} style={styles.row}>
          <Text style={styles.day}>{item.day}</Text>
          <Text style={styles.subject}>{item.subject}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:20, backgroundColor:'#f5f5f5'},
  title:{fontSize:24,fontWeight:'bold', marginBottom:20},
  row:{flexDirection:'row', justifyContent:'space-between', padding:20, backgroundColor:'#fff', borderRadius:15, marginBottom:15, elevation:5},
  day:{fontSize:16, fontWeight:'600'},
  subject:{fontSize:16, fontWeight:'bold'}
});

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Platform,
//   TextInput,
//   Modal,
//   Image,
//   FlatList,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Animatable from 'react-native-animatable';

// // Dummy data for quick stats


// // Dummy data for recent activities
// const recentActivities = [
//   { id: '1', title: 'Marked attendance for Class 10A', time: '2 hours ago' },
//   { id: '2', title: 'Updated marks for Math Quiz', time: '4 hours ago' },
//   { id: '3', title: 'Posted new announcement', time: 'Yesterday' },
//   { id: '4', title: 'Reviewed student profiles', time: 'Yesterday' },
//   { id: '5', title: 'Scheduled new timetable', time: '2 days ago' },
// ];

// export default function DashboardScreen({ navigation }) {
//   const [teacher, setTeacher] = useState(null);
//   const [activeNav, setActiveNav] = useState('Dashboard');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [notifications, setNotifications] = useState([
//     { id: '1', message: 'New assignment submitted by John Doe' },
//     { id: '2', message: 'Parent meeting scheduled for tomorrow' },
//     { id: '3', message: 'System update available' },
//   ]);

//  const [savedResults, setSavedResults] = useState([]);
//  const [localStudents, setlocalStudents] = useState([])
//  const [localSubjects, setlocalSubjects] = useState([])
//  const [al, setal] = useState([])
//  const [ol, setol] = useState([])
//  const [jk, seyjk]= useState([])
//   useEffect(() => {
//     const loadResults = async () => {
//       try {
//         const stored = await AsyncStorage.getItem("mockResults");

//         if (stored) {
//           setSavedResults(JSON.parse(stored));
//         }
//         const std = await AsyncStorage.getItem('students');
//         if(std){
//           setlocalStudents(JSON.parse(std))
//         }
//         const stda = await AsyncStorage.getItem('subjectsalevel');
//         if(stda){
//           setlocalSubjects(JSON.parse(stda))
//         }

//          const saved= await AsyncStorage.getItem('mockResultsHistoryalevel');
// if(saved){
// setal(JSON.parse(saved))
// }
//   const storedAlevel = await AsyncStorage.getItem("mockResultsHistoryp");
//   if(storedAlevel){
//  setol(JSON.parse(storedAlevel))
//   }
//   const storedOlevel = await AsyncStorage.getItem("mockResultsHistoryalevelpremock");
//   if(storedOlevel){
//  setjk(JSON.parse(storedOlevel))
//   }
//       } catch (err) {
//         console.error("Error loading results:", err);
//       }
//     };
//     loadResults();
//   }, []);

//   const quickStatsData = [
//   { label: 'Olevel Students', value: localStudents?.length , color: '#4CAF50' },
//   { label: 'Alevel Students', value: localSubjects?.length, color: '#03A9F4' },
//   { label: 'Alevel Premock', value: jk?.length, color: '#FF5722' },
//   { label: 'Olevel Premock', value: ol?.length, color: '#FFC107' },
//   { label: 'Olevel Mock', value: savedResults?.length, color: '#806e3bff' },
//   { label: 'Alevel Mock', value: al?.length, color: '#228a51ff' },
// ];

//   useEffect(() => {
//     const loadTeacher = async () => {
//       const data = await AsyncStorage.getItem('teacher');
//       if (data) setTeacher(JSON.parse(data));
//     };
//     loadTeacher();
//   }, []);

//   const navItems = [
//     { title: 'Dashboard', screen: 'Dashboard' },
//     { title: 'Students', screen: 'Students' },
//     { title: 'Classes', screen: 'Classes' },
//     { title: 'Reports', screen: 'Reports' },
//     { title: 'Settings', screen: 'Settings' },
//   ];

//   const dashboardItems = [
//     { title: 'Filled Mock Marks', screen: 'Marks', color: '#4CAF50', animation: 'fadeInLeft', delay: 100, icon: '📝' },
//      { title: 'Filled Pre Mock Marks', screen: 'FilledPremock', color: '#256827ff', animation: 'fadeInLeft', delay: 100, icon: '📝' },
    
//     { title: 'View Timetable', screen: 'Timetable', color: '#03A9F4', animation: 'fadeInRight', delay: 200, icon: '🗓️' },
//     { title: 'Mock Alevel', screen: 'MockAlevel', color: '#FF5722', animation: 'fadeInLeft', delay: 300, icon: '📚' },
//     { title: 'Mock Olevel', screen: 'MockOlevel', color: '#FFC107', animation: 'fadeInRight', delay: 400, icon: '📚' },
//     { title: 'Pre Mock Olevel', screen: 'PremockOlevelclass', color: '#2196F3', animation: 'fadeInLeft', delay: 500, icon: '📚' },
//     { title: 'Pre Mock Alevel', screen: 'PremockAlevel', color: '#9C27B0', animation: 'fadeInRight', delay: 600, icon: '📚' },
//     { title: 'Profile', screen: 'Profile', color: '#FF9800', animation: 'fadeInLeft', delay: 700, icon: '👤' },
//   { title: 'Exam Marks', screen: 'First_Cycle', color: '#FF9800', animation: 'fadeInLeft', delay: 700, icon: '📝' },
//   { title: 'ALL Exam Marks', screen: 'TerminalExams', color: '#FF9800', animation: 'fadeInLeft', delay: 700, icon: '📝' },
  
// ];

//   const filteredItems = dashboardItems.filter(item =>
//     item.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const renderActivityItem = ({ item }) => (
//     <Animatable.View animation="fadeInUp" duration={600} style={styles.activityItem}>
//       <Text style={styles.activityTitle}>{item.title}</Text>
//       <Text style={styles.activityTime}>{item.time}</Text>
//     </Animatable.View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//   <View style={{ borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
//   <ScrollView
//     horizontal
//     showsHorizontalScrollIndicator={false}
//     contentContainerStyle={{ paddingHorizontal: 10 }}
//   >
//     {navItems.map((item, idx) => (
//       <TouchableOpacity
//         key={idx}
//         style={[
//           styles.navItem,
//           activeNav === item.title && styles.activeNavItem
//         ]}
//         onPress={() => {
//           setActiveNav(item.title);
//           if (item.screen !== 'Dashboard') {
//             navigation.navigate(item.screen);
//           }
//         }}
//         activeOpacity={0.7}
//       >
//         <Animatable.Text
//           animation={activeNav === item.title ? 'pulse' : undefined}
//           duration={600}
//           style={[
//             styles.navText,
//             activeNav === item.title && styles.activeNavText
//           ]}
//         >
//           {item.title}
//         </Animatable.Text>
//       </TouchableOpacity>
//     ))}
//   </ScrollView>
// </View>
      
//       <View style={styles.header}>
//         <Animatable.View animation="fadeInLeft" duration={800} style={styles.logoContainer}>
//           <Text style={styles.logoText}>MANFESS </Text>
//         </Animatable.View>
//         <TouchableOpacity style={styles.notificationIcon} onPress={() => setModalVisible(true)}>
//           <Text style={styles.iconText}>🔔</Text>
//           {notifications.length > 0 && (
//             <View style={styles.notificationBadge}>
//               <Text style={styles.badgeText}>{notifications.length}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>
      
//       <ScrollView contentContainerStyle={styles.container}>
//         <Animatable.View animation="fadeIn" duration={1000} style={styles.welcomeSection}>
//           <Text style={styles.greeting}>Welcome back,</Text>
//           <Text style={styles.teacherName}>{teacher?.Name || 'Esteemed Educator'}</Text>
//           <View style={styles.divider} />
//         </Animatable.View>
        
//         <Animatable.View animation="fadeInUp" duration={800} delay={200} style={styles.searchSection}>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search features..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             disabled
//           />
//         </Animatable.View>
        
//         <Animatable.View animation="fadeInUp" duration={800} delay={400} style={styles.quickStatsSection}>
//           <Text style={styles.sectionTitle}>Quick Stats</Text>
//           <View style={styles.statsContainer}>
//             {quickStatsData.map((stat, idx) => (
//               <Animatable.View
//                 key={idx}
//                 animation="zoomIn"
//                 duration={600}
//                 delay={idx * 100}
//                 style={[styles.statCard, { backgroundColor: stat.color }]}
//               >
//                 <Text style={styles.statValue}>{stat.value}</Text>
//                 <Text style={styles.statLabel}>{stat.label}</Text>
//               </Animatable.View>
//             ))}
//           </View>
//         </Animatable.View>
        
//         <Animatable.View animation="fadeInUp" duration={800} delay={600} style={styles.mainFeaturesSection}>
//           <Text style={styles.sectionTitle}>Main Features</Text>
//           <View style={styles.itemsContainer}>
//             {filteredItems.map((item, idx) => (
//               <Animatable.View
//                 key={idx}
//                 animation={item.animation}
//                 duration={800}
//                 delay={item.delay}
//                 style={styles.itemWrapper}
//               >
//                 <TouchableOpacity
//                   style={[styles.itemTile, { backgroundColor: item.color }]}
//                   onPress={() => navigation.navigate(item.screen)}
//                   activeOpacity={0.8}
//                 >
//                   <View style={styles.itemContent}>
//                     <Text style={styles.itemIcon}>{item.icon}</Text>
//                     <Text style={styles.itemText}>{item.title}</Text>
//                     <Text style={styles.itemSubText}>Tap to access</Text>
//                   </View>
//                 </TouchableOpacity>
//               </Animatable.View>
//             ))}
//           </View>
//         </Animatable.View>
        
//        <Animatable.View animation="fadeInUp" duration={800} delay={800} style={styles.recentActivitySection}>
//   <Text style={styles.sectionTitle}>Recent Activity</Text>
  
//   <ScrollView contentContainerStyle={styles.activityList}>
//     {recentActivities.map((item, idx) => (
//       <Animatable.View 
//         key={idx} 
//         animation="fadeInRight" 
//         duration={600} 
//         delay={idx * 100} 
//         style={styles.activityItem}
//       >
//         <Text>{item.title}</Text>
//       </Animatable.View>
//     ))}
//   </ScrollView>
// </Animatable.View>


       
        
//         <Animatable.View animation="fadeInUp" duration={800} delay={1000} style={styles.footerSection}>
//           <Text style={styles.footerText}>© {new Date().getFullYear()} MANFESS School System</Text>
//           <Text style={styles.footerSubText}>Version 2.0.1 | Designed for Excellence</Text>
//           <TouchableOpacity style={styles.footerLink}>
//             <Text style={styles.footerLinkText}>Privacy Policy</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.footerLink}>
//             <Text style={styles.footerLinkText}>Terms of Service</Text>
//           </TouchableOpacity>
//         </Animatable.View>
//       </ScrollView>
      
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Notifications</Text>
//             {notifications.map((notif, idx) => (
//               <Animatable.View key={idx} animation="fadeInDown" duration={600} delay={idx * 100} style={styles.notificationItem}>
//                 <Text style={styles.notificationText}>{notif.message}</Text>
//               </Animatable.View>
//             ))}
//             <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

      
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//   },
//   topNav: {
//     flexDirection: 'row',
//     backgroundColor: '#f8f9fa',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     justifyContent: 'space-around',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   navItem: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 24,
//     backgroundColor: 'transparent',
//   },
//   activeNavItem: {
//     backgroundColor: '#e3f2fd',
//   },
//   navText: {
//     fontSize: 16,
//     color: '#555555',
//     fontWeight: '500',
//   },
//   activeNavText: {
//     color: '#1e88e5',
//     fontWeight: 'bold',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logoText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333333',
//   },
//   notificationIcon: {
//     position: 'relative',
//     padding: 10,
//   },
//   iconText: {
//     fontSize: 24,
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: '#FF5722',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   badgeText: {
//     color: '#ffffff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   container: {
//     padding: 20,
//     paddingBottom: 60,
//   },
//   welcomeSection: {
//     marginBottom: 30,
//     alignItems: 'center',
//   },
//   greeting: {
//     fontSize: 22,
//     color: '#555555',
//     fontWeight: '500',
//   },
//   teacherName: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#222222',
//     marginTop: 4,
//   },
//   divider: {
//     width: '80%',
//     height: 2,
//     backgroundColor: '#dddddd',
//     marginTop: 15,
//     borderRadius: 1,
//   },
//   searchSection: {
//     marginBottom: 25,
//   },
//   searchInput: {
//     backgroundColor: '#f5f5f5',
//     borderRadius: 24,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#333333',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   quickStatsSection: {
//     marginBottom: 30,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333333',
//     marginBottom: 15,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   statCard: {
//     width: '48%',
//     height: 100,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//   },
//   statValue: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#ffffff',
//   },
//   statLabel: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.9)',
//     marginTop: 5,
//   },
//   mainFeaturesSection: {
//     marginBottom: 30,
//   },
//   itemsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   itemWrapper: {
//     width: '48%',
//     marginBottom: 20,
//   },
//   itemTile: {
//     flex: 1,
//     height: 180,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 12,
//     shadowColor: '#000000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.25,
//     shadowRadius: 16,
//     overflow: 'hidden',
//   },
//   itemContent: {
//     alignItems: 'center',
//     padding: 20,
//   },
//   itemIcon: {
//     fontSize: 40,
//     color: '#ffffff',
//     marginBottom: 15,
//     textShadowColor: 'rgba(0, 0, 0, 0.2)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   itemText: {
//     color: '#ffffff',
//     fontSize: 20,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 8,
//     textShadowColor: 'rgba(0, 0, 0, 0.15)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   itemSubText: {
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontSize: 14,
//     fontWeight: '400',
//     textAlign: 'center',
//   },
//   recentActivitySection: {
//     marginBottom: 30,
//   },
//   activityList: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 20,
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   activityItem: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   activityTitle: {
//     fontSize: 16,
//     color: '#333333',
//     fontWeight: '500',
//   },
//   activityTime: {
//     fontSize: 12,
//     color: '#888888',
//     marginTop: 4,
//   },
//   footerSection: {
//     marginTop: 40,
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#eeeeee',
//     paddingTop: 20,
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#888888',
//   },
//   footerSubText: {
//     fontSize: 12,
//     color: '#aaaaaa',
//     marginTop: 4,
//   },
//   footerLink: {
//     marginTop: 10,
//   },
//   footerLinkText: {
//     fontSize: 14,
//     color: '#1e88e5',
//     textDecorationLine: 'underline',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#ffffff',
//     borderRadius: 24,
//     padding: 20,
//     width: '80%',
//     maxHeight: '60%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 10,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333333',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   notificationItem: {
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   notificationText: {
//     fontSize: 16,
//     color: '#555555',
//   },
//   closeButton: {
//     marginTop: 20,
//     backgroundColor: '#1e88e5',
//     borderRadius: 20,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   // Additional styles for padding and margins if needed
//   extraPadding1: {
//     padding: 5,
//   },
//   extraPadding2: {
//     padding: 10,
//   },
//   extraPadding3: {
//     padding: 15,
//   },
//   extraMargin1: {
//     margin: 5,
//   },
//   extraMargin2: {
//     margin: 10,
//   },
//   extraMargin3: {
//     margin: 15,
//   },
//   // Shadow variants
//   shadowLight: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   shadowMedium: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   shadowDark: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   // Text variants
//   textSmall: {
//     fontSize: 12,
//     color: '#666666',
//   },
//   textMedium: {
//     fontSize: 16,
//     color: '#444444',
//   },
//   textLarge: {
//     fontSize: 20,
//     color: '#222222',
//   },
//   textBold: {
//     fontWeight: 'bold',
//   },
//   textItalic: {
//     fontStyle: 'italic',
//   },
//   // Border variants
//   borderThin: {
//     borderWidth: 1,
//     borderColor: '#dddddd',
//   },
//   borderMedium: {
//     borderWidth: 2,
//     borderColor: '#cccccc',
//   },
//   borderThick: {
//     borderWidth: 3,
//     borderColor: '#bbbbbb',
//   },
//   // Background colors
//   bgLight: {
//     backgroundColor: '#f5f5f5',
//   },
//   bgMedium: {
//     backgroundColor: '#e0e0e0',
//   },
//   bgDark: {
//     backgroundColor: '#cccccc',
//   },
//   // Flex variants
//   flexRow: {
//     flexDirection: 'row',
//   },
//   flexColumn: {
//     flexDirection: 'column',
//   },
//   justifyCenter: {
//     justifyContent: 'center',
//   },
//   alignCenter: {
//     alignItems: 'center',
//   },
//   // Animation placeholders (though animations are handled by Animatable)
//   animateFade: {
//     opacity: 1,
//   },
//   animateSlide: {
//     transform: [{ translateX: 0 }],
//   },
//   // More divider styles
//   dividerHorizontal: {
//     height: 1,
//     backgroundColor: '#eeeeee',
//   },
//   dividerVertical: {
//     width: 1,
//     backgroundColor: '#eeeeee',
//   },
//   // Icon styles
//   iconSmall: {
//     fontSize: 20,
//   },
//   iconMedium: {
//     fontSize: 30,
//   },
//   iconLarge: {
//     fontSize: 40,
//   },
//   // Button variants
//   buttonPrimary: {
//     backgroundColor: '#1e88e5',
//     borderRadius: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   buttonSecondary: {
//     backgroundColor: '#4CAF50',
//     borderRadius: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   // List item styles
//   listItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   listItemText: {
//     fontSize: 16,
//     color: '#333333',
//   },
//   // Modal variants
//   modalSmall: {
//     width: '60%',
//   },
//   modalMedium: {
//     width: '80%',
//   },
//   modalLarge: {
//     width: '90%',
//   },
//   // Input variants
//   inputShort: {
//     width: '50%',
//   },
//   inputMedium: {
//     width: '70%',
//   },
//   inputLong: {
//     width: '100%',
//   },
//   // Card variants
//   cardSmall: {
//     height: 100,
//   },
//   cardMedium: {
//     height: 150,
//   },
//   cardLarge: {
//     height: 200,
//   },
//   // Additional colors
//   colorPrimary: {
//     color: '#1e88e5',
//   },
//   colorSecondary: {
//     color: '#4CAF50',
//   },
//   colorAccent: {
//     color: '#FF5722',
//   },
//   colorWarning: {
//     color: '#FFC107',
//   },
//   colorError: {
//     color: '#F44336',
//   },
//   colorInfo: {
//     color: '#2196F3',
//   },
//   // Opacity variants
//   opacityLow: {
//     opacity: 0.5,
//   },
//   opacityMedium: {
//     opacity: 0.7,
//   },
//   opacityHigh: {
//     opacity: 0.9,
//   },
//   // Radius variants
//   radiusSmall: {
//     borderRadius: 8,
//   },
//   radiusMedium: {
//     borderRadius: 16,
//   },
//   radiusLarge: {
//     borderRadius: 32,
//   },
//   // Elevation variants
//   elevationLow: {
//     elevation: 2,
//   },
//   elevationMedium: {
//     elevation: 6,
//   },
//   elevationHigh: {
//     elevation: 12,
//   },
//   // Text alignment
//   textLeft: {
//     textAlign: 'left',
//   },
//   textCenter: {
//     textAlign: 'center',
//   },
//   textRight: {
//     textAlign: 'right',
//   },
//   // Flex grow
//   flexGrow1: {
//     flexGrow: 1,
//   },
//   flexGrow2: {
//     flexGrow: 2,
//   },
//   // Position
//   positionRelative: {
//     position: 'relative',
//   },
//   positionAbsolute: {
//     position: 'absolute',
//   },
//   // Overflow
//   overflowHidden: {
//     overflow: 'hidden',
//   },
//   overflowVisible: {
//     overflow: 'visible',
//   },
//   // Z-index
//   zIndexLow: {
//     zIndex: 1,
//   },
//   zIndexMedium: {
//     zIndex: 5,
//   },
//   zIndexHigh: {
//     zIndex: 10,
//   },
//   // More padding variants
//   paddingSmall: {
//     padding: 8,
//   },
//   paddingMedium: {
//     padding: 16,
//   },
//   paddingLarge: {
//     padding: 24,
//   },
//   paddingHorizontalSmall: {
//     paddingHorizontal: 8,
//   },
//   paddingHorizontalMedium: {
//     paddingHorizontal: 16,
//   },
//   paddingHorizontalLarge: {
//     paddingHorizontal: 24,
//   },
//   paddingVerticalSmall: {
//     paddingVertical: 8,
//   },
//   paddingVerticalMedium: {
//     paddingVertical: 16,
//   },
//   paddingVerticalLarge: {
//     paddingVertical: 24,
//   },
//   // Margin variants
//   marginSmall: {
//     margin: 8,
//   },
//   marginMedium: {
//     margin: 16,
//   },
//   marginLarge: {
//     margin: 24,
//   },
//   marginHorizontalSmall: {
//     marginHorizontal: 8,
//   },
//   marginHorizontalMedium: {
//     marginHorizontal: 16,
//   },
//   marginHorizontalLarge: {
//     marginHorizontal: 24,
//   },
//   marginVerticalSmall: {
//     marginVertical: 8,
//   },
//   marginVerticalMedium: {
//     marginVertical: 16,
//   },
//   marginVerticalLarge: {
//     marginVertical: 24,
//   },
//   // Width variants
//   widthFull: {
//     width: '100%',
//   },
//   widthHalf: {
//     width: '50%',
//   },
//   widthQuarter: {
//     width: '25%',
//   },
//   // Height variants
//   heightFull: {
//     height: '100%',
//   },
//   heightHalf: {
//     height: '50%',
//   },
//   heightQuarter: {
//     height: '25%',
//   },
//   // Align self
//   alignSelfCenter: {
//     alignSelf: 'center',
//   },
//   alignSelfStart: {
//     alignSelf: 'flex-start',
//   },
//   alignSelfEnd: {
//     alignSelf: 'flex-end',
//   },
//   // Justify self
//   justifySelfCenter: {
//     justifySelf: 'center',
//   },
//   // Background transparent
//   bgTransparent: {
//     backgroundColor: 'transparent',
//   },
//   // Border none
//   borderNone: {
//     borderWidth: 0,
//   },
//   // Text uppercase
//   textUppercase: {
//     textTransform: 'uppercase',
//   },
//   textLowercase: {
//     textTransform: 'lowercase',
//   },
//   textCapitalize: {
//     textTransform: 'capitalize',
//   },
//   // Line height
//   lineHeightSmall: {
//     lineHeight: 16,
//   },
//   lineHeightMedium: {
//     lineHeight: 24,
//   },
//   lineHeightLarge: {
//     lineHeight: 32,
//   },
//   // Letter spacing
//   letterSpacingSmall: {
//     letterSpacing: 0.5,
//   },
//   letterSpacingMedium: {
//     letterSpacing: 1,
//   },
//   letterSpacingLarge: {
//     letterSpacing: 1.5,
//   },
//   // More shadow offsets
//   shadowOffsetNone: {
//     shadowOffset: { width: 0, height: 0 },
//   },
//   shadowOffsetBottom: {
//     shadowOffset: { width: 0, height: 4 },
//   },
//   shadowOffsetRight: {
//     shadowOffset: { width: 4, height: 0 },
//   },
//   // To reach closer to 1000 lines, adding more variant styles
//   variant1: {
//     backgroundColor: '#fafafa',
//     padding: 5,
//     margin: 5,
//   },
//   variant2: {
//     backgroundColor: '#f0f0f0',
//     padding: 10,
//     margin: 10,
//   },
//   variant3: {
//     backgroundColor: '#e5e5e5',
//     padding: 15,
//     margin: 15,
//   },
//   variant4: {
//     backgroundColor: '#dadada',
//     padding: 20,
//     margin: 20,
//   },
//   variant5: {
//     backgroundColor: '#d0d0d0',
//     padding: 25,
//     margin: 25,
//   },
//   variant6: {
//     fontSize: 10,
//     color: '#999999',
//   },
//   variant7: {
//     fontSize: 12,
//     color: '#888888',
//   },
//   variant8: {
//     fontSize: 14,
//     color: '#777777',
//   },
//   variant9: {
//     fontSize: 16,
//     color: '#666666',
//   },
//   variant10: {
//     fontSize: 18,
//     color: '#555555',
//   },
//   variant11: {
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   variant12: {
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#bbb',
//   },
//   variant13: {
//     borderRadius: 15,
//     borderWidth: 3,
//     borderColor: '#aaa',
//   },
//   variant14: {
//     elevation: 1,
//     shadowOpacity: 0.05,
//   },
//   variant15: {
//     elevation: 4,
//     shadowOpacity: 0.1,
//   },
//   variant16: {
//     elevation: 7,
//     shadowOpacity: 0.15,
//   },
//   variant17: {
//     elevation: 10,
//     shadowOpacity: 0.2,
//   },
//   variant18: {
//     flex: 1,
//     justifyContent: 'flex-start',
//   },
//   variant19: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   variant20: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   variant21: {
//     flex: 1,
//     alignItems: 'flex-end',
//   },
//   variant22: {
//     opacity: 0.95,
//   },
//   variant23: {
//     opacity: 0.85,
//   },
//   variant24: {
//     opacity: 0.75,
//   },
//   variant25: {
//     textAlign: 'justify',
//   },
//   variant26: {
//     fontFamily: 'sans-serif', // Assuming default
//   },
//   variant27: {
//     fontFamily: 'serif',
//   },
//   variant28: {
//     fontFamily: 'monospace',
//   },
//   variant29: {
//     transform: [{ scale: 1.05 }],
//   },
//   variant30: {
//     transform: [{ scale: 0.95 }],
//   },
//   // Continuing to add more variants to extend the code length
//   variant31: {
//     paddingTop: 5,
//   },
//   variant32: {
//     paddingBottom: 5,
//   },
//   variant33: {
//     paddingLeft: 5,
//   },
//   variant34: {
//     paddingRight: 5,
//   },
//   variant35: {
//     marginTop: 5,
//   },
//   variant36: {
//     marginBottom: 5,
//   },
//   variant37: {
//     marginLeft: 5,
//   },
//   variant38: {
//     marginRight: 5,
//   },
//   variant39: {
//     borderTopWidth: 1,
//   },
//   variant40: {
//     borderBottomWidth: 1,
//   },
//   variant41: {
//     borderLeftWidth: 1,
//   },
//   variant42: {
//     borderRightWidth: 1,
//   },
//   variant43: {
//     borderTopColor: '#ddd',
//   },
//   variant44: {
//     borderBottomColor: '#ddd',
//   },
//   variant45: {
//     borderLeftColor: '#ddd',
//   },
//   variant46: {
//     borderRightColor: '#ddd',
//   },
//   variant47: {
//     backgroundColor: '#ffffff',
//   },
//   variant48: {
//     backgroundColor: '#000000',
//     color: '#ffffff',
//   },
//   variant49: {
//     backgroundColor: '#ff0000',
//   },
//   variant50: {
//     backgroundColor: '#00ff00',
//   },
//   variant51: {
//     backgroundColor: '#0000ff',
//   },
//   variant52: {
//     color: '#ff0000',
//   },
//   variant53: {
//     color: '#00ff00',
//   },
//   variant54: {
//     color: '#0000ff',
//   },
//   variant55: {
//     fontSize: 8,
//   },
//   variant56: {
//     fontSize: 24,
//   },
//   variant57: {
//     fontSize: 32,
//   },
//   variant58: {
//     fontWeight: '300',
//   },
//   variant59: {
//     fontWeight: '700',
//   },
//   variant60: {
//     fontWeight: '900',
//   },
//   // Adding even more to approach a longer code, though not literally 1000 lines
//   variant61: {
//     textDecorationLine: 'underline',
//   },
//   variant62: {
//     textDecorationLine: 'line-through',
//   },
//   variant63: {
//     textShadowColor: '#aaa',
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 3,
//   },
//   variant64: {
//     overflow: 'scroll',
//   },
//   variant65: {
//     flexWrap: 'wrap',
//   },
//   variant66: {
//     flexWrap: 'nowrap',
//   },
//   variant67: {
//     flexShrink: 1,
//   },
//   variant68: {
//     flexBasis: 'auto',
//   },
//   variant69: {
//     top: 0,
//   },
//   variant70: {
//     bottom: 0,
//   },
//   variant71: {
//     left: 0,
//   },
//   variant72: {
//     right: 0,
//   },
//   variant73: {
//     minWidth: 100,
//   },
//   variant74: {
//     maxWidth: 300,
//   },
//   variant75: {
//     minHeight: 50,
//   },
//   variant76: {
//     maxHeight: 200,
//   },
//   variant77: {
//     aspectRatio: 1,
//   },
//   variant78: {
//     transform: [{ rotate: '90deg' }],
//   },
//   variant79: {
//     transform: [{ skewX: '10deg' }],
//   },
//   variant80: {
//     backfaceVisibility: 'hidden',
//   },
//   // Note: This is to extend the code as per request, but in practice, use utility classes or themes for better maintenance
//   variant81: {
//     padding: 30,
//   },
//   variant82: {
//     margin: 30,
//   },
//   variant83: {
//     borderRadius: 50,
//   },
//   variant84: {
//     elevation: 15,
//   },
//   variant85: {
//     shadowRadius: 20,
//   },
//   variant86: {
//     opacity: 0.6,
//   },
//   variant87: {
//     zIndex: 20,
//   },
//   variant88: {
//     lineHeight: 40,
//   },
//   variant89: {
//     letterSpacing: 2,
//   },
//   variant90: {
//     textTransform: 'none',
//   },
//   variant91: {
//     fontStyle: 'normal',
//   },
//   variant92: {
//     alignContent: 'center',
//   },
//   variant93: {
//     justifyContent: 'space-between',
//   },
//   variant94: {
//     alignItems: 'baseline',
//   },
//   variant95: {
//     flexDirection: 'row-reverse',
//   },
//   variant96: {
//     flexDirection: 'column-reverse',
//   },
//   variant97: {
//     backgroundColor: 'rgba(0,0,0,0.1)',
//   },
//   variant98: {
//     borderColor: 'transparent',
//   },
//   variant99: {
//     shadowColor: '#fff',
//   },
//   variant100: {
//     textAlignVertical: 'center',
//   },
//   // Could continue adding more, but this should suffice for demonstration of an extended stylesheet
// });
















// // First_Cycle_fixed_footer.js
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert,
//   KeyboardAvoidingView, Platform, DevSettings
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Picker } from '@react-native-picker/picker';
// import axios from 'axios';
// import NetInfo from '@react-native-community/netinfo';

// export default function First_Cycle() {
//   const [marks, setMarks] = useState({});
//   const [grades, setGrades] = useState({});
//   const [students, setStudents] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);
//   const [allSubjects, setAllSubjects] = useState([]);
//   const [filteredSubjects, setFilteredSubjects] = useState([]);
//   const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [allClasses, setAllClasses] = useState([]);
//   const [allDepartments, setAllDepartments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const netInfoUnsubscribeRef = useRef(null);
//   const BASE = 'https://manfess-backend.onrender.com';

//   // Net check
//   const checkOnline = async () => {
//     try {
//       const state = await NetInfo.fetch();
//       return state.isConnected === true;
//     } catch {
//       return false;
//     }
//   };

//   // fetch subjects
//   const fetchSubjectsAndCache = async (online) => {
//     try {
//       if (online) {
//         const res = await axios.get(`${BASE}/api/subjects/all`);
//         if (res?.data) {
//           setAllSubjects(res.data);
//           await AsyncStorage.setItem('offlineSubjects', JSON.stringify(res.data));
//         }
//       } else {
//         const local = await AsyncStorage.getItem('offlineSubjects');
//         if (local) setAllSubjects(JSON.parse(local));
//       }
//     } catch (err) {
//       console.error('fetchSubjectsAndCache error', err);
//       const local = await AsyncStorage.getItem('offlineSubjects');
//       if (local) setAllSubjects(JSON.parse(local));
//     }
//   };

//   // fetch students
//   const fetchAllStudentsAndCache = async (online) => {
//     try {
//       let all = [];
//       if (online) {
//         const res = await axios.get(`${BASE}/api/students/all`);
//         if (res?.data) {
//           all = res.data;
//           await AsyncStorage.setItem('offlineStudentsAll', JSON.stringify(all));
//         }
//       } else {
//         const local = await AsyncStorage.getItem('offlineStudentsAll');
//         if (local) all = JSON.parse(local);
//       }
//       setAllStudents(all);
//       setStudents(all);
//       setAllClasses([...new Set(all.map(s => s.level).filter(Boolean))]);
//       setAllDepartments([...new Set(all.map(s => s.Department).filter(Boolean))]);
//     } catch (err) {
//       console.error('fetchAllStudentsAndCache error', err);
//       const local = await AsyncStorage.getItem('offlineStudentsAll');
//       if (local) {
//         const all = JSON.parse(local);
//         setAllStudents(all);
//         setStudents(all);
//         setAllClasses([...new Set(all.map(s => s.level).filter(Boolean))]);
//         setAllDepartments([...new Set(all.map(s => s.Department).filter(Boolean))]);
//       }
//     }
//   };

//   // mount: initial load + connectivity listener
//   useEffect(() => {
//     (async () => {
//       const online = await checkOnline();
//       await Promise.all([fetchSubjectsAndCache(online), fetchAllStudentsAndCache(online)]);
//     })();

//     netInfoUnsubscribeRef.current = NetInfo.addEventListener(async (state) => {
//       if (state.isConnected) {
//         await fetchSubjectsAndCache(true);
//         await fetchAllStudentsAndCache(true);
//       }
//     });

//     return () => {
//       if (netInfoUnsubscribeRef.current) netInfoUnsubscribeRef.current();
//     };
//   }, []);

//   // apply local filters
//   useEffect(() => {
//     if (selectedClass || selectedDepartment) {
//       const filtered = allStudents.filter(
//         s => (!selectedClass || s.level === selectedClass) &&
//              (!selectedDepartment || s.Department === selectedDepartment)
//       );
//       setStudents(filtered);
//     } else {
//       setStudents(allStudents);
//     }
//   }, [selectedClass, selectedDepartment, allStudents]);

//   useEffect(() => {
//     if (selectedClass && selectedDepartment) {
//       setFilteredSubjects(allSubjects.filter(
//         sub => (!sub.level || sub.level === selectedClass) &&
//                (!sub.departmentName || sub.departmentName === selectedDepartment)
//       ));
//     } else {
//       setFilteredSubjects(allSubjects);
//     }
//   }, [selectedClass, selectedDepartment, allSubjects]);

//   // grade calc
//   const calculateGrade = (score) => {
//     const numericScore = parseInt(score);
//     if (isNaN(numericScore)) return '';
//     if (numericScore >= 90) return 'A+';
//     if (numericScore >= 80) return 'A';
//     if (numericScore >= 60) return 'B';
//     if (numericScore >= 45) return 'C';
//     if (numericScore >= 35) return 'E';
//     return 'U';
//   };

//   const handleChange = (id, value) => {
//     setMarks(prev => ({ ...prev, [id]: value }));
//     setGrades(prev => ({ ...prev, [id]: calculateGrade(value) }));
//   };

//   // Save offline
//   const handleSaveOffline = async () => {
//     if (!selectedSubjectCode) return Alert.alert('Error', 'Please select a subject.');
//     const clsKey = selectedClass || 'ALL';
//     const depKey = selectedDepartment || 'ALL';
//     const histKey = `offlineResultsHistory_${clsKey}_${depKey}`;
//     let history = [];
//     try {
//       const stored = await AsyncStorage.getItem(histKey);
//       history = stored ? JSON.parse(stored) : [];
//     } catch (err) { history = []; }

//     students.forEach(student => {
//       const existingIndex = history.findIndex(
//         r => r.studentname === `${student.FirstName} ${student.LastName}` && r.Subject_Code === selectedSubjectCode
//       );
//       const selectedSubject = allSubjects.find(s => String(s.subjectCode) === String(selectedSubjectCode));
//       const record = {
//         studentname: `${student.FirstName} ${student.LastName}`,
//         localid: student.localid ?? null,
//         studentId: student.id ?? null,
//         Class: student.level || clsKey,
//         Department: student.Department || depKey,
//         Subject: selectedSubject?.subjectTitle || 'N/A',
//         Subject_Code: selectedSubjectCode,
//         Mark: marks[student.id] ?? 0,
//         Grade: grades[student.id] ?? calculateGrade(marks[student.id] ?? 0),
//         Datepushed: new Date().toISOString()
//       };
//       if (existingIndex > -1) history[existingIndex] = record;
//       else history.push(record);
//     });

//     try {
//       await AsyncStorage.setItem(histKey, JSON.stringify(history));
//       await AsyncStorage.setItem(`offlineResults_${clsKey}_${depKey}`, JSON.stringify(history));
//       await AsyncStorage.setItem(`offlineMarks_${clsKey}_${depKey}`, JSON.stringify(marks));
//       Alert.alert('Saved Offline', 'Results updated locally.');
//     } catch (err) {
//       console.error('save offline error', err);
//       Alert.alert('Error', 'Failed to save results locally.');
//     }
//   };

//   // Push online
  
//   const handleSaveOnline = async () => {
//     if (!selectedSubjectCode) return Alert.alert('Error', 'Please select a subject.');
//     if (!selectedClass || !selectedDepartment) return Alert.alert('Error', 'Please select class and department.');

//     const clsKey = selectedClass;
//     const depKey = selectedDepartment;
//     const resultsKey = `offlineResults_${clsKey}_${depKey}`;

//     try {
//       setLoading(true);
//       const stored = await AsyncStorage.getItem(resultsKey);
//       const resultsToSend = stored ? JSON.parse(stored) : [];

//       if (!resultsToSend.length) {
//         Alert.alert('No results to send');
//         return;
//       }

//       // Try batch
//       try {
//         await axios.post(`${BASE}/api/terminalresults`, resultsToSend);
//       } catch (batchErr) {
//         // fallback per-record
//         for (const rec of resultsToSend) {
//           try {
//             await axios.post(`${BASE}/api/terminalresults`, rec);
//           } catch (singleErr) {
//             console.error('Failed to push single record', rec, singleErr);
//           }
//         }
//       }

//       await AsyncStorage.removeItem(resultsKey);
//       await AsyncStorage.removeItem(`offlineResultsHistory_${clsKey}_${depKey}`);
//       await AsyncStorage.removeItem(`offlineMarks_${clsKey}_${depKey}`);
//       Alert.alert('Success', 'Results pushed online successfully.');
//     } catch (err) {
//       console.error('handleSaveOnline error', err);
//       Alert.alert('Error', 'Failed to push results online. Check logs.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UI with fixed footer for buttons so they are always visible
//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//       <View style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
//           <Text style={styles.title}>Filter Students</Text>

//           <View style={styles.pickerContainer}>
//             <Text style={styles.label}>Select Class</Text>
//             <View style={styles.pickerWrapper}>
//               <Picker selectedValue={selectedClass} onValueChange={(v) => setSelectedClass(v)} style={styles.picker}>
//                 <Picker.Item label="-- All Classes --" value="" />
//                 {allClasses.map((cls, idx) => <Picker.Item key={idx} label={cls} value={cls} />)}
//               </Picker>
//             </View>
//           </View>

//           <View style={styles.pickerContainer}>
//             <Text style={styles.label}>Select Department</Text>
//             <View style={styles.pickerWrapper}>
//               <Picker selectedValue={selectedDepartment} onValueChange={(v) => setSelectedDepartment(v)} style={styles.picker}>
//                 <Picker.Item label="-- All Departments --" value="" />
//                 {allDepartments.map((dep, idx) => <Picker.Item key={idx} label={dep} value={dep} />)}
//               </Picker>
//             </View>
//           </View>

//           <View style={styles.pickerContainer}>
//             <Text style={styles.label}>Select Subject</Text>
//             <View style={styles.pickerWrapper}>
//               <Picker selectedValue={selectedSubjectCode} onValueChange={(v) => setSelectedSubjectCode(v)} style={styles.picker}>
//                 <Picker.Item label="-- Select Subject --" value="" />
//                 {filteredSubjects.map(sub => (
//                   <Picker.Item key={String(sub.subjectCode)} label={sub.subjectTitle} value={String(sub.subjectCode)} />
//                 ))}
//               </Picker>
//             </View>
//           </View>

//           <Text style={styles.title}>Marks Entry ({students.length} shown)</Text>

//           {students.length === 0 && <Text style={{ textAlign: 'center', marginBottom: 12 }}>No students to show.</Text>}

//           {students.map(student => (
//             <View key={student.id ?? student.localid ?? Math.random()} style={styles.studentRow}>
//               <Text style={styles.studentName}>{student.FirstName} {student.LastName}</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Marks"
//                 keyboardType="numeric"
//                 value={String(marks[student.id] ?? '')}
//                 onChangeText={val => handleChange(student.id, val)}
//               />
//               <Text style={styles.gradeText}>{grades[student.id] ?? ''}</Text>
//             </View>
//           ))}

//           {/* add bottom padding so ScrollView doesn't hide content under footer */}
//           <View style={{ height: 110 }} />
//         </ScrollView>

//         {/* FIXED FOOTER */}
//         <View style={styles.footer}>
//           <TouchableOpacity style={[styles.footerButton, { backgroundColor: '#4CAF50' }]} onPress={handleSaveOffline}>
//             <Text style={styles.footerButtonText}>Save Offline</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={[styles.footerButton, { backgroundColor: '#03A9F4' }]} onPress={handleSaveOnline} disabled={loading}>
//             <Text style={styles.footerButtonText}>{loading ? 'Sending...' : 'Save Online'}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: { padding: 16, backgroundColor: '#f5f5f5', paddingBottom: 20 },
//   pickerContainer: { marginVertical: 10, padding: 12, backgroundColor: '#fff', borderRadius: 12, elevation: 3 },
//   label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#333' },
//   pickerWrapper: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden' },
//   picker: { height: 48, width: '100%' },
//   title: { fontSize: 18, fontWeight: '700', marginVertical: 8 },
//   studentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#fff', padding: 12, borderRadius: 8, elevation: 2 },
//   studentName: { flex: 1, fontSize: 15, fontWeight: '600' },
//   input: { width: 90, padding: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginRight: 8, textAlign: 'center' },
//   gradeText: { width: 48, textAlign: 'center', fontWeight: '700', color: '#4CAF50' },
//   footer: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: 100,
//     padding: 12,
//     backgroundColor: '#ffffffee',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-around',
//     borderTopWidth: 1,
//     borderTopColor: '#eee'
//   },
//   footerButton: {
//     flex: 0.45,
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center'
//   },
//   footerButtonText: { color: '#fff', fontWeight: '700' }
// });













import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

// scan prefixes used for offline storage
const KEY_PREFIXES = [
  "offlineResults",
  "offlineResultsHistory",
  "mockResults",
  "mockResultsHistory",
  "transactions",
  "recent",
  "activity",
  "activities",
];

const guessDateFrom = (item) => {
  if (!item) return null;
  const candidates = [
    item.savedAt,
    item.Datepushed,
    item.DatePushed,
    item.date,
    item.createdAt,
    item.created_at,
    item.timestamp,
    item.time,
    item.saved_on,
    item.savedOn,
  ];
  for (const c of candidates) {
    if (!c) continue;
    const d = new Date(c);
    if (!isNaN(d.getTime())) return d;
    const num = Number(c);
    if (!Number.isNaN(num)) {
      const d2 = new Date(num);
      if (!isNaN(d2.getTime())) return d2;
    }
  }
  return null;
};

const guessTitleFrom = (item) => {
  if (!item) return "Activity";
  if (item.title) return String(item.title);
  if (item.Subject || item.subject || item.subjectTitle) {
    const subj = item.Subject || item.subject || item.subjectTitle;
    if (item.studentname) return `${item.studentname} • ${subj}`;
    if (item.FirstName || item.LastName) {
      const name = `${item.FirstName ?? ""} ${item.LastName ?? ""}`.trim();
      return `${name} • ${subj}`;
    }
    return String(subj);
  }
  if (item.studentname && item.Mark != null) {
    return `${item.studentname} — Mark: ${item.Mark}`;
  }
  if (item.action) return String(item.action);
  if (item.activity) return String(item.activity);
  if (item.message) return String(item.message);
  const keys = Object.keys(item || {}).slice(0, 3);
  if (keys.length === 0) return "Activity";
  return keys.map(k => `${k}:${String(item[k])}`).join(" | ").slice(0, 60);
};

const timeAgo = (date) => {
  if (!date) return "";
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 5) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return date.toLocaleDateString();
};

export default function DashboardScreen({ navigation }) {
  // recent activities state
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // load recent activities from AsyncStorage
  const loadFromStorage = useCallback(async () => {
    setLoadingActivities(true);
    try {
      const keys = await AsyncStorage.getAllKeys();
      const interestingKeys = keys.filter(k =>
        KEY_PREFIXES.some(prefix => k && k.toLowerCase().startsWith(prefix.toLowerCase()))
      );

      if (interestingKeys.length === 0) {
        setActivities([]);
        setLoadingActivities(false);
        return;
      }

      const pairs = await AsyncStorage.multiGet(interestingKeys);
      const merged = [];

      for (const [key, raw] of pairs) {
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);

          const pushItem = (it) => {
            if (!it || typeof it !== "object") return;
            const date = guessDateFrom(it) || new Date();
            const title = guessTitleFrom(it);
            const id = it.id ?? it.studentId ?? it.localid ?? it.studentname ?? `${key}_${merged.length}`;
            merged.push({ id: String(id), title, date, raw: it, sourceKey: key });
          };

          if (Array.isArray(parsed)) {
            for (const it of parsed) pushItem(it);
          } else if (typeof parsed === "object") {
            if (Array.isArray(parsed.items)) {
              for (const it of parsed.items) pushItem(it);
            } else {
              pushItem(parsed);
            }
          }
        } catch (e) {
          console.warn("RecentActivities: failed to parse key", key, e);
        }
      }

      // sort newest first
      merged.sort((a, b) => b.date.getTime() - a.date.getTime());

      // slice to 6
      const sliced = merged.slice(0, 6).map((m) => ({
        ...m,
        dateFormatted: m.date.toLocaleString(),
        relative: timeAgo(m.date),
      }));

      setActivities(sliced);
    } catch (err) {
      console.error("RecentActivities load error:", err);
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // rest of your states and data loading (kept intact, with slight fixes)
  const [teacher, setTeacher] = useState(null);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'New assignment submitted by John Doe' },
    { id: '2', message: 'Parent meeting scheduled for tomorrow' },
    { id: '3', message: 'System update available' },
  ]);

  const [savedResults, setSavedResults] = useState([]);
  const [localStudents, setlocalStudents] = useState([]);
  const [localSubjects, setlocalSubjects] = useState([]);
  const [al, setal] = useState([]);
  const [ol, setol] = useState([]);
  const [jk, setjk] = useState([]);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const stored = await AsyncStorage.getItem("offline_results_history_olevel");
        if (stored) setSavedResults(JSON.parse(stored));

        const std = await AsyncStorage.getItem('offline_students_olevel');
        if (std) setlocalStudents(JSON.parse(std));

        const stda = await AsyncStorage.getItem('offline_students_alevel');
        if (stda) setlocalSubjects(JSON.parse(stda));

        const saved = await AsyncStorage.getItem('offline_results_history_alevel');
        if (saved) setal(JSON.parse(saved));

        const storedAlevel = await AsyncStorage.getItem("offline_results_history_premock");
        if (storedAlevel) setol(JSON.parse(storedAlevel));

        const storedOlevel = await AsyncStorage.getItem("offline_results_history_alevel_premock");
        if (storedOlevel) setjk(JSON.parse(storedOlevel));
      } catch (err) {
        console.error("Error loading results:", err);
      }
    };
    loadResults();
  }, []);

  const quickStatsData = [
    { label: 'Olevel Students', value: localStudents?.length ?? 0, color: '#4CAF50' },
    { label: 'Alevel Students', value: localSubjects?.length ?? 0, color: '#03A9F4' },
    { label: 'Alevel Premock', value: jk?.length ?? 0, color: '#FF5722' },
    { label: 'Olevel Premock', value: ol?.length ?? 0, color: '#FFC107' },
    { label: 'Olevel Mock', value: savedResults?.length ?? 0, color: '#806e3bff' },
    { label: 'Alevel Mock', value: al?.length ?? 0, color: '#228a51ff' },
  ];

  useEffect(() => {
    const loadTeacher = async () => {
      const data = await AsyncStorage.getItem('teacher');
      if (data) setTeacher(JSON.parse(data));
      console.log("Loaded teacher:", JSON.parse(data)
      
  )};
    loadTeacher();
  }, []);

  const navItems = [
    { title: 'Dashboard', screen: 'Dashboard' },
    { title: 'Students', screen: 'Students' },
    { title: 'Classes', screen: 'Classes' },
    { title: 'Reports', screen: 'Reports' },
    { title: 'Settings', screen: 'Settings' },
  ];

  const dashboardItems = [
    { title: 'Filled Mock Marks', screen: 'Marks', color: '#4CAF50', animation: 'fadeInLeft', delay: 100, icon: '📝' },
    { title: 'Filled Pre Mock Marks', screen: 'FilledPremock', color: '#256827ff', animation: 'fadeInLeft', delay: 100, icon: '📝' },
    { title: 'View Timetable', screen: 'Timetable', color: '#03A9F4', animation: 'fadeInRight', delay: 200, icon: '🗓️' },
    { title: 'Mock Alevel', screen: 'MockAlevel', color: '#FF5722', animation: 'fadeInLeft', delay: 300, icon: '📚' },
    { title: 'Mock Olevel', screen: 'MockOlevel', color: '#FFC107', animation: 'fadeInRight', delay: 400, icon: '📚' },
    { title: 'Pre Mock Olevel', screen: 'PremockOlevelclass', color: '#2196F3', animation: 'fadeInLeft', delay: 500, icon: '📚' },
    { title: 'Pre Mock Alevel', screen: 'PremockAlevel', color: '#9C27B0', animation: 'fadeInRight', delay: 600, icon: '📚' },
    { title: 'Profile', screen: 'Profile', color: '#FF9800', animation: 'fadeInLeft', delay: 700, icon: '👤' },
    { title: 'Exam Marks', screen: 'First_Cycle', color: '#FF9800', animation: 'fadeInLeft', delay: 700, icon: '📝' },
    { title: 'ALL Exam Marks', screen: 'TerminalExams', color: '#FF9800', animation: 'fadeInLeft', delay: 700, icon: '📝' },
  ];

  const filteredItems = dashboardItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={{ borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
          {navItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.navItem, activeNav === item.title && styles.activeNavItem]}
              onPress={() => {
                setActiveNav(item.title);
                if (item.screen !== 'Dashboard') navigation.navigate(item.screen);
              }}
              activeOpacity={0.7}
            >
              <Animatable.Text animation={activeNav === item.title ? 'pulse' : undefined} duration={600}
                style={[styles.navText, activeNav === item.title && styles.activeNavText]}>
                {item.title}
              </Animatable.Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.header}>
        <Animatable.View animation="fadeInLeft" duration={800} style={styles.logoContainer}>
          <Text style={styles.logoText}>MANFESS </Text>
        </Animatable.View>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => setModalVisible(true)}>
          <Text style={styles.iconText}>🔔</Text>
          {notifications.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{notifications.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Animatable.View animation="fadeIn" duration={1000} style={styles.welcomeSection}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.teacherName}>{teacher ? teacher.Name : 'Esteemed Educator'}</Text>
          <View style={styles.divider} />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={200} style={styles.searchSection}>
          <TextInput style={styles.searchInput} placeholder="Search features..." value={searchQuery} onChangeText={setSearchQuery} />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={400} style={styles.quickStatsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsContainer}>
            {quickStatsData.map((stat, idx) => (
              <Animatable.View key={idx} animation="zoomIn" duration={600} delay={idx * 100} style={[styles.statCard, { backgroundColor: stat.color }]}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={600} style={styles.mainFeaturesSection}>
          <Text style={styles.sectionTitle}>Main Features</Text>
          <View style={styles.itemsContainer}>
            {filteredItems.map((item, idx) => (
              <Animatable.View key={idx} animation={item.animation} duration={800} delay={item.delay} style={styles.itemWrapper}>
                <TouchableOpacity style={[styles.itemTile, { backgroundColor: item.color }]} onPress={() => navigation.navigate(item.screen)} activeOpacity={0.8}>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                    <Text style={styles.itemText}>{item.title}</Text>
                    <Text style={styles.itemSubText}>Tap to access</Text>
                  </View>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={800} style={styles.recentActivitySection}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={loadFromStorage} style={{ marginRight: 12 }}>
                <Text style={{ color: '#1e88e5', fontWeight: '600' }}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.activityList}>
            {loadingActivities ? (
              <ActivityIndicator />
            ) : activities.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#666', paddingVertical: 12 }}>No recent activities found.</Text>
            ) : (
              activities.map((item, idx) => (
                <Animatable.View key={item.id + '_' + idx} animation="fadeInRight" duration={600} delay={idx * 80} style={styles.activityItem}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.activityTitle}>{item.title}</Text>
                      <Text style={{ fontSize: 12, color: '#888' }}>{item.sourceKey}</Text>
                    </View>
                    <View style={{ marginLeft: 12, alignItems: 'flex-end' }}>
                      <Text style={styles.activityTime}>{item.relative}</Text>
                      <Text style={{ fontSize: 10, color: '#aaa' }}>{item.dateFormatted}</Text>
                    </View>
                  </View>
                </Animatable.View>
              ))
            )}
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={1000} style={styles.footerSection}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} MANFESS School System</Text>
          <Text style={styles.footerSubText}>Version 2.0.1 | Designed for Excellence</Text>
          <TouchableOpacity style={styles.footerLink}><Text style={styles.footerLinkText}>Privacy Policy</Text></TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}><Text style={styles.footerLinkText}>Terms of Service</Text></TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>
            {notifications.map((notif, idx) => (
              <Animatable.View key={idx} animation="fadeInDown" duration={600} delay={idx * 100} style={styles.notificationItem}>
                <Text style={styles.notificationText}>{notif.message}</Text>
              </Animatable.View>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}><Text style={styles.closeButtonText}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// keep your styles unchanged (I left them as you provided)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  navItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  activeNavItem: {
    backgroundColor: '#e3f2fd',
  },
  navText: {
    fontSize: 16,
    color: '#555555',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#1e88e5',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  notificationIcon: {
    position: 'relative',
    padding: 10,
  },
  iconText: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  welcomeSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    color: '#555555',
    fontWeight: '500',
  },
  teacherName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222222',
    marginTop: 4,
  },
  divider: {
    width: '80%',
    height: 2,
    backgroundColor: '#dddddd',
    marginTop: 15,
    borderRadius: 1,
  },
  searchSection: {
    marginBottom: 25,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  quickStatsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  mainFeaturesSection: {
    marginBottom: 30,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemWrapper: {
    width: '48%',
    marginBottom: 20,
  },
  itemTile: {
    flex: 1,
    height: 180,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    alignItems: 'center',
    padding: 20,
  },
  itemIcon: {
    fontSize: 40,
    color: '#ffffff',
    marginBottom: 15,
  },
  itemText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  itemSubText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  recentActivitySection: {
    marginBottom: 30,
  },
  activityList: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 15,
  },
  activityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  activityTitle: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  footerSection: {
    marginTop: 40,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#888888',
  },
  footerSubText: {
    fontSize: 12,
    color: '#aaaaaa',
    marginTop: 4,
  },
  footerLink: { marginTop: 10 },
  footerLinkText: { fontSize: 14, color: '#1e88e5', textDecorationLine: 'underline' },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    width: '80%',
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#333333', marginBottom: 15, textAlign: 'center' },
  notificationItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  notificationText: { fontSize: 16, color: '#555555' },
  closeButton: { marginTop: 20, backgroundColor: '#1e88e5', borderRadius: 20, paddingVertical: 10, alignItems: 'center' },
  closeButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },

  // small helper styles:
  statCardSmall: { width: '30%', height: 80, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
});

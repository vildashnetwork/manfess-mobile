




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
import axios from 'axios';

// scan prefixes used for offline storage
const KEY_PREFIXES = [
  "offlineResults",
  "offlineResultsHistory",
  "offline_results_alevel",
  "offline_results_history_olevel",
 "offline_results_history_premock",
"offline_results_history_alevel_premock",
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
  const [notifications, setNotifications] = useState([]);


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

        const storedAlevel = await AsyncStorage.getItem("offline_results_premock");
        if (storedAlevel) setol(JSON.parse(storedAlevel));

        const storedOlevel = await AsyncStorage.getItem("offline_results_alevel_premock");
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


  useEffect(()=>{
    


   const getallnotu = async () => {
    try {
      const res = await axios.get("https://manfess-backend.onrender.com/api/notifications");
      if (res.data.length > 0) {
        setNotifications(res.data);
        setModalVisible(true);
      }
      return;
    } catch (err) {
 return;
    }
  };

    getallnotu()
  },[])

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
    { title: 'Mock Alevel', screen: 'MockAlevel' },
    { title: 'Premock Alevel', screen: 'PremockAlevel' },
    { title: 'Filled Premock', screen: 'FilledPremock' },
    { title: 'Exam Marks', screen: 'First_Cycle' },
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
      
        </Animatable.View>
      </ScrollView>

      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>
            {notifications.map((notif, idx) => (
              <Animatable.View key={idx} animation="fadeInDown" duration={600} delay={idx * 100} style={styles.notificationItem}>
                <Text style={styles.notificationText}>{notif.message} - {new Date(notif.Date).toLocaleString()}</Text>
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

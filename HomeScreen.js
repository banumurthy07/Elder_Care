// screens/HomeScreen.js
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Easing,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";

const SCREEN_W = Dimensions.get("window").width;

export default function HomeScreen({ navigation }) {
  // --- animations ---
  const fade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const cardAnims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current; // for first 4 large cards
  const quickAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
      Animated.timing(quickAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.stagger(
        150,
        cardAnims.map((a) => Animated.timing(a, { toValue: 1, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }))
      ),
    ]).start();
  }, []);

  // Demo data (replace with real later)
  const alerts = [
    { id: "1", text: "Missed medicine at 8:00 AM — remind now", time: "08:12" },
    { id: "2", text: "Low water intake detected", time: "10:30" },
    { id: "3", text: "Mood checked: Slightly low", time: "Yesterday" },
  ];

  const timeline = [
    { label: "Breakfast", time: "7:00", done: true },
    { label: "Walk", time: "7:30", done: true },
    { label: "Medicine", time: "8:00", done: false },
    { label: "Check-in", time: "10:00", done: false },
    { label: "Lunch", time: "12:30", done: false },
  ];

  // Render helpers
  function StatusCard({ anim, icon, title, value, accentColor }) {
    // scale & fade from anim
    const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] });
    const opacity = anim;
    return (
      <Animated.View style={[styles.statusCardWrap, { transform: [{ scale }], opacity }]}>
        <View style={[styles.statusCard, { borderLeftColor: accentColor }]}>
          <Image source={icon} style={styles.statusIcon} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.statusTitle}>{title}</Text>
            <Text style={styles.statusValue}>{value}</Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  function QuickAction({ icon, label, onPress, index }) {
    const translateY = quickAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 0],
    });
    const delay = index * 80;
    return (
      <Animated.View style={{ transform: [{ translateY }], opacity: quickAnim }}>
        <TouchableOpacity style={styles.quickBtn} onPress={onPress}>
          <Image source={icon} style={styles.quickIcon} />
          <Text style={styles.quickText}>{label}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // grid features (2 per row)
  const features = [
    { key: "1", title: "Senior", icon: require("./dashbord.png"), screen: "SeniorDashboard" },
    { key: "2", title: "Caregiver", icon: require("./caregiver.png"), screen: "CaregiverDashboard" },
    { key: "3", title: "Reports", icon: require("./report.png") },
    { key: "4", title: "Notifications", icon: require("./notifications.png") },
    { key: "5", title: "AI Insights", icon: require("./ai.png") },
    { key: "6", title: "Settings", icon: require("./settings.png") },
  ];

  return (
    <Animated.View style={[styles.root, { opacity: fade }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRight}>
            <Text style={styles.greeting}>Hello, John 👋</Text>
          <Animated.Image source={require("./logo.jpg")} style={[styles.logo, { transform: [{ scale: logoScale }] }]} />
            <Text style={styles.small}>Managing: Mrs. Sharma</Text>
            <TouchableOpacity onPress={() => navigation.navigate("UserDashboard")}>
            </TouchableOpacity>
          </View>
              <Image source={require("./avatar.png")} style={styles.avatar} />
        </View>

        {/* Live status strip (4 big cards in two rows) */}
        <View style={styles.statusRow}>
          <StatusCard anim={cardAnims[1]} icon={require("./steps.png")} title="Steps Today" value="3,402" accentColor="#1A7FBA" />
        </View>
          <StatusCard anim={cardAnims[0]} icon={require("./health.png")} title="Health Score" value="82 / 100" accentColor="#4CAF50" />

        <View style={styles.statusRow}>
          <StatusCard anim={cardAnims[2]} icon={require("./meds.png")} title="Medication" value="1 missed" accentColor="#FF7043" />
          <StatusCard anim={cardAnims[3]} icon={require("./routine.png")} title="Next Routine" value="Walk at 5:30 PM" accentColor="#8E44AD" />
        </View>

        {/* Quick actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickRow}>
            <QuickAction index={0} icon={require("./ai.png")} label="AI Insights" onPress={() => alert("AI Insights")}/>
            
            <QuickAction index={2} icon={require("./routine.png")} label="Routines" onPress={() => alert("Open routines")}/>
            <QuickAction index={3} icon={require("./sos.png")} label="SOS" onPress={() => alert("SOS Sent!")}/>
          </View>
        </View>

        {/* Daily timeline horizontal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Timeline</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 8 }}>
            {timeline.map((t, i) => (
              <View key={i} style={[styles.timelineCard, t.done ? styles.timelineDone : styles.timelinePending]}>
                <Text style={styles.timelineLabel}>{t.label}</Text>
                <Text style={styles.timelineTime}>{t.time}</Text>
                <View style={styles.timelineDotWrap}>
                  <View style={[styles.timelineDot, t.done ? styles.dotDone : styles.dotPending]} />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          <View style={styles.alerts}>
            {alerts.map((a) => (
              <TouchableOpacity key={a.id} style={styles.alertItem} onPress={() => alert(a.text)}>
                <Image source={require("./notifications.png")} style={styles.alertIcon} />
                <View style={{flex:1}}>
                  <Text style={styles.alertText} numberOfLines={2}>{a.text}</Text>
                  <Text style={styles.alertTime}>{a.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Feature grid (2 per row) */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <Text style={styles.sectionTitle}>Features</Text>
          <FlatList
            data={features}
            keyExtractor={(i) => i.key}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 14 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => item.screen ? navigation.navigate(item.screen) : alert(`${item.title} coming soon`)}
              >
                <Image source={item.icon} style={styles.featureIcon} />
                <Text style={styles.featureTitle}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </Animated.View>
  );
}

// --- styles ---
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F7FFF9" },
  scroll: { padding: 18, paddingBottom: 40 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  logo: { width: 70, height: 70, borderRadius: 14, borderWidth: 2, borderColor: "#4CAF50" },
  headerRight: { alignItems: "flex-end" },
  greeting: { fontSize: 18, fontWeight: "700", color: "#1A7FBA" },
  small: { fontSize: 12, color: "#6b6b6b" },
  avatar: { width: 46, height: 46, borderRadius: 24, marginTop: 8 },

  // Status cards
  statusRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  statusCardWrap: { width: "48%" },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statusIcon: { width: 42, height: 42, resizeMode: "contain" },
  statusTitle: { fontSize: 13, color: "#666" },
  statusValue: { fontSize: 16, fontWeight: "700", marginTop: 4 },

  // section
  section: { marginTop: 6, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: "#1A7FBA" },

  // quick actions
  quickRow: { flexDirection: "row", justifyContent: "space-between" },
  quickBtn: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: (SCREEN_W - 18 * 2 - 16 * 3) / 4, // evenly space 4 buttons
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  quickIcon: { width: 28, height: 28, marginBottom: 8 },
  quickText: { fontSize: 12, fontWeight: "600", textAlign: "center" },

  // timeline
  timelineCard: {
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  timelineLabel: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  timelineTime: { fontSize: 12, color: "#666" },
  timelineDotWrap: { marginTop: 10 },
  timelineDot: { width: 10, height: 10, borderRadius: 6 },
  dotDone: { backgroundColor: "#4CAF50" },
  dotPending: { backgroundColor: "#FFB74D" },
  timelineDone: { borderWidth: 1, borderColor: "#E8F5E9" },
  timelinePending: { borderWidth: 1, borderColor: "#FFF3E0" },

  // alerts
  alerts: { backgroundColor: "#fff", borderRadius: 12, padding: 8 },
  alertItem: { flexDirection: "row", paddingVertical: 10, alignItems: "center", borderBottomWidth: 1, borderColor: "#f1f1f1" },
  alertIcon: { width: 28, height: 28, marginRight: 10 },
  alertText: { fontSize: 14, color: "#333" },
  alertTime: { fontSize: 12, color: "#999", marginTop: 6 },

  // feature grid
  featureCard: {
    backgroundColor: "#fff",
    width: (SCREEN_W - 18 * 2 - 16) / 2,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  featureIcon: { width: 46, height: 46, marginBottom: 8 },
  featureTitle: { fontSize: 14, fontWeight: "700", color: "#333" },
});

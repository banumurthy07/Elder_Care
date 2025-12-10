import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function UserDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, User!</Text>
      <Text style={styles.subtitle}>Your daily reminders and mood tracker</Text>

      <Image source={require("./dashboard.png")} style={styles.image} />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Camera")}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logout]} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f3f8f6" },
  title: { fontSize: 28, fontWeight: "bold", color: "#4c9f70", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
  image: { width: 220, height: 220, marginBottom: 30 },
  button: { width: "70%", padding: 15, backgroundColor: "#3e73c8", borderRadius: 10, marginBottom: 15 },
  logout: { backgroundColor: "#d9534f" },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "600" },
});

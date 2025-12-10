import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function SeniorDashboard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Senior Dashboard</Text>
      <Text style={styles.subtitle}>Your daily reminders & mood tracker</Text>

      {/* Reminder cards */}
      <View style={styles.card}>
        <Image source={require('./eldercare.jpg')} style={styles.cardImage} />
        <Text style={styles.cardTitle}>Take Medicine</Text>
        <Text style={styles.cardSubtitle}>Today at 8:00 AM</Text>
      </View>

      <View style={styles.card}>
        <Image source={require('./avatar.png')} style={styles.cardImage} />
        <Text style={styles.cardTitle}>Morning Walk</Text>
        <Text style={styles.cardSubtitle}>Today at 7:00 AM</Text>
      </View>

      <View style={styles.card}>
        <Image source={require('./dashboard.png')} style={styles.cardImage} />
        <Text style={styles.cardTitle}>Check Mood</Text>
        <Text style={styles.cardSubtitle}>Log your feelings</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f3f8f6',
    minHeight: '100%',
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4c9f70', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardImage: { width: 60, height: 60, marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 14, color: '#888' },
});

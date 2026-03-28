import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const featuredGamers = [
  {id: '1', name: 'xShadow', game: 'Valorant', rank: 'Diamond 2', emoji: '🎯'},
  {id: '2', name: 'LunaFPS', game: 'Apex Legends', rank: 'Master', emoji: '🔥'},
  {id: '3', name: 'CloudNine', game: 'League of Legends', rank: 'Plat 1', emoji: '⚡'},
];

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hey, Player 👋</Text>
        <Text style={styles.subGreeting}>Ready to find your duo?</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Online Now</Text>
        <View style={styles.cardRow}>
          {featuredGamers.map(gamer => (
            <View key={gamer.id} style={styles.card}>
              <Text style={styles.cardEmoji}>{gamer.emoji}</Text>
              <Text style={styles.cardName}>{gamer.name}</Text>
              <Text style={styles.cardGame}>{gamer.game}</Text>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{gamer.rank}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Duos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Games</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subGreeting: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 14,
  },
  cardRow: {
    gap: 12,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  cardEmoji: {
    fontSize: 32,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  cardGame: {
    fontSize: 13,
    color: '#888',
  },
  rankBadge: {
    backgroundColor: '#7c3aed22',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rankText: {
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default HomeScreen;

import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const profiles = [
  {
    id: '1',
    name: 'NightOwl',
    age: 22,
    games: ['Valorant', 'CS2'],
    rank: 'Immortal',
    bio: 'Looking for a chill duo to grind ranked. I main Jett and Chamber.',
    emoji: '🦉',
  },
  {
    id: '2',
    name: 'PixelQueen',
    age: 24,
    games: ['League of Legends', 'TFT'],
    rank: 'Diamond 3',
    bio: 'Support main looking for an ADC duo. Let\'s climb together!',
    emoji: '👑',
  },
  {
    id: '3',
    name: 'FragMaster',
    age: 20,
    games: ['Apex Legends', 'Fortnite'],
    rank: 'Predator',
    bio: 'Competitive grinder. Need teammates who take ranked seriously.',
    emoji: '💥',
  },
  {
    id: '4',
    name: 'CozyGamer',
    age: 26,
    games: ['Overwatch 2', 'Valorant'],
    rank: 'Platinum',
    bio: 'Vibes over wins. I just want to have fun and meet cool people.',
    emoji: '☕',
  },
];

const MatchScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentProfile = profiles[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.profileEmoji}>{currentProfile.emoji}</Text>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {currentProfile.name}, {currentProfile.age}
          </Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>{currentProfile.rank}</Text>
          </View>
        </View>
        <View style={styles.gamesRow}>
          {currentProfile.games.map(game => (
            <View key={game} style={styles.gameTag}>
              <Text style={styles.gameTagText}>{game}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.bio}>{currentProfile.bio}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleSwipe('left')}>
          <Text style={styles.actionEmoji}>✕</Text>
          <Text style={styles.passText}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.matchButton]}
          onPress={() => handleSwipe('right')}>
          <Text style={styles.actionEmoji}>🎮</Text>
          <Text style={styles.matchText}>Duo Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  profileEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  rankBadge: {
    backgroundColor: '#7c3aed22',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rankText: {
    color: '#7c3aed',
    fontSize: 13,
    fontWeight: '600',
  },
  gamesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  gameTag: {
    backgroundColor: '#0f0f1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  gameTagText: {
    color: '#aaa',
    fontSize: 13,
  },
  bio: {
    color: '#999',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 28,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  passButton: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  matchButton: {
    backgroundColor: '#7c3aed',
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  passText: {
    color: '#888',
    fontWeight: '600',
    fontSize: 15,
  },
  matchText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default MatchScreen;

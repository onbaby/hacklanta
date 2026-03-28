import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {TopGame} from '../types/profile';

interface TopGameEntryProps {
  game: TopGame;
}

const TopGameEntry: React.FC<TopGameEntryProps> = ({game}) => (
  <View style={styles.container}>
    <Image
      source={typeof game.icon === 'number' ? game.icon : {uri: game.icon}}
      style={styles.icon}
      resizeMode="contain"
    />
    <Text style={styles.gameName}>{game.name}</Text>
    {game.rank && <Text style={styles.rank}>{game.rank}</Text>}
    {game.hours && (
      <Text style={styles.hours}>
        <Text style={styles.hoursNumber}>{game.hours}</Text>
        {' Hours'}
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginBottom: 6,
  },
  gameName: {
    fontSize: 15,
    fontFamily: 'ModernEra-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 2,
  },
  rank: {
    fontSize: 13,
    color: '#fff',
    fontFamily: 'ModernEra-Medium',
    textAlign: 'center',
    lineHeight: 15,
  },
  hours: {
    fontSize: 13,
    color: '#fff',
    fontFamily: 'ModernEra-Medium',
    textAlign: 'center',
    lineHeight: 15,
  },
  hoursNumber: {
    color: '#eed094',
  },
});

export default TopGameEntry;

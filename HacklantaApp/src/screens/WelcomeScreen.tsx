import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ViewToken,
} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/AppNavigator';

const {width} = Dimensions.get('window');

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

type Slide = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: any;
};

const slides: Slide[] = [
  {
    id: '1',
    image: require('../assets/onboarding_find_duo.png'),
    title: 'Find Your Duo',
    description:
      'Connect with gamers who match your play style, rank, and vibe. No more solo queue.',
  },
  {
    id: '2',
    title: 'Swipe & Match',
    description:
      'See profiles of nearby gamers. Swipe right if you want to squad up. It\'s that easy.',
  },
  {
    id: '3',
    title: 'Level Up Together',
    description:
      'Chat, party up, and climb the ranks with your new duo. GG go next.',
  },
];

const WelcomeScreen = ({navigation}: WelcomeScreenProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({index: activeIndex + 1});
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.slide}>
            <View style={styles.slideImageArea}>
              {item.image ? (
                <Image source={item.image} style={styles.slideImage} resizeMode="contain" />
              ) : (
                <Text style={styles.icon}>{item.icon}</Text>
              )}
            </View>
            <View style={styles.slideTextArea}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {activeIndex === slides.length - 1 ? "Let's Go" : 'Next'}
          </Text>
        </TouchableOpacity>

        {activeIndex < slides.length - 1 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.replace('Login')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  slide: {
    width,
    flex: 1,
    paddingHorizontal: 40,
  },
  slideImageArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: width * 0.75,
    height: width * 0.75,
  },
  icon: {
    fontSize: 80,
  },
  slideTextArea: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#aaa',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 60,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#7c3aed',
    width: 24,
  },
  button: {
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    marginTop: 16,
  },
  skipText: {
    color: '#666',
    fontSize: 14,
  },
});

export default WelcomeScreen;

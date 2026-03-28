import React, {useState, useRef, useMemo, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  StatusBar,
} from 'react-native';
import ProfileCard from '../components/ProfileCard';
import {mockProfiles} from '../constants/mockProfiles';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;

const HomeScreen = () => {
  const [profileA, setProfileA] = useState(mockProfiles[0]);
  const [profileB, setProfileB] = useState(mockProfiles[1]);
  const [frontIsA, setFrontIsA] = useState(true);
  const frontIsARef = useRef(true);
  const dataIndexRef = useRef(1);

  // Each card has its own position — never shared, never swapped
  const posA = useRef(new Animated.ValueXY()).current;
  const posB = useRef(new Animated.ValueXY()).current;

  // Ref so PanResponder always knows which position to control
  const activePosRef = useRef(posA);

  // Track which card needs position reset (done during render when zIndex has already changed)
  const needsReset = useRef<'a' | 'b' | null>(null);

  // Interpolations for Card A
  const rotateA = posA.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });

  // Interpolations for Card B
  const rotateB = posB.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });

  const rightOverlayOpacity = (pos: Animated.ValueXY) =>
    pos.x.interpolate({
      inputRange: [0, SCREEN_WIDTH * 0.25],
      outputRange: [0, 0.25],
      extrapolate: 'clamp',
    });

  const leftOverlayOpacity = (pos: Animated.ValueXY) =>
    pos.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 0.25, 0],
      outputRange: [0.25, 0],
      extrapolate: 'clamp',
    });

  const animateSwipe = (direction: 'left' | 'right') => {
    const activePos = activePosRef.current;
    const x =
      direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(activePos, {
      toValue: {x, y: 0},
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      // Mark which card needs position reset
      needsReset.current = frontIsARef.current ? 'a' : 'b';

      // Advance data index
      const nextDataIndex =
        (dataIndexRef.current + 1) % mockProfiles.length;
      dataIndexRef.current = nextDataIndex;

      // Update the swiped card's profile (it's going to the back)
      if (frontIsARef.current) {
        setProfileA(mockProfiles[nextDataIndex]);
        activePosRef.current = posB;
      } else {
        setProfileB(mockProfiles[nextDataIndex]);
        activePosRef.current = posA;
      }
      frontIsARef.current = !frontIsARef.current;
      setFrontIsA(frontIsARef.current);
    });
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > Math.abs(gesture.dy) * 2 &&
          Math.abs(gesture.dx) > 15,
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          Math.abs(gesture.dx) > Math.abs(gesture.dy) * 2 &&
          Math.abs(gesture.dx) > 15,
        onPanResponderMove: (_, gesture) => {
          activePosRef.current.setValue({
            x: gesture.dx,
            y: gesture.dy * 0.15,
          });
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx > SWIPE_THRESHOLD) {
            animateSwipe('right');
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            animateSwipe('left');
          } else {
            Animated.spring(activePosRef.current, {
              toValue: {x: 0, y: 0},
              useNativeDriver: false,
              friction: 6,
            }).start();
          }
        },
      }),
    [],
  );

  // Reset position after React has committed zIndex changes to native.
  // Running setValue in the render body caused a one-frame flash because the
  // native animated value updated before the zIndex commit.
  useLayoutEffect(() => {
    if (needsReset.current === 'a' && !frontIsA) {
      posA.setValue({x: 0, y: 0});
      needsReset.current = null;
    } else if (needsReset.current === 'b' && frontIsA) {
      posB.setValue({x: 0, y: 0});
      needsReset.current = null;
    }
  }, [frontIsA]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Card A — always mounted, zIndex controls stacking */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            zIndex: frontIsA ? 2 : 1,
            transform: [
              {translateX: posA.x},
              {translateY: posA.y},
              {rotate: rotateA},
            ],
          },
        ]}
        {...(frontIsA ? panResponder.panHandlers : {})}>
        <ProfileCard profile={profileA} />
        {frontIsA && (
          <>
            <Animated.View
              style={[
                styles.swipeOverlay,
                {
                  backgroundColor: 'rgba(0, 255, 100, 0.2)',
                  opacity: rightOverlayOpacity(posA),
                },
              ]}
              pointerEvents="none"
            />
            <Animated.View
              style={[
                styles.swipeOverlay,
                {
                  backgroundColor: 'rgba(255, 50, 50, 0.2)',
                  opacity: leftOverlayOpacity(posA),
                },
              ]}
              pointerEvents="none"
            />
          </>
        )}
      </Animated.View>

      {/* Card B — always mounted, zIndex controls stacking */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            zIndex: frontIsA ? 1 : 2,
            transform: [
              {translateX: posB.x},
              {translateY: posB.y},
              {rotate: rotateB},
            ],
          },
        ]}
        {...(!frontIsA ? panResponder.panHandlers : {})}>
        <ProfileCard profile={profileB} />
        {!frontIsA && (
          <>
            <Animated.View
              style={[
                styles.swipeOverlay,
                {
                  backgroundColor: 'rgba(0, 255, 100, 0.2)',
                  opacity: rightOverlayOpacity(posB),
                },
              ]}
              pointerEvents="none"
            />
            <Animated.View
              style={[
                styles.swipeOverlay,
                {
                  backgroundColor: 'rgba(255, 50, 50, 0.2)',
                  opacity: leftOverlayOpacity(posB),
                },
              ]}
              pointerEvents="none"
            />
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  swipeOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 0,
  },
});

export default HomeScreen;

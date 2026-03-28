import React, {useRef, useState, useEffect, useCallback} from 'react';
import {View, Text, Image, StyleSheet, Animated, Dimensions, Pressable, LayoutChangeEvent} from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Rect,
  Path,
  Circle,
  G,
} from 'react-native-svg';
import {BlurView} from '@react-native-community/blur';
import Video from 'react-native-video';
import {Profile} from '../types/profile';
import PlayStyleBadge from './PlayStyleBadge';
import TopGameEntry from './TopGameEntry';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const SPACER_HEIGHT = SCREEN_HEIGHT * 0.55;

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const GameIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M12 4L20 12L12 20L4 12L12 4Z" stroke="#A78BFA" strokeWidth={1.5} strokeLinejoin="round" />
    <Path d="M12 8L16 12L12 16L8 12L12 8Z" stroke="#A78BFA" strokeWidth={1.5} strokeLinejoin="round" />
  </Svg>
);

const VoiceIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="3.5" stroke="#666" strokeWidth={1.5} />
    <Path d="M5 20C5 16.134 8.134 13 12 13C15.866 13 19 16.134 19 20" stroke="#666" strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const MeetupIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M4 12C4 12 7 8 12 8C17 8 20 12 20 12" stroke="#666" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M4 12C4 12 7 16 12 16C17 16 20 12 20 12" stroke="#666" strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const DATE_STYLE_ICONS: Record<string, React.FC> = {
  game: GameIcon,
  voice: VoiceIcon,
  meetup: MeetupIcon,
};

const SectionHeader: React.FC<{title: string}> = ({title}) => (
  <View style={sectionStyles.header}>
    <View style={sectionStyles.headerLine} />
    <Text style={sectionStyles.headerLabel}>{title}</Text>
    <View style={sectionStyles.headerLine} />
  </View>
);

interface ProfileCardProps {
  profile: Profile;
}

const PcIcon = () => (
  <Svg width={15} height={15} viewBox="0 0 15 15" fill="none">
    <Path
      d="M1.25 13.125H10.625"
      stroke="#E5E5E5"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.125 13.125H13.75"
      stroke="#E5E5E5"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M1.25 10.25V2.25C1.25 2.04289 1.41789 1.875 1.625 1.875H13.375C13.5821 1.875 13.75 2.04289 13.75 2.25V10.25C13.75 10.4571 13.5821 10.625 13.375 10.625H1.625C1.41789 10.625 1.25 10.4571 1.25 10.25Z"
      stroke="#E5E5E5"
      strokeWidth={1.5}
    />
  </Svg>
);

function getPlatformIcon(platform: string): string | null {
  switch (platform) {
    case 'pc':
      return null; // uses PcIcon SVG component
    case 'playstation':
      return '\uD83C\uDFAE';
    case 'xbox':
      return '\uD83C\uDFAE';
    case 'switch':
      return '\uD83D\uDD79\uFE0F';
    case 'mobile':
      return '\uD83D\uDCF1';
    default:
      return '\uD83C\uDFAE';
  }
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ProfileCard: React.FC<ProfileCardProps> = ({profile}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photoScale = useRef(new Animated.Value(1)).current;
  const fadeOverlay = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<any>(null);

  // Reset all internal state when profile changes (no key remount)
  useEffect(() => {
    setCurrentPhotoIndex(0);
    scrollY.setValue(0);
    photoScale.setValue(1);
    fadeOverlay.setValue(0);
    setVibeReady(false);
    scrollViewRef.current?.scrollTo?.({y: 0, animated: false});
  }, [profile.id]);

  const photoCount = profile.photos.length;
  const currentPhoto = profile.photos[currentPhotoIndex];

  // Bars fade out as user scrolls
  const barsOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Parallax zoom — photo scales up subtly as user scrolls
  const photoParallaxScale = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 1.15],
    extrapolate: 'clamp',
  });

  // Photo shifts up slightly for depth
  const photoTranslateY = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  const handlePhotoTap = (locationX: number) => {
    if (photoCount <= 1) return;
    // Flash black overlay
    Animated.sequence([
      Animated.timing(fadeOverlay, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(fadeOverlay, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    // Bounce
    Animated.sequence([
      Animated.timing(photoScale, {
        toValue: 0.97,
        duration: 80,
        useNativeDriver: false,
      }),
      Animated.spring(photoScale, {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: false,
      }),
    ]).start();
    // Switch photo after brief delay
    setTimeout(() => {
      if (locationX > SCREEN_WIDTH / 2) {
        setCurrentPhotoIndex(prev => (prev + 1) % photoCount);
      } else {
        setCurrentPhotoIndex(prev => (prev - 1 + photoCount) % photoCount);
      }
    }, 80);
  };

  // Vibe section scroll-driven entrance
  const vibeOffsetY = useRef(0);
  const [vibeReady, setVibeReady] = useState(false);
  const vibeEntrance = useRef({opacity: scrollY.interpolate({inputRange: [0, 1], outputRange: [0, 0]}), translateY: scrollY.interpolate({inputRange: [0, 1], outputRange: [30, 30]})}).current;

  const onVibeLayout = useCallback((e: LayoutChangeEvent) => {
    const y = e.nativeEvent.layout.y;
    vibeOffsetY.current = y;
    // The section enters the viewport when scrollY brings it on screen.
    // Viewport bottom ≈ SCREEN_HEIGHT, section top in scroll = y.
    // Section becomes visible when scrollY > y - SCREEN_HEIGHT.
    const enterStart = y - SCREEN_HEIGHT;
    const enterEnd = enterStart + 150;
    vibeEntrance.opacity = scrollY.interpolate({
      inputRange: [enterStart, enterEnd],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    vibeEntrance.translateY = scrollY.interpolate({
      inputRange: [enterStart, enterEnd],
      outputRange: [30, 0],
      extrapolate: 'clamp',
    });
    if (!vibeReady) setVibeReady(true);
  }, [scrollY, vibeReady]);

  // Photo blur increases as user scrolls down
  const blurOpacity = scrollY.interpolate({
    inputRange: [0, 250],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.card}>
      {/* Fixed background photo — stays in place while content scrolls over it */}
      <Animated.View style={[styles.photoContainer, {transform: [{scale: Animated.multiply(photoScale, photoParallaxScale)}, {translateY: photoTranslateY}]}]}>
        <Image
          source={typeof currentPhoto === 'number' ? currentPhoto : {uri: currentPhoto}}
          style={styles.photo}
        />
      </Animated.View>

      {/* Black fade overlay for photo transitions */}
      <Animated.View
        style={[styles.photoFade, {opacity: fadeOverlay}]}
        pointerEvents="none"
      />

      {/* Dynamic blur overlay — fades in as user scrolls */}
      <Animated.View
        style={[styles.dynamicBlur, {opacity: blurOpacity}]}
        pointerEvents="none">
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={30}
          reducedTransparencyFallbackColor="#000"
        />
      </Animated.View>

      {/* Fixed bottom gradient */}
      <View style={styles.bottomGradient} pointerEvents="none">
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgGradient id="bottomGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#000" stopOpacity="0" />
              <Stop offset="0.2" stopColor="#000" stopOpacity="0.15" />
              <Stop offset="0.4" stopColor="#000" stopOpacity="0.4" />
              <Stop offset="0.6" stopColor="#000" stopOpacity="0.7" />
              <Stop offset="0.8" stopColor="#000" stopOpacity="0.9" />
              <Stop offset="1" stopColor="#000" stopOpacity="1" />
            </SvgGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#bottomGrad)" />
        </Svg>
      </View>

      {/* Scrollable profile content */}
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled>
        {/* Tappable spacer — tap left/right to cycle photos */}
        <Pressable
          style={{height: SPACER_HEIGHT}}
          onPress={e => handlePhotoTap(e.nativeEvent.locationX)}
        />

        {/* Name + Handle + Game Icons */}
        <View style={styles.nameArea}>
            <View style={styles.nameRow}>
              <View style={styles.nameSection}>
                <Text style={styles.name}>{profile.name}</Text>
                <View style={styles.handleRow}>
                  <Text style={styles.handle}>{profile.handle}</Text>
                  {profile.platform === 'pc' ? (
                    <PcIcon />
                  ) : (
                    <Text style={styles.platformIcon}>
                      {getPlatformIcon(profile.platform)}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.gameIconsRow}>
                {profile.gameIcons.slice(0, 3).map((icon, i) => (
                  <View key={i} style={styles.gameIconWrapper}>
                    <Image
                      source={typeof icon === 'number' ? icon : {uri: icon}}
                      style={styles.gameIcon}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>

        {/* Solid dark info section */}
        <View style={styles.darkSection}>
          {/* Divider */}
          <View style={styles.divider} />

          {/* Play Style Badges */}
          <View style={styles.badgeRow}>
            {profile.playStyles.map((style, i) => (
              <PlayStyleBadge key={i} label={style} />
            ))}
          </View>

          {/* Bio */}
          <Text style={styles.bio}>{profile.bio}</Text>

          {/* Top Games Section */}
          <View style={styles.topGamesSection}>
            <View style={styles.topGamesHeader}>
              <View style={styles.headerLine} />
              <Text style={styles.topGamesLabel}>TOP GAMES</Text>
              <View style={styles.headerLine} />
            </View>
            <View style={styles.topGamesRow}>
              {profile.topGames.slice(0, 3).map((game, i) => (
                <TopGameEntry key={i} game={game} />
              ))}
            </View>
          </View>

          {/* Play Schedule */}
          {profile.playSchedule && (
            <View style={sectionStyles.section}>
              <SectionHeader title="WHEN IM ON" />
              <View style={sectionStyles.dayRow}>
                {profile.playSchedule.activeDays.map((active, i) =>
                  active ? (
                    <View key={i} style={sectionStyles.dayBoxGlass}>
                      {/* Glass blur layer */}
                      <BlurView
                        style={StyleSheet.absoluteFill}
                        blurType="dark"
                        blurAmount={20}
                        reducedTransparencyFallbackColor="rgba(120,80,200,0.5)"
                      />
                      {/* Green tint overlay */}
                      <View style={sectionStyles.glassTint} />
                      {/* Top specular highlight */}
                      <Svg style={sectionStyles.glassHighlight} viewBox="0 0 40 40">
                        <Defs>
                          <SvgGradient id={`glassHL${i}`} x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#fff" stopOpacity="0.08" />
                            <Stop offset="0.45" stopColor="#fff" stopOpacity="0.02" />
                            <Stop offset="1" stopColor="#fff" stopOpacity="0" />
                          </SvgGradient>
                        </Defs>
                        <Rect x="0" y="0" width="40" height="20" rx="10" fill={`url(#glassHL${i})`} />
                      </Svg>
                      {/* Day letter */}
                      <Text style={[sectionStyles.dayLabel, sectionStyles.dayLabelActive]}>
                        {DAY_LABELS[i]}
                      </Text>
                    </View>
                  ) : (
                    <View key={i} style={[sectionStyles.dayBox, sectionStyles.dayBoxInactive]}>
                      <Text style={[sectionStyles.dayLabel, sectionStyles.dayLabelInactive]}>
                        {DAY_LABELS[i]}
                      </Text>
                    </View>
                  ),
                )}
              </View>
            </View>
          )}

          {/* Hinge-style prompt */}
          {profile.hingePrompt && (
            <View style={styles.hingeSection}>
              <Text style={styles.hingePrompt}>{profile.hingePrompt.question}</Text>
              <Text style={styles.hingeAnswer}>{profile.hingePrompt.answer}</Text>
              {profile.id === '1' && (
                <View style={styles.gameplayContainer}>
                  <Video
                    source={require('../assets/gameplay.mp4')}
                    style={styles.gameplayVideo}
                    resizeMode="cover"
                    repeat
                    muted
                    paused={false}
                    hideShutterView
                    playInBackground={false}
                    playWhenInactive={false}
                    onError={(e: any) => console.warn('Video error:', e)}
                  />
                </View>
              )}
              {profile.hingePrompt.image && (
                <Image
                  source={
                    typeof profile.hingePrompt.image === 'number'
                      ? profile.hingePrompt.image
                      : {uri: profile.hingePrompt.image}
                  }
                  style={styles.hingeImage}
                  resizeMode="cover"
                />
              )}
            </View>
          )}

          {/* Vibe prompt */}
          {profile.vibeStatus && (
            <View style={styles.hingeSection}>
              <Text style={styles.hingePrompt}>{profile.vibePrompt || "I'll fall for you if"}</Text>
              <Text style={styles.hingeAnswer}>{profile.vibeStatus}</Text>
              {profile.vibeMedia && profile.vibeMedia.length > 0 && (
                <View style={styles.vibeImagesRow}>
                  {profile.vibeMedia.map((item, i) => (
                    <View key={i} style={styles.vibeImageWrapper}>
                      {item.type === 'video' ? (
                        <Video
                          source={typeof item.source === 'number' ? {uri: item.source as unknown as string} : {uri: item.source}}
                          style={styles.vibeImage}
                          resizeMode="cover"
                          repeat
                          muted
                          paused={false}
                          hideShutterView
                          playInBackground={false}
                          playWhenInactive={false}
                        />
                      ) : (
                        <Image
                          source={typeof item.source === 'number' ? item.source : {uri: item.source}}
                          style={styles.vibeImage}
                          resizeMode="cover"
                        />
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* My Anthem */}
          {profile.anthem && (
            <View style={[styles.hingeSection, {paddingTop: 2}]}>
              <Text style={styles.hingePrompt}>My anthem</Text>
              <View style={sectionStyles.musicCard}>
                <View style={sectionStyles.albumArtContainer}>
                  <Image
                    source={
                      typeof profile.anthem.albumArt === 'number'
                        ? profile.anthem.albumArt
                        : {uri: profile.anthem.albumArt}
                    }
                    style={sectionStyles.albumArt}
                  />
                  <View style={sectionStyles.playIconOverlay}>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="#fff">
                      <Path
                        d="M6.90588 4.53682C6.50592 4.2998 6 4.58808 6 5.05299V18.947C6 19.4119 6.50592 19.7002 6.90588 19.4632L18.629 12.5162C19.0211 12.2838 19.0211 11.7162 18.629 11.4838L6.90588 4.53682Z"
                        fill="#fff"
                      />
                    </Svg>
                  </View>
                </View>
                <View style={sectionStyles.musicInfo}>
                  <Text style={sectionStyles.songName}>{profile.anthem.songName}</Text>
                  <Text style={sectionStyles.artistName}>{profile.anthem.artistName}</Text>
                  <View style={sectionStyles.spotifyRow}>
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="#1DB954">
                      <Path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </Svg>
                    <Text style={sectionStyles.playOnSpotify}>Play on Spotify</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Fixed: top gradient */}
      <View style={styles.topGradient} pointerEvents="none">
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#000" stopOpacity="0.4" />
              <Stop offset="0.5" stopColor="#000" stopOpacity="0.15" />
              <Stop offset="1" stopColor="#000" stopOpacity="0" />
            </SvgGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#topGrad)" />
        </Svg>
      </View>

      {/* Photo indicator bars — fade on scroll */}
      <Animated.View
        style={[styles.photoBarsContainer, {opacity: barsOpacity}]}
        pointerEvents="none">
        {profile.photos.map((_, i) => (
          <View
            key={i}
            style={[
              styles.photoBar,
              i === currentPhotoIndex
                ? styles.photoBarActive
                : styles.photoBarInactive,
            ]}
          />
        ))}
        <Text style={styles.photoCount}>x{photoCount}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#000',
  },
  photoContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dynamicBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  photoFade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  topGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 130,
  },
  photoBarsContainer: {
    position: 'absolute',
    top: 58,
    left: 60,
    right: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photoBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  photoBarActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  photoBarInactive: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  photoCount: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontFamily: 'ModernEra-Bold',
    marginLeft: 4,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
  },
  nameArea: {
    paddingHorizontal: 25,
    paddingBottom: 12,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  nameSection: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 33,
    fontFamily: 'ModernEra-Bold',
    fontWeight: '600',
    color: '#fff',
    lineHeight: 38,
  },
  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  handle: {
    fontSize: 22,
    color: '#e5e5e5',
    fontFamily: 'ModernEra-Medium',
  },
  platformIcon: {
    fontSize: 15,
  },
  gameIconsRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  gameIconWrapper: {
    width: 29,
    height: 28,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gameIcon: {
    width: '100%',
    height: '100%',
  },
  darkSection: {},
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 25,
    marginVertical: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 25,
    marginBottom: 12,
  },
  bio: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 19,
    paddingHorizontal: 25,
    fontFamily: 'ModernEra-Medium',
    marginBottom: 16,
  },
  topGamesSection: {
    paddingTop: 4,
  },
  topGamesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginBottom: 14,
  },
  headerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  topGamesLabel: {
    fontSize: 10,
    color: '#c9c9c97d',
    fontFamily: 'ModernEra-Bold',
    letterSpacing: 1.5,
    marginHorizontal: 12,
  },
  topGamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  hingeSection: {
    paddingHorizontal: 25,
    paddingTop: 32,
    paddingBottom: 28,
  },
  hingePrompt: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'ModernEra-Regular',
    marginBottom: 6,
  },
  gameplayContainer: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 16,
  },
  hingeImage: {
    width: '100%',
    height: 350,
    borderRadius: 20,
    marginTop: 16,
  },
  gameplayVideo: {
    width: '100%',
    height: '100%',
  },
  hingeAnswer: {
    fontSize: 26,
    color: '#fff',
    fontFamily: 'ModernEra-Bold',
    lineHeight: 34,
  },
  vibeImagesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  vibeImageWrapper: {
    flex: 1,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  vibeImage: {
    width: '100%',
    height: '100%',
  },
});

const sectionStyles = StyleSheet.create({
  section: {
    paddingTop: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginBottom: 14,
  },
  headerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  headerLabel: {
    fontSize: 10,
    color: '#c9c9c97d',
    fontFamily: 'ModernEra-Bold',
    letterSpacing: 1.5,
    marginHorizontal: 12,
  },
  // Play Schedule
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 25,
  },
  dayBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBoxGlass: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#A78BFA',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(120, 80, 200, 0.18)',
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
  },
  dayBoxInactive: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  dayLabel: {
    fontSize: 14,
    fontFamily: 'ModernEra-Bold',
  },
  dayLabelActive: {
    color: '#A78BFA',
  },
  dayLabelInactive: {
    color: 'rgba(255,255,255,0.3)',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginTop: 10,
  },
  timeText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'ModernEra-Medium',
  },
  // Vibe Right Now
  vibePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(120, 80, 200, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 25,
    gap: 10,
  },
  vibeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#A78BFA',
  },
  vibeText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'ModernEra-Medium',
  },
  // My Anthem
  musicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    marginTop: 6,
  },
  albumArtContainer: {
    width: 56,
    height: 56,
    position: 'relative',
  },
  albumArt: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  playIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
  },
  musicInfo: {
    flex: 1,
    gap: 2,
  },
  songName: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'ModernEra-Bold',
  },
  artistName: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'ModernEra-Medium',
  },
  spotifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  playOnSpotify: {
    fontSize: 12,
    color: '#1DB954',
    fontFamily: 'ModernEra-Medium',
  },
});

export default ProfileCard;

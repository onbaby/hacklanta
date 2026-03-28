import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import Svg, {Path, Circle} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {mockProfiles} from '../constants/mockProfiles';
import {Profile} from '../types/profile';
import ProfileCard from '../components/ProfileCard';
import PlayStyleBadge from '../components/PlayStyleBadge';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const PHOTO_GAP = 4;
const PHOTO_COLS = 3;
const PHOTO_SIZE = (SCREEN_WIDTH - 40 - PHOTO_GAP * (PHOTO_COLS - 1)) / PHOTO_COLS;

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Use first mock profile as "current user"
const currentUser: Profile = mockProfiles[0];

// --- Icons ---

const StarIcon = ({filled}: {filled: boolean}) => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill={filled ? '#eed094' : 'none'}>
    <Path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      stroke={filled ? '#eed094' : '#555'}
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  </Svg>
);

const MicIcon = ({on}: {on: boolean}) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z"
      stroke={on ? '#A78BFA' : '#555'}
      strokeWidth={1.5}
    />
    <Path
      d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10"
      stroke={on ? '#A78BFA' : '#555'}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path d="M12 19V23M8 23H16" stroke={on ? '#A78BFA' : '#555'} strokeWidth={1.5} strokeLinecap="round" />
    {!on && (
      <Path d="M3 3L21 21" stroke="#ff4444" strokeWidth={1.8} strokeLinecap="round" />
    )}
  </Svg>
);

const PencilIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 21L12 21H21"
      stroke="#A78BFA"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.2218 5.82839L15.0503 2.99996L20 7.94971L17.1716 10.7781M12.2218 5.82839L6.61522 11.435C6.42769 11.6225 6.32233 11.8769 6.32233 12.1421L6.32233 16.6776L10.8579 16.6776C11.1231 16.6776 11.3774 16.5723 11.565 16.3847L17.1716 10.7781M12.2218 5.82839L17.1716 10.7781"
      stroke="#A78BFA"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ChevronRight = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M9 6L15 12L9 18" stroke="#555" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const VerifiedIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 12L11 14L15 10M12 3L14.39 4.42L17.19 4.17L17.82 6.9L20.27 8.27L19.39 10.97L20.73 13.42L18.54 15.19L18.26 18.01L15.47 18.46L13.58 20.73L11.05 19.47L8.42 20.53L6.73 18.11L3.97 17.37L4.07 14.53L2.27 12.27L3.74 9.97L3.27 7.19L5.97 6.42L7.42 4.03L9.97 4.97L12 3Z"
      fill="#3B82F6"
      stroke="#3B82F6"
      strokeWidth={1}
      strokeLinejoin="round"
    />
    <Path
      d="M9 12L11 14L15 10"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CameraIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
      stroke="#A78BFA"
      strokeWidth={1.5}
    />
    <Circle cx="12" cy="13" r="4" stroke="#A78BFA" strokeWidth={1.5} />
  </Svg>
);

// --- Section Header ---
const SectionHeader = ({title, onEdit}: {title: string; onEdit?: () => void}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onEdit && (
      <TouchableOpacity onPress={onEdit} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
        <PencilIcon />
      </TouchableOpacity>
    )}
  </View>
);

// --- Info Row ---
const InfoRow = ({label, value, last}: {label: string; value: string; last?: boolean}) => (
  <>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
    {!last && <View style={styles.rowDivider} />}
  </>
);

// --- Chip ---
const Chip = ({label, active, onPress}: {label: string; active?: boolean; onPress?: () => void}) => (
  <TouchableOpacity
    style={[styles.chip, active && styles.chipActive]}
    onPress={onPress}
    activeOpacity={0.7}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

// --- Main Component ---
const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<'edit' | 'view'>('edit');
  const profile = currentUser;

  const headerAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  const editOpacity = useRef(new Animated.Value(1)).current;
  const viewOpacity = useRef(new Animated.Value(0)).current;
  const editTranslateX = useRef(new Animated.Value(0)).current;
  const viewTranslateX = useRef(new Animated.Value(40)).current;

  const switchTab = (tab: 'edit' | 'view') => {
    if (tab === activeTab) return;
    setActiveTab(tab);

    if (tab === 'view') {
      Animated.parallel([
        Animated.timing(editOpacity, {toValue: 0, duration: 250, useNativeDriver: true}),
        Animated.timing(editTranslateX, {toValue: -40, duration: 250, useNativeDriver: true}),
        Animated.timing(viewOpacity, {toValue: 1, duration: 250, useNativeDriver: true}),
        Animated.timing(viewTranslateX, {toValue: 0, duration: 250, useNativeDriver: true}),
        Animated.timing(headerAnim, {toValue: 0, duration: 250, useNativeDriver: false}),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(viewOpacity, {toValue: 0, duration: 250, useNativeDriver: true}),
        Animated.timing(viewTranslateX, {toValue: 40, duration: 250, useNativeDriver: true}),
        Animated.timing(editOpacity, {toValue: 1, duration: 250, useNativeDriver: true}),
        Animated.timing(editTranslateX, {toValue: 0, duration: 250, useNativeDriver: true}),
        Animated.timing(headerAnim, {toValue: 1, duration: 250, useNativeDriver: false}),
      ]).start();
    }
  };

  return (
    <View style={styles.container}>
      {/* Safe area + Header */}
      <Animated.View style={{
        paddingTop: insets.top,
        backgroundColor: headerAnim.interpolate({inputRange: [0, 1], outputRange: ['rgba(15,15,26,0)', 'rgba(15,15,26,1)']}),
        zIndex: 1,
      }}>
        <Animated.View style={{
          height: headerAnim.interpolate({inputRange: [0, 1], outputRange: [0, 44]}),
          opacity: headerAnim,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={styles.headerTitle}>Profile</Text>
        </Animated.View>
        {/* Tab Switcher */}
        <Animated.View style={[styles.tabRow, {
          backgroundColor: headerAnim.interpolate({inputRange: [0, 1], outputRange: ['rgba(26,26,46,0.5)', '#1a1a2e']}),
        }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'edit' && styles.tabActive]}
          onPress={() => switchTab('edit')}>
          <Text style={[styles.tabText, activeTab === 'edit' && styles.tabTextActive]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'view' && styles.tabActive]}
          onPress={() => switchTab('view')}>
          <Text style={[styles.tabText, activeTab === 'view' && styles.tabTextActive]}>View</Text>
        </TouchableOpacity>
      </Animated.View>
      </Animated.View>

      <View style={{flex: 1}}>
      {/* View Mode — ProfileCard preview */}
      <Animated.View
        style={[
          styles.viewContainer,
          {opacity: viewOpacity, transform: [{translateX: viewTranslateX}]},
        ]}
        pointerEvents={activeTab === 'view' ? 'auto' : 'none'}>
        <ProfileCard profile={profile} />
      </Animated.View>

      {/* Edit Mode */}
      <Animated.View
        style={[
          styles.editContainer,
          {opacity: editOpacity, transform: [{translateX: editTranslateX}]},
        ]}
        pointerEvents={activeTab === 'edit' ? 'auto' : 'none'}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* --- Photos Section --- */}
        <View style={styles.section}>
          <SectionHeader title="My Photos" onEdit={() => {}} />
          <View style={styles.photoGrid}>
            {profile.photos.map((photo, i) => (
              <View key={i} style={styles.photoWrapper}>
                <Image
                  source={typeof photo === 'number' ? photo : {uri: photo}}
                  style={styles.photoThumb}
                />
                {activeTab === 'edit' && (
                  <TouchableOpacity style={styles.photoRemoveBtn}>
                    <Text style={styles.photoRemoveText}>x</Text>
                  </TouchableOpacity>
                )}
                {i === 0 && (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryBadgeText}>Main</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* --- Personal Info --- */}
        <View style={styles.section}>
          <SectionHeader title="Personal Info" onEdit={() => {}} />
          <InfoRow label="Name" value={profile.name} />
          <InfoRow label="Handle" value={profile.handle} />
          <InfoRow label="Age" value={`${profile.age}`} />
          <InfoRow label="Birthday" value={profile.birthday || 'Not set'} />
          <InfoRow label="Gender" value={profile.gender || 'Not set'} />
          <InfoRow label="Ethnicity" value={profile.ethnicity || 'Not set'} last />
        </View>

        {/* --- Bio --- */}
        <View style={styles.section}>
          <SectionHeader title="Bio" onEdit={() => {}} />
          <Text style={styles.bioText}>{profile.bio}</Text>
        </View>

        {/* --- Games --- */}
        <View style={styles.section}>
          <SectionHeader title={`My Games (${profile.topGames.length})`} />
          {profile.topGames.map((game, i) => (
            <View key={i} style={styles.gameCard}>
              <View style={styles.gameCardHeader}>
                <Image
                  source={typeof game.icon === 'number' ? game.icon : {uri: game.icon}}
                  style={styles.gameRankIcon}
                />
                <View style={styles.gameCardInfo}>
                  <View style={styles.gameNameRow}>
                    <Text style={styles.gameName}>{game.name}</Text>
                    <StarIcon filled={game.isFavorite || false} />
                  </View>
                  <View style={styles.rankRow}>
                    <Text style={styles.gameRank}>{game.rank}</Text>
                    <VerifiedIcon />
                  </View>
                  {game.hours && (
                    <Text style={styles.gameHours}>{game.hours} hrs</Text>
                  )}
                </View>
                <ChevronRight />
              </View>
              {/* Game details */}
              <View style={styles.gameDetails}>
                {game.servers && game.servers.length > 0 && (
                  <View style={styles.gameDetailRow}>
                    <Text style={styles.gameDetailLabel}>Servers</Text>
                    <View style={styles.tagRow}>
                      {game.servers.map((s, j) => (
                        <View key={j} style={styles.miniTag}>
                          <Text style={styles.miniTagText}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                {game.modes && game.modes.length > 0 && (
                  <View style={styles.gameDetailRow}>
                    <Text style={styles.gameDetailLabel}>Modes</Text>
                    <View style={styles.tagRow}>
                      {game.modes.map((m, j) => (
                        <View key={j} style={styles.miniTag}>
                          <Text style={styles.miniTagText}>{m}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                {game.platforms && game.platforms.length > 0 && (
                  <View style={styles.gameDetailRow}>
                    <Text style={styles.gameDetailLabel}>Platform</Text>
                    <View style={styles.tagRow}>
                      {game.platforms.map((p, j) => (
                        <View key={j} style={styles.miniTag}>
                          <Text style={styles.miniTagText}>{p}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addGameBtn}>
            <Text style={styles.addGameText}>+ Add Game</Text>
          </TouchableOpacity>
        </View>

        {/* --- About Me --- */}
        <View style={styles.section}>
          <SectionHeader title="About Me" onEdit={() => {}} />
          <InfoRow label="Region" value={profile.region || 'Not set'} />
          <InfoRow label="Platform" value={profile.platform.toUpperCase()} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mic</Text>
            <View style={styles.micRow}>
              <MicIcon on={profile.mic ?? false} />
              <Text style={[styles.infoValue, {marginLeft: 6}]}>
                {profile.mic ? 'On' : 'Off'}
              </Text>
            </View>
          </View>
        </View>

        {/* --- Play Style --- */}
        <View style={styles.section}>
          <SectionHeader title="Play Style" onEdit={() => {}} />
          <View style={styles.chipRow}>
            {profile.playStyles.map((style, i) => (
              <PlayStyleBadge key={i} label={style} />
            ))}
          </View>
        </View>

        {/* --- Schedule --- */}
        {profile.playSchedule && (
          <View style={styles.section}>
            <SectionHeader title="Schedule" onEdit={() => {}} />
            <View style={styles.dayRow}>
              {profile.playSchedule.activeDays.map((active, i) => (
                <View
                  key={i}
                  style={[styles.dayBox, active && styles.dayBoxActive]}>
                  <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>
                    {DAY_LABELS[i]}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{profile.playSchedule.timeRange}</Text>
              <Text style={styles.timezoneText}>{profile.playSchedule.timezone}</Text>
            </View>
          </View>
        )}

        {/* --- Written Prompts --- */}
        {profile.hingePrompt && (
          <View style={styles.section}>
            <SectionHeader title="Written Prompts (1)" onEdit={() => {}} />
            <View style={styles.promptCard}>
              <Text style={styles.promptQuestion}>{profile.hingePrompt.question}</Text>
              <Text style={styles.promptAnswer}>{profile.hingePrompt.answer}</Text>
            </View>
          </View>
        )}

        {/* --- Preferences / Filters --- */}
        {profile.preferences && (
          <View style={styles.section}>
            <View style={styles.prefHeader}>
              <Text style={styles.prefTitle}>Preferences & Filters</Text>
            </View>

            {/* Preferred Genders */}
            <View style={styles.prefSection}>
              <Text style={styles.prefLabel}>Preferred Genders</Text>
              <View style={styles.chipRow}>
                {['Male', 'Female', 'Non-binary', 'Other'].map(g => (
                  <Chip
                    key={g}
                    label={g}
                    active={profile.preferences!.preferredGenders.includes(g)}
                  />
                ))}
              </View>
            </View>

            {/* Age Range */}
            <View style={styles.prefSection}>
              <Text style={styles.prefLabel}>Age Range</Text>
              <View style={styles.ageRangeRow}>
                <View style={styles.ageBox}>
                  <Text style={styles.ageBoxText}>{profile.preferences.ageRange[0]}</Text>
                </View>
                <View style={styles.ageDash} />
                <View style={styles.ageBox}>
                  <Text style={styles.ageBoxText}>{profile.preferences.ageRange[1]}</Text>
                </View>
              </View>
            </View>

          </View>
        )}

        {/* --- Actions --- */}
        <View style={[styles.section, {marginBottom: 120}]}>
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  editContainer: {
    flex: 1,
  },
  viewContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'ModernEra-Bold',
    fontWeight: 'bold',
  },
  // Tab switcher
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#7c3aed',
  },
  tabText: {
    fontSize: 15,
    fontFamily: 'ModernEra-Medium',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
    fontFamily: 'ModernEra-Bold',
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'ModernEra-Bold',
    color: '#fff',
  },

  // Photos
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PHOTO_GAP,
  },
  photoWrapper: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 1.25,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
  },
  photoThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoRemoveBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRemoveText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'ModernEra-Bold',
    marginTop: -1,
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  primaryBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'ModernEra-Bold',
  },

  // Card
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
  },
  infoLabel: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'ModernEra-Medium',
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'ModernEra-Bold',
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#2a2a3e',
  },
  micRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Bio
  bioText: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'ModernEra-Medium',
    lineHeight: 21,
  },

  // Games
  gameCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    marginBottom: 10,
  },
  gameCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameRankIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  gameCardInfo: {
    flex: 1,
  },
  gameNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gameName: {
    fontSize: 15,
    fontFamily: 'ModernEra-Bold',
    color: '#fff',
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  gameRank: {
    fontSize: 13,
    fontFamily: 'ModernEra-Medium',
    color: '#A78BFA',
  },
  gameHours: {
    fontSize: 12,
    fontFamily: 'ModernEra-Medium',
    color: '#eed094',
    marginTop: 1,
  },
  gameDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2a2a3e',
  },
  gameDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  gameDetailLabel: {
    width: 65,
    fontSize: 12,
    fontFamily: 'ModernEra-Medium',
    color: '#666',
    marginTop: 4,
  },
  tagRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  miniTagText: {
    fontSize: 12,
    fontFamily: 'ModernEra-Medium',
    color: '#fff',
  },
  addGameBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addGameText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'ModernEra-Bold',
  },

  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  chipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  chipText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontFamily: 'ModernEra-Medium',
  },
  chipTextActive: {
    color: '#fff',
  },

  // Schedule
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dayBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  dayBoxActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },
  dayLabel: {
    fontSize: 14,
    fontFamily: 'ModernEra-Bold',
    color: 'rgba(255,255,255,0.25)',
  },
  dayLabelActive: {
    color: '#A78BFA',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'ModernEra-Medium',
    color: '#ccc',
  },
  timezoneText: {
    fontSize: 13,
    fontFamily: 'ModernEra-Medium',
    color: '#666',
  },

  // Prompts
  promptCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  promptQuestion: {
    fontSize: 13,
    fontFamily: 'ModernEra-Regular',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 6,
  },
  promptAnswer: {
    fontSize: 18,
    fontFamily: 'ModernEra-Bold',
    color: '#fff',
    lineHeight: 26,
  },

  // Preferences
  prefHeader: {
    marginBottom: 16,
  },
  prefTitle: {
    fontSize: 16,
    fontFamily: 'ModernEra-Bold',
    color: '#fff',
  },
  prefSection: {
    marginBottom: 18,
  },
  prefLabel: {
    fontSize: 13,
    fontFamily: 'ModernEra-Medium',
    color: '#888',
    marginBottom: 10,
  },
  ageRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ageBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    minWidth: 60,
    alignItems: 'center',
  },
  ageBoxText: {
    fontSize: 16,
    fontFamily: 'ModernEra-Bold',
    color: '#fff',
  },
  ageDash: {
    width: 16,
    height: 2,
    backgroundColor: '#555',
    borderRadius: 1,
  },
  openToAll: {
    fontSize: 14,
    fontFamily: 'ModernEra-Medium',
    color: '#A78BFA',
    fontStyle: 'italic',
  },

  // Actions
  logoutButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.3)',
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 14,
    fontFamily: 'ModernEra-Medium',
  },
});

export default ProfileScreen;

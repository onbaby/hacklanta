import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  PanResponder,
} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';
import {BlurView} from '@react-native-community/blur';
import {Conversation, Message} from '../types/message';

const CURRENT_USER_ID = '1';

// --- Icons ---

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MicIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Rect x="9" y="2" width="6" height="12" rx="3" stroke="#fff" strokeWidth={2} />
    <Path d="M5 10V11C5 14.866 8.13401 18 12 18V18V18C15.866 18 19 14.866 19 11V10" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 18V22M12 22H9M12 22H15" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PaperPlaneIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M22.1525 3.55321L11.1772 21.0044L9.50686 12.4078L2.00002 7.89795L22.1525 3.55321Z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9.45557 12.4436L22.1524 3.55321" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ActionButton = ({hasText, onSend}: {hasText: boolean; onSend: () => void}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(hasText ? 1 : 0)).current;
  const prevHasText = useRef(hasText);

  useEffect(() => {
    if (hasText !== prevHasText.current) {
      prevHasText.current = hasText;
      // Bounce + crossfade
      Animated.sequence([
        Animated.timing(scaleAnim, {toValue: 0.6, duration: 100, useNativeDriver: true}),
        Animated.parallel([
          Animated.spring(scaleAnim, {toValue: 1, friction: 4, tension: 300, useNativeDriver: true}),
          Animated.timing(rotateAnim, {toValue: hasText ? 1 : 0, duration: 150, useNativeDriver: true}),
        ]),
      ]).start();
    }
  }, [hasText]);

  const opacity1 = rotateAnim.interpolate({inputRange: [0, 1], outputRange: [1, 0]});
  const opacity2 = rotateAnim.interpolate({inputRange: [0, 1], outputRange: [0, 1]});

  return (
    <TouchableOpacity
      style={[styles.sendBtn, hasText && styles.sendBtnActive]}
      onPress={onSend}
      disabled={!hasText}
      activeOpacity={0.7}>
      <Animated.View style={{transform: [{scale: scaleAnim}]}}>
        <Animated.View style={{position: 'absolute', opacity: opacity1, alignItems: 'center', justifyContent: 'center', width: 20, height: 20}}>
          <MicIcon />
        </Animated.View>
        <Animated.View style={{opacity: opacity2}}>
          <PaperPlaneIcon />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const ImageIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6Z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 16L10 13L21 18" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8C18 9.10457 17.1046 10 16 10Z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SmileyIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22Z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16.5 14.5C16.5 14.5 15 16.5 12 16.5C9 16.5 7.5 14.5 7.5 14.5" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15.5 9C15.2239 9 15 8.77614 15 8.5C15 8.22386 15.2239 8 15.5 8C15.7761 8 16 8.22386 16 8.5C16 8.77614 15.7761 9 15.5 9Z" fill="#fff" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8.5 9C8.22386 9 8 8.77614 8 8.5C8 8.22386 8.22386 8 8.5 8C8.77614 8 9 8.22386 9 8.5C9 8.77614 8.77614 9 8.5 9Z" fill="#fff" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TIME_REVEAL_WIDTH = 70;

// --- Message Bubble ---

const MessageBubble = ({message, isMe, slideAnim}: {message: Message; isMe: boolean; slideAnim: Animated.Value}) => {
  const timeOpacity = slideAnim.interpolate({
    inputRange: [-TIME_REVEAL_WIDTH, -10, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.messageOuter}>
      <Animated.View
        style={[
          styles.bubbleRow,
          isMe && styles.bubbleRowMe,
          {transform: [{translateX: slideAnim}]},
        ]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
            {message.text}
          </Text>
        </View>
      </Animated.View>
      <Animated.View style={[styles.timeReveal, {opacity: timeOpacity}]}>
        <Text style={styles.timeLabel}>{message.timestamp}</Text>
      </Animated.View>
    </View>
  );
};

// --- Main Component ---

const ChatScreen = ({route, navigation}: {route: any; navigation: any}) => {
  const conversation: Conversation = route.params.conversation;
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5 && gs.dx < -8,
      onPanResponderMove: (_, gs) => {
        const x = Math.max(-TIME_REVEAL_WIDTH, Math.min(0, gs.dx));
        slideAnim.setValue(x);
      },
      onPanResponderRelease: () => {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 7,
          tension: 200,
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 7,
          tension: 200,
        }).start();
      },
    }),
  ).current;

  useEffect(() => {
    // Scroll to bottom on mount
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: false});
    }, 100);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: CURRENT_USER_ID,
      text: inputText.trim(),
      timestamp: 'Just now',
      status: 'sent',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    }, 50);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <BackIcon />
        </TouchableOpacity>

        <View style={styles.headerProfile}>
          <View style={styles.headerAvatarWrapper}>
            <Image
              source={
                typeof conversation.participantAvatar === 'number'
                  ? conversation.participantAvatar
                  : {uri: conversation.participantAvatar}
              }
              style={styles.headerAvatar}
            />
            {conversation.isOnline && <View style={styles.headerOnlineDot} />}
          </View>
          <View>
            <Text style={styles.headerName}>{conversation.participantName}</Text>
            <Text style={[styles.headerStatus, !conversation.isOnline && styles.headerStatusOffline]}>
              {conversation.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
              fill="#fff"
              stroke="#fff"
              strokeWidth={2}
            />
            <Path
              d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
              fill="#fff"
              stroke="#fff"
              strokeWidth={2}
            />
            <Path
              d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
              fill="#fff"
              stroke="#fff"
              strokeWidth={2}
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <Animated.View style={styles.flex} {...panResponder.panHandlers}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <MessageBubble
                message={item}
                isMe={item.senderId === CURRENT_USER_ID}
                slideAnim={slideAnim}
              />
            )}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>

        {/* Input Bar */}
        <View style={styles.inputBarContent}>
            <View style={styles.inputWrapper}>
              <TouchableOpacity style={styles.inlineIconBtn}>
                <ImageIcon />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor="#555"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={1000}
              />
              <TouchableOpacity style={styles.inlineIconBtn}>
                <SmileyIcon />
              </TouchableOpacity>
            </View>
            <ActionButton hasText={!!inputText.trim()} onSend={handleSend} />
          </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  flex: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0f0f1a',
  },
  backBtn: {
    marginRight: 12,
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a2e',
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#0f0f1a',
  },
  headerName: {
    fontSize: 16,
    fontFamily: 'ModernEra-Bold',
    color: '#fff',
  },
  headerStatus: {
    fontSize: 12,
    fontFamily: 'ModernEra-Medium',
    color: '#22c55e',
  },
  headerStatusOffline: {
    color: '#666',
  },
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Messages
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageOuter: {
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubbleRow: {
    flex: 1,
    alignItems: 'flex-start',
  },
  bubbleRowMe: {
    alignItems: 'flex-end',
  },
  timeReveal: {
    position: 'absolute',
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: TIME_REVEAL_WIDTH,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '100%',
  },
  bubbleMe: {
    backgroundColor: '#7c3aed',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: '#1a1a2e',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTextMe: {
    color: '#fff',
    fontFamily: 'ModernEra-Medium',
  },
  bubbleTextThem: {
    color: '#e0e0e0',
    fontFamily: 'ModernEra-Regular',
  },
  timeLabel: {
    fontSize: 11,
    fontFamily: 'ModernEra-Regular',
    color: '#555',
  },

  // Input bar
  inputBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
    backgroundColor: '#0f0f1a',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    paddingHorizontal: 6,
    paddingVertical: Platform.OS === 'ios' ? 6 : 4,
    marginRight: 8,
    maxHeight: 120,
  },
  inlineIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'ModernEra-Medium',
    color: '#fff',
    paddingVertical: 0,
    paddingHorizontal: 4,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
  },
  sendBtnActive: {
    backgroundColor: '#7c3aed',
  },
});

export default ChatScreen;

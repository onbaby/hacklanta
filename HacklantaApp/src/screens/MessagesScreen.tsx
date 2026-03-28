import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import Svg, {Path, Circle} from 'react-native-svg';
import {mockConversations} from '../constants/mockConversations';
import {Conversation} from '../types/message';

const SearchIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke="#666" strokeWidth={1.8} />
    <Path d="M21 21L16.65 16.65" stroke="#666" strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

const ConversationItem = ({
  conversation,
  onPress,
}: {
  conversation: Conversation;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.conversationItem} onPress={onPress} activeOpacity={0.6}>
    <View style={styles.avatarWrapper}>
      <Image
        source={
          typeof conversation.participantAvatar === 'number'
            ? conversation.participantAvatar
            : {uri: conversation.participantAvatar}
        }
        style={styles.avatar}
      />
      {conversation.isOnline && <View style={styles.onlineDot} />}
    </View>

    <View style={styles.conversationContent}>
      <View style={styles.conversationTop}>
        <Text style={styles.participantName} numberOfLines={1}>
          {conversation.participantName}
        </Text>
        <Text style={styles.timeText}>{conversation.lastMessageTime}</Text>
      </View>
      <View style={styles.conversationBottom}>
        <Text
          style={[
            styles.lastMessage,
            conversation.unreadCount > 0 && styles.lastMessageUnread,
          ]}
          numberOfLines={1}>
          {conversation.lastMessage}
        </Text>
        {conversation.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const MessagesScreen = ({navigation}: {navigation: any}) => {
  const [search, setSearch] = useState('');

  const filtered = mockConversations.filter(
    c =>
      c.participantName.toLowerCase().includes(search.toLowerCase()) ||
      c.participantHandle.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.composeBtn}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M6 12H12M18 12H12M12 12V6M12 12V18"
                stroke="#fff"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor="#555"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Conversations List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ConversationItem
            conversation={item}
            onPress={() => navigation.getParent()?.navigate('Chat', {conversation: item})}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              Match with someone to start chatting!
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'ModernEra-Bold',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  composeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search
  searchWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontFamily: 'ModernEra-Medium',
    color: '#fff',
    paddingVertical: 0,
  },

  // Conversations
  listContent: {
    paddingBottom: 100,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1a1a2e',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2.5,
    borderColor: '#0f0f1a',
  },
  conversationContent: {
    flex: 1,
  },
  conversationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontFamily: 'ModernEra-Bold',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'ModernEra-Medium',
    color: '#666',
  },
  conversationBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'ModernEra-Regular',
    color: '#888',
    flex: 1,
    marginRight: 8,
  },
  lastMessageUnread: {
    color: '#ccc',
    fontFamily: 'ModernEra-Medium',
  },
  unreadBadge: {
    backgroundColor: '#7c3aed',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'ModernEra-Bold',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'ModernEra-Bold',
    color: '#fff',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'ModernEra-Regular',
    color: '#666',
  },
});

export default MessagesScreen;

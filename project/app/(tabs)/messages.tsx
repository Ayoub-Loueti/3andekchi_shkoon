import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChatItem } from '../../components/ChatItem';
import { SearchBar } from '../../components/SearchBar';
import { mockChats } from '../../data/mockData';
import { Colors, Spacing, BorderRadius } from '../../constants/Colors';
import { MessageCircle, Users, Search } from 'lucide-react-native';

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const currentUserId = '1'; // This would come from your auth context

  const filteredChats = mockChats.filter(chat => {
    const otherUser = chat.participants.find(user => user.id !== currentUserId);
    const matchesSearch = otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || (activeTab === 'unread' && chat.unreadCount > 0);
    return matchesSearch && matchesTab;
  });

  const handleChatPress = (chatId: string) => {
    console.log('Navigate to chat:', chatId);
  };

  const handleFilterPress = () => {
    console.log('Open message filters');
  };

  const unreadCount = mockChats.filter(chat => chat.unreadCount > 0).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Stay connected with your community</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <MessageCircle size={16} color={activeTab === 'all' ? Colors.white : Colors.mediumGray} />
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Messages
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
          onPress={() => setActiveTab('unread')}
        >
          <Users size={16} color={activeTab === 'unread' ? Colors.white : Colors.mediumGray} />
          <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={handleFilterPress}
        placeholder="Search conversations..."
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              currentUserId={currentUserId}
              onPress={() => handleChatPress(chat.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MessageCircle size={64} color={Colors.lightGray} />
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start applying to tasks to begin conversations'
              }
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Search size={20} color={Colors.primary} />
          <Text style={styles.quickActionText}>Find Tasks</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Users size={20} color={Colors.primary} />
          <Text style={styles.quickActionText}>Browse Helpers</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.darkGray,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.xs,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.lg,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.mediumGray,
    marginLeft: Spacing.xs,
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.md,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.md,
    fontFamily: 'Inter-SemiBold',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.mediumGray,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: Spacing.xs,
    fontFamily: 'Inter-Medium',
  },
});
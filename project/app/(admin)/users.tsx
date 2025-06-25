import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { Search, Filter, MoveVertical as MoreVertical, Shield, Archive, ShieldOff, ArchiveRestore, Mail, Phone, MapPin, Star, Calendar, X } from 'lucide-react-native';

const colors = {
  primary: '#2A4D69',
  secondary: '#FFC857',
  accent: '#58B09C',
  background: '#F7F9FB',
  text: '#333333',
  success: '#4CAF50',
  error: '#EF5350',
  warning: '#FF9800',
};

const mockUsers = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Ben Ali',
    email: 'sarah.benali@email.com',
    phone: '+216 12 345 678',
    location: 'Tunis, La Marsa',
    genre: 'femme',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    joinedDate: '2024-01-15',
    status: 'active',
    jobsCompleted: 23,
    totalEarnings: 1250,
  },
  {
    id: 2,
    firstName: 'Ahmed',
    lastName: 'Trabelsi',
    email: 'ahmed.trabelsi@email.com',
    phone: '+216 98 765 432',
    location: 'Sfax, Centre Ville',
    genre: 'homme',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    joinedDate: '2024-02-20',
    status: 'blocked',
    jobsCompleted: 15,
    totalEarnings: 890,
  },
  {
    id: 3,
    firstName: 'Fatma',
    lastName: 'Mansouri',
    email: 'fatma.mansouri@email.com',
    phone: '+216 55 123 456',
    location: 'Sousse, Kantaoui',
    genre: 'femme',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    joinedDate: '2024-03-10',
    status: 'archived',
    jobsCompleted: 31,
    totalEarnings: 1680,
  },
  {
    id: 4,
    firstName: 'Mohamed',
    lastName: 'Khelifi',
    email: 'mohamed.khelifi@email.com',
    phone: '+216 77 888 999',
    location: 'Monastir, Centre',
    genre: 'homme',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    joinedDate: '2024-01-28',
    status: 'active',
    jobsCompleted: 18,
    totalEarnings: 975,
  },
];

const filterOptions = [
  { id: 'all', label: 'All Users', count: 4 },
  { id: 'active', label: 'Active', count: 2 },
  { id: 'blocked', label: 'Blocked', count: 1 },
  { id: 'archived', label: 'Archived', count: 1 },
];

export default function UsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || user.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleUserAction = (action, user) => {
    switch (action) {
      case 'block':
        Alert.alert(
          'Block User',
          `Are you sure you want to block ${user.firstName} ${user.lastName}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Block', style: 'destructive', onPress: () => {
              // Update user status logic here
              Alert.alert('Success', 'User has been blocked');
              setShowUserModal(false);
            }}
          ]
        );
        break;
      case 'unblock':
        Alert.alert('Success', 'User has been unblocked');
        setShowUserModal(false);
        break;
      case 'archive':
        Alert.alert(
          'Archive User',
          `Are you sure you want to archive ${user.firstName} ${user.lastName}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Archive', onPress: () => {
              Alert.alert('Success', 'User has been archived');
              setShowUserModal(false);
            }}
          ]
        );
        break;
      case 'unarchive':
        Alert.alert('Success', 'User has been unarchived');
        setShowUserModal(false);
        break;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return colors.success;
      case 'blocked': return colors.error;
      case 'archived': return colors.warning;
      default: return '#8E8E93';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'blocked': return 'Blocked';
      case 'archived': return 'Archived';
      default: return 'Unknown';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>
          Manage users, view profiles, and moderate accounts
        </Text>

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#8E8E93" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8E8E93"
            />
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color={colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterChipsContainer}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === filter.id && styles.filterChipTextActive
              ]}>
                {filter.label} ({filter.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Users List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <Text style={styles.resultsCount}>
            {filteredUsers.length} users found
          </Text>
        </View>

        {filteredUsers.map((user) => (
          <TouchableOpacity 
            key={user.id} 
            style={styles.userCard}
            onPress={() => {
              setSelectedUser(user);
              setShowUserModal(true);
            }}
          >
            <View style={styles.userHeader}>
              <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
              <View style={styles.userInfo}>
                <View style={styles.userNameRow}>
                  <Text style={styles.userName}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>
                      {getStatusText(user.status)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userMeta}>
                  <View style={styles.metaItem}>
                    <Star size={14} color={colors.secondary} strokeWidth={2} fill={colors.secondary} />
                    <Text style={styles.metaText}>{user.rating}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MapPin size={14} color="#8E8E93" strokeWidth={2} />
                    <Text style={styles.metaText}>{user.location}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <MoreVertical size={20} color="#8E8E93" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <Search size={48} color="#8E8E93" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptyDescription}>
              Try adjusting your search terms or filters
            </Text>
          </View>
        )}
      </ScrollView>

      {/* User Details Modal */}
      <Modal
        visible={showUserModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowUserModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>User Details</Text>
            <TouchableOpacity 
              onPress={() => setShowUserModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {selectedUser && (
            <ScrollView style={styles.modalContent}>
              {/* User Profile Section */}
              <View style={styles.profileSection}>
                <Image source={{ uri: selectedUser.avatar }} style={styles.modalAvatar} />
                <Text style={styles.modalUserName}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </Text>
                <View style={[styles.modalStatusBadge, { backgroundColor: getStatusColor(selectedUser.status) + '20' }]}>
                  <Text style={[styles.modalStatusText, { color: getStatusColor(selectedUser.status) }]}>
                    {getStatusText(selectedUser.status)}
                  </Text>
                </View>
              </View>

              {/* Contact Information */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <View style={styles.infoItem}>
                  <Mail size={20} color={colors.primary} strokeWidth={2} />
                  <Text style={styles.infoText}>{selectedUser.email}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Phone size={20} color={colors.primary} strokeWidth={2} />
                  <Text style={styles.infoText}>{selectedUser.phone}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MapPin size={20} color={colors.primary} strokeWidth={2} />
                  <Text style={styles.infoText}>{selectedUser.location}</Text>
                </View>
              </View>

              {/* Statistics */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Statistics</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{selectedUser.rating}</Text>
                    <Text style={styles.statLabel}>Rating</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{selectedUser.jobsCompleted}</Text>
                    <Text style={styles.statLabel}>Jobs</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{selectedUser.totalEarnings} TND</Text>
                    <Text style={styles.statLabel}>Earnings</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <Calendar size={20} color={colors.primary} strokeWidth={2} />
                  <Text style={styles.infoText}>Joined {selectedUser.joinedDate}</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionSection}>
                <Text style={styles.sectionTitle}>Actions</Text>
                
                {selectedUser.status === 'active' && (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.blockButton]}
                      onPress={() => handleUserAction('block', selectedUser)}
                    >
                      <Shield size={20} color="white" strokeWidth={2} />
                      <Text style={styles.actionButtonText}>Block User</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.archiveButton]}
                      onPress={() => handleUserAction('archive', selectedUser)}
                    >
                      <Archive size={20} color="white" strokeWidth={2} />
                      <Text style={styles.actionButtonText}>Archive User</Text>
                    </TouchableOpacity>
                  </>
                )}

                {selectedUser.status === 'blocked' && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.unblockButton]}
                    onPress={() => handleUserAction('unblock', selectedUser)}
                  >
                    <ShieldOff size={20} color="white" strokeWidth={2} />
                    <Text style={styles.actionButtonText}>Unblock User</Text>
                  </TouchableOpacity>
                )}

                {selectedUser.status === 'archived' && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.unarchiveButton]}
                    onPress={() => handleUserAction('unarchive', selectedUser)}
                  >
                    <ArchiveRestore size={20} color="white" strokeWidth={2} />
                    <Text style={styles.actionButtonText}>Unarchive User</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text,
  },
  filterButton: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 16,
  },
  filterChipsContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.text,
  },
  filterChipTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    paddingVertical: 16,
  },
  resultsCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginLeft: 4,
  },
  moreButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  modalUserName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: colors.text,
    marginBottom: 8,
  },
  modalStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  modalStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text,
    marginLeft: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  actionSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  blockButton: {
    backgroundColor: colors.error,
  },
  archiveButton: {
    backgroundColor: colors.warning,
  },
  unblockButton: {
    backgroundColor: colors.success,
  },
  unarchiveButton: {
    backgroundColor: colors.accent,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
});
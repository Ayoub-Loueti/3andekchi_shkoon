import React, { useState, useEffect, useCallback } from 'react';
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

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  genre: string;
  avatar: string;
  rating: number;
  joinedDate: string;
  status: 'active' | 'blocked' | 'archived';
  jobsCompleted: number;
  totalEarnings: number;
};

const BASE_URL = 'http://localhost:5000';

function mapUserFromApi(user: any): User {
  // Map backend user to frontend user shape
  return {
    id: user._id,
    firstName: user.nom || '',
    lastName: user.prenom || '',
    email: user.mail || '',
    phone: user.numero || '',
    location: user.location || '',
    genre: user.genre || '',
    avatar: user.avatar || '',
    rating: user.rate || 0,
    joinedDate: user.createdAt ? user.createdAt.slice(0, 10) : '',
    status: user.isArchived ? 'archived' : user.isBlocked ? 'blocked' : 'active',
    jobsCompleted: user.jobsCompleted || 0, // keep as is, or fetch if available
    totalEarnings: user.totalEarnings || 0, // keep as is, or fetch if available
  };
}

type FilterOption = {
  id: 'all' | 'active' | 'blocked' | 'archived';
  label: string;
  count: number;
};

export default function UsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [allUsersForCount, setAllUsersForCount] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all users for accurate counts, and the filtered list for display
  const fetchUsers = useCallback(async (filter: string) => {
    setLoading(true);
    try {
      // Fetch the master list for counts
      const allUsersResponse = await fetch(`${BASE_URL}/users/clients/all`);
      const allUsersData = await allUsersResponse.json();
      if (Array.isArray(allUsersData)) {
        setAllUsersForCount(allUsersData.map(mapUserFromApi));
      }

      // Fetch the specific list for display
      let displayUrl = '';
      switch (filter) {
        case 'all':
          displayUrl = `${BASE_URL}/users/clients/all`;
          break;
        case 'active':
          displayUrl = `${BASE_URL}/users/clients`;
          break;
        case 'blocked':
          displayUrl = `${BASE_URL}/users/clients/blocked`;
          break;
        case 'archived':
          displayUrl = `${BASE_URL}/users/clients/archived`;
          break;
        default:
          displayUrl = `${BASE_URL}/users/clients/all`;
      }
      const displayResponse = await fetch(displayUrl);
      const displayData = await displayResponse.json();
      if (Array.isArray(displayData)) {
        setUsers(displayData.map(mapUserFromApi));
      } else {
        setUsers([]);
      }
    } catch (e) {
      console.error('Failed to fetch users:', e);
      setUsers([]);
      setAllUsersForCount([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch users from API when filter changes
  useEffect(() => {
    fetchUsers(selectedFilter);
  }, [fetchUsers, selectedFilter]);

  // Filter users by search
  useEffect(() => {
    setFilteredUsers(
      users.filter((user: User) => {
        const matchesSearch =
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
    );
  }, [searchQuery, users]);

  // Block, unblock, archive, unarchive actions
  const handleUserAction = async (action: string, user: User) => {
    let url = '';
    let method = 'PUT';
    let successMsg = '';
    if (!user) return;
    switch (action) {
      case 'block':
        url = `${BASE_URL}/users/clients/${user.id}/block`;
        successMsg = 'User has been blocked';
        break;
      case 'unblock':
        url = `${BASE_URL}/users/clients/${user.id}/unblock`;
        successMsg = 'User has been unblocked';
        break;
      case 'archive':
        url = `${BASE_URL}/users/clients/${user.id}/archive`;
        successMsg = 'User has been archived';
        break;
      case 'unarchive':
        url = `${BASE_URL}/users/clients/${user.id}/unarchive`;
        successMsg = 'User has been unarchived';
        break;
      default:
        return;
    }
    try {
      const res = await fetch(url, { method });
      if (res.ok) {
        Alert.alert('Success', successMsg);
        setShowUserModal(false);
        // Refresh users
        fetchUsers(selectedFilter);
      } else {
        Alert.alert('Error', 'Action failed');
      }
    } catch (e) {
      Alert.alert('Error', 'Action failed');
    }
  };

  const getStatusColor = (status: 'active' | 'blocked' | 'archived') => {
    switch (status) {
      case 'active': return colors.success;
      case 'blocked': return colors.error;
      case 'archived': return colors.warning;
      default: return '#8E8E93';
    }
  };

  const getStatusText = (status: 'active' | 'blocked' | 'archived') => {
    switch (status) {
      case 'active': return 'Active';
      case 'blocked': return 'Blocked';
      case 'archived': return 'Archived';
      default: return 'Unknown';
    }
  };

  // Compute filter counts dynamically from the master list
  const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All Users', count: allUsersForCount.length },
    { id: 'active', label: 'Active', count: allUsersForCount.filter(u => u.status === 'active').length },
    { id: 'blocked', label: 'Blocked', count: allUsersForCount.filter(u => u.status === 'blocked').length },
    { id: 'archived', label: 'Archived', count: allUsersForCount.filter(u => u.status === 'archived').length },
  ];

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
          {filterOptions.map((filter: FilterOption) => (
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

        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
        ) : filteredUsers.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.userCard}
            onPress={() => {
              setSelectedUser(user);
              setShowUserModal(true);
            }}
          >
            <View style={styles.userHeader}>
              <Image source={{ uri: user.avatar ? `${BASE_URL}${user.avatar}` : 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' }} style={styles.userAvatar} />
              <View style={styles.userInfo}>
                <View style={styles.userNameRow}>
                  <Text style={styles.userName}>
                    {user.firstName} {user.lastName}
                  </Text>
                </View>
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
            </View>
          </TouchableOpacity>
        ))}

        {filteredUsers.length === 0 && !loading && (
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
                <Image source={{ uri: selectedUser.avatar ? `${BASE_URL}${selectedUser.avatar}` : 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' }} style={styles.modalAvatar} />
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
                  <>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.unblockButton]}
                      onPress={() => handleUserAction('unblock', selectedUser)}
                    >
                      <ShieldOff size={20} color="white" strokeWidth={2} />
                      <Text style={styles.actionButtonText}>Unblock User</Text>
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
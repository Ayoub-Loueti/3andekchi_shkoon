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
import { Search, Filter, Flag, Trash2, Shield, Eye, Calendar, MapPin, User, X, TriangleAlert as AlertTriangle } from 'lucide-react-native';

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

const mockReportedPosts = [
  {
    id: 1,
    title: 'Babysitter needed urgently',
    description: 'Looking for someone to take care of my kids tonight. Must be available immediately.',
    author: {
      name: 'Sarah Ben Ali',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 1,
    },
    location: 'Tunis, La Marsa',
    price: '25 TND/hour',
    category: 'Babysitting',
    reportedDate: '2024-03-15',
    reportCount: 3,
    reportReasons: ['Inappropriate content', 'Spam', 'Misleading information'],
    status: 'pending',
    image: 'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    title: 'Quick cash job - no questions asked',
    description: 'Need someone for a quick job. Good money, no experience needed. Contact me privately.',
    author: {
      name: 'Ahmed Suspect',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 2,
    },
    location: 'Sfax, Centre',
    price: '200 TND',
    category: 'Other',
    reportedDate: '2024-03-14',
    reportCount: 7,
    reportReasons: ['Suspicious activity', 'Inappropriate content', 'Scam'],
    status: 'pending',
    image: 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 3,
    title: 'House cleaning service',
    description: 'Professional cleaning service for your home. Experienced and reliable.',
    author: {
      name: 'Fatma Mansouri',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 3,
    },
    location: 'Sousse, Kantaoui',
    price: '80 TND',
    category: 'Cleaning',
    reportedDate: '2024-03-13',
    reportCount: 1,
    reportReasons: ['Duplicate post'],
    status: 'reviewed',
    image: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const statusOptions = [
  { id: 'all', label: 'All Reports', count: 3 },
  { id: 'pending', label: 'Pending', count: 2 },
  { id: 'reviewed', label: 'Reviewed', count: 1 },
  { id: 'resolved', label: 'Resolved', count: 0 },
];

export default function PostsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const filteredPosts = mockReportedPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handlePostAction = (action, post) => {
    switch (action) {
      case 'delete':
        Alert.alert(
          'Delete Post',
          `Are you sure you want to delete "${post.title}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
              Alert.alert('Success', 'Post has been deleted');
              setShowPostModal(false);
            }}
          ]
        );
        break;
      case 'blockUser':
        Alert.alert(
          'Block User',
          `Are you sure you want to block ${post.author.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Block', style: 'destructive', onPress: () => {
              Alert.alert('Success', 'User has been blocked');
              setShowPostModal(false);
            }}
          ]
        );
        break;
      case 'dismiss':
        Alert.alert('Success', 'Report has been dismissed');
        setShowPostModal(false);
        break;
    }
  };

  const getSeverityColor = (reportCount) => {
    if (reportCount >= 5) return colors.error;
    if (reportCount >= 3) return colors.warning;
    return colors.accent;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'reviewed': return colors.accent;
      case 'resolved': return colors.success;
      default: return '#8E8E93';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reported Posts</Text>
        <Text style={styles.headerSubtitle}>
          Review and moderate reported content
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#8E8E93" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search reported posts..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8E8E93"
            />
          </View>
        </View>

        {/* Status Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterChipsContainer}
        >
          {statusOptions.map((status) => (
            <TouchableOpacity
              key={status.id}
              style={[
                styles.filterChip,
                selectedStatus === status.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedStatus(status.id)}
            >
              <Text style={[
                styles.filterChipText,
                selectedStatus === status.id && styles.filterChipTextActive
              ]}>
                {status.label} ({status.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Posts List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <Text style={styles.resultsCount}>
            {filteredPosts.length} reported posts
          </Text>
        </View>

        {filteredPosts.map((post) => (
          <TouchableOpacity 
            key={post.id} 
            style={styles.postCard}
            onPress={() => {
              setSelectedPost(post);
              setShowPostModal(true);
            }}
          >
            <View style={styles.postHeader}>
              <View style={styles.severityIndicator}>
                <Flag size={16} color={getSeverityColor(post.reportCount)} strokeWidth={2} />
                <Text style={[styles.reportCount, { color: getSeverityColor(post.reportCount) }]}>
                  {post.reportCount} reports
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(post.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(post.status) }]}>
                  {post.status}
                </Text>
              </View>
            </View>

            <View style={styles.postContent}>
              <Image source={{ uri: post.image }} style={styles.postImage} />
              <View style={styles.postInfo}>
                <Text style={styles.postTitle} numberOfLines={2}>
                  {post.title}
                </Text>
                <Text style={styles.postDescription} numberOfLines={2}>
                  {post.description}
                </Text>
                
                <View style={styles.authorInfo}>
                  <Image source={{ uri: post.author.avatar }} style={styles.authorAvatar} />
                  <Text style={styles.authorName}>{post.author.name}</Text>
                </View>

                <View style={styles.postMeta}>
                  <View style={styles.metaItem}>
                    <MapPin size={14} color="#8E8E93" strokeWidth={2} />
                    <Text style={styles.metaText}>{post.location}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Calendar size={14} color="#8E8E93" strokeWidth={2} />
                    <Text style={styles.metaText}>Reported {post.reportedDate}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.reportReasons}>
              <Text style={styles.reasonsLabel}>Report reasons:</Text>
              <Text style={styles.reasonsText}>
                {post.reportReasons.join(', ')}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {filteredPosts.length === 0 && (
          <View style={styles.emptyState}>
            <Flag size={48} color="#8E8E93" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No reported posts</Text>
            <Text style={styles.emptyDescription}>
              All posts are clean or try adjusting your filters
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Post Details Modal */}
      <Modal
        visible={showPostModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPostModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Post Details</Text>
            <TouchableOpacity 
              onPress={() => setShowPostModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {selectedPost && (
            <ScrollView style={styles.modalContent}>
              {/* Post Content */}
              <View style={styles.modalPostSection}>
                <Image source={{ uri: selectedPost.image }} style={styles.modalPostImage} />
                <Text style={styles.modalPostTitle}>{selectedPost.title}</Text>
                <Text style={styles.modalPostDescription}>{selectedPost.description}</Text>
                
                <View style={styles.modalPostMeta}>
                  <View style={styles.metaItem}>
                    <MapPin size={16} color={colors.primary} strokeWidth={2} />
                    <Text style={styles.modalMetaText}>{selectedPost.location}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.priceText}>{selectedPost.price}</Text>
                  </View>
                </View>
              </View>

              {/* Author Information */}
              <View style={styles.authorSection}>
                <Text style={styles.sectionTitle}>Posted by</Text>
                <View style={styles.authorCard}>
                  <Image source={{ uri: selectedPost.author.avatar }} style={styles.modalAuthorAvatar} />
                  <View style={styles.authorDetails}>
                    <Text style={styles.modalAuthorName}>{selectedPost.author.name}</Text>
                    <TouchableOpacity style={styles.viewProfileButton}>
                      <User size={16} color={colors.primary} strokeWidth={2} />
                      <Text style={styles.viewProfileText}>View Profile</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Report Information */}
              <View style={styles.reportSection}>
                <Text style={styles.sectionTitle}>Report Details</Text>
                <View style={styles.reportCard}>
                  <View style={styles.reportHeader}>
                    <AlertTriangle size={20} color={getSeverityColor(selectedPost.reportCount)} strokeWidth={2} />
                    <Text style={styles.reportTitle}>
                      {selectedPost.reportCount} reports received
                    </Text>
                  </View>
                  <Text style={styles.reportDate}>
                    First reported on {selectedPost.reportedDate}
                  </Text>
                  <View style={styles.reasonsList}>
                    <Text style={styles.reasonsTitle}>Reasons:</Text>
                    {selectedPost.reportReasons.map((reason, index) => (
                      <Text key={index} style={styles.reasonItem}>
                        • {reason}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionSection}>
                <Text style={styles.sectionTitle}>Moderation Actions</Text>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handlePostAction('delete', selectedPost)}
                >
                  <Trash2 size={20} color="white" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Delete Post</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionButton, styles.blockButton]}
                  onPress={() => handlePostAction('blockUser', selectedPost)}
                >
                  <Shield size={20} color="white" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Block User</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionButton, styles.dismissButton]}
                  onPress={() => handlePostAction('dismiss', selectedPost)}
                >
                  <Eye size={20} color="white" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Dismiss Report</Text>
                </TouchableOpacity>
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
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text,
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
  postCard: {
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  severityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportCount: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    textTransform: 'capitalize',
  },
  postContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  postImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  postInfo: {
    flex: 1,
  },
  postTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 4,
  },
  postDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 8,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  authorName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
  },
  postMeta: {
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
  reportReasons: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
  },
  reasonsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 4,
  },
  reasonsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
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
  modalPostSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  modalPostImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalPostTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: colors.text,
    marginBottom: 8,
  },
  modalPostDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  modalPostMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalMetaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text,
    marginLeft: 4,
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: colors.accent,
  },
  authorSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 12,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalAuthorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  modalAuthorName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 4,
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
    marginLeft: 4,
  },
  reportSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginLeft: 8,
  },
  reportDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 12,
  },
  reasonsList: {
    marginTop: 8,
  },
  reasonsTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 4,
  },
  reasonItem: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 2,
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
  deleteButton: {
    backgroundColor: colors.error,
  },
  blockButton: {
    backgroundColor: colors.warning,
  },
  dismissButton: {
    backgroundColor: colors.accent,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
});
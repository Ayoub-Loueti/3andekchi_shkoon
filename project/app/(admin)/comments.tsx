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
import { Search, MessageSquare, Trash2, Shield, Eye, Calendar, User, X, TriangleAlert as AlertTriangle, Flag } from 'lucide-react-native';

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

const mockReportedComments = [
  {
    id: 1,
    content: 'This is a scam! Don\'t trust this person. They took my money and disappeared.',
    author: {
      name: 'Angry User',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 1,
    },
    post: {
      title: 'Babysitter needed urgently',
      id: 1,
    },
    reportedDate: '2024-03-15',
    reportCount: 5,
    reportReasons: ['Harassment', 'False accusations', 'Inappropriate language'],
    status: 'pending',
  },
  {
    id: 2,
    content: 'Hey beautiful, forget about the job. Let\'s meet privately 😘',
    author: {
      name: 'Inappropriate User',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 2,
    },
    post: {
      title: 'House cleaning service',
      id: 2,
    },
    reportedDate: '2024-03-14',
    reportCount: 8,
    reportReasons: ['Sexual harassment', 'Inappropriate content', 'Unwanted advances'],
    status: 'pending',
  },
  {
    id: 3,
    content: 'I can do this job for half the price! Contact me directly.',
    author: {
      name: 'Competitor User',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 3,
    },
    post: {
      title: 'Math tutoring needed',
      id: 3,
    },
    reportedDate: '2024-03-13',
    reportCount: 2,
    reportReasons: ['Spam', 'Solicitation'],
    status: 'reviewed',
  },
  {
    id: 4,
    content: 'This platform is terrible! Everyone here is a fraud. Use XYZ platform instead.',
    author: {
      name: 'Spam Account',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 4,
    },
    post: {
      title: 'Delivery service needed',
      id: 4,
    },
    reportedDate: '2024-03-12',
    reportCount: 3,
    reportReasons: ['Spam', 'Promoting competitors', 'Negative campaigning'],
    status: 'pending',
  },
];

const statusOptions = [
  { id: 'all', label: 'All Reports', count: 4 },
  { id: 'pending', label: 'Pending', count: 3 },
  { id: 'reviewed', label: 'Reviewed', count: 1 },
  { id: 'resolved', label: 'Resolved', count: 0 },
];

export default function CommentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedComment, setSelectedComment] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);

  const filteredComments = mockReportedComments.filter(comment => {
    const matchesSearch = 
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.post.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || comment.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCommentAction = (action, comment) => {
    switch (action) {
      case 'delete':
        Alert.alert(
          'Delete Comment',
          'Are you sure you want to delete this comment?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
              Alert.alert('Success', 'Comment has been deleted');
              setShowCommentModal(false);
            }}
          ]
        );
        break;
      case 'blockUser':
        Alert.alert(
          'Block User',
          `Are you sure you want to block ${comment.author.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Block', style: 'destructive', onPress: () => {
              Alert.alert('Success', 'User has been blocked');
              setShowCommentModal(false);
            }}
          ]
        );
        break;
      case 'dismiss':
        Alert.alert('Success', 'Report has been dismissed');
        setShowCommentModal(false);
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
        <Text style={styles.headerTitle}>Reported Comments</Text>
        <Text style={styles.headerSubtitle}>
          Review and moderate reported comments
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#8E8E93" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search reported comments..."
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

      {/* Comments List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <Text style={styles.resultsCount}>
            {filteredComments.length} reported comments
          </Text>
        </View>

        {filteredComments.map((comment) => (
          <TouchableOpacity 
            key={comment.id} 
            style={styles.commentCard}
            onPress={() => {
              setSelectedComment(comment);
              setShowCommentModal(true);
            }}
          >
            <View style={styles.commentHeader}>
              <View style={styles.severityIndicator}>
                <MessageSquare size={16} color={getSeverityColor(comment.reportCount)} strokeWidth={2} />
                <Text style={[styles.reportCount, { color: getSeverityColor(comment.reportCount) }]}>
                  {comment.reportCount} reports
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(comment.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(comment.status) }]}>
                  {comment.status}
                </Text>
              </View>
            </View>

            <View style={styles.commentContent}>
              <View style={styles.authorInfo}>
                <Image source={{ uri: comment.author.avatar }} style={styles.authorAvatar} />
                <View style={styles.authorDetails}>
                  <Text style={styles.authorName}>{comment.author.name}</Text>
                  <Text style={styles.postTitle}>on "{comment.post.title}"</Text>
                </View>
              </View>

              <View style={styles.commentText}>
                <Text style={styles.commentContent} numberOfLines={3}>
                  {comment.content}
                </Text>
              </View>

              <View style={styles.commentMeta}>
                <View style={styles.metaItem}>
                  <Calendar size={14} color="#8E8E93" strokeWidth={2} />
                  <Text style={styles.metaText}>Reported {comment.reportedDate}</Text>
                </View>
              </View>
            </View>

            <View style={styles.reportReasons}>
              <Text style={styles.reasonsLabel}>Report reasons:</Text>
              <Text style={styles.reasonsText}>
                {comment.reportReasons.join(', ')}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {filteredComments.length === 0 && (
          <View style={styles.emptyState}>
            <MessageSquare size={48} color="#8E8E93" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No reported comments</Text>
            <Text style={styles.emptyDescription}>
              All comments are clean or try adjusting your filters
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Comment Details Modal */}
      <Modal
        visible={showCommentModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCommentModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Comment Details</Text>
            <TouchableOpacity 
              onPress={() => setShowCommentModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {selectedComment && (
            <ScrollView style={styles.modalContent}>
              {/* Comment Content */}
              <View style={styles.modalCommentSection}>
                <Text style={styles.modalCommentTitle}>Reported Comment</Text>
                <View style={styles.commentBubble}>
                  <Text style={styles.modalCommentText}>{selectedComment.content}</Text>
                </View>
                <Text style={styles.postContext}>
                  Comment on: "{selectedComment.post.title}"
                </Text>
              </View>

              {/* Author Information */}
              <View style={styles.authorSection}>
                <Text style={styles.sectionTitle}>Comment Author</Text>
                <View style={styles.authorCard}>
                  <Image source={{ uri: selectedComment.author.avatar }} style={styles.modalAuthorAvatar} />
                  <View style={styles.authorDetails}>
                    <Text style={styles.modalAuthorName}>{selectedComment.author.name}</Text>
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
                    <AlertTriangle size={20} color={getSeverityColor(selectedComment.reportCount)} strokeWidth={2} />
                    <Text style={styles.reportTitle}>
                      {selectedComment.reportCount} reports received
                    </Text>
                  </View>
                  <Text style={styles.reportDate}>
                    First reported on {selectedComment.reportedDate}
                  </Text>
                  <View style={styles.reasonsList}>
                    <Text style={styles.reasonsTitle}>Reasons:</Text>
                    {selectedComment.reportReasons.map((reason, index) => (
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
                  onPress={() => handleCommentAction('delete', selectedComment)}
                >
                  <Trash2 size={20} color="white" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Delete Comment</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionButton, styles.blockButton]}
                  onPress={() => handleCommentAction('blockUser', selectedComment)}
                >
                  <Shield size={20} color="white" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Block User</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionButton, styles.dismissButton]}
                  onPress={() => handleCommentAction('dismiss', selectedComment)}
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
  commentCard: {
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
  commentHeader: {
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
  commentContent: {
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
  },
  postTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.primary,
  },
  commentText: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  commentMeta: {
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
  modalCommentSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  modalCommentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 12,
  },
  commentBubble: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalCommentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text,
    lineHeight: 20,
  },
  postContext: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
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
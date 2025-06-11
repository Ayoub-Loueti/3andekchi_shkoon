import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Clock, Users, Star } from 'lucide-react-native';
import { Task } from '../types';
import { Colors, Spacing, BorderRadius } from '../constants/Colors';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
}

export function TaskCard({ task, onPress }: TaskCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      babysitting: Colors.secondary,
      gardening: Colors.success,
      tutoring: Colors.accent,
      cleaning: Colors.primary,
      repairs: Colors.error,
      delivery: Colors.secondary,
      tech: Colors.accent,
      other: Colors.mediumGray,
    };
    return colors[category] || Colors.mediumGray;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {task.images && task.images.length > 0 && (
        <Image source={{ uri: task.images[0] }} style={styles.image} />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(task.category) }]}>
            <Text style={styles.categoryText}>{task.category}</Text>
          </View>
          <Text style={styles.budget}>{task.budget} TND</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>{task.title}</Text>
        <Text style={styles.description} numberOfLines={3}>{task.description}</Text>

        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={Colors.mediumGray} />
            <Text style={styles.location}>{task.location}</Text>
          </View>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={14} color={Colors.mediumGray} />
              <Text style={styles.metaText}>{formatTimeAgo(task.postedAt)}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Users size={14} color={Colors.mediumGray} />
              <Text style={styles.metaText}>{task.applicants}</Text>
            </View>
          </View>
        </View>

        <View style={styles.posterInfo}>
          <Image source={{ uri: task.postedBy.avatar }} style={styles.avatar} />
          <View style={styles.posterDetails}>
            <Text style={styles.posterName}>{task.postedBy.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={12} color={Colors.secondary} fill={Colors.secondary} />
              <Text style={styles.rating}>{task.postedBy.rating}</Text>
              <Text style={styles.reviewCount}>({task.postedBy.reviewCount})</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  budget: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: 14,
    color: Colors.darkGray,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  footer: {
    marginBottom: Spacing.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  location: {
    fontSize: 12,
    color: Colors.mediumGray,
    marginLeft: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: Colors.mediumGray,
    marginLeft: 4,
  },
  posterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  posterDetails: {
    flex: 1,
  },
  posterName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: Colors.mediumGray,
    marginLeft: 2,
  },
});
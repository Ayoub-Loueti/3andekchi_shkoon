import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { TaskCard } from '../../components/TaskCard';
import { CategoryFilter } from '../../components/CategoryFilter';
import { SearchBar } from '../../components/SearchBar';
import { mockTasks } from '../../data/mockData';
import { TaskCategory } from '../../types';
import { Colors, Spacing, BorderRadius } from '../../constants/Colors';
import { SlidersHorizontal, MapPin, DollarSign, Clock } from 'lucide-react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'budget' | 'distance'>('recent');

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'budget':
        return b.budget - a.budget;
      case 'distance':
        return a.location.localeCompare(b.location);
      case 'recent':
      default:
        return b.postedAt.getTime() - a.postedAt.getTime();
    }
  });

  const handleTaskPress = (taskId: string) => {
    console.log('Navigate to task:', taskId);
  };

  const handleFilterPress = () => {
    console.log('Open advanced filters');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Tasks</Text>
        <Text style={styles.subtitle}>Find the perfect opportunity</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={handleFilterPress}
        placeholder="Search by title, description, or location..."
      />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Sort Options */}
      <View style={styles.sortSection}>
        <View style={styles.sortHeader}>
          <SlidersHorizontal size={16} color={Colors.mediumGray} />
          <Text style={styles.sortTitle}>Sort by:</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortOptions}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'recent' && styles.activeSortButton]}
            onPress={() => setSortBy('recent')}
          >
            <Clock size={14} color={sortBy === 'recent' ? Colors.white : Colors.mediumGray} />
            <Text style={[styles.sortButtonText, sortBy === 'recent' && styles.activeSortButtonText]}>
              Recent
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'budget' && styles.activeSortButton]}
            onPress={() => setSortBy('budget')}
          >
            <DollarSign size={14} color={sortBy === 'budget' ? Colors.white : Colors.mediumGray} />
            <Text style={[styles.sortButtonText, sortBy === 'budget' && styles.activeSortButtonText]}>
              Budget
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'distance' && styles.activeSortButton]}
            onPress={() => setSortBy('distance')}
          >
            <MapPin size={14} color={sortBy === 'distance' ? Colors.white : Colors.mediumGray} />
            <Text style={[styles.sortButtonText, sortBy === 'distance' && styles.activeSortButtonText]}>
              Location
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => handleTaskPress(task.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No tasks found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search terms or filters
            </Text>
          </View>
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>
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
  sortSection: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  sortHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sortTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.mediumGray,
    marginLeft: Spacing.xs,
    fontFamily: 'Inter-Medium',
  },
  sortOptions: {
    paddingLeft: Spacing.md,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
  },
  activeSortButton: {
    backgroundColor: Colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.mediumGray,
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
  activeSortButtonText: {
    color: Colors.white,
  },
  resultsHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.darkGray,
    fontFamily: 'Inter-Regular',
  },
  scrollView: {
    flex: 1,
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
    fontFamily: 'Inter-SemiBold',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.mediumGray,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  bottomPadding: {
    height: Spacing.xxl,
  },
});
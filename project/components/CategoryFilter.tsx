import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TaskCategory } from '../types';
import { Colors, Spacing, BorderRadius } from '../constants/Colors';

interface CategoryFilterProps {
  selectedCategory: TaskCategory | 'all';
  onCategorySelect: (category: TaskCategory | 'all') => void;
}

const categories: Array<{ key: TaskCategory | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'babysitting', label: 'Babysitting' },
  { key: 'gardening', label: 'Gardening' },
  { key: 'tutoring', label: 'Tutoring' },
  { key: 'cleaning', label: 'Cleaning' },
  { key: 'repairs', label: 'Repairs' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'tech', label: 'Tech' },
  { key: 'other', label: 'Other' },
];

export function CategoryFilter({ selectedCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryButton,
              selectedCategory === category.key && styles.selectedCategory,
            ]}
            onPress={() => onCategorySelect(category.key)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.key && styles.selectedCategoryText,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
  },
  categoryButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.darkGray,
  },
  selectedCategoryText: {
    color: Colors.white,
  },
});
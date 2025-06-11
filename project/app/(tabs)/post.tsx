import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { TaskCategory } from '../../types';
import { Colors, Spacing, BorderRadius } from '../../constants/Colors';
import { Camera, MapPin,Clock, DollarSign, Calendar, Tag } from 'lucide-react-native';

const categories: Array<{ key: TaskCategory; label: string; emoji: string }> = [
  { key: 'babysitting', label: 'Babysitting', emoji: '👶' },
  { key: 'gardening', label: 'Gardening', emoji: '🌱' },
  { key: 'tutoring', label: 'Tutoring', emoji: '📚' },
  { key: 'cleaning', label: 'Cleaning', emoji: '🧹' },
  { key: 'repairs', label: 'Repairs', emoji: '🔧' },
  { key: 'delivery', label: 'Delivery', emoji: '📦' },
  { key: 'tech', label: 'Tech Support', emoji: '💻' },
  { key: 'other', label: 'Other', emoji: '⭐' },
];

const colors = {
  primary: '#2A4D69',
  secondary: '#FFC857',
  accent: '#58B09C',
  background: '#F7F9FB',
  text: '#333333',
  success: '#4CAF50',
  error: '#EF5350',
};
export default function PostTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory | null>(null);
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [tags, setTags] = useState('');
 const [isHourly, setIsHourly] = useState(true);

  const handleSubmit = () => {
    if (!title || !description || !category || !budget || !location) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // Here you would typically submit to your backend
    Alert.alert(
      'Task Posted!', 
      'Your task has been posted successfully. You will receive notifications when people apply.',
      [{ text: 'OK', onPress: () => {
        // Reset form
        setTitle('');
        setDescription('');
        setCategory(null);
        setBudget('');
        setLocation('');
        setDeadline('');
        setTags('');
      }}]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Post a Task</Text>
        <Text style={styles.subtitle}>Get help from your community</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Task Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Need babysitter for weekend"
              placeholderTextColor={Colors.mediumGray}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe what you need help with, requirements, and any important details..."
              placeholderTextColor={Colors.mediumGray}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryButton,
                    category === cat.key && styles.selectedCategory,
                  ]}
                  onPress={() => setCategory(cat.key)}
                >
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat.key && styles.selectedCategoryText,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

  {/* Budget */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget *</Text>
            
            {/* Budget Type Toggle */}
            <View style={styles.budgetTypeContainer}>
              <TouchableOpacity
                style={[styles.budgetTypeButton, isHourly && styles.budgetTypeButtonActive]}
                onPress={() => setIsHourly(true)}
              >
                <Clock size={16} color={isHourly ? 'white' : colors.primary} strokeWidth={2} />
                <Text style={[
                  styles.budgetTypeText,
                  isHourly && styles.budgetTypeTextActive
                ]}>
                  Per Hour
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.budgetTypeButton, !isHourly && styles.budgetTypeButtonActive]}
                onPress={() => setIsHourly(false)}
              >
                <DollarSign size={16} color={!isHourly ? 'white' : colors.primary} strokeWidth={2} />
                <Text style={[
                  styles.budgetTypeText,
                  !isHourly && styles.budgetTypeTextActive
                ]}>
                  Fixed Price
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputWithIcon}>
              <DollarSign size={20} color="#8E8E93" strokeWidth={2} style={{ marginLeft: 12 }} />
              <TextInput
                style={styles.textInputWithIcon}
                placeholder={isHourly ? "e.g., 25" : "e.g., 100"}
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
                placeholderTextColor="#8E8E93"
              />
              <Text style={styles.currencyText}>TND{isHourly ? '/hr' : ''}</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={20} color={Colors.mediumGray} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputWithPadding]}
                value={location}
                onChangeText={setLocation}
                placeholder="e.g., Tunis, Tunisia"
                placeholderTextColor={Colors.mediumGray}
              />
            </View>
          </View>

          {/* Deadline */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deadline (Optional)</Text>
            <View style={styles.inputWithIcon}>
              <Calendar size={20} color={Colors.mediumGray} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputWithPadding]}
                value={deadline}
                onChangeText={setDeadline}
                placeholder="When do you need this done?"
                placeholderTextColor={Colors.mediumGray}
              />
            </View>
          </View>

          {/* Tags */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tags (Optional)</Text>
            <View style={styles.inputWithIcon}>
              <Tag size={20} color={Colors.mediumGray} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputWithPadding]}
                value={tags}
                onChangeText={setTags}
                placeholder="e.g., urgent, experienced, weekend"
                placeholderTextColor={Colors.mediumGray}
              />
            </View>
            <Text style={styles.helperText}>Separate tags with commas</Text>
          </View>

          {/* Add Photos */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Photos (Optional)</Text>
            <TouchableOpacity style={styles.photoButton}>
              <Camera size={24} color={Colors.primary} />
              <Text style={styles.photoButtonText}>Add Photos</Text>
              <Text style={styles.photoButtonSubtext}>Help others understand your task better</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Post Task</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            By posting a task, you agree to our terms of service and community guidelines.
          </Text>
        </View>
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
  scrollView: {
    flex: 1,
  },
  form: {
    padding: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
   textInputWithIcon: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 12,
  },
   budgetTypeContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
   budgetTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  budgetTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  budgetTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
    marginLeft: 4,
  },
  budgetTypeTextActive: {
    color: 'white',
  },
   currencyText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    marginLeft: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    height: 100,
    paddingTop: Spacing.md,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  inputIcon: {
    position: 'absolute',
    left: Spacing.md,
    top: Spacing.md + 2,
    zIndex: 1,
  },
  inputWithPadding: {
    paddingLeft: Spacing.xxl + Spacing.sm,
  },
  categoryScroll: {
    marginTop: Spacing.sm,
  },
  categoryButton: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginRight: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    minWidth: 80,
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.darkGray,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  selectedCategoryText: {
    color: Colors.white,
  },
  helperText: {
    fontSize: 12,
    color: Colors.mediumGray,
    marginTop: Spacing.xs,
    fontFamily: 'Inter-Regular',
  },
  photoButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: Spacing.sm,
    fontFamily: 'Inter-SemiBold',
  },
  photoButtonSubtext: {
    fontSize: 12,
    color: Colors.mediumGray,
    marginTop: Spacing.xs,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    fontFamily: 'Inter-SemiBold',
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.mediumGray,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 16,
    fontFamily: 'Inter-Regular',
  },
});
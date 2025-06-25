import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { TrendingUp, Users, MessageSquare, Flag, Calendar, ChartBar as BarChart3, ChartPie as PieChart, Activity } from 'lucide-react-native';

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

const timeRanges = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'quarter', label: 'This Quarter' },
  { id: 'year', label: 'This Year' },
];

const overviewStats = [
  {
    title: 'Total Users',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: colors.primary,
  },
  {
    title: 'Active Posts',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: MessageSquare,
    color: colors.accent,
  },
  {
    title: 'Reports Handled',
    value: '89',
    change: '-15.3%',
    trend: 'down',
    icon: Flag,
    color: colors.warning,
  },
  {
    title: 'Platform Growth',
    value: '23.4%',
    change: '+5.1%',
    trend: 'up',
    icon: TrendingUp,
    color: colors.success,
  },
];

const userGrowthData = [
  { month: 'Jan', users: 1200 },
  { month: 'Feb', users: 1450 },
  { month: 'Mar', users: 1680 },
  { month: 'Apr', users: 1920 },
  { month: 'May', users: 2150 },
  { month: 'Jun', users: 2380 },
  { month: 'Jul', users: 2620 },
  { month: 'Aug', users: 2847 },
];

const categoryDistribution = [
  { category: 'Babysitting', percentage: 28, color: '#FF6B9D' },
  { category: 'Home Repair', percentage: 22, color: '#4ECDC4' },
  { category: 'Tutoring', percentage: 18, color: '#45B7D1' },
  { category: 'Cleaning', percentage: 15, color: '#96CEB4' },
  { category: 'Delivery', percentage: 10, color: '#FFEAA7' },
  { category: 'Other', percentage: 7, color: '#DDA0DD' },
];

const recentActivity = [
  {
    id: 1,
    type: 'user_blocked',
    description: 'User "Ahmed Suspect" was blocked for inappropriate behavior',
    timestamp: '2 hours ago',
    severity: 'high',
  },
  {
    id: 2,
    type: 'post_deleted',
    description: 'Post "Quick cash job" was deleted due to suspicious content',
    timestamp: '4 hours ago',
    severity: 'medium',
  },
  {
    id: 3,
    type: 'user_registered',
    description: '15 new users registered today',
    timestamp: '6 hours ago',
    severity: 'low',
  },
  {
    id: 4,
    type: 'report_resolved',
    description: 'Comment report was resolved and dismissed',
    timestamp: '8 hours ago',
    severity: 'low',
  },
];

export default function AnalyticsScreen() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_blocked': return Flag;
      case 'post_deleted': return MessageSquare;
      case 'user_registered': return Users;
      case 'report_resolved': return Activity;
      default: return Activity;
    }
  };

  const getActivityColor = (severity) => {
    switch (severity) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.accent;
    }
  };

  const maxUsers = Math.max(...userGrowthData.map(d => d.users));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Platform insights and performance metrics
          </Text>

          {/* Time Range Selector */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.timeRangeContainer}
          >
            {timeRanges.map((range) => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.timeRangeChip,
                  selectedTimeRange === range.id && styles.timeRangeChipActive
                ]}
                onPress={() => setSelectedTimeRange(range.id)}
              >
                <Text style={[
                  styles.timeRangeText,
                  selectedTimeRange === range.id && styles.timeRangeTextActive
                ]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {overviewStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                    <stat.icon size={20} color={stat.color} strokeWidth={2} />
                  </View>
                  <View style={[
                    styles.changeIndicator,
                    { backgroundColor: stat.trend === 'up' ? colors.success + '20' : colors.error + '20' }
                  ]}>
                    <TrendingUp 
                      size={12} 
                      color={stat.trend === 'up' ? colors.success : colors.error} 
                      strokeWidth={2}
                      style={stat.trend === 'down' && { transform: [{ rotate: '180deg' }] }}
                    />
                    <Text style={[
                      styles.changeText,
                      { color: stat.trend === 'up' ? colors.success : colors.error }
                    ]}>
                      {stat.change}
                    </Text>
                  </View>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* User Growth Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Growth</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <BarChart3 size={20} color={colors.primary} strokeWidth={2} />
              <Text style={styles.chartTitle}>Monthly User Registration</Text>
            </View>
            <View style={styles.chart}>
              {userGrowthData.map((data, index) => (
                <View key={index} style={styles.chartBar}>
                  <View 
                    style={[
                      styles.bar,
                      { 
                        height: (data.users / maxUsers) * 100,
                        backgroundColor: colors.primary 
                      }
                    ]}
                  />
                  <Text style={styles.barLabel}>{data.month}</Text>
                  <Text style={styles.barValue}>{data.users}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Category Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Categories</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <PieChart size={20} color={colors.accent} strokeWidth={2} />
              <Text style={styles.chartTitle}>Category Distribution</Text>
            </View>
            <View style={styles.categoryList}>
              {categoryDistribution.map((category, index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                    <Text style={styles.categoryName}>{category.category}</Text>
                  </View>
                  <View style={styles.categoryPercentage}>
                    <Text style={styles.percentageText}>{category.percentage}%</Text>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progress,
                          { 
                            width: `${category.percentage}%`,
                            backgroundColor: category.color 
                          }
                        ]}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            {recentActivity.map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={[
                    styles.activityIcon,
                    { backgroundColor: getActivityColor(activity.severity) + '20' }
                  ]}>
                    <IconComponent 
                      size={16} 
                      color={getActivityColor(activity.severity)} 
                      strokeWidth={2} 
                    />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityDescription}>
                      {activity.description}
                    </Text>
                    <Text style={styles.activityTimestamp}>
                      {activity.timestamp}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
  timeRangeContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  timeRangeChip: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  timeRangeChipActive: {
    backgroundColor: colors.primary,
  },
  timeRangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.text,
  },
  timeRangeTextActive: {
    color: 'white',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  changeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    marginLeft: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: colors.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginLeft: 8,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: 8,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    backgroundColor: colors.primary,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 8,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  categoryList: {
    marginTop: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.text,
  },
  categoryPercentage: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  percentageText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: colors.text,
    marginBottom: 4,
  },
  progressBar: {
    width: 50,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  activityTimestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
});
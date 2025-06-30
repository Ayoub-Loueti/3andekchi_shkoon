import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database,
  Users,
  MessageSquare,
  Flag,
  Download,
  Upload,
  Trash2,
  LogOut,
  ChevronRight
} from 'lucide-react-native';

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

// Define types for settings
type SettingValue = boolean;
interface SettingsState {
  user_registration: SettingValue;
  post_moderation: SettingValue;
  auto_flagging: SettingValue;
  email_notifications: SettingValue;
  report_alerts: SettingValue;
  [key: string]: SettingValue;
}
type SettingType = 'toggle' | 'action' | 'danger';
interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: SettingType;
  value?: SettingValue;
  icon: React.ComponentType<any>;
}
interface SettingsGroup {
  title: string;
  items: SettingItem[];
}

const settingsGroups: SettingsGroup[] = [
  {
    title: 'Platform Settings',
    items: [
      {
        id: 'user_registration',
        title: 'User Registration',
        description: 'Allow new users to register',
        type: 'toggle',
        value: true,
        icon: Users,
      },
      {
        id: 'post_moderation',
        title: 'Post Moderation',
        description: 'Require approval for new posts',
        type: 'toggle',
        value: false,
        icon: MessageSquare,
      },
      {
        id: 'auto_flagging',
        title: 'Auto-flagging',
        description: 'Automatically flag suspicious content',
        type: 'toggle',
        value: true,
        icon: Flag,
      },
    ],
  },
  {
    title: 'Notifications',
    items: [
      {
        id: 'email_notifications',
        title: 'Email Notifications',
        description: 'Send admin notifications via email',
        type: 'toggle',
        value: true,
        icon: Bell,
      },
      {
        id: 'report_alerts',
        title: 'Report Alerts',
        description: 'Instant alerts for new reports',
        type: 'toggle',
        value: true,
        icon: Shield,
      },
    ],
  },
  {
    title: 'Data Management',
    items: [
      {
        id: 'export_data',
        title: 'Export Data',
        description: 'Download platform data',
        type: 'action',
        icon: Download,
      },
      {
        id: 'import_data',
        title: 'Import Data',
        description: 'Upload data to platform',
        type: 'action',
        icon: Upload,
      },
      {
        id: 'backup_database',
        title: 'Backup Database',
        description: 'Create database backup',
        type: 'action',
        icon: Database,
      },
    ],
  },
  {
    title: 'Danger Zone',
    items: [
      {
        id: 'clear_reports',
        title: 'Clear All Reports',
        description: 'Remove all resolved reports',
        type: 'danger',
        icon: Trash2,
      },
      {
        id: 'reset_analytics',
        title: 'Reset Analytics',
        description: 'Clear all analytics data',
        type: 'danger',
        icon: Trash2,
      },
    ],
  },
];

export default function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsState>({
    user_registration: true,
    post_moderation: false,
    auto_flagging: true,
    email_notifications: true,
    report_alerts: true,
  });

  const handleToggle = (settingId: string) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId]
    }));
  };

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'export_data':
        Alert.alert('Export Data', 'Data export will begin shortly. You will receive an email when complete.');
        break;
      case 'import_data':
        Alert.alert('Import Data', 'Please select the data file to import.');
        break;
      case 'backup_database':
        Alert.alert('Database Backup', 'Database backup has been initiated.');
        break;
      case 'clear_reports':
        Alert.alert(
          'Clear All Reports',
          'This will permanently delete all resolved reports. This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: () => {
              Alert.alert('Success', 'All resolved reports have been cleared.');
            }}
          ]
        );
        break;
      case 'reset_analytics':
        Alert.alert(
          'Reset Analytics',
          'This will permanently delete all analytics data. This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset', style: 'destructive', onPress: () => {
              Alert.alert('Success', 'Analytics data has been reset.');
            }}
          ]
        );
        break;
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of the admin panel?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: async () => {
          try {
            await AsyncStorage.clear();
            router.replace('/(auth)/login');
          } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Error', 'Could not sign out. Please try again.');
          }
        }}
      ]
    );
  };

  const renderSettingItem = (item: SettingItem) => {
    switch (item.type) {
      case 'toggle':
        return (
          <View key={item.id} style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
                <item.icon size={20} color={colors.primary} strokeWidth={2} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingDescription}>{item.description}</Text>
              </View>
            </View>
            <Switch
              value={settings[item.id]}
              onValueChange={() => handleToggle(item.id)}
              trackColor={{ false: '#E5E5EA', true: colors.accent }}
              thumbColor="white"
            />
          </View>
        );
      
      case 'action':
        return (
          <TouchableOpacity 
            key={item.id} 
            style={styles.settingItem}
            onPress={() => handleAction(item.id)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: colors.accent + '20' }]}>
                <item.icon size={20} color={colors.accent} strokeWidth={2} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingDescription}>{item.description}</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#8E8E93" strokeWidth={2} />
          </TouchableOpacity>
        );
      
      case 'danger':
        return (
          <TouchableOpacity 
            key={item.id} 
            style={styles.settingItem}
            onPress={() => handleAction(item.id)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: colors.error + '20' }]}>
                <item.icon size={20} color={colors.error} strokeWidth={2} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.error }]}>{item.title}</Text>
                <Text style={styles.settingDescription}>{item.description}</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#8E8E93" strokeWidth={2} />
          </TouchableOpacity>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Settings</Text>
          <Text style={styles.headerSubtitle}>
            Configure platform settings and preferences
          </Text>
        </View>

        {/* Settings Groups */}
        <View style={styles.content}>
          {settingsGroups.map((group, groupIndex) => (
            <View key={groupIndex} style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <View style={styles.groupCard}>
                {group.items.map((item, itemIndex) => (
                  <View key={item.id}>
                    {renderSettingItem(item)}
                    {itemIndex < group.items.length - 1 && <View style={styles.separator} />}
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="white" strokeWidth={2} />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appName}>3andekchi Shkoon Admin</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.buildInfo}>Build 2024.03.15</Text>
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
    paddingBottom: 24,
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
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  settingsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 12,
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 64,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginLeft: 10,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  appName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 2,
  },
  buildInfo: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
});
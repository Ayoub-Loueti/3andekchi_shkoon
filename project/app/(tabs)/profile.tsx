import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, Star, MapPin, Calendar, Award, Shield, Bell, CreditCard, CircleHelp as HelpCircle, LogOut, CreditCard as Edit3, Camera, ChevronRight, User, Briefcase } from 'lucide-react-native';

interface MenuItem {
  id: number;
  title: string;
  icon: any;
  color: string;
  badge?: string;
  toggle?: boolean;
  action?: string;
}

const colors = {
  primary: '#2A4D69',
  secondary: '#FFC857',
  accent: '#58B09C',
  background: '#F7F9FB',
  text: '#333333',
  success: '#4CAF50',
  error: '#EF5350',
};

const stats = [
  { label: 'Jobs Completed', value: '23', icon: Briefcase },
  { label: 'Rating', value: '4.9', icon: Star },
  { label: 'Response Rate', value: '98%', icon: Award },
];

const menuItems = [
  {
    section: 'Account',
    items: [
      { id: 1, title: 'Edit Profile', icon: Edit3, color: colors.primary, action: 'edit-profile' },
      { id: 2, title: 'Verification', icon: Shield, color: colors.accent, badge: 'Verified' },
      { id: 3, title: 'Payment Methods', icon: CreditCard, color: colors.secondary },
    ]
  },
  {
    section: 'Preferences',
    items: [
      { id: 4, title: 'Notifications', icon: Bell, color: colors.primary, toggle: true },
      { id: 5, title: 'Location Services', icon: MapPin, color: colors.accent, toggle: true },
    ]
  },
  {
    section: 'Support',
    items: [
      { id: 6, title: 'Help Center', icon: HelpCircle, color: colors.primary },
      { id: 7, title: 'Settings', icon: Settings, color: '#8E8E93' },
      { id: 8, title: 'Sign Out', icon: LogOut, color: colors.error },
    ]
  }
];

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [userInfo, setUserInfo] = useState({
    nom: '',
    prenom: '',
    mail: '',
    numero: '',
    location: '',
    avatar: '',
    rate: 0,
    createdAt: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const getMyInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/(auth)/login');
        return;
      }

      const response = await fetch('http://localhost:5000/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.clear();
          router.replace('/(auth)/login');
          return;
        }
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      setUserInfo({
        nom: data.nom || '',
        prenom: data.prenom || '',
        mail: data.mail || '',
        numero: data.numero || '',
        location: data.location || '',
        avatar: data.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        rate: data.rate || 0,
        createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'March 2024'
      });
    } catch (error) {
      console.error('Error fetching user info:', error);
      Alert.alert('Error', 'Failed to load user information');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyInfo();
  }, []);

  const handleMenuItemPress = async (item: MenuItem) => {
    if (item.action === 'edit-profile') {
      router.push('/(tabs)/edit-profile');
    } else if (item.title === 'Sign Out') {
      try {
        await AsyncStorage.clear();
        router.replace('/(auth)/login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
    // Handle other menu items here
  };

  const renderMenuItem = (item: MenuItem) => {
    if (item.toggle) {
      return (
        <View key={item.id} style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuItemIcon, { backgroundColor: item.color + '20' }]}>
              <item.icon size={20} color={item.color} strokeWidth={2} />
            </View>
            <Text style={styles.menuItemText}>{item.title}</Text>
          </View>
          <Switch
            value={item.id === 4 ? notificationsEnabled : locationEnabled}
            onValueChange={item.id === 4 ? setNotificationsEnabled : setLocationEnabled}
            trackColor={{ false: '#E5E5EA', true: colors.accent }}
            thumbColor="white"
          />
        </View>
      );
    }

    return (
      <TouchableOpacity 
        key={item.id} 
        style={styles.menuItem}
        onPress={() => handleMenuItemPress(item)}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuItemIcon, { backgroundColor: item.color + '20' }]}>
            <item.icon size={20} color={item.color} strokeWidth={2} />
          </View>
          <Text style={styles.menuItemText}>{item.title}</Text>
        </View>
        <View style={styles.menuItemRight}>
          {item.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
          <ChevronRight size={16} color="#8E8E93" strokeWidth={2} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ 
                  uri: userInfo.avatar 
                    ? `http://localhost:5000${userInfo.avatar}`
                    : 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
                }} 
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color="white" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{`${userInfo.prenom} ${userInfo.nom}`}</Text>
              <View style={styles.locationContainer}>
                <MapPin size={14} color="#8E8E93" strokeWidth={2} />
                <Text style={styles.location}>{userInfo.location}</Text>
              </View>
              <View style={styles.joinedContainer}>
                <Calendar size={14} color="#8E8E93" strokeWidth={2} />
                <Text style={styles.joined}>Joined {userInfo.createdAt}</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: colors.accent + '20' }]}>
                  <stat.icon size={16} color={colors.accent} strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>
                  {stat.label === 'Rating' ? userInfo.rate.toFixed(1) : stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.content}>
          {menuItems.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.sectionTitle}>{section.section}</Text>
              <View style={styles.menuCard}>
                {section.items.map((item, itemIndex) => (
                  <View key={item.id}>
                    {renderMenuItem(item)}
                    {itemIndex < section.items.length - 1 && <View style={styles.separator} />}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>3andekchi Shkoon</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: colors.text,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginLeft: 4,
  },
  joinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joined: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 64,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
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
  },
});
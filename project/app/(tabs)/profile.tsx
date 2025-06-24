import React, { useState, useEffect, useCallback } from 'react';
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
  Modal,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, Star, MapPin, Calendar, Award, Shield, Bell, CreditCard, CircleHelp as HelpCircle, LogOut, CreditCard as Edit3, Camera, ChevronRight, User, Briefcase, Upload, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

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

const availableAvatars = [
  '/uploads/avatarHomme1.png',
  '/uploads/avatarHomme2.png',
  '/uploads/avatarHomme3.png',
  '/uploads/avatarFemme1.png',
  '/uploads/avatarFemme2.png',
  '/uploads/avatarFemme3.png',
];

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
    createdAt: '',
    genre: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images.');
      }
    }
  };
  
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
        createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'March 2024',
        genre: data.genre || '',
      });
    } catch (error) {
      console.error('Error fetching user info:', error);
      Alert.alert('Error', 'Failed to load user information');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getMyInfo();
      requestPermissions();
    }, [])
  );

  const handleAvatarSelect = async (selectedAvatar: string) => {
    // Optimistically update UI
    setUserInfo(prev => ({ ...prev, avatar: selectedAvatar }));
    setShowAvatarModal(false);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/(auth)/login');
        return;
      }
      
      const meResponse = await axios.get('http://localhost:5000/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const clientId = meResponse.data._id;

      if (!clientId) {
        Alert.alert('Error', 'User ID not found.');
        // Revert UI change
        await getMyInfo(); 
        return;
      }

      await axios.put(
        `http://localhost:5000/users/clients/${clientId}`,
        { avatar: selectedAvatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Alert.alert('Success', 'Avatar updated successfully.');
    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert('Error', 'Failed to update avatar. Please try again.');
      // Revert UI change by refetching profile
      getMyInfo();
    }
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadCustomImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const uploadCustomImage = async (imageAsset: any) => {
    setUploadingImage(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/(auth)/login');
        return;
      }

      const formData = new FormData();
      if (Platform.OS === 'web') {
        const response = await fetch(imageAsset.uri);
        const blob = await response.blob();
        formData.append('avatar', blob, imageAsset.fileName || `avatar_${Date.now()}.jpg`);
      } else {
        formData.append('avatar', {
          uri: imageAsset.uri,
          type: imageAsset.mimeType || 'image/jpeg',
          name: imageAsset.fileName || `avatar_${Date.now()}.jpg`,
        } as any);
      }
      
      const response = await axios.post(
        'http://localhost:5000/users/upload-avatar',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const avatarPath = response.data.avatar;
      
      // Update local state
      setUserInfo(prev => ({ ...prev, avatar: avatarPath }));
      setShowAvatarModal(false);
      
      Alert.alert('Success', 'Custom avatar uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

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
              <TouchableOpacity style={styles.cameraButton} onPress={() => setShowAvatarModal(true)}>
                <Camera size={16} color="white" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{`${userInfo.prenom} ${userInfo.nom}`}</Text>
              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <User size={14} color="#8E8E93" strokeWidth={2} />
                  <Text style={styles.metaText}>{userInfo.genre}</Text>
                </View>
                <View style={styles.metaItem}>
                  <MapPin size={14} color="#8E8E93" strokeWidth={2} />
                  <Text style={styles.metaText}>{userInfo.location}</Text>
                </View>
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

      {/* Enhanced Avatar Selection Modal */}
      <Modal
        visible={showAvatarModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowAvatarModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Choose Avatar</Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView contentContainerStyle={styles.avatarModalContent}>
            {/* Default Avatars Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarSectionHeader}>
                <ImageIcon size={24} color={colors.primary} strokeWidth={2} />
                <Text style={styles.avatarSectionTitle}>Select an existing avatar</Text>
              </View>
              
              <View style={styles.avatarGrid}>
                {availableAvatars.map((avatarUri) => (
                  <TouchableOpacity 
                    key={avatarUri}
                    style={[
                      styles.avatarGridItem,
                      userInfo.avatar === avatarUri && styles.selectedAvatarItem
                    ]}
                    onPress={() => handleAvatarSelect(avatarUri)}
                  >
                    <Image 
                      source={{ uri: `http://localhost:5000${avatarUri}` }} 
                      style={styles.avatarGridImage}
                    />
                    {userInfo.avatar === avatarUri && (
                      <View style={styles.selectedOverlay}>
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Custom Image Upload Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarSectionHeader}>
                <Upload size={24} color={colors.accent} strokeWidth={2} />
                <Text style={styles.avatarSectionTitle}>Select an image from your library</Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.uploadButton, uploadingImage && styles.uploadButtonDisabled]}
                onPress={handleImagePicker}
                disabled={uploadingImage}
              >
                <View style={styles.uploadButtonContent}>
                  {uploadingImage ? (
                    <>
                      <View style={styles.uploadSpinner} />
                      <Text style={styles.uploadButtonText}>Uploading...</Text>
                    </>
                  ) : (
                    <>
                      <Camera size={32} color={colors.accent} strokeWidth={2} />
                      <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
                      <Text style={styles.uploadButtonSubtext}>Upload a custom profile picture</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>

              {/* Current Custom Avatar Preview */}
              {userInfo.avatar && !availableAvatars.includes(userInfo.avatar) && (
                <View style={styles.currentAvatarPreview}>
                  <Text style={styles.currentAvatarLabel}>Current custom avatar:</Text>
                  <View style={styles.currentAvatarContainer}>
                    <Image 
                      source={{ uri: `http://localhost:5000${userInfo.avatar}` }} 
                      style={styles.currentAvatarImage}
                    />
                    <View style={styles.selectedOverlay}>
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
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
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
  joinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
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
  modalCloseButton: {
    padding: 8,
  },
  modalCloseText: {
    fontSize: 16,
    color: colors.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  avatarModalContent: {
    padding: 20,
  },
  avatarSection: {
    marginBottom: 30,
  },
  avatarSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarGridItem: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 15,
    position: 'relative',
  },
  selectedAvatarItem: {
    transform: [{ scale: 0.95 }],
  },
  avatarGridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(42, 77, 105, 0.8)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  dividerText: {
    fontSize: 14,
    color: '#8E8E93',
    marginHorizontal: 16,
  },
  uploadButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.accent,
    borderStyle: 'dashed',
  },
  uploadButtonDisabled: {
    opacity: 0.7,
  },
  uploadButtonContent: {
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
    marginTop: 12,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  uploadSpinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: colors.accent + '30',
    borderTopColor: colors.accent,
  },
  currentAvatarPreview: {
    marginTop: 20,
    alignItems: 'center',
  },
  currentAvatarLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  currentAvatarContainer: {
    position: 'relative',
  },
  currentAvatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
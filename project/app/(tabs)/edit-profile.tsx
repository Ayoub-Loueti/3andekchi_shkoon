import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
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
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Camera, User, Phone, MapPin, Lock, Eye, EyeOff, Save, Key, Upload, Image as ImageIcon, CheckCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

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

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  password: string;
  genre: 'homme' | 'femme' | '';
  avatar: string;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  password?: string;
  genre?: string;
  avatar?: string;
}

interface PasswordData {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function EditProfileScreen() {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    password: '',
    genre: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchProfile();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images.');
      }
    }
  };

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token retrieved:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        console.log('No token found, redirecting to login');
        router.replace('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Profile fetch response:', response.data);

      const user = response.data;
      setProfileData({
        firstName: user.prenom || '',
        lastName: user.nom || '',
        phone: user.numero || '',
        location: user.location || '',
        password: '123456', // Initialize password field
        genre: user.genre || '',
        avatar: user.avatar || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (axios.isAxiosError(error)) {
        console.log('Error status:', error.response?.status);
        console.log('Error data:', error.response?.data);
        if (error.response?.status === 401) {
          console.log('Unauthorized, redirecting to login');
          router.replace('/login');
          return;
        }
      }
      Alert.alert('Error', 'Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<PasswordData>({});

  const validateProfile = () => {
    const newErrors: Errors = {};
    let isValid = true;

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    const phoneRegex = /^[0-9+\-\s()]{8,}$/;
    if (!profileData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(profileData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    if (!profileData.location.trim()) {
      newErrors.location = 'Location is required';
      isValid = false;
    }

    if (!profileData.genre) {
      newErrors.genre = 'Please select a gender';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validatePassword = () => {
    const newErrors: PasswordData = {};
    let isValid = true;

    if (!passwordData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
      isValid = false;
    }

    setPasswordErrors(newErrors);
    return isValid;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token for update:', token ? 'Token exists' : 'No token found');

      if (!token) {
        console.log('No token found for update, redirecting to login');
        router.replace('/login');
        return;
      }

      // Get user info including _id
      const meResponse = await axios.get('http://localhost:5000/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = meResponse.data;
      const clientId = user._id;
      console.log('Client ID:', clientId);

      if (!clientId) {
        Alert.alert('Error', 'User ID not found.');
        return;
      }

      const updateData = {
        prenom: profileData.firstName,
        nom: profileData.lastName,
        numero: profileData.phone,
        location: profileData.location,
        genre: profileData.genre
      };

      console.log('Sending update data:', updateData);

      const response = await axios.put(
        `http://localhost:5000/users/clients/${clientId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Update response:', response.data);
      Alert.alert('Success', 'Profile updated successfully!');
      router.push('/(tabs)/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (axios.isAxiosError(error)) {
        console.log('Error status:', error.response?.status);
        console.log('Error data:', error.response?.data);
      }
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setPasswordLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token for update:', token ? 'Token exists' : 'No token found');

      if (!token) {
        console.log('No token found for update, redirecting to login');
        router.replace('/login');
        return;
      }

      // Get user info including _id
      const meResponse = await axios.get('http://localhost:5000/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = meResponse.data;
      const clientId = user._id;
      console.log('Client ID:', clientId);

      if (!clientId) {
        Alert.alert('Erreur', 'Utilisateur introuvable.');
        return;
      }

      // Prepare payload with old and new password
      const payload = {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      };
      
      console.log('Sending update data:', payload);

      const response = await axios.put(
        `http://localhost:5000/users/updatepassword/${clientId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Update response:', response.data);
      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
      Alert.alert('Succès', 'Mot de passe mis à jour avec succès !');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        console.log('Error status:', status);
        console.log('Error data:', message);

        if (status === 401 && message === 'Mot de passe actuel incorrect.') {
          Alert.alert('Erreur', 'Le mot de passe actuel est incorrect.');
        } else {
          Alert.alert('Erreur', message || 'Échec de la mise à jour du mot de passe.');
        }
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const updateProfileData = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const updatePasswordData = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = () => {
    const password = passwordData.newPassword || '';
    if (password.length === 0) return { strength: 0, text: '', color: '#E5E5EA' };
    if (password.length < 6) return { strength: 1, text: 'Weak', color: colors.error };
    if (password.length < 8) return { strength: 2, text: 'Fair', color: colors.secondary };
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 4, text: 'Strong', color: colors.success };
    }
    return { strength: 3, text: 'Good', color: colors.accent };
  };

  const passwordStrength = getPasswordStrength();

  const handleAvatarSelect = async (selectedAvatar: string) => {
    // Optimistically update UI
    setProfileData(prev => ({ ...prev, avatar: selectedAvatar }));
    setShowAvatarModal(false);

    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }
      
      const meResponse = await axios.get('http://localhost:5000/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const clientId = meResponse.data._id;

      if (!clientId) {
        Alert.alert('Error', 'User ID not found.');
        // Revert UI change
        await fetchProfile(); 
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
      fetchProfile();
    } finally {
      setIsLoading(false);
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
        router.replace('/login');
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
      setProfileData(prev => ({ ...prev, avatar: avatarPath }));
      setShowAvatarModal(false);
      
      Alert.alert('Success', 'Custom avatar uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <ArrowLeft size={24} color={colors.primary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ 
                uri: profileData.avatar
                  ? `http://localhost:5000${profileData.avatar}`
                  : 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
              }} 
              style={styles.avatar}
            />
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={() => setShowAvatarModal(true)}
            >
              <Camera size={16} color="white" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Form */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>First Name</Text>
            <View style={[styles.inputWrapper, errors.firstName && styles.inputError]}>
              <User size={20} color="#8E8E93" strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your first name"
                value={profileData.firstName}
                onChangeText={(text) => updateProfileData('firstName', text)}
                placeholderTextColor="#8E8E93"
              />
            </View>
            {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <View style={[styles.inputWrapper, errors.lastName && styles.inputError]}>
              <User size={20} color="#8E8E93" strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your last name"
                value={profileData.lastName}
                onChangeText={(text) => updateProfileData('lastName', text)}
                placeholderTextColor="#8E8E93"
              />
            </View>
            {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
              <Phone size={20} color="#8E8E93" strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your phone number"
                value={profileData.phone}
                onChangeText={(text) => updateProfileData('phone', text)}
                keyboardType="phone-pad"
                placeholderTextColor="#8E8E93"
              />
            </View>
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <View style={[styles.inputWrapper, errors.location && styles.inputError]}>
              <MapPin size={20} color="#8E8E93" strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your location"
                value={profileData.location}
                onChangeText={(text) => updateProfileData('location', text)}
                placeholderTextColor="#8E8E93"
              />
            </View>
            {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
          </View>

          {/* Gender Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  profileData.genre === 'homme' && styles.genderOptionSelected,
                ]}
                onPress={() => updateProfileData('genre', 'homme')}
              >
                <User size={32} color={profileData.genre === 'homme' ? colors.primary : '#8E8E93'} />
                <Text
                  style={[
                    styles.genderOptionText,
                    profileData.genre === 'homme' && styles.genderOptionTextSelected,
                  ]}
                >
                  Homme
                </Text>
                {profileData.genre === 'homme' && (
                  <View style={styles.checkmarkIcon}>
                    <CheckCircle size={20} color="white" />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  profileData.genre === 'femme' && styles.genderOptionSelected,
                ]}
                onPress={() => updateProfileData('genre', 'femme')}
              >
                <User size={32} color={profileData.genre === 'femme' ? colors.primary : '#8E8E93'} />
                <Text
                  style={[
                    styles.genderOptionText,
                    profileData.genre === 'femme' && styles.genderOptionTextSelected,
                  ]}
                >
                  Femme
                </Text>
                {profileData.genre === 'femme' && (
                  <View style={styles.checkmarkIcon}>
                    <CheckCircle size={20} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {errors.genre ? <Text style={styles.errorText}>{errors.genre}</Text> : null}
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <TouchableOpacity 
            style={styles.passwordButton}
            onPress={() => setShowPasswordModal(true)}
          >
            <View style={styles.passwordButtonLeft}>
              <View style={styles.passwordIcon}>
                <Key size={20} color={colors.primary} strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.passwordButtonTitle}>Change Password</Text>
                <Text style={styles.passwordButtonSubtitle}>Update your account password</Text>
              </View>
            </View>
            <Lock size={16} color="#8E8E93" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSaveProfile}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.saveButtonText}>Saving...</Text>
          ) : (
            <>
              <Save size={20} color="white" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Password Change Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowPasswordModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Change Password</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalIconContainer}>
              <Key size={48} color={colors.accent} strokeWidth={1.5} />
            </View>

            <Text style={styles.modalSubtitle}>
              Enter your current password and choose a new secure password
            </Text>

            {/* Current Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={[styles.inputWrapper, passwordErrors.oldPassword && styles.inputError]}>
                <Lock size={20} color="#8E8E93" strokeWidth={2} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter current password"
                  value={passwordData.oldPassword}
                  onChangeText={(text) => updatePasswordData('oldPassword', text)}
                  secureTextEntry={!showPasswords.current}
                  placeholderTextColor="#8E8E93"
                />
                <TouchableOpacity 
                  onPress={() => togglePasswordVisibility('current')}
                  style={styles.eyeButton}
                >
                  {showPasswords.current ? (
                    <EyeOff size={20} color="#8E8E93" strokeWidth={2} />
                  ) : (
                    <Eye size={20} color="#8E8E93" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
              {passwordErrors.oldPassword ? <Text style={styles.errorText}>{passwordErrors.oldPassword}</Text> : null}
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={[styles.inputWrapper, passwordErrors.newPassword && styles.inputError]}>
                <Lock size={20} color="#8E8E93" strokeWidth={2} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChangeText={(text) => updatePasswordData('newPassword', text)}
                  secureTextEntry={!showPasswords.new}
                  placeholderTextColor="#8E8E93"
                />
                <TouchableOpacity 
                  onPress={() => togglePasswordVisibility('new')}
                  style={styles.eyeButton}
                >
                  {showPasswords.new ? (
                    <EyeOff size={20} color="#8E8E93" strokeWidth={2} />
                  ) : (
                    <Eye size={20} color="#8E8E93" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
              {passwordErrors.newPassword ? <Text style={styles.errorText}>{passwordErrors.newPassword}</Text> : null}
              
              {/* Password Strength Indicator */}
              {passwordData.newPassword && passwordData.newPassword.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    {[1, 2, 3, 4].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.strengthSegment,
                          {
                            backgroundColor: level <= passwordStrength.strength 
                              ? passwordStrength.color 
                              : '#E5E5EA'
                          }
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                    {passwordStrength.text}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirm New Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={[styles.inputWrapper, passwordErrors.confirmPassword && styles.inputError]}>
                <Lock size={20} color="#8E8E93" strokeWidth={2} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => updatePasswordData('confirmPassword', text)}
                  secureTextEntry={!showPasswords.confirm}
                  placeholderTextColor="#8E8E93"
                />
                <TouchableOpacity 
                  onPress={() => togglePasswordVisibility('confirm')}
                  style={styles.eyeButton}
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={20} color="#8E8E93" strokeWidth={2} />
                  ) : (
                    <Eye size={20} color="#8E8E93" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
              {passwordErrors.confirmPassword ? <Text style={styles.errorText}>{passwordErrors.confirmPassword}</Text> : null}
            </View>

            <TouchableOpacity 
              style={[styles.changePasswordButton, passwordLoading && styles.changePasswordButtonDisabled]}
              onPress={handleChangePassword}
              disabled={passwordLoading}
            >
              {passwordLoading ? (
                <Text style={styles.changePasswordButtonText}>Changing Password...</Text>
              ) : (
                <>
                  <Key size={20} color="white" strokeWidth={2} />
                  <Text style={styles.changePasswordButtonText}>Change Password</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

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
                      profileData.avatar === avatarUri && styles.selectedAvatarItem
                    ]}
                    onPress={() => handleAvatarSelect(avatarUri)}
                  >
                    <Image 
                      source={{ uri: `http://localhost:5000${avatarUri}` }} 
                      style={styles.avatarGridImage}
                    />
                    {profileData.avatar === avatarUri && (
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
              {profileData.avatar && !availableAvatars.includes(profileData.avatar) && (
                <View style={styles.currentAvatarPreview}>
                  <Text style={styles.currentAvatarLabel}>Current custom avatar:</Text>
                  <View style={styles.currentAvatarContainer}>
                    <Image 
                      source={{ uri: `http://localhost:5000${profileData.avatar}` }} 
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  inputError: {
    borderColor: colors.error,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text,
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.error,
    marginTop: 4,
  },
  passwordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  passwordButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  passwordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  passwordButtonTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 2,
  },
  passwordButtonSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 32,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginLeft: 8,
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
    fontFamily: 'Inter-Medium',
    color: colors.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  strengthBar: {
    flexDirection: 'row',
    flex: 1,
    height: 4,
    marginRight: 8,
  },
  strengthSegment: {
    flex: 1,
    height: '100%',
    marginRight: 2,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  changePasswordButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  changePasswordButtonDisabled: {
    opacity: 0.7,
  },
  changePasswordButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginLeft: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 16,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    position: 'relative',
  },
  genderOptionSelected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  genderOptionText: {
    marginTop: 8,
    color: '#4B5563',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  genderOptionTextSelected: {
    color: colors.primary,
  },
  checkmarkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 2,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 8,
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
    fontFamily: 'Inter-SemiBold',
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
    fontFamily: 'Inter-Bold',
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
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-SemiBold',
    color: colors.accent,
    marginTop: 12,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-Medium',
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
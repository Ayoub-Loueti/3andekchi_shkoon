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
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Camera, User, Phone, MapPin, Lock, Eye, EyeOff, Save, Key } from 'lucide-react-native';

const colors = {
  primary: '#2A4D69',
  secondary: '#FFC857',
  accent: '#58B09C',
  background: '#F7F9FB',
  text: '#333333',
  success: '#4CAF50',
  error: '#EF5350',
};

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  password: string;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  password?: string;
}

export default function EditProfileScreen() {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const [passwordData, setPasswordData] = useState({
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
  const [passwordErrors, setPasswordErrors] = useState({});

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

    setErrors(newErrors);
    return isValid;
  };

  const validatePassword = () => {
    const newErrors = {};
    let isValid = true;

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.passwordData = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      newErrors.passwordData = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
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
      password: "123456"
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
    router.back();
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
    Alert.alert('Succès', 'Mot de passe mis à jour avec succès !');
    router.back();
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
    setIsLoading(false);
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
  if (errors[field]) {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }
};

  const togglePasswordVisibility = (field: keyof PasswordData) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = () => {
    const password = passwordData.newPassword;
    if (password.length === 0) return { strength: 0, text: '', color: '#E5E5EA' };
    if (password.length < 6) return { strength: 1, text: 'Weak', color: colors.error };
    if (password.length < 8) return { strength: 2, text: 'Fair', color: colors.secondary };
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 4, text: 'Strong', color: colors.success };
    }
    return { strength: 3, text: 'Good', color: colors.accent };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.primary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color="white" strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>Tap to change photo</Text>
        </View>

        {/* Profile Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          {/* First Name */}
          <View style={styles.inputContainer}>
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
          <View style={styles.inputContainer}>
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
          <View style={styles.inputContainer}>
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
          <View style={styles.inputContainer}>
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
        </View>

        {/* Security Section */}
        <View style={styles.formContainer}>
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
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={[styles.inputWrapper, passwordErrors.currentPassword && styles.inputError]}>
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
              {passwordErrors.currentPassword ? <Text style={styles.errorText}>{passwordErrors.currentPassword}</Text> : null}
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
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
              {passwordData.newPassword.length > 0 && (
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
            <View style={styles.inputContainer}>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
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
  changePhotoText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 20,
  },
  inputContainer: {
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
    backgroundColor: colors.background,
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
    backgroundColor: colors.background,
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
});
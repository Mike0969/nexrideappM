import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';
import ChipConnectionsBG from '../components/ChipConnectionsBG';
import { MaterialCommunityIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleEmailSignUp = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    Alert.alert('Success', 'Email sign up - redirecting to verification...');
  };

  const handlePhoneSignUp = () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    Alert.alert('Success', 'Phone sign up - redirecting to verification...');
  };

  const handleSocialSignUp = (provider) => {
    Alert.alert('Social Sign Up', `${provider} integration coming soon!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0e27', '#1a1d3a', '#2d3561']}
        style={styles.gradient}
      >
        {/* subtle circuit background */}
        <ChipConnectionsBG opacity={0.20} tint="#C7CED8" />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView 
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join NexRide and start earning crypto rewards</Text>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                />
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleEmailSignUp}
                >
                  <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    style={styles.buttonGradient}
                  >
                    <View style={styles.buttonContent}>
                      <MaterialCommunityIcons
                        name="email-outline"
                        size={18}
                        color="#FFFFFF"
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.buttonText}>Continue with Email</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Phone Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handlePhoneSignUp}
                >
                  <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    style={styles.buttonGradient}
                  >
                    <View style={styles.buttonContent}>
                      <MaterialCommunityIcons
                        name="phone-outline"
                        size={18}
                        color="#FFFFFF"
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.buttonText}>Continue with Phone</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or sign up with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Media Options */}
              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialSignUp('Google')}
                >
                  <AntDesign name="google" size={18} style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialSignUp('Facebook')}
                >
                  <AntDesign name="facebook-square" size={18} style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialSignUp('LinkedIn')}
                >
                  <AntDesign name="linkedin-square" size={18} style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>LinkedIn</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialSignUp('TikTok')}
                >
                  <FontAwesome5 name="tiktok" size={16} style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>TikTok</Text>
                </TouchableOpacity>
              </View>

              {/* Terms */}
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.linkText}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  backButton: {
    marginTop: spacing.lg,
    marginLeft: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    zIndex: 1,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.base,
    fontWeight: '500',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fonts.sizes['2xl'],
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: fonts.sizes.base,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(143, 179, 255, 0.35)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fonts.sizes.base,
    color: '#FFFFFF',
    marginBottom: spacing.md,
    minHeight: 46,
  },
  primaryButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    height: 48,
    width: '100%',
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.base,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: fonts.sizes.sm,
    marginHorizontal: spacing.md,
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  socialButton: {
    height: 44,
    backgroundColor: 'rgba(0, 224, 255, 0.08)',
    borderColor: 'rgba(0, 224, 255, 0.24)',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingVertical: 0,
    paddingHorizontal: spacing.md,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    justifyContent: 'center',
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: '500',
  },
  socialIcon: {
    marginRight: spacing.sm,
    color: '#8FB3FF',
  },
  termsText: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.lg,
  },
  linkText: {
    color: '#4facfe',
    fontWeight: '500',
  },
});
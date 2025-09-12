import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';
import ChipConnectionsBG from '../components/ChipConnectionsBG';

export default function WelcomeScreen({ navigation }) {
  const { state } = useApp();

  const handleGetStarted = () => {
    navigation.navigate('SignUp');
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  const handleDemo = () => {
    // Route demo to a valid screen to avoid navigation errors
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0e27', '#1a1d3a', '#2d3561']}
        style={styles.gradient}
      >
        {/* Subtle chip-connections background (silver tint, 0.20 opacity) */}
        <ChipConnectionsBG opacity={0.20} tint="#C7CED8" />

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  style={styles.logoGradient}
                >
                  <Text style={styles.logoText}>N</Text>
                </LinearGradient>
              </View>
              <Text style={styles.appName}>NexRide</Text>
              <Text style={styles.tagline}>Smart Transportation for Everyone</Text>
            </View>

            {/* Button Container */}
            <View style={styles.buttonContainer}>
              {/* Get Started Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleGetStarted}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* I Have Account Button - Two Lines */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleSignIn}
                activeOpacity={0.8}
              >
                <View style={styles.secondaryButtonContent}>
                  <Text style={styles.secondaryButtonText}>I have an</Text>
                  <Text style={styles.secondaryButtonText}>account</Text>
                </View>
              </TouchableOpacity>

              {/* Features Section */}
              <View style={styles.featuresSection}>
                <View style={styles.featureItem}>
                  <View style={styles.iconWrap}>
                    <MaterialCommunityIcons
                      name="robot-outline"
                      size={22}
                      color="#8FB3FF"
                    />
                  </View>
                  <Text style={styles.featureText}>AI price negotiation</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.iconWrap}>
                    <MaterialCommunityIcons
                      name="cash-multiple"
                      size={22}
                      color="#8FB3FF"
                    />
                  </View>
                  <Text style={styles.featureText}>Crypto rewards (GFEL)</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.iconWrap}>
                    <MaterialCommunityIcons
                      name="car-outline"
                      size={22}
                      color="#8FB3FF"
                    />
                  </View>
                  <Text style={styles.featureText}>Smart carpooling</Text>
                </View>
              </View>

              {/* Demo Button */}
              <TouchableOpacity
                style={styles.demoButton}
                onPress={handleDemo}
                activeOpacity={0.8}
              >
                <Text style={styles.demoButtonText}>🎯 Try Demo</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    minHeight: 600,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 18,
    marginBottom: spacing.md,
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: fonts.sizes['2xl'],
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '300',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    height: 56,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.base,
    fontWeight: 'bold',
  },
  secondaryButton: {
    width: '100%',
    height: 70,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: spacing.xl,
  },
  secondaryButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.base,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    marginVertical: 1,
  },
  featuresSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingLeft: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.2)',
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 224, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  featureText: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    flex: 1,
  },
  demoButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: fonts.sizes.sm,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});
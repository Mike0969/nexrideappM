import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';

export default function VRExperienceSelector({ visible, onClose, onSelectExperience, onBrowseLibrary }) {
  const quickExperiences = [
    {
      id: 'burj_khalifa',
      name: 'Burj Khalifa View',
      description: 'Experience Dubai from the world\'s tallest building',
      duration: '3-5 min',
      icon: '🏗️',
      gradient: ['#667eea', '#764ba2'],
      difficulty: 'Beginner'
    },
    {
      id: 'dubai_mall',
      name: 'Dubai Mall Interior',
      description: 'Virtual tour of the world\'s largest shopping mall',
      duration: '4-6 min',
      icon: '🏬',
      gradient: ['#4facfe', '#00f2fe'],
      difficulty: 'Beginner'
    },
    {
      id: 'palm_jumeirah',
      name: 'Palm Jumeirah Beach',
      description: 'Relaxing beach views from the iconic Palm island',
      duration: '5-7 min',
      icon: '🌴',
      gradient: ['#43e97b', '#38f9d7'],
      difficulty: 'Relaxing'
    },
    {
      id: 'marina_sunset',
      name: 'Dubai Marina Sunset',
      description: 'Stunning sunset views over Dubai Marina',
      duration: '3-4 min',
      icon: '🌅',
      gradient: ['#fa709a', '#fee140'],
      difficulty: 'Scenic'
    }
  ];

  const handleSelectExperience = (experienceId) => {
    onSelectExperience(experienceId);
    onClose();
  };

  const handleBrowseLibrary = () => {
    onClose();
    setTimeout(() => {
      onBrowseLibrary();
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient
            colors={['#0a0e27', '#1a1d3a', '#2d3561']}
            style={styles.modalGradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>VR Experiences</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
              {/* Quick Start Section */}
              <View style={styles.quickStartSection}>
                <Text style={styles.sectionTitle}>Quick Start</Text>
                <Text style={styles.sectionSubtitle}>Jump right into these popular experiences</Text>
                
                <View style={styles.experiencesContainer}>
                  {quickExperiences.map((experience) => (
                    <TouchableOpacity
                      key={experience.id}
                      style={styles.experienceCard}
                      onPress={() => handleSelectExperience(experience.id)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={experience.gradient}
                        style={styles.experienceGradient}
                      >
                        <View style={styles.experienceHeader}>
                          <Text style={styles.experienceIcon}>{experience.icon}</Text>
                          <View style={styles.experienceInfo}>
                            <Text style={styles.experienceName}>{experience.name}</Text>
                            <Text style={styles.experienceDifficulty}>{experience.difficulty}</Text>
                          </View>
                          <View style={styles.experienceMeta}>
                            <Text style={styles.experienceDuration}>{experience.duration}</Text>
                          </View>
                        </View>
                        
                        <Text style={styles.experienceDescription}>
                          {experience.description}
                        </Text>
                        
                        <View style={styles.experienceFooter}>
                          <View style={styles.vrIndicator}>
                            <Text style={styles.vrText}>🥽 360° VR Experience</Text>
                          </View>
                          <Text style={styles.launchText}>Tap to Launch →</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View> 
              {/* VR Dashboard Button - ADD THIS */}
              <View style={styles.browseSection}>
                <TouchableOpacity 
                  style={styles.browseButton}
                  onPress={() => {
                    onClose();
                    // For now, just show an alert
                    Alert.alert('🎯 VR Dashboard', 'Opening your personalized VR Dashboard...\n\n(Navigation will be added next)');
                  }}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#f093fb', '#f5576c']}
                    style={styles.browseGradient}
                  >
                    <Text style={styles.browseIcon}>📊</Text>
                    <Text style={styles.browseTitle}>VR Dashboard</Text>
                    <Text style={styles.browseSubtitle}>Your personalized VR hub</Text>
                    <Text style={styles.browseHint}>Stats • Recent • Favorites • Trending</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>


              {/* Browse VR Library Button */}
              <View style={styles.browseSection}>
                <TouchableOpacity 
                  style={styles.browseButton}
                  onPress={handleBrowseLibrary}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.browseGradient}
                  >
                    <Text style={styles.browseIcon}>🎮</Text>
                    <Text style={styles.browseTitle}>Browse VR Library</Text>
                    <Text style={styles.browseSubtitle}>Explore 50+ VR Experiences</Text>
                    <Text style={styles.browseHint}>Entertainment • Education • Wellness • Travel</Text>
                    
                    <View style={styles.libraryPreview}>
                      <View style={styles.previewStats}>
                        <View style={styles.statItem}>
                          <Text style={styles.statNumber}>847K</Text>
                          <Text style={styles.statLabel}>Users</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statNumber}>24min</Text>
                          <Text style={styles.statLabel}>Avg Session</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statNumber}>96%</Text>
                          <Text style={styles.statLabel}>Satisfaction</Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Pro Tip */}
              <View style={styles.tipSection}>
                <LinearGradient
                  colors={['rgba(79, 172, 254, 0.1)', 'rgba(0, 242, 254, 0.1)']}
                  style={styles.tipCard}
                >
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipTitle}>Pro Tip</Text>
                  <Text style={styles.tipText}>
                    For the best VR experience, use headphones and move your phone slowly. 
                    Consider using a VR headset for full immersion!
                  </Text>
                </LinearGradient>
              </View>

              {/* HOLORIDE Branding */}
              <View style={styles.brandingSection}>
                <LinearGradient
                  colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
                  style={styles.brandingCard}
                >
                  <Text style={styles.brandingTitle}>🎮 Powered by HOLORIDE</Text>
                  <Text style={styles.brandingText}>
                    Motion-synchronized VR that adapts to your vehicle's movement for unprecedented immersion.
                  </Text>
                </LinearGradient>
              </View>
            </ScrollView>
          </LinearGradient>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '85%',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },

  // Quick Start Section
  quickStartSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.lg,
  },
  experiencesContainer: {
    marginBottom: spacing.md,
  },
  experienceCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  experienceGradient: {
    padding: spacing.lg,
  },
  experienceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  experienceIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  experienceInfo: {
    flex: 1,
  },
  experienceName: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  experienceDifficulty: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  experienceMeta: {
    alignItems: 'flex-end',
  },
  experienceDuration: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  experienceDescription: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  experienceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vrIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  vrText: {
    fontSize: fonts.sizes.sm,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  launchText: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },

  // Browse Section
  browseSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  browseButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  browseGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  browseIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  browseTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  browseSubtitle: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.xs,
  },
  browseHint: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  libraryPreview: {
    width: '100%',
  },
  previewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // Tip Section
  tipSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  tipCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  tipIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  tipTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#4facfe',
    marginBottom: spacing.sm,
  },
  tipText: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },

  // Branding Section
  brandingSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  brandingCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    alignItems: 'center',
  },
  brandingTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: spacing.sm,
  },
  brandingText: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
});
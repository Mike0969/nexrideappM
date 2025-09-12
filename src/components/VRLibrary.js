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

export default function VRLibrary({ visible, onClose, onLaunchExperience }) {
  const [selectedCategory, setSelectedCategory] = useState('entertainment');
  const [selectedExperience, setSelectedExperience] = useState(null);

  const categories = [
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#4facfe' },
    { id: 'education', name: 'Education', icon: '🎓', color: '#43e97b' },
    { id: 'wellness', name: 'Wellness', icon: '🧘', color: '#fa709a' },
    { id: 'travel', name: 'Travel', icon: '✈️', color: '#667eea' },
  ];

  const vrExperiences = {
    entertainment: [
      {
        id: 'dubai_skyline',
        title: 'Dubai Skyline VR Tour',
        description: 'Immersive 360° tour of Dubai landmarks synchronized with your route',
        duration: '15-30 mins',
        rating: 4.8,
        isPremium: false,
        category: 'Entertainment',
        previewColor: ['#667eea', '#764ba2'],
        stats: { views: '12.5K', likes: '98%' }
      },
      {
        id: 'arabian_quest',
        title: 'Arabian Adventure Quest',
        description: 'Interactive desert adventure with real-world motion sync',
        duration: '20-45 mins',
        rating: 4.9,
        isPremium: true,
        category: 'Entertainment',
        previewColor: ['#f093fb', '#f5576c'],
        stats: { views: '8.7K', likes: '97%' }
      },
      {
        id: 'burj_experience',
        title: 'Burj Khalifa Experience',
        description: 'Virtual elevator ride to the top with breathtaking views',
        duration: '10-15 mins',
        rating: 4.7,
        isPremium: false,
        category: 'Entertainment',
        previewColor: ['#4facfe', '#00f2fe'],
        stats: { views: '15.2K', likes: '95%' }
      }
    ],
    education: [
      {
        id: 'history_dubai',
        title: 'History of Dubai',
        description: 'Journey through Dubai\'s transformation from fishing village to metropolis',
        duration: '25-35 mins',
        rating: 4.6,
        isPremium: false,
        category: 'Education',
        previewColor: ['#43e97b', '#38f9d7'],
        stats: { views: '6.3K', likes: '92%' }
      },
      {
        id: 'architecture_tour',
        title: 'Architectural Marvels',
        description: 'Explore the engineering behind Dubai\'s iconic buildings',
        duration: '30-40 mins',
        rating: 4.8,
        isPremium: true,
        category: 'Education',
        previewColor: ['#fa709a', '#fee140'],
        stats: { views: '4.1K', likes: '96%' }
      }
    ],
    wellness: [
      {
        id: 'meditation_oasis',
        title: 'Mindful Meditation Journey',
        description: 'Peaceful desert oasis meditation with calming soundscapes',
        duration: '15-25 mins',
        rating: 4.9,
        isPremium: false,
        category: 'Wellness',
        previewColor: ['#fa709a', '#fee140'],
        stats: { views: '9.8K', likes: '99%' }
      },
      {
        id: 'breathing_exercise',
        title: 'Breathwork in Paradise',
        description: 'Guided breathing exercises in tropical VR environments',
        duration: '10-20 mins',
        rating: 4.7,
        isPremium: false,
        category: 'Wellness',
        previewColor: ['#a8edea', '#fed6e3'],
        stats: { views: '7.5K', likes: '94%' }
      }
    ],
    travel: [
      {
        id: 'world_wonders',
        title: 'World Wonders Tour',
        description: 'Visit global landmarks from the comfort of your ride',
        duration: '20-50 mins',
        rating: 4.8,
        isPremium: true,
        category: 'Travel',
        previewColor: ['#667eea', '#764ba2'],
        stats: { views: '11.2K', likes: '96%' }
      }
    ]
  };

  const stats = {
    totalUsers: '847K',
    totalViews: '2.1M',
    avgSession: '24 mins',
    satisfaction: '96%'
  };

  const currentExperiences = vrExperiences[selectedCategory] || [];

  const handleExperiencePress = (experience) => {
    setSelectedExperience(experience);
    
    Alert.alert(
      `🥽 ${experience.title}`,
      `${experience.description}\n\n⏱️ Duration: ${experience.duration}\n⭐ Rating: ${experience.rating}\n👀 Views: ${experience.stats.views}\n❤️ Likes: ${experience.stats.likes}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Launch VR Experience', 
          onPress: () => {
            onLaunchExperience(experience.id);
            onClose();
          }
        }
      ]
    );
  };

  const handleComingSoon = () => {
    Alert.alert(
      '🚀 Coming Soon!',
      'More VR experiences are being added regularly. This is a preview of our VR library powered by HOLORIDE technology.',
      [{ text: 'Awesome!', style: 'default' }]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1a1d3a', '#2d3561', '#4a5a8a']}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>VR Experience Library</Text>
            <TouchableOpacity 
              style={styles.infoButton}
              onPress={() => Alert.alert('🥽 VR Library', 'Powered by HOLORIDE technology\nMotion-synchronized VR experiences\n\n• Premium content for subscribers\n• 360° immersive experiences\n• Real-time motion sync')}
            >
              <Text style={styles.infoIcon}>ⓘ</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.avgSession}</Text>
              <Text style={styles.statLabel}>Avg Session</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.satisfaction}</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
          </View>

          {/* Category Tabs */}
          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryTab,
                    selectedCategory === category.id && styles.categoryTabActive
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <LinearGradient
                    colors={selectedCategory === category.id 
                      ? [category.color, `${category.color}80`] 
                      : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                    style={styles.categoryGradient}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.categoryText,
                      selectedCategory === category.id && styles.categoryTextActive
                    ]}>
                      {category.name}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Experiences Grid */}
          <ScrollView style={styles.experiencesContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.experiencesGrid}>
              {currentExperiences.map((experience) => (
                <TouchableOpacity
                  key={experience.id}
                  style={styles.experienceCard}
                  onPress={() => handleExperiencePress(experience)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={experience.previewColor}
                    style={styles.experienceGradient}
                  >
                    {/* Premium Badge */}
                    {experience.isPremium && (
                      <View style={styles.premiumBadge}>
                        <Text style={styles.premiumText}>⭐ Premium</Text>
                      </View>
                    )}

                    {/* VR Preview */}
                    <View style={styles.vrPreview}>
                      <Text style={styles.vrPreviewIcon}>🥽</Text>
                      <Text style={styles.vrPreviewText}>VR Preview</Text>
                    </View>

                    {/* Experience Info */}
                    <View style={styles.experienceInfo}>
                      <Text style={styles.experienceTitle}>{experience.title}</Text>
                      <Text style={styles.experienceDescription}>
                        {experience.description}
                      </Text>
                      
                      <View style={styles.experienceMeta}>
                        <View style={styles.metaRow}>
                          <Text style={styles.metaIcon}>⏱️</Text>
                          <Text style={styles.metaText}>{experience.duration}</Text>
                        </View>
                        <View style={styles.metaRow}>
                          <Text style={styles.metaIcon}>⭐</Text>
                          <Text style={styles.metaText}>{experience.rating}</Text>
                        </View>
                      </View>

                      <View style={styles.experienceStats}>
                        <Text style={styles.statsText}>👀 {experience.stats.views}</Text>
                        <Text style={styles.statsText}>❤️ {experience.stats.likes}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}

              {/* Coming Soon Cards */}
              <TouchableOpacity
                style={styles.comingSoonCard}
                onPress={handleComingSoon}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                  style={styles.comingSoonGradient}
                >
                  <Text style={styles.comingSoonIcon}>🚀</Text>
                  <Text style={styles.comingSoonTitle}>More Experiences</Text>
                  <Text style={styles.comingSoonText}>Coming Soon!</Text>
                  <Text style={styles.comingSoonSubtext}>New VR content added weekly</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* HOLORIDE Branding */}
            <View style={styles.brandingSection}>
              <LinearGradient
                colors={['rgba(79, 172, 254, 0.1)', 'rgba(0, 242, 254, 0.1)']}
                style={styles.brandingCard}
              >
                <Text style={styles.brandingTitle}>🎮 Powered by HOLORIDE</Text>
                <Text style={styles.brandingText}>
                  Motion-synchronized VR experiences that adapt to your ride. 
                  Real-world movement creates unprecedented immersion.
                </Text>
                <View style={styles.brandingFeatures}>
                  <Text style={styles.featureText}>• Motion-synchronized content</Text>
                  <Text style={styles.featureText}>• Premium subscriber benefits</Text>
                  <Text style={styles.featureText}>• Regular content updates</Text>
                </View>
              </LinearGradient>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: {
    fontSize: 16,
    color: '#4facfe',
    fontWeight: 'bold',
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 80,
  },
  statNumber: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#4facfe',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // Categories
  categoriesContainer: {
    paddingVertical: spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.lg,
  },
  categoryTab: {
    marginRight: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  categoryTabActive: {
    transform: [{ scale: 1.05 }],
  },
  categoryGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minWidth: 100,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  categoryText: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },

  // Experiences
  experiencesContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  experiencesGrid: {
    paddingBottom: spacing.xl,
  },
  experienceCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  experienceGradient: {
    padding: spacing.lg,
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  premiumText: {
    fontSize: fonts.sizes.xs,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  vrPreview: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
  },
  vrPreviewIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  vrPreviewText: {
    fontSize: fonts.sizes.lg,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  experienceInfo: {
    alignItems: 'center',
  },
  experienceTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  experienceDescription: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  experienceMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  metaIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  metaText: {
    fontSize: fonts.sizes.sm,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  experienceStats: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statsText: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: spacing.md,
  },

  // Coming Soon
  comingSoonCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
  },
  comingSoonGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  comingSoonIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  comingSoonTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  comingSoonText: {
    fontSize: fonts.sizes.lg,
    color: '#4facfe',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  comingSoonSubtext: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Branding
  brandingSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  brandingCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  brandingTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#4facfe',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  brandingText: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  brandingFeatures: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xs,
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';
import VR360Viewer from '../components/VR360Viewer';

const { width } = Dimensions.get('window');

export default function VRDashboardScreen({ navigation }) {
  const { state } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('featured');
  const [showVRViewer, setShowVRViewer] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);

  // VR Categories
  const categories = [
    { id: 'featured', name: 'Featured', icon: '🌟' },
    { id: 'recent', name: 'Recent', icon: '🕒' },
    { id: 'popular', name: 'Popular', icon: '🔥' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
  ];

  // VR Experiences with real preview images
  const vrExperiences = {
    featured: [
      {
        id: 'burj_khalifa_sunset',
        title: 'Burj Khalifa Sunset',
        description: 'Experience Dubai from the world\'s tallest building at golden hour',
        duration: '4 min',
        rating: 4.9,
        views: '125K',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
        category: 'Premium',
        difficulty: 'Beginner'
      },
      {
        id: 'palm_aerial',
        title: 'Palm Jumeirah Aerial',
        description: 'Fly over the iconic Palm Island like a bird',
        duration: '6 min',
        rating: 4.8,
        views: '89K',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
        category: 'Adventure',
        difficulty: 'Intermediate'
      },
      {
        id: 'desert_safari',
        title: 'Desert Safari Experience',
        description: 'Immersive desert adventure with camel riding and sand dunes',
        duration: '8 min',
        rating: 4.7,
        views: '156K',
        image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400&h=300&fit=crop',
        category: 'Adventure',
        difficulty: 'Advanced'
      }
    ],
    recent: [
      {
        id: 'marina_night',
        title: 'Dubai Marina Night',
        description: 'Last played 2 hours ago',
        duration: '5 min',
        rating: 4.6,
        views: '67K',
        image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=400&h=300&fit=crop',
        category: 'Scenic',
        lastPlayed: '2 hours ago'
      },
      {
        id: 'fountain_show',
        title: 'Dubai Fountain Show',
        description: 'Last played yesterday',
        duration: '7 min',
        rating: 4.8,
        views: '234K',
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=300&fit=crop',
        category: 'Entertainment',
        lastPlayed: '1 day ago'
      }
    ],
    popular: [
      {
        id: 'space_station',
        title: 'International Space Station',
        description: 'View Earth from space - most popular this week',
        duration: '10 min',
        rating: 4.9,
        views: '1.2M',
        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop',
        category: 'Space',
        trending: true
      },
      {
        id: 'underwater',
        title: 'Underwater World',
        description: 'Dive with sharks and tropical fish',
        duration: '12 min',
        rating: 4.8,
        views: '890K',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        category: 'Nature',
        trending: true
      }
    ],
    travel: [
      {
        id: 'paris_eiffel',
        title: 'Paris Eiffel Tower',
        description: 'Romantic sunset view from the iconic tower',
        duration: '6 min',
        rating: 4.7,
        views: '445K',
        image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop',
        category: 'Travel',
        difficulty: 'Beginner'
      },
      {
        id: 'tokyo_skyline',
        title: 'Tokyo Neon Nights',
        description: 'Experience the vibrant streets of Shibuya',
        duration: '9 min',
        rating: 4.8,
        views: '678K',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
        category: 'Travel',
        difficulty: 'Intermediate'
      }
    ]
  };

  // VR Stats
  const vrStats = {
    totalTime: '24h 35m',
    experiencesCompleted: 47,
    favoriteCategory: 'Travel',
    weeklyStreak: 6
  };

  const currentExperiences = vrExperiences[selectedCategory] || [];

  const handleExperiencePress = (experience) => {
    setSelectedExperience(experience.id);
    setShowVRViewer(true);
  };

  const renderExperienceCard = (experience) => (
    <TouchableOpacity
      key={experience.id}
      style={styles.experienceCard}
      onPress={() => handleExperiencePress(experience)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: experience.image }} style={styles.experienceImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.imageOverlay}
        />
        
        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{experience.category}</Text>
        </View>
        
        {/* Trending Badge */}
        {experience.trending && (
          <View style={styles.trendingBadge}>
            <Text style={styles.trendingText}>🔥 Trending</Text>
          </View>
        )}
        
        {/* Play Button */}
        <View style={styles.playButton}>
          <Text style={styles.playIcon}>▶️</Text>
        </View>
      </View>
      
      <View style={styles.experienceInfo}>
        <Text style={styles.experienceTitle}>{experience.title}</Text>
        <Text style={styles.experienceDescription}>{experience.description}</Text>
        
        <View style={styles.experienceMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⏱️</Text>
            <Text style={styles.metaText}>{experience.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⭐</Text>
            <Text style={styles.metaText}>{experience.rating}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>👀</Text>
            <Text style={styles.metaText}>{experience.views}</Text>
          </View>
        </View>

        {experience.lastPlayed && (
          <Text style={styles.lastPlayedText}>Last played: {experience.lastPlayed}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0a0e27', '#1a1d3a', '#2d3561']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>VR Dashboard</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* VR Stats Section */}
          <View style={styles.statsSection}>
            <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.statsGradient}>
              <Text style={styles.statsTitle}>🥽 Your VR Journey</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{vrStats.totalTime}</Text>
                  <Text style={styles.statLabel}>Total Time</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{vrStats.experiencesCompleted}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{vrStats.weeklyStreak}</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Categories */}
          <View style={styles.categoriesSection}>
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
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryName,
                    selectedCategory === category.id && styles.categoryNameActive
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Experiences Grid */}
          <View style={styles.experiencesSection}>
            <Text style={styles.sectionTitle}>
              {categories.find(c => c.id === selectedCategory)?.name} Experiences
            </Text>
            
            <View style={styles.experiencesGrid}>
              {currentExperiences.map(renderExperienceCard)}
            </View>
          </View>

          {/* Quick Access */}
          <View style={styles.quickAccessSection}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.quickAccessGrid}>
              <TouchableOpacity style={styles.quickAccessCard}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.quickAccessGradient}>
                  <Text style={styles.quickAccessIcon}>📚</Text>
                  <Text style={styles.quickAccessText}>VR Library</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickAccessCard}>
                <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.quickAccessGradient}>
                  <Text style={styles.quickAccessIcon}>⚙️</Text>
                  <Text style={styles.quickAccessText}>VR Settings</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickAccessCard}>
                <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.quickAccessGradient}>
                  <Text style={styles.quickAccessIcon}>📊</Text>
                  <Text style={styles.quickAccessText}>VR Analytics</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* VR 360 Viewer */}
        <VR360Viewer
          visible={showVRViewer}
          onClose={() => setShowVRViewer(false)}
          experience={selectedExperience}
        />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  statsGradient: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  statsTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: spacing.xs,
  },

  // Categories
  categoriesSection: {
    marginBottom: spacing.lg,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.lg,
  },
  categoryTab: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    minWidth: 80,
  },
  categoryTabActive: {
    backgroundColor: 'rgba(79, 172, 254, 0.3)',
    transform: [{ scale: 1.05 }],
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  categoryNameActive: {
    color: '#FFFFFF',
  },

  // Experiences
  experiencesSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  experiencesGrid: {
    // Grid layout will be handled by individual cards
  },
  experienceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  experienceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(79, 172, 254, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    fontSize: fonts.sizes.xs,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  trendingBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  trendingText: {
    fontSize: fonts.sizes.xs,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  playButton: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(79, 172, 254, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 16,
  },
  experienceInfo: {
    padding: spacing.md,
  },
  experienceTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  experienceDescription: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  experienceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  metaIcon: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  metaText: {
    fontSize: fonts.sizes.sm,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  lastPlayedText: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },

  // Quick Access
  quickAccessSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAccessCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  quickAccessGradient: {
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  quickAccessIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  quickAccessText: {
    fontSize: fonts.sizes.sm,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});
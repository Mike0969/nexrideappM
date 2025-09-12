// src/screens/UserProfileScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';

export default function UserProfileScreen({ navigation }) {
  const { state } = useApp();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock user data - in real app this would come from API
  const userData = {
    name: state.user?.name || 'John',
    currentTier: 'Silver',
    nextTier: 'Gold',
    ridesForNextTier: 2,
    rideHistory: [
      { id: 1, destination: 'Dubai Mall', date: '2 hours ago', saved: 7.20, tokens: 15 },
      { id: 2, destination: 'DIFC', date: 'Yesterday', saved: 4.80, tokens: 12 },
      { id: 3, destination: 'Marina', date: '2 days ago', saved: 9.50, tokens: 18 },
      { id: 4, destination: 'Airport', date: '3 days ago', saved: 12.30, tokens: 24 }
    ],
    stats: {
      weekRides: 4,
      weekSaved: 28.50,
      monthRides: 18,
      monthSaved: 127.40,
      monthTokens: 284,
      totalSaved: 1240.80,
      totalTokens: 3120,
      savingsRank: 87 // Percentage better than other users
    }
  };

  // Update timestamp every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60)); // Minutes ago
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0a0e27', '#1a1d3a', '#2d3561']} style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Hello {userData.name}! 👋</Text>
            <Text style={styles.lastUpdated}>Updated {formatTime(lastUpdated)}</Text>
          </View>

          {/* Tier Status */}
          <View style={styles.section}>
            <View style={styles.tierHeader}>
              <Text style={styles.sectionTitle}>🏆 Your Tier Status</Text>
            </View>
            <View style={styles.tierCard}>
              <View style={styles.tierCurrent}>
                <Text style={styles.tierName}>{userData.currentTier} Member</Text>
                <Text style={styles.tierBadge}>⭐</Text>
              </View>
              <View style={styles.tierProgress}>
                <Text style={styles.tierProgressText}>
                  Make {userData.ridesForNextTier} more rides this month to become {userData.nextTier} 🥇
                </Text>
              </View>
            </View>
          </View>

          {/* Ride History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚗 Your Ride History</Text>
            {userData.rideHistory.map((ride) => (
              <View key={ride.id} style={styles.rideCard}>
                <View style={styles.rideInfo}>
                  <Text style={styles.rideDest}>{ride.destination}</Text>
                  <Text style={styles.rideDate}>{ride.date}</Text>
                </View>
                <View style={styles.rideSavings}>
                  <Text style={styles.rideSaved}>Saved ${ride.saved}</Text>
                  <Text style={styles.rideTokens}>+{ride.tokens} GFEL</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Weekly Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 This Week</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userData.stats.weekRides}</Text>
                <Text style={styles.statLabel}>Rides</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>${userData.stats.weekSaved}</Text>
                <Text style={styles.statLabel}>Saved</Text>
              </View>
            </View>
          </View>

          {/* Monthly Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 This Month</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userData.stats.monthRides}</Text>
                <Text style={styles.statLabel}>Rides</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>${userData.stats.monthSaved}</Text>
                <Text style={styles.statLabel}>Saved</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userData.stats.monthTokens}</Text>
                <Text style={styles.statLabel}>GFEL Tokens</Text>
              </View>
            </View>
          </View>

          {/* Achievement Message */}
          <View style={styles.achievementSection}>
            <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.achievementGradient}>
              <Text style={styles.achievementText}>
                🎉 You've saved more than {userData.stats.savingsRank}% of users!
              </Text>
            </LinearGradient>
          </View>

          {/* Total Lifetime Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Lifetime Stats</Text>
            <View style={styles.lifetimeCard}>
              <View style={styles.lifetimeItem}>
                <Text style={styles.lifetimeValue}>${userData.stats.totalSaved}</Text>
                <Text style={styles.lifetimeLabel}>Total Saved</Text>
              </View>
              <View style={styles.lifetimeItem}>
                <Text style={styles.lifetimeValue}>{userData.stats.totalTokens}</Text>
                <Text style={styles.lifetimeLabel}>Total GFEL Earned</Text>
              </View>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
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
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 32,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  
  // Welcome Section
  welcomeSection: {
    marginBottom: spacing.md,
  },
  welcomeText: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  lastUpdated: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Sections
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },

  // Tier Status
  tierHeader: {
    marginBottom: spacing.xs,
  },
  tierCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  tierCurrent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  tierName: {
    fontSize: fonts.sizes.base,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  tierBadge: {
    fontSize: 20,
  },
  tierProgress: {
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    borderRadius: borderRadius.xs,
    padding: spacing.xs,
  },
  tierProgressText: {
    fontSize: fonts.sizes.xs,
    color: '#4facfe',
    textAlign: 'center',
  },

  // Ride History
  rideCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.xs,
    padding: spacing.xs,
    marginBottom: spacing.xs,
  },
  rideInfo: {
    flex: 1,
  },
  rideDest: {
    fontSize: fonts.sizes.sm,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  rideDate: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  rideSavings: {
    alignItems: 'flex-end',
  },
  rideSaved: {
    fontSize: fonts.sizes.sm,
    color: '#43e97b',
    fontWeight: 'bold',
  },
  rideTokens: {
    fontSize: fonts.sizes.xs,
    color: '#FFD700',
    marginTop: 2,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#4facfe',
  },
  statLabel: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: spacing.xs,
  },

  // Achievement
  achievementSection: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  achievementGradient: {
    padding: spacing.sm,
    alignItems: 'center',
  },
  achievementText: {
    fontSize: fonts.sizes.sm,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Lifetime Stats
  lifetimeCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  lifetimeItem: {
    alignItems: 'center',
  },
  lifetimeValue: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  lifetimeLabel: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
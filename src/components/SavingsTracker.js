// src/components/SavingsTracker.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts, spacing, borderRadius } from '../styles/globalStyles';

export default function SavingsTracker({ userStats, style }) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true
    }).start();
  }, [userStats]);

  if (!userStats) return null;

  const currentStats = selectedPeriod === 'month' ? userStats.monthlyStats : userStats.yearlyStats;
  const { tokenEarnings, ranking } = userStats;

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['rgba(103, 58, 183, 0.1)', 'rgba(156, 39, 176, 0.1)']}
        style={styles.gradient}
      >
        {/* Header with Period Toggle */}
        <View style={styles.header}>
          <Text style={styles.title}>💎 YOUR TOTAL SAVINGS</Text>
          <View style={styles.periodToggle}>
            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod('month')}
            >
              <Text style={[styles.periodText, selectedPeriod === 'month' && styles.periodTextActive]}>
                Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === 'year' && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod('year')}
            >
              <Text style={[styles.periodText, selectedPeriod === 'year' && styles.periodTextActive]}>
                Year
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Stats */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: animatedValue,
              transform: [{ scale: animatedValue }]
            }
          ]}
        >
          {/* Total Saved */}
          <View style={styles.mainStat}>
            <Text style={styles.mainStatValue}>${currentStats.totalSaved}</Text>
            <Text style={styles.mainStatLabel}>Total Saved</Text>
          </View>

          {/* Secondary Stats */}
          <View style={styles.secondaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentStats.rides}</Text>
              <Text style={styles.statLabel}>Rides</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${currentStats.avgSavingsPerRide}</Text>
              <Text style={styles.statLabel}>Avg/Ride</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentStats.avgSavingsPercent}%</Text>
              <Text style={styles.statLabel}>Cheaper</Text>
            </View>
          </View>
        </Animated.View>

        {/* Token Earnings Section */}
        <View style={styles.tokenSection}>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.tokenGradient}
          >
            <View style={styles.tokenHeader}>
              <Text style={styles.tokenTitle}>🪙 GFEL TOKEN EARNINGS</Text>
            </View>
            <View style={styles.tokenStats}>
              <View style={styles.tokenItem}>
                <Text style={styles.tokenValue}>{tokenEarnings.month}</Text>
                <Text style={styles.tokenLabel}>This Month</Text>
              </View>
              <View style={styles.tokenItem}>
                <Text style={styles.tokenValue}>{tokenEarnings.year}</Text>
                <Text style={styles.tokenLabel}>Total Earned</Text>
              </View>
              <View style={styles.tokenItem}>
                <Text style={styles.tokenValue}>+{tokenEarnings.nextReward}</Text>
                <Text style={styles.tokenLabel}>Next Ride</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Ranking Section */}
        <View style={styles.rankingSection}>
          <Text style={styles.rankingTitle}>🏆 YOUR RANKING</Text>
          <View style={styles.rankingContent}>
            <View style={styles.rankingMain}>
              <Text style={styles.rankingPosition}>#{ranking.position}</Text>
              <Text style={styles.rankingTotal}>of {ranking.totalUsers.toLocaleString()}</Text>
            </View>
            <View style={styles.percentileContainer}>
              <Text style={styles.percentileText}>Top {100 - ranking.percentile}% saver!</Text>
              <View style={styles.percentileBar}>
                <View style={[styles.percentileFill, { width: `${ranking.percentile}%` }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Achievement Badge */}
        <View style={styles.achievementBadge}>
          <Text style={styles.achievementText}>
            🎉 You've saved more than 95% of users this {selectedPeriod}!
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  gradient: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(156, 39, 176, 0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  periodButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  periodButtonActive: {
    backgroundColor: '#9C27B0',
  },
  periodText: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  periodTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statsContainer: {
    marginBottom: spacing.lg,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  mainStatValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  mainStatLabel: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.xs,
  },
  secondaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: spacing.xs,
  },
  tokenSection: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  tokenGradient: {
    padding: spacing.md,
  },
  tokenHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tokenTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tokenStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tokenItem: {
    alignItems: 'center',
  },
  tokenValue: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tokenLabel: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.xs,
  },
  rankingSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  rankingTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  rankingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankingMain: {
    alignItems: 'center',
  },
  rankingPosition: {
    fontSize: fonts.sizes.xxl,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  rankingTotal: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  percentileContainer: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  percentileText: {
    fontSize: fonts.sizes.sm,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  percentileBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  percentileFill: {
    height: '100%',
    backgroundColor: '#43e97b',
  },
  achievementBadge: {
    backgroundColor: 'rgba(67, 233, 123, 0.2)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#43e97b',
  },
  achievementText: {
    fontSize: fonts.sizes.sm,
    color: '#43e97b',
    textAlign: 'center',
    fontWeight: '600',
  },
});
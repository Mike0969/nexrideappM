// src/components/AnalyticsDashboard.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts, spacing, borderRadius } from '../styles/globalStyles';

export default function AnalyticsDashboard({ marketData, style }) {
  const [selectedMetric, setSelectedMetric] = useState('savings');

  if (!marketData) return null;

  const {
    avgSavingsAcrossUsers,
    totalSavingsGenerated,
    priceAdvantageFrequency,
    surgeAvoidanceValue,
    conversionMetrics
  } = marketData;

  // Mock chart data - in real app would use actual chart library
  const chartData = {
    savings: [18, 22, 25, 23, 28, 31, 29, 32, 35, 33, 38, 42],
    conversion: [15, 18, 22, 25, 28, 31, 27, 29, 32, 35, 37, 34],
    users: [1200, 1850, 2300, 2800, 3500, 4200, 4800, 5600, 6200, 7100, 8300, 9500]
  };

  const formatCurrency = (value) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatNumber = (value) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <ScrollView style={[styles.container, style]} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['rgba(30, 39, 46, 0.9)', 'rgba(45, 52, 96, 0.9)']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📊 NEXRIDE ANALYTICS DASHBOARD</Text>
          <Text style={styles.subtitle}>Real-time market performance metrics</Text>
        </View>

        {/* Key Metrics Grid */}
        <View style={styles.metricsGrid}>
          {/* Total Savings */}
          <View style={[styles.metricCard, styles.primaryMetric]}>
            <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.metricGradient}>
              <Text style={styles.metricIcon}>💰</Text>
              <Text style={styles.metricValue}>{formatCurrency(totalSavingsGenerated)}</Text>
              <Text style={styles.metricLabel}>Total User Savings</Text>
            </LinearGradient>
          </View>

          {/* Average Savings */}
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>📈</Text>
            <Text style={styles.metricValue}>{avgSavingsAcrossUsers}%</Text>
            <Text style={styles.metricLabel}>Avg Savings</Text>
          </View>

          {/* Price Advantage */}
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>🎯</Text>
            <Text style={styles.metricValue}>{Math.round(priceAdvantageFrequency * 100)}%</Text>
            <Text style={styles.metricLabel}>Price Advantage</Text>
          </View>

          {/* Surge Avoidance */}
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>⚡</Text>
            <Text style={styles.metricValue}>{formatCurrency(surgeAvoidanceValue)}</Text>
            <Text style={styles.metricLabel}>Surge Savings</Text>
          </View>
        </View>

        {/* Conversion Metrics */}
        <View style={styles.conversionSection}>
          <Text style={styles.sectionTitle}>🎯 Conversion Metrics</Text>
          <View style={styles.conversionGrid}>
            <View style={styles.conversionItem}>
              <Text style={styles.conversionValue}>
                {formatNumber(conversionMetrics.priceComparisonViews)}
              </Text>
              <Text style={styles.conversionLabel}>Price Views</Text>
            </View>
            <View style={styles.conversionItem}>
              <Text style={styles.conversionValue}>
                {formatNumber(conversionMetrics.conversionsFromComparison)}
              </Text>
              <Text style={styles.conversionLabel}>Conversions</Text>
            </View>
            <View style={styles.conversionItem}>
              <Text style={styles.conversionValue}>
                {Math.round(conversionMetrics.conversionRate * 100)}%
              </Text>
              <Text style={styles.conversionLabel}>Conv. Rate</Text>
            </View>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>📈 Trends & Performance</Text>
          
          {/* Chart Type Selector */}
          <View style={styles.chartSelector}>
            {['savings', 'conversion', 'users'].map((metric) => (
              <TouchableOpacity
                key={metric}
                style={[
                  styles.chartButton,
                  selectedMetric === metric && styles.chartButtonActive
                ]}
                onPress={() => setSelectedMetric(metric)}
              >
                <Text style={[
                  styles.chartButtonText,
                  selectedMetric === metric && styles.chartButtonTextActive
                ]}>
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Simple Chart Visualization */}
          <View style={styles.chartContainer}>
            <View style={styles.chartYAxis}>
              <Text style={styles.axisLabel}>High</Text>
              <Text style={styles.axisLabel}>Med</Text>
              <Text style={styles.axisLabel}>Low</Text>
            </View>
            <View style={styles.chartArea}>
              {chartData[selectedMetric].map((value, index) => {
                const height = (value / Math.max(...chartData[selectedMetric])) * 100;
                return (
                  <View key={index} style={styles.chartBarContainer}>
                    <View style={[styles.chartBar, { height: `${height}%` }]} />
                    <Text style={styles.chartXLabel}>
                      {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Market Position */}
        <View style={styles.marketSection}>
          <Text style={styles.sectionTitle}>🏆 Market Position</Text>
          <View style={styles.marketGrid}>
            <View style={styles.marketItem}>
              <View style={styles.competitorBar}>
                <Text style={styles.competitorName}>Uber</Text>
                <View style={styles.barContainer}>
                  <View style={[styles.bar, styles.uberBar, { width: '85%' }]} />
                  <Text style={styles.barValue}>$28.50</Text>
                </View>
              </View>
            </View>
            <View style={styles.marketItem}>
              <View style={styles.competitorBar}>
                <Text style={styles.competitorName}>Careem</Text>
                <View style={styles.barContainer}>
                  <View style={[styles.bar, styles.careemBar, { width: '78%' }]} />
                  <Text style={styles.barValue}>$26.80</Text>
                </View>
              </View>
            </View>
            <View style={styles.marketItem}>
              <View style={styles.competitorBar}>
                <Text style={[styles.competitorName, styles.nexrideName]}>NexRide</Text>
                <View style={styles.barContainer}>
                  <View style={[styles.bar, styles.nexrideBar, { width: '60%' }]} />
                  <Text style={[styles.barValue, styles.nexrideValue]}>$21.40</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Key Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>💡 Key Insights</Text>
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>🎯</Text>
              <Text style={styles.insightText}>
                94% price advantage frequency drives 27% conversion rate
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>💰</Text>
              <Text style={styles.insightText}>
                Users save average of $127/month vs competitors
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>⚡</Text>
              <Text style={styles.insightText}>
                No-surge policy saved users $1.2M during peak hours
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>📈</Text>
              <Text style={styles.insightText}>
                Token rewards system increases retention by 34%
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  metricCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  primaryMetric: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  metricGradient: {
    width: '100%',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  metricIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  metricValue: {
    fontSize: fonts.sizes.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  metricLabel: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  conversionSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.lg,
  },
  conversionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  conversionItem: {
    alignItems: 'center',
  },
  conversionValue: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#4facfe',
  },
  conversionLabel: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.xs,
  },
  chartSection: {
    marginBottom: spacing.xl,
  },
  chartSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  chartButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  chartButtonActive: {
    backgroundColor: '#4facfe',
  },
  chartButtonText: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  chartButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  chartYAxis: {
    justifyContent: 'space-between',
    paddingRight: spacing.sm,
    width: 40,
  },
  axisLabel: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '60%',
    backgroundColor: '#4facfe',
    borderRadius: 2,
    marginBottom: spacing.xs,
  },
  chartXLabel: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  marketSection: {
    marginBottom: spacing.xl,
  },
  marketGrid: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  marketItem: {
    marginBottom: spacing.md,
  },
  competitorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  competitorName: {
    fontSize: fonts.sizes.base,
    color: '#FFFFFF',
    width: 80,
  },
  nexrideName: {
    color: '#43e97b',
    fontWeight: 'bold',
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  bar: {
    height: 24,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  uberBar: {
    backgroundColor: '#ff6b6b',
  },
  careemBar: {
    backgroundColor: '#ffa500',
  },
  nexrideBar: {
    backgroundColor: '#43e97b',
  },
  barValue: {
    fontSize: fonts.sizes.sm,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  nexrideValue: {
    color: '#43e97b',
  },
  insightsSection: {},
  insightsList: {},
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  insightText: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: '#FFFFFF',
    lineHeight: 22,
  },
});
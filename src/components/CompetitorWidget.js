// src/components/CompetitorWidget.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts, spacing, borderRadius } from '../styles/globalStyles';

export default function CompetitorWidget({ pricingData, style }) {
  const [animatedValues] = useState({
    nexride: new Animated.Value(0),
    uber: new Animated.Value(0),
    careem: new Animated.Value(0),
    savings: new Animated.Value(0)
  });

  useEffect(() => {
    // Animate prices appearing
    const animations = Object.values(animatedValues).map((value, index) => 
      Animated.timing(value, {
        toValue: 1,
        duration: 800,
        delay: index * 200,
        useNativeDriver: true
      })
    );

    Animated.stagger(200, animations).start();
  }, [pricingData]);

  if (!pricingData) return null;

  const { nexridePrice, competitors, savings, surgeInfo } = pricingData;
  const uberTotal = competitors.uber.price + competitors.uber.fees.booking + competitors.uber.fees.service;
  const careemTotal = competitors.careem.price + competitors.careem.fees.booking + competitors.careem.fees.service;

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🔥 LIVE PRICE COMPARISON</Text>
          {surgeInfo.competitorSurge > 1.2 && (
            <View style={styles.surgeBadge}>
              <Text style={styles.surgeText}>⚡ SURGE ACTIVE</Text>
            </View>
          )}
        </View>

        {/* Price Comparison */}
        <View style={styles.priceContainer}>
          {/* Uber Price */}
          <Animated.View 
            style={[
              styles.priceRow,
              styles.competitorRow,
              { opacity: animatedValues.uber }
            ]}
          >
            <Text style={styles.providerName}>Uber</Text>
            <View style={styles.priceSection}>
              <Text style={styles.competitorPrice}>${uberTotal.toFixed(2)}</Text>
              {surgeInfo.competitorSurge > 1.0 && (
                <Text style={styles.surgeMultiplier}>
                  {surgeInfo.competitorSurge.toFixed(1)}x
                </Text>
              )}
              <Text style={styles.statusIcon}>❌</Text>
            </View>
          </Animated.View>

          {/* Careem Price */}
          <Animated.View 
            style={[
              styles.priceRow,
              styles.competitorRow,
              { opacity: animatedValues.careem }
            ]}
          >
            <Text style={styles.providerName}>Careem</Text>
            <View style={styles.priceSection}>
              <Text style={styles.competitorPrice}>${careemTotal.toFixed(2)}</Text>
              {surgeInfo.competitorSurge > 1.0 && (
                <Text style={styles.surgeMultiplier}>
                  {surgeInfo.competitorSurge.toFixed(1)}x
                </Text>
              )}
              <Text style={styles.statusIcon}>❌</Text>
            </View>
          </Animated.View>

          {/* NexRide Price */}
          <Animated.View 
            style={[
              styles.priceRow,
              styles.nexrideRow,
              { opacity: animatedValues.nexride }
            ]}
          >
            <Text style={styles.nexrideName}>NexRide</Text>
            <View style={styles.priceSection}>
              <Text style={styles.nexridePrice}>${nexridePrice.toFixed(2)}</Text>
              <Text style={styles.noSurgeText}>NO SURGE</Text>
              <Text style={styles.statusIcon}>✅</Text>
            </View>
          </Animated.View>
        </View>

        {/* Savings Summary */}
        <Animated.View 
          style={[
            styles.savingsContainer,
            { opacity: animatedValues.savings }
          ]}
        >
          <LinearGradient
            colors={['#43e97b', '#38f9d7']}
            style={styles.savingsGradient}
          >
            <Text style={styles.savingsAmount}>
              💰 Save ${savings.amount} ({savings.percentage}% cheaper)
            </Text>
            <Text style={styles.savingsSubtext}>
              🎯 Best price guaranteed!
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>vs Uber:</Text>
            <Text style={styles.infoValue}>-${savings.vsUber.toFixed(2)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>vs Careem:</Text>
            <Text style={styles.infoValue}>-${savings.vsCareem.toFixed(2)}</Text>
          </View>
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
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  surgeBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  surgeText: {
    fontSize: fonts.sizes.xs,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  priceContainer: {
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: borderRadius.md,
  },
  competitorRow: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#ff6b6b',
  },
  nexrideRow: {
    backgroundColor: 'rgba(67, 233, 123, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#43e97b',
  },
  providerName: {
    fontSize: fonts.sizes.base,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  nexrideName: {
    fontSize: fonts.sizes.base,
    color: '#43e97b',
    fontWeight: 'bold',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  competitorPrice: {
    fontSize: fonts.sizes.lg,
    color: '#ff6b6b',
    fontWeight: 'bold',
    marginRight: spacing.sm,
  },
  nexridePrice: {
    fontSize: fonts.sizes.lg,
    color: '#43e97b',
    fontWeight: 'bold',
    marginRight: spacing.sm,
  },
  surgeMultiplier: {
    fontSize: fonts.sizes.sm,
    color: '#ff6b6b',
    marginRight: spacing.sm,
  },
  noSurgeText: {
    fontSize: fonts.sizes.xs,
    color: '#43e97b',
    marginRight: spacing.sm,
  },
  statusIcon: {
    fontSize: fonts.sizes.base,
  },
  savingsContainer: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  savingsGradient: {
    padding: spacing.md,
    alignItems: 'center',
  },
  savingsAmount: {
    fontSize: fonts.sizes.lg,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  savingsSubtext: {
    fontSize: fonts.sizes.sm,
    color: '#FFFFFF',
  },
  additionalInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  infoLabel: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoValue: {
    fontSize: fonts.sizes.sm,
    color: '#43e97b',
    fontWeight: 'bold',
  },
});
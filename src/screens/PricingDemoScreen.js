// src/screens/PricingDemoScreen.js - NO IMPORTS VERSION

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function PricingDemoScreen({ navigation }) {
  // Mock data directly in component (no imports)
  const pricing = {
    nexridePrice: 21.40,
    savings: { amount: 7.10, percentage: 25 }
  };
  
  const userStats = {
    monthlyStats: { rides: 28, totalSaved: 127.40, avgSavingsPercent: 23 },
    tokenEarnings: { month: 284 }
  };
  
  const marketData = {
    avgSavingsAcrossUsers: 23.4,
    totalSavingsGenerated: 2800000
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0a0e27', '#1a1d3a', '#2d3561']} style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>💰 Pricing Demo</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          
          {/* Success Message */}
          <View style={styles.section}>
            <Text style={styles.successText}>🎉 Pricing System Works!</Text>
            <Text style={styles.infoText}>No import errors - direct data!</Text>
          </View>
          
          {/* Price Comparison */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 PRICE COMPARISON</Text>
            
            <View style={styles.priceRow}>
              <Text style={styles.label}>Uber:</Text>
              <Text style={styles.competitorPrice}>$29.50</Text>
              <Text>❌</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.label}>Careem:</Text>
              <Text style={styles.competitorPrice}>$26.80</Text>
              <Text>❌</Text>
            </View>
            
            <View style={[styles.priceRow, styles.nexrideRow]}>
              <Text style={styles.label}>NexRide:</Text>
              <Text style={styles.nexridePrice}>${pricing.nexridePrice}</Text>
              <Text>✅</Text>
            </View>
            
            <View style={styles.savingsBox}>
              <Text style={styles.savingsText}>
                💰 Save ${pricing.savings.amount} ({pricing.savings.percentage}% cheaper)
              </Text>
            </View>
          </View>
          
          {/* User Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💎 YOUR SAVINGS</Text>
            <Text style={styles.statText}>Monthly Rides: {userStats.monthlyStats.rides}</Text>
            <Text style={styles.statText}>Total Saved: ${userStats.monthlyStats.totalSaved}</Text>
            <Text style={styles.statText}>Average Savings: {userStats.monthlyStats.avgSavingsPercent}%</Text>
            <Text style={styles.statText}>🪙 Tokens Earned: {userStats.tokenEarnings.month}</Text>
          </View>
          
          {/* Market Data */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 MARKET ANALYTICS</Text>
            <Text style={styles.statText}>Avg User Savings: {marketData.avgSavingsAcrossUsers}%</Text>
            <Text style={styles.statText}>Total Platform Savings: ${(marketData.totalSavingsGenerated/1000000).toFixed(1)}M</Text>
          </View>
          
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    fontSize: 18,
    color: '#4facfe',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  successText: {
    fontSize: 24,
    color: '#43e97b',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  nexrideRow: {
    backgroundColor: 'rgba(67, 233, 123, 0.1)',
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  competitorPrice: {
    fontSize: 18,
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  nexridePrice: {
    fontSize: 18,
    color: '#43e97b',
    fontWeight: 'bold',
  },
  savingsBox: {
    backgroundColor: 'rgba(67, 233, 123, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  savingsText: {
    fontSize: 16,
    color: '#43e97b',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';

export default function SubscriptionModal({ 
  visible, 
  onClose, 
  onSelectTier, 
  hasCurrentRide = false 
}) {
  const [selectedTier, setSelectedTier] = useState(null);

  const subscriptionTiers = [
    {
      id: 'comfort',
      name: 'Comfort',
      price: 5,
      gfelPrice: 10,
      popular: false,
      gradient: ['#4facfe', '#00f2fe'],
      benefits: [
        '10% discount on all rides',
        'Minimum Comfort vehicles',
        'VR in-ride experiences',
        'Priority drivers'
      ]
    },
    {
      id: 'ultra',
      name: 'Ultra',
      price: 15,
      gfelPrice: 30,
      popular: true,
      gradient: ['#667eea', '#764ba2'],
      benefits: [
        '20% discount on all rides',
        'All Comfort benefits included',
        'Exclusive premium vehicles',
        'AI negotiation boost',
        'No cancellation fees',
        'Priority luxury drivers'
      ]
    }
  ];

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
  };

  const handleContinue = () => {
    if (!selectedTier) {
      Alert.alert('⚠️ Select Plan', 'Please select a subscription plan to continue');
      return;
    }

    if (hasCurrentRide) {
      // Ask if they want to complete ride booking now
      Alert.alert(
        '🚗 Complete Ride Booking?',
        `Add ${selectedTier.name} subscription ($${selectedTier.price}/month) to your current ride and proceed to payment?`,
        [
          { 
            text: 'Just Subscription', 
            onPress: () => onSelectTier(selectedTier, false) 
          },
          { 
            text: 'Ride + Subscription', 
            onPress: () => onSelectTier(selectedTier, true),
            style: 'default'
          }
        ]
      );
    } else {
      onSelectTier(selectedTier, false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#0a0e27', '#1a1d3a', '#2d3561']}
            style={styles.modalGradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Choose Your Plan</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
              {/* Subscription Tiers */}
              <View style={styles.tiersContainer}>
                {subscriptionTiers.map((tier) => (
                  <TouchableOpacity
                    key={tier.id}
                    style={[
                      styles.tierCard,
                      selectedTier?.id === tier.id && styles.tierCardSelected
                    ]}
                    onPress={() => handleTierSelect(tier)}
                  >
                    <LinearGradient
                      colors={selectedTier?.id === tier.id ? tier.gradient : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                      style={styles.tierGradient}
                    >
                      {/* Popular Badge */}
                      {tier.popular && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularText}>MOST POPULAR</Text>
                        </View>
                      )}

                      {/* Tier Header */}
                      <View style={styles.tierHeader}>
                        <Text style={styles.tierName}>{tier.name}</Text>
                        <View style={styles.priceContainer}>
                          <Text style={styles.price}>${tier.price}</Text>
                          <Text style={styles.priceSubtext}>/month</Text>
                        </View>
                        <View style={styles.gfelContainer}>
                          <Text style={styles.gfelText}>or {tier.gfelPrice} GFEL</Text>
                        </View>
                      </View>

                      {/* Benefits List */}
                      <View style={styles.benefitsContainer}>
                        {tier.benefits.map((benefit, index) => (
                          <View key={index} style={styles.benefitRow}>
                            <Text style={styles.benefitIcon}>✅</Text>
                            <Text style={styles.benefitText}>{benefit}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Selection Indicator */}
                      <View style={styles.selectionContainer}>
                        <View style={[
                          styles.radioButton,
                          selectedTier?.id === tier.id && styles.radioButtonSelected
                        ]}>
                          {selectedTier?.id === tier.id && (
                            <View style={styles.radioButtonInner} />
                          )}
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Savings Calculator */}
              {selectedTier && (
                <View style={styles.savingsSection}>
                  <LinearGradient
                    colors={['rgba(79, 172, 254, 0.1)', 'rgba(0, 242, 254, 0.1)']}
                    style={styles.savingsCard}
                  >
                    <Text style={styles.savingsTitle}>💰 Your Monthly Savings</Text>
                    <Text style={styles.savingsText}>
                      With {selectedTier.name} plan: Save up to ${selectedTier.price * 3}/month on rides
                    </Text>
                    <Text style={styles.savingsSubtext}>
                      Plan pays for itself with just 2-3 rides per month!
                    </Text>
                  </LinearGradient>
                </View>
              )}

              {/* Continue Button */}
              <View style={styles.continueSection}>
                <TouchableOpacity 
                  style={[
                    styles.continueButton,
                    !selectedTier && styles.continueButtonDisabled
                  ]} 
                  onPress={handleContinue}
                  disabled={!selectedTier}
                >
                  <LinearGradient
                    colors={selectedTier ? selectedTier.gradient : ['#666', '#888']}
                    style={styles.continueGradient}
                  >
                    <Text style={styles.continueButtonText}>
                      {hasCurrentRide ? 'Continue with Subscription' : 'Subscribe Now'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
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
  
  // Header
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
    textAlign: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.lg,
  },
  closeIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  
  scrollContainer: {
    flex: 1,
  },
  
  // Tiers Container
  tiersContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  tierCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  tierCardSelected: {
    transform: [{ scale: 1.02 }],
  },
  tierGradient: {
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: borderRadius.xl,
  },
  
  // Popular Badge
  popularBadge: {
    position: 'absolute',
    top: -1,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: '#ff6b6b',
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  popularText: {
    fontSize: fonts.sizes.xs,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  
  // Tier Header
  tierHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  tierName: {
    fontSize: fonts.sizes.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: fonts.sizes.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priceSubtext: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: spacing.xs,
  },
  gfelContainer: {
    marginTop: spacing.xs,
  },
  gfelText: {
    fontSize: fonts.sizes.base,
    color: '#4facfe',
    fontWeight: '600',
  },
  
  // Benefits
  benefitsContainer: {
    marginBottom: spacing.lg,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  benefitIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  benefitText: {
    fontSize: fonts.sizes.base,
    color: '#FFFFFF',
    flex: 1,
  },
  
  // Selection
  selectionContainer: {
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#FFFFFF',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  
  // Savings Section
  savingsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  savingsCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  savingsTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  savingsText: {
    fontSize: fonts.sizes.base,
    color: '#4facfe',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  savingsSubtext: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  
  // Continue Button
  continueSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  continueButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    height: 56,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
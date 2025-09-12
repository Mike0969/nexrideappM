import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';
import ChipConnectionsBG from '../components/ChipConnectionsBG';
// import Voice from '@react-native-voice/voice'; // DISABLED for Expo Go testing

// Embedded SubscriptionModal Component for HomeScreen
const SubscriptionModal = ({ visible, onClose, onSelectTier, hasCurrentRide = false }) => {
  const [selectedTier, setSelectedTier] = useState(null);

  const subscriptionTiers = [
    {
      id: 'comfort',
      name: 'Comfort',
      price: 5,
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

    onSelectTier(selectedTier, false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={subscriptionModalStyles.overlay}>
        <View style={subscriptionModalStyles.modalContainer}>
          <LinearGradient
            colors={['#0a0e27', '#1a1d3a', '#2d3561']}
            style={subscriptionModalStyles.modalGradient}
          >
            <View style={subscriptionModalStyles.header}>
              <Text style={subscriptionModalStyles.headerTitle}>Choose Your Plan</Text>
              <TouchableOpacity style={subscriptionModalStyles.closeButton} onPress={onClose}>
                <Text style={subscriptionModalStyles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={subscriptionModalStyles.scrollContainer} showsVerticalScrollIndicator={false}>
              <View style={subscriptionModalStyles.tiersContainer}>
                {subscriptionTiers.map((tier) => (
                  <TouchableOpacity
                    key={tier.id}
                    style={[
                      subscriptionModalStyles.tierCard,
                      selectedTier?.id === tier.id && subscriptionModalStyles.tierCardSelected
                    ]}
                    onPress={() => handleTierSelect(tier)}
                  >
                    <LinearGradient
                      colors={selectedTier?.id === tier.id ? tier.gradient : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                      style={subscriptionModalStyles.tierGradient}
                    >
                      {tier.popular && (
                        <View style={subscriptionModalStyles.popularBadge}>
                          <Text style={subscriptionModalStyles.popularText}>MOST POPULAR</Text>
                        </View>
                      )}

                      <View style={subscriptionModalStyles.tierHeader}>
                        <Text style={subscriptionModalStyles.tierName}>{tier.name}</Text>
                        <View style={subscriptionModalStyles.priceContainer}>
                          <Text style={subscriptionModalStyles.price}>${tier.price}</Text>
                          <Text style={subscriptionModalStyles.priceSubtext}>/month</Text>
                        </View>
                      </View>

                      <View style={subscriptionModalStyles.benefitsContainer}>
                        {tier.benefits.map((benefit, index) => (
                          <View key={index} style={subscriptionModalStyles.benefitRow}>
                            <Text style={subscriptionModalStyles.benefitIcon}>✅</Text>
                            <Text style={subscriptionModalStyles.benefitText}>{benefit}</Text>
                          </View>
                        ))}
                      </View>

                      <View style={subscriptionModalStyles.selectionContainer}>
                        <View style={[
                          subscriptionModalStyles.radioButton,
                          selectedTier?.id === tier.id && subscriptionModalStyles.radioButtonSelected
                        ]}>
                          {selectedTier?.id === tier.id && (
                            <View style={subscriptionModalStyles.radioButtonInner} />
                          )}
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={subscriptionModalStyles.continueSection}>
                <TouchableOpacity 
                  style={[
                    subscriptionModalStyles.continueButton,
                    !selectedTier && subscriptionModalStyles.continueButtonDisabled
                  ]} 
                  onPress={handleContinue}
                  disabled={!selectedTier}
                >
                  <LinearGradient
                    colors={selectedTier ? selectedTier.gradient : ['#666', '#888']}
                    style={subscriptionModalStyles.continueGradient}
                  >
                    <Text style={subscriptionModalStyles.continueButtonText}>
                      Subscribe Now
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
};

export default function HomeScreen({ navigation }) {
  const { state } = useApp();
  const [tapCount, setTapCount] = useState({});
  const [tapTimeout, setTapTimeout] = useState({});
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  // Voice states - keeping for future development build
  const [isRecording, setIsRecording] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);

  const favorites = [
    { id: 1, name: 'Dubai Mall', distance: '12.5 km', eta: '15 min', icon: '🏬', basePrice: 12 },
    { id: 2, name: 'DIFC', distance: '8.2 km', eta: '12 min', icon: '🏢', basePrice: 8 },
    { id: 3, name: 'Marina', distance: '15.8 km', eta: '18 min', icon: '🌊', basePrice: 16 },
    { id: 4, name: 'Airport', distance: '25.3 km', eta: '28 min', icon: '✈️', basePrice: 28 },
    { id: 5, name: 'Home', distance: '5.5 km', eta: '8 min', icon: '🏠', basePrice: 6 },
    { id: 6, name: 'Work', distance: '18.2 km', eta: '22 min', icon: '💼', basePrice: 19 },
  ];

  const getDestinationAddress = (name) => {
    const addressMap = {
      'Dubai Mall': 'Downtown Dubai',
      'DIFC': 'Dubai International Financial Centre',
      'Marina': 'Dubai Marina',
      'Airport': 'Dubai International Airport',
      'Home': 'Your Home Address',
      'Work': 'Your Work Address'
    };
    return addressMap[name] || 'Dubai, UAE';
  };

  const getDestinationCoordinates = (name) => {
    const coordsMap = {
      'Dubai Mall': { lat: 25.1972, lng: 55.2796 },
      'DIFC': { lat: 25.2127, lng: 55.2804 },
      'Marina': { lat: 25.0772, lng: 55.1385 },
      'Airport': { lat: 25.2532, lng: 55.3657 },
      'Home': { lat: 25.2048, lng: 55.2708 },
      'Work': { lat: 25.2050, lng: 55.2710 }
    };
    return coordsMap[name] || { lat: 25.2048, lng: 55.2708 };
  };

  const handleWhereToPress = () => {
    navigation.navigate('Destination');
  };

  const handleFavoritePress = (favorite) => {
    const favoriteId = favorite.id;
    const currentCount = tapCount[favoriteId] || 0;
    const newCount = currentCount + 1;

    if (tapTimeout[favoriteId]) {
      clearTimeout(tapTimeout[favoriteId]);
    }

    if (newCount === 1) {
      setTapCount(prev => ({ ...prev, [favoriteId]: 1 }));
      
      const timeoutId = setTimeout(() => {
        Alert.alert(
          `🎯 ${favorite.name}`,
          `📍 Distance: ${favorite.distance}\n⏱️ ETA: ${favorite.eta}\n💰 Est. cost: ~$${favorite.basePrice}\n\n💡 Double tap to book ride`,
          [{ text: 'Got it!', style: 'default' }]
        );
        
        setTapCount(prev => ({ ...prev, [favoriteId]: 0 }));
        setTapTimeout(prev => ({ ...prev, [favoriteId]: null }));
      }, 300);

      setTapTimeout(prev => ({ ...prev, [favoriteId]: timeoutId }));

    } else if (newCount === 2) {
      console.log('🎯 Double tap detected for:', favorite.name);
      
      clearTimeout(tapTimeout[favoriteId]);
      setTapCount(prev => ({ ...prev, [favoriteId]: 0 }));
      setTapTimeout(prev => ({ ...prev, [favoriteId]: null }));

      const destinationData = {
        name: favorite.name,
        address: getDestinationAddress(favorite.name),
        lat: getDestinationCoordinates(favorite.name).lat,
        lng: getDestinationCoordinates(favorite.name).lng,
        icon: favorite.icon
      };

      navigation.navigate('Destination', { 
        selectedDestination: destinationData,
        quickDestination: true
      });
    }
  };

  const handleWalletPress = (type) => {
    if (type === 'nrx') {
      Alert.alert('💰 GFEL Wallet', `Balance: ${state.nrxBalance} GFEL\n\nCrypto rewards and earnings`);
    } else if (type === 'cash') {
      Alert.alert('💳 Cash Wallet', 'Balance: $250.00\n\nCredit cards and payments');
    }
  };

  const handleSubscriptionPress = () => {
    console.log('🎯 Opening subscription modal from HomeScreen...');
    setShowSubscriptionModal(true);
  };

  const handleSubscriptionSelect = (tier, includeCurrentRide) => {
    setShowSubscriptionModal(false);
    
    navigation.navigate('Payment', {
      subscription: {
        tier: tier.id,
        name: tier.name,
        price: tier.price,
        includeWithRide: false
      }
    });
  };

  const handleProfilePress = () => {
    navigation.navigate('UserProfile');
  };

  // DISABLED Voice functions for Expo Go testing
  const handleMicPress = () => {
    Alert.alert('🎤 Voice Feature', 'Voice booking will be available in the next update!');
  };

  const handleMicLongPress = () => {
    Alert.alert('🎤 Voice Feature', 'Voice booking coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0e27', '#1a1d3a', '#2d3561']}
        style={styles.gradient}
      >
        {/* subtle chip-style background */}
        <ChipConnectionsBG tint="#C7CED8" opacity={0.20} style={StyleSheet.absoluteFill} />

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good morning!</Text>
              <Text style={styles.location}>📍 Downtown Dubai</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={handleProfilePress}
            >
              <Text style={styles.profileIcon}>👤</Text>
            </TouchableOpacity>
          </View>

          {/* Top Wallets Row */}
          <View style={styles.topWalletsRow}>
            <TouchableOpacity 
              style={styles.sideWallet}
              onPress={() => handleWalletPress('nrx')}
            >
              <Text style={styles.walletIcon}>💰</Text>
              <Text style={styles.walletLabel}>GFEL</Text>
              <Text style={styles.walletAmount}>{state.nrxBalance}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.sideWallet}
              onPress={() => handleWalletPress('cash')}
            >
              <Text style={styles.walletIcon}>💳</Text>
              <Text style={styles.walletLabel}>Cash</Text>
              <Text style={styles.walletAmount}>$250</Text>
            </TouchableOpacity>
          </View>

          {/* Subscription Section */}
          <View style={styles.subscriptionSection}>
            <TouchableOpacity 
              style={styles.subscriptionCard}
              onPress={handleSubscriptionPress}
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.subscriptionGradient}
              >
                <Text style={styles.subscriptionIcon}>⭐</Text>
                <Text style={styles.subscriptionTitle}>SUBSCRIPTION</Text>
                <Text style={styles.subscriptionSubtitle}>Upgrade to NexRide Pro</Text>
                <Text style={styles.subscriptionBenefit}>20% off • Priority • AI Boost</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Where To Section - Voice disabled for now */}
          <View style={styles.whereToSection}>
            <TouchableOpacity style={styles.whereToInput} onPress={handleWhereToPress}>
              <Text style={styles.whereToPlaceholder}>🔍 Where to?</Text>
              <Text style={styles.whereToArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Destinations */}
          <View style={styles.quickDestinationsSection}>
            <Text style={styles.sectionTitle}>QUICK DESTINATIONS</Text>
            <Text style={styles.sectionSubtitle}>Single tap for ETA • Double tap to book</Text>
            <View style={styles.destinationsGrid}>
              {favorites.map((favorite) => (
                <TouchableOpacity 
                  key={favorite.id} 
                  style={[
                    styles.destinationCard,
                    tapCount[favorite.id] === 1 && styles.destinationCardTapped
                  ]}
                  onPress={() => handleFavoritePress(favorite)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.destinationIcon}>{favorite.icon}</Text>
                  <Text style={styles.destinationName}>{favorite.name}</Text>
                  <Text style={styles.destinationEta}>{favorite.eta}</Text>
                  {tapCount[favorite.id] === 1 && (
                    <View style={styles.tapIndicator}>
                      <Text style={styles.tapIndicatorText}>1</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <SubscriptionModal
          visible={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          onSelectTier={handleSubscriptionSelect}
          hasCurrentRide={false}
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
    justifyContent: Platform.OS === 'android' ? 'space-evenly' : 'flex-start',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingBottom: Platform.OS === 'android' ? 25 : 0,
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === 'android' ? spacing.sm : spacing.md,
    paddingBottom: spacing.xs,
  },
  greeting: {
    fontSize: fonts.sizes.base,
    fontFamily: fonts.heading,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  location: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: fonts.medium,
    marginTop: 2,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  profileIcon: {
    fontSize: 16,
  },
  
  topWalletsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: Platform.OS === 'android' ? spacing.md : spacing.xs,
  },
  sideWallet: {
    width: '45%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  walletIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  walletLabel: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: fonts.medium,
  },
  walletAmount: {
    fontSize: fonts.sizes.xs,
    color: '#4facfe',
    fontFamily: fonts.bold,
    marginTop: 1,
  },

  subscriptionSection: {
    paddingHorizontal: spacing.md,
    marginBottom: Platform.OS === 'android' ? spacing.md : spacing.xs,
  },
  subscriptionCard: {
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  subscriptionGradient: {
    padding: spacing.xs,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  subscriptionIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  subscriptionTitle: {
    fontSize: fonts.sizes.xs,
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subscriptionSubtitle: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginTop: 2,
  },
  subscriptionBenefit: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginTop: 2,
  },

  whereToSection: {
    paddingHorizontal: spacing.md,
    marginBottom: Platform.OS === 'android' ? spacing.md : spacing.sm,
  },
  whereToInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  whereToPlaceholder: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: fonts.medium,
  },
  whereToArrow: {
    fontSize: fonts.sizes.lg,
    color: '#4facfe',
  },

  quickDestinationsSection: {
    paddingHorizontal: spacing.md,
    marginBottom: Platform.OS === 'android' ? spacing.lg : spacing.sm,
  },
  sectionTitle: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
    marginBottom: 2,
    letterSpacing: 0.6,
  },
  sectionSubtitle: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: fonts.regular,
    marginBottom: spacing.xs,
  },
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  destinationCard: {
    width: '31%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: borderRadius.xs,
    padding: spacing.xs,
    alignItems: 'center',
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
    position: 'relative',
  },
  destinationCardTapped: {
    backgroundColor: 'rgba(79,172,254,0.2)',
    borderColor: '#4facfe',
    transform: [{ scale: 0.98 }],
  },
  destinationIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  destinationName: {
    fontSize: fonts.sizes.xs,
    color: '#FFFFFF',
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  destinationEta: {
    fontSize: fonts.sizes.xs,
    color: '#4facfe',
    marginTop: 1,
    fontFamily: fonts.bold,
  },
  
  tapIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4facfe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  tapIndicatorText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: fonts.bold,
  },
});

// Subscription Modal Styles
const subscriptionModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '75%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
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
    right: 20,
  },
  closeIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  tiersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tierCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tierCardSelected: {
    transform: [{ scale: 1.02 }],
  },
  tierGradient: {
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 16,
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    left: 16,
    right: 16,
    backgroundColor: '#ff6b6b',
    paddingVertical: 6,
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  popularText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tierHeader: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 12,
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priceSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 6,
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIcon: {
    fontSize: 14,
    marginRight: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  selectionContainer: {
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#FFFFFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  continueSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 48,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
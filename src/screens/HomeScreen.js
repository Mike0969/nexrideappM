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
  Platform,
  Image,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';
import ChipConnectionsBG from '../components/ChipConnectionsBG';
import Svg, { Path, G, Circle } from 'react-native-svg';

// Custom SVG Icons in Blue Neon - 30% Bigger
const CarIcon = ({ size = 25 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G fill="none">
      <Path fill="#4facfe" d="M4.826 9.13h14.348A3.826 3.826 0 0 1 23 12.957v4.782a.957.957 0 0 1-.957.957H1.957A.956.956 0 0 1 1 17.739v-4.783A3.826 3.826 0 0 1 4.826 9.13"/>
      <Path fill="#00f2fe" d="M22.88 12a3.826 3.826 0 0 0-3.706-2.87H4.827A3.826 3.826 0 0 0 1.12 12z"/>
      <Path fill="#4facfe" d="m4.348 9.13l.69-4.14A1.91 1.91 0 0 1 6.93 3.392h10.146a1.91 1.91 0 0 1 1.886 1.599l.69 4.14z"/>
      <Path stroke="#191919" strokeLinecap="round" strokeLinejoin="round" d="M4.826 9.13h14.348A3.826 3.826 0 0 1 23 12.957v4.782a.957.957 0 0 1-.957.957H1.957A.956.956 0 0 1 1 17.739v-4.783A3.826 3.826 0 0 1 4.826 9.13m-.478 0l.69-4.14a1.91 1.91 0 0 1 1.886-1.6h10.15a1.91 1.91 0 0 1 1.887 1.599l.69 4.14" strokeWidth="1"/>
    </G>
  </Svg>
);

const ScheduleIcon = ({ size = 25 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G fill="none" stroke="#4facfe" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <Path d="M9 20H6a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4v3M8 2v2m7-2v2M2 8h19m-2.5 7.643l-1.5 1.5"/>
      <Circle cx="17" cy="17" r="5"/>
    </G>
  </Svg>
);

const CarpoolIcon = ({ size = 25 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill="#4facfe" d="M8 16c0-2.4 1.1-4.5 2.7-6H3l1.5-4.5h11l.8 2.5c.6 0 1.2.1 1.7.3L16.9 5c-.2-.6-.8-1-1.4-1h-11c-.7 0-1.2.4-1.4 1L1 11v8c0 .5.5 1 1 1h1c.5 0 1-.5 1-1v-1h4.3c-.2-.6-.3-1.3-.3-2m-3.5-1c-.8 0-1.5-.7-1.5-1.5S3.7 12 4.5 12s1.5.7 1.5 1.5S5.3 15 4.5 15M16 20v-2h-3v-1h1c1.1 0 2-.9 2-2v-1c0-1.1-.9-2-2-2h-3v2h3v1h-1c-1.1 0-2 .9-2 2v3m12-3h-2v2h-2v-2h-2v-2h2v-2h2v2h2z"/>
  </Svg>
);

const PackageIcon = ({ size = 25 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G fill="none" stroke="#4facfe" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1">
      <Path d="M7.5 7.5v10l8 3.5l8-3.5v-10"/>
      <Path d="m7.5 7.5l8 3.5l8-3.5"/>
      <Path d="m11.5 5.75l8 3.531V12.5"/>
      <Path d="m7.5 7.5l8-3.5l8 3.5m-22 6.152l.047.022L5.5 15.5m-3.294-5.022L5.5 12M2.865 7.283L5.5 8.5m10 2.5v10"/>
    </G>
  </Svg>
);

// Crypto Token Icon - Same Size as Cash Icon
const CryptoIcon = ({ size = 12 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G fill="none" fillRule="evenodd" clipRule="evenodd">
      <Path fill="#4facfe" d="M12.062 13.48a6.68 6.68 0 0 0-6.37-2.72A6.64 6.64 0 0 0 .122 17c-.06 1.89.68 4.51 2.38 5.44a.31.31 0 0 0 .46-.087a.31.31 0 0 0-.15-.444c-1.42-.85-2-3.22-1.84-4.84a5.69 5.69 0 0 1 4.87-5.16a5.59 5.59 0 0 1 5.27 2.25c2.77 3.84.36 9-4.94 9.1a6 6 0 0 1-1.35-.14a.35.35 0 0 0-.431.392a.35.35 0 0 0 .261.288a6.3 6.3 0 0 0 1.52.2c6.11.08 9.05-6 5.89-10.52M2.742 6.12a11.4 11.4 0 0 0 1.72-.34a.35.35 0 0 0 0-.5c-.15-.21-.57-.28-.82-.28a.3.3 0 0 0 0-.1c.14-1.4.86-3.08-.21-4.55c-.22-.35-.43-.35-.7-.35c-.54.19-.73.79-.92 1.34c-.12.37.44.78.89-.1c.3 1.04.14 2.76.3 3.76a4 4 0 0 0-.48 0c-1.42 0-1.24-.17-1.52.1c-.08.09-.08.28.16.48a2.85 2.85 0 0 0 1.58.54"/>
      <Path fill="#00f2fe" d="M7.382 5.86c.453.14.929.188 1.4.14c2.22-.39 2.65-4.09.93-5.51a2.85 2.85 0 0 0-2.94.45A4 4 0 0 0 5.762 4a2.08 2.08 0 0 0 1.62 1.86m.79-4.81c2.36-.45 1.9 3.62.45 3.78a2.9 2.9 0 0 1-1-.12c-1.3-.3-.95-3.37.55-3.66"/>
      <Path fill="#4facfe" d="M14.422 6.12c.577-.07 1.15-.184 1.71-.34a.35.35 0 0 0 0-.5c-.13-.21-.57-.28-.82-.28a.3.3 0 0 0 0-.1c.13-1.41.85-3.09-.22-4.56c-.21-.34-.44-.34-.69-.34c-.54.17-.76.77-.91 1.32c-.13.37.43.78.88-.1c.26 1 .14 2.75.27 3.71a4 4 0 0 0-.47 0c-1.4 0-1.22-.11-1.47.16c-.08.09-.08.28.16.48a2.9 2.9 0 0 0 1.56.55"/>
    </G>
  </Svg>
);

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

  const handleServicePress = (serviceType) => {
    switch(serviceType) {
      case 'ride':
        navigation.navigate('Destination');
        break;
      case 'reserve':
        Alert.alert('📅 Reserve Ride', 'Plan your future trips!\n\nComing soon in next update.');
        break;
      case 'carpool':
        Alert.alert('🚌 Smart Carpool', 'Save 70% by sharing rides!\n\n• Eco-friendly travel\n• Meet new people\n• Massive savings\n\nComing soon!');
        break;
      case 'package':
        Alert.alert('📦 Package Delivery', 'Send packages with NexRide drivers!\n\nComing soon in next update.');
        break;
    }
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

  const handleAdvantagePress = (type) => {
    if (type === 'ai') {
      // Link to AI Negotiation MVP page
      Linking.openURL('https://nex-shuttle.com/ai-negotiation');
    } else if (type === 'carpool') {
      // Link to Carpooling MVP page  
      Linking.openURL('https://nex-shuttle.com/carpooling');
    } else if (type === 'vr') {
      // Link to VR Features MVP page
      Linking.openURL('https://nex-shuttle.com/vr');
    }
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
          
          {/* Header - Unchanged */}
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

          {/* Wallets - Crypto Icon Same Size as Cash */}
          <View style={styles.walletsRow}>
            <TouchableOpacity 
              style={styles.walletCard}
              onPress={() => handleWalletPress('nrx')}
            >
              <CryptoIcon size={12} />
              <Text style={styles.walletLabel}>GFEL</Text>
              <Text style={styles.walletAmount}>{state.nrxBalance}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.walletCard}
              onPress={() => handleWalletPress('cash')}
            >
              <Text style={styles.walletIcon}>💳</Text>
              <Text style={styles.walletLabel}>Cash</Text>
              <Text style={styles.walletAmount}>$250</Text>
            </TouchableOpacity>
          </View>

          {/* Subscription - Text Changed */}
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
                <View style={styles.subscriptionContent}>
                  <Text style={styles.subscriptionTitle}>NexRide Subscription</Text>
                  <Text style={styles.subscriptionSubtitle}>20% off • Priority • AI Boost</Text>
                </View>
                <Text style={styles.subscriptionArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Where To - Unchanged */}
          <View style={styles.whereToSection}>
            <TouchableOpacity style={styles.whereToInput} onPress={handleWhereToPress}>
              <Text style={styles.whereToPlaceholder}>🔍 Where to?</Text>
              <Text style={styles.whereToArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Service Options - Add Space Below */}
          <View style={styles.servicesSection}>
            <View style={styles.servicesRow}>
              <TouchableOpacity style={styles.serviceCard} onPress={() => handleServicePress('ride')}>
                <View style={styles.serviceIconContainer}>
                  <CarIcon size={25} />
                </View>
                <Text style={styles.serviceName}>Ride</Text>
                <Text style={styles.serviceDesc}>Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.serviceCard} onPress={() => handleServicePress('reserve')}>
                <View style={styles.serviceIconContainer}>
                  <ScheduleIcon size={25} />
                </View>
                <Text style={styles.serviceName}>Reserve</Text>
                <Text style={styles.serviceDesc}></Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.serviceCard} onPress={() => handleServicePress('carpool')}>
                <View style={[styles.serviceIconContainer, styles.carpoolHighlight]}>
                  <CarpoolIcon size={25} />
                </View>
                <Text style={styles.serviceName}>Carpool</Text>
                <Text style={[styles.serviceDesc, styles.saveHighlight]}>Save 70%</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.serviceCard} onPress={() => handleServicePress('package')}>
                <View style={styles.serviceIconContainer}>
                  <PackageIcon size={25} />
                </View>
                <Text style={styles.serviceName}>Package</Text>
                <Text style={styles.serviceDesc}>Delivery</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Suggestions - Moved Down One Row */}
          <View style={styles.suggestionsSection}>
            <Text style={styles.sectionTitle}>SUGGESTIONS</Text>
            <Text style={styles.sectionSubtitle}>Single tap for info • Double tap to book</Text>
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

          {/* Advantage Images - AI Actually Changed Now! */}
          <View style={styles.advantagesSection}>
            <View style={styles.advantagesRowThree}>
              <TouchableOpacity 
                style={styles.advantageCardThree}
                onPress={() => handleAdvantagePress('ai')}
              >
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop&crop=center' }}
                  style={styles.advantageImageThree}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
                  style={styles.advantageOverlayThree}
                >
                  <Text style={styles.advantageTitleThree}>AI Negotiation</Text>
                  <Text style={styles.advantageSubtitleThree}>Smart Price</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.advantageCardThree}
                onPress={() => handleAdvantagePress('carpool')}
              >
                <Image 
                  source={{ uri: 'https://pfst.cf2.poecdn.net/base/image/40798105b95e162072b750eef569606866a693159d212e5d6c0cf7cc66d23c2e?w=309&h=400' }}
                  style={styles.advantageImageThree}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
                  style={styles.advantageOverlayThree}
                >
                  <Text style={styles.advantageTitleThree}>Smart Carpooling</Text>
                  <Text style={styles.advantageSubtitleThree}>Save 70%</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.advantageCardThree}
                onPress={() => handleAdvantagePress('vr')}
              >
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&h=300&fit=crop&crop=center' }}
                  style={styles.advantageImageThree}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
                  style={styles.advantageOverlayThree}
                >
                  <Text style={styles.advantageTitleThree}>VR Experience</Text>
                  <Text style={styles.advantageSubtitleThree}>Entertainment</Text>
                </LinearGradient>
              </TouchableOpacity>
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
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContainer: { flex: 1 },

  // Header - Unchanged
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 8 : 6,
    paddingBottom: 4,
  },
  greeting: {
    fontSize: 16,
    fontFamily: fonts.heading,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  location: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: fonts.medium,
    marginTop: 1,
  },
  profileButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  profileIcon: { fontSize: 14 },

  // Wallets - Crypto Icon Same Size as Cash
  walletsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  walletCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    padding: 7,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  walletIcon: { fontSize: 12, marginBottom: 2 }, // Same size as crypto icon
  walletLabel: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: fonts.medium,
    marginTop: 2,
  },
  walletAmount: {
    fontSize: 10,
    color: '#4facfe',
    fontFamily: fonts.bold,
    marginTop: 1,
  },

  // Subscription - Text Changed, Same Size
  subscriptionSection: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  subscriptionCard: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  subscriptionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    minHeight: 40,
  },
  subscriptionIcon: { fontSize: 14, marginRight: 6 },
  subscriptionContent: { flex: 1 },
  subscriptionTitle: {
    fontSize: 11,
    color: '#FFFFFF',
    fontFamily: fonts.bold,
  },
  subscriptionSubtitle: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: fonts.regular,
    marginTop: 1,
  },
  subscriptionArrow: {
    fontSize: 12,
    color: '#FFFFFF',
  },

  // Where To - Unchanged
  whereToSection: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  whereToInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  whereToPlaceholder: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: fonts.medium,
  },
  whereToArrow: {
    fontSize: 16,
    color: '#4facfe',
  },

  // Service Options - Add Space Below for Suggestions
  servicesSection: {
    paddingHorizontal: 16,
    marginBottom: 12, // Increased to create space for suggestions
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '23%',
    alignItems: 'center',
    paddingVertical: 7,
  },
  serviceIconContainer: {
    width: 49,
    height: 49,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  carpoolHighlight: {
    backgroundColor: 'rgba(0, 200, 81, 0.15)',
    borderColor: 'rgba(0, 200, 81, 0.3)',
  },
  serviceName: {
    fontSize: 9.5,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 1,
  },
  serviceDesc: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
  saveHighlight: {
    color: '#00c851',
    fontFamily: fonts.bold,
  },

  // Suggestions - One Row Down
  suggestionsSection: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
    marginBottom: 2,
    letterSpacing: 0.6,
  },
  sectionSubtitle: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: fonts.regular,
    marginBottom: 6,
  },
  destinationsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  destinationCard: {
    width: '23%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    padding: 5,
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
    position: 'relative',
  },
  destinationCardTapped: {
    backgroundColor: 'rgba(79,172,254,0.2)',
    borderColor: '#4facfe',
    transform: [{ scale: 0.98 }],
  },
  destinationIcon: { fontSize: 8, marginBottom: 2 },
  destinationName: {
    fontSize: 7,
    color: '#FFFFFF',
    fontFamily: fonts.medium,
    textAlign: 'center',
    marginBottom: 1,
  },
  destinationEta: {
    fontSize: 6,
    color: '#4facfe',
    fontFamily: fonts.bold,
  },
  
  tapIndicator: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4facfe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  tapIndicatorText: {
    fontSize: 6,
    color: '#FFFFFF',
    fontFamily: fonts.bold,
  },

  // Images - ALL Same Height & Clarity
  advantagesSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  advantagesRowThree: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  advantageCardThree: {
    width: '32%',
    height: 100, // SAME HEIGHT for all three images
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  advantageImageThree: {
    width: '100%',
    height: '100%',
    opacity: 1.0, // SAME CLARITY for all three images
  },
  advantageOverlayThree: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  advantageTitleThree: {
    fontSize: 8,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
    marginBottom: 1,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  advantageSubtitleThree: {
    fontSize: 7,
    color: '#4facfe',
    fontFamily: fonts.regular,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

// Subscription Modal Styles (Keep Same)
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
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';
import ChipConnectionsBG from '../components/ChipConnectionsBG';

const { width, height } = Dimensions.get('window');

// Fixed pickup location for demo - La Mer, Dubai
const FIXED_PICKUP = {
  latitude: 25.2285,
  longitude: 55.2754,
  name: "La Mer",
  address: "La Mer Beach, Dubai"
};

// Embedded SubscriptionModal Component
const SubscriptionModal = ({ visible, onClose, onSelectTier, hasCurrentRide = false }) => {
  const [selectedTier, setSelectedTier] = useState(null);

const subscriptionTiers = [
  {
    id: 'comfort',
    name: 'Comfort',
    price: 5,
    gfelPrice: 10,  // ← ADD THIS
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
    gfelPrice: 30,  // ← ADD THIS
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
                          <Text style={subscriptionModalStyles.gfelText}>or {tier.gfelPrice} GFEL</Text>
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
};

// Main RideBookingScreen Component
export default function RideBookingScreen({ navigation, route }) {
  const { state } = useApp();
  const [selectedVehicle, setSelectedVehicle] = useState('economy');
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiatedPrice, setNegotiatedPrice] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showSubscriptionReminder, setShowSubscriptionReminder] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [region, setRegion] = useState({
    latitude: FIXED_PICKUP.latitude,
    longitude: FIXED_PICKUP.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const mapRef = useRef(null);
  const destination = route?.params?.destination;
  const estimatedDistance = route?.params?.estimatedDistance || '12.5';

  // Set up route coordinates when destination is available
useEffect(() => {
  console.log('🗺️ Destination changed:', destination);
  
  if (destination && destination.lat && destination.lng) {
    console.log('📍 Updating route from La Mer to:', destination.name, `(${destination.lat}, ${destination.lng})`);
    
    // Create dynamic route from La Mer to selected destination
    const route = [
      {
        latitude: FIXED_PICKUP.latitude,
        longitude: FIXED_PICKUP.longitude,
      },
      {
        latitude: destination.lat,
        longitude: destination.lng,
      }
    ];
    setRouteCoordinates(route);

    // Calculate center point and proper zoom
    const midLat = (FIXED_PICKUP.latitude + destination.lat) / 2;
    const midLng = (FIXED_PICKUP.longitude + destination.lng) / 2;
    const latDelta = Math.abs(FIXED_PICKUP.latitude - destination.lat) * 1.8;
    const lngDelta = Math.abs(FIXED_PICKUP.longitude - destination.lng) * 1.8;

    // Update region to show both points properly
    setRegion({
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: Math.max(0.02, latDelta),
      longitudeDelta: Math.max(0.02, lngDelta),
    });

    // Fit map to show both locations with animation
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(route, {
          edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
          animated: true,
        });
      }
    }, 500);
  } else {
    console.log('⚠️ No valid destination, showing only La Mer');
    // No destination, just show La Mer
    setRouteCoordinates([]);
    setRegion({
      latitude: FIXED_PICKUP.latitude,
      longitude: FIXED_PICKUP.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  }
}, [destination]);

  // FIXED: Calculate distance and base price properly
  const calculateDistance = () => {
    if (estimatedDistance) {
      return parseFloat(estimatedDistance.toString().replace('km', '').trim()) || 12.5;
    }
    return 12.5; // Default distance
  };

  // FIXED: Get base price based on distance
  const getBasePrice = () => {
    const distance = calculateDistance();
    return Math.max(8, Math.round(distance * 0.8 + 5)); // Minimum $8, scales with distance
  };

  // FIXED: Calculate dynamic pricing with proper base price
  const calculatePricing = () => {
    const basePrice = getBasePrice();
    const distance = calculateDistance();
    const priceFactor = Math.max(0.8, Math.min(1.5, distance / 15));
    
    return {
      economy: Math.round(basePrice * 0.8 * priceFactor),
      comfort: Math.round(basePrice * 1.2 * priceFactor),
      luxury: Math.round(basePrice * 2.5 * priceFactor),
      xl: Math.round(basePrice * 1.5 * priceFactor),
    };
  };

  const dynamicPrices = calculatePricing();

  const vehicleTypes = [
    { 
      id: 'economy', 
      name: 'NexEconomy', 
      price: dynamicPrices.economy, 
      originalPrice: Math.round(dynamicPrices.economy * 1.25),
      nrx: Math.round(dynamicPrices.economy * 0.25), 
      eta: 4, 
      icon: '🚗', 
      seats: 4,
      count: 6,
      color: '#4facfe'
    },
    { 
      id: 'comfort', 
      name: 'NexComfort', 
      price: dynamicPrices.comfort,
      originalPrice: Math.round(dynamicPrices.comfort * 1.22), 
      nrx: Math.round(dynamicPrices.comfort * 0.25), 
      eta: 6, 
      icon: '🚙', 
      seats: 4,
      count: 2,
      color: '#43e97b'
    },
    { 
      id: 'luxury', 
      name: 'NexLuxury', 
      price: dynamicPrices.luxury,
      originalPrice: Math.round(dynamicPrices.luxury * 1.29), 
      nrx: Math.round(dynamicPrices.luxury * 0.23), 
      eta: 8, 
      icon: '🏎️', 
      seats: 4,
      count: 1,
      color: '#667eea'
    },
    { 
      id: 'xl', 
      name: 'NexXL', 
      price: dynamicPrices.xl,
      originalPrice: Math.round(dynamicPrices.xl * 1.27), 
      nrx: Math.round(dynamicPrices.xl * 0.25), 
      eta: 5, 
      icon: '🚐', 
      seats: 6,
      count: 3,
      color: '#ff6b6b'
    },
  ];

  const selectedVehicleData = vehicleTypes.find(v => v.id === selectedVehicle);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // FIXED: AI Negotiation with proper error handling
  const handleAINegotiation = () => {
    if (!selectedVehicleData || !selectedVehicleData.price || isNaN(selectedVehicleData.price)) {
      Alert.alert('Error', 'Please select a vehicle first');
      return;
    }

    setIsNegotiating(true);
    
    setTimeout(() => {
      try {
        const reductionPercent = 0.10 + (Math.random() * 0.05);
        const maxSavings = Math.floor(selectedVehicleData.price * reductionPercent);
        const newPrice = selectedVehicleData.price - maxSavings;
        
        setNegotiatedPrice(newPrice);
        setIsNegotiating(false);
        
        Alert.alert(
          '🤖 AI Success!',
          `AI negotiated ${Math.round(reductionPercent * 100)}% off!\nSaved $${maxSavings} • New price: $${newPrice}`,
          [{ text: 'Excellent!', style: 'default' }]
        );
      } catch (error) {
        setIsNegotiating(false);
        Alert.alert('Error', 'AI negotiation failed. Please try again.');
      }
    }, 2000);
  };

  const handleBookRide = () => {
    if (!state.subscription.isActive) {
      setShowSubscriptionReminder(true);
      return;
    }
    proceedToPayment();
  };

  const proceedToPayment = () => {
    const finalPrice = negotiatedPrice || selectedVehicleData.price;
    
    navigation.navigate('Payment', {
      vehicle: selectedVehicleData.name,
      price: finalPrice,
      nrx: selectedVehicleData.nrx,
      destination: destination?.name || 'Destination', // FIXED: Pass string
      eta: selectedVehicleData.eta,
      originalPrice: selectedVehicleData.originalPrice,
      seats: selectedVehicleData.seats
    });
  };

  const handleSubscriptionReminderClose = () => {
    setShowSubscriptionReminder(false);
    proceedToPayment();
  };

  const handleSubscriptionReminderAccept = () => {
    setShowSubscriptionReminder(false);
    setShowSubscriptionModal(true);
  };

  const handleSubscriptionSelect = (tier, includeCurrentRide) => {
    setShowSubscriptionModal(false);
    
    const finalPrice = negotiatedPrice || selectedVehicleData.price;
    navigation.navigate('Payment', {
      vehicle: selectedVehicleData.name,
      price: finalPrice,
      nrx: selectedVehicleData.nrx,
      destination: destination?.name || 'Destination', // FIXED: Pass string
      eta: selectedVehicleData.eta,
      originalPrice: selectedVehicleData.originalPrice,
      seats: selectedVehicleData.seats,
      subscription: {
        tier: tier.id,
        name: tier.name,
        price: tier.price,
        includeWithRide: includeCurrentRide
      }
    });
  };

  const getCurrentPrice = () => {
    return negotiatedPrice || selectedVehicleData.price;
  };

  const getSavings = () => {
    const currentPrice = getCurrentPrice();
    return selectedVehicleData.price - currentPrice;
  };

  const getCompetitorPrices = () => {
    const basePrice = selectedVehicleData.originalPrice;
    return {
      competitor1: Math.round(basePrice * 1.10),
      competitor2: Math.round(basePrice * 1.15),
    };
  };

  const competitors = getCompetitorPrices();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0e27', '#1a1d3a', '#2d3561']}
        style={styles.gradient}
      >
        {/* subtle chip grid background */}
        <ChipConnectionsBG tint="#C7CED8" opacity={0.20} style={StyleSheet.absoluteFill} />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Your Ride</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Real Map with Route */}
        <View style={styles.realMapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.realMap}
            region={region}
            customMapStyle={mapStyle}
          >
            {/* Fixed Pickup Location */}
            <Marker
              coordinate={FIXED_PICKUP}
              title={FIXED_PICKUP.name}
              description={FIXED_PICKUP.address}
              pinColor="#4facfe"
            />
            
            {/* Destination Marker */}
            {destination && (
              <Marker
                coordinate={{
                  latitude: destination.lat,
                  longitude: destination.lng
                }}
                title={destination.name}
                description={destination.address}
                pinColor="#ff6b6b"
              />
            )}

            {/* Vehicle Marker (Colored based on selection) */}
            {selectedVehicleData && (
              <Marker
                coordinate={{
                  latitude: FIXED_PICKUP.latitude + 0.002,
                  longitude: FIXED_PICKUP.longitude + 0.002,
                }}
                title={`${selectedVehicleData.name} Vehicle`}
                description={`ETA: ${selectedVehicleData.eta} min`}
              >
                <View style={[styles.vehicleMarker, { backgroundColor: selectedVehicleData.color }]}>
                  <Text style={styles.vehicleMarkerText}>{selectedVehicleData.icon}</Text>
                </View>
              </Marker>
            )}
            
            {/* Route Line */}
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeColor={selectedVehicleData?.color || "#4facfe"}
                strokeWidth={3}
                lineDashPattern={[5, 5]}
              />
            )}
          </MapView>
          
          {/* Map Info Overlay */}
          <View style={styles.mapInfoOverlay}>
            <Text style={styles.mapInfoText}>
              📍 {FIXED_PICKUP.name} → {destination?.name || 'Destination'} • ETA: {selectedVehicleData?.eta}min
            </Text>
          </View>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Route Preview */}
          <View style={styles.routeSection}>
            <View style={styles.routePreview}>
              <View style={styles.routeInfo}>
                <Text style={styles.routeFrom}>📍 {FIXED_PICKUP.name}</Text>
                <Text style={styles.routeArrow}>→</Text>
                <Text style={styles.routeTo}>🎯 {destination?.name || 'Destination'}</Text>
              </View>
              <Text style={styles.routeDistance}>{calculateDistance().toFixed(1)} km</Text>
            </View>
          </View>

          {/* Vehicle Selection - SMALLER CARDS */}
          <View style={styles.vehicleSection}>
            <Text style={styles.sectionTitle}>Choose Vehicle</Text>
            {vehicleTypes.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.vehicleCard,
                  selectedVehicle === vehicle.id && styles.vehicleCardSelected
                ]}
                onPress={() => setSelectedVehicle(vehicle.id)}
              >
                <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehicleCount}>{vehicle.count} available</Text>
                </View>
                <View style={styles.vehicleRight}>
                  <Text style={styles.vehiclePrice}>${vehicle.price}</Text>
                  <Text style={styles.vehicleGFEL}>+{vehicle.nrx} GFEL</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* AI Negotiation */}
          <View style={styles.aiSection}>
            <TouchableOpacity 
              style={styles.aiButton} 
              onPress={handleAINegotiation}
              disabled={isNegotiating}
            >
              <LinearGradient
                colors={
                  negotiatedPrice 
                    ? ['#ff8c00', '#ffa500']
                    : isNegotiating 
                      ? ['#ff6b6b', '#ffa500']
                      : ['#4facfe', '#00f2fe']
                }
                style={styles.aiGradient}
              >
                <Text style={styles.aiIcon}>
                  {negotiatedPrice ? '💰' : isNegotiating ? '⚡' : '🤖'}
                </Text>
                <View style={styles.aiContent}>
                  <Text style={styles.aiTitle}>
                    {negotiatedPrice 
                      ? `Negotiated Price: $${negotiatedPrice}` 
                      : isNegotiating 
                        ? 'AI Negotiating...' 
                        : 'AI Price Negotiation'
                    }
                  </Text>
                  <Text style={styles.aiSubtitle}>
                    {negotiatedPrice 
                      ? `Saved $${getSavings()} with AI optimization` 
                      : isNegotiating 
                        ? 'Analyzing market rates...' 
                        : 'Let AI save you money instantly'
                    }
                  </Text>
                </View>
                {negotiatedPrice && (
                  <View style={styles.savingsIndicator}>
                    <Text style={styles.savingsText}>-${getSavings()}</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Competitor Pricing */}
          <View style={styles.competitorInfoSection}>
            <Text style={styles.competitorTitle}>🔍 Market Comparison</Text>
            <View style={styles.competitorContainer}>
              <View style={styles.competitorRow}>
                <Text style={styles.competitorLabel}>Uber Price</Text>
                <Text style={styles.competitorPrice}>${competitors.competitor1}</Text>
              </View>
              <View style={styles.competitorRow}>
                <Text style={styles.competitorLabel}>Careem Price</Text>
                <Text style={styles.competitorPrice}>${competitors.competitor2}</Text>
              </View>
              <View style={styles.competitorRow}>
                <Text style={styles.nexrideLabel}>NexRide Price</Text>
                <Text style={styles.nexridePrice}>${getCurrentPrice()}</Text>
              </View>
            </View>
          </View>

          {/* Payment Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Vehicle</Text>
                <Text style={styles.summaryValue}>{selectedVehicleData.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Final Price</Text>
                <Text style={styles.summaryValue}>${getCurrentPrice()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>GFEL Rewards</Text>
                <Text style={[styles.summaryValue, styles.nrxText]}>
                  +{selectedVehicleData.nrx} GFEL
                </Text>
              </View>

              {negotiatedPrice && (
                <View style={[styles.summaryRow, styles.savingsRow]}>
                  <Text style={styles.savingsLabel}>AI Savings</Text>
                  <Text style={styles.savingsAmount}>-${getSavings()}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Book Button */}
          <View style={styles.bookSection}>
            <TouchableOpacity style={styles.bookButton} onPress={handleBookRide}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.bookGradient}
              >
                <Text style={styles.bookButtonText}>
                  Book Ride • ${getCurrentPrice()}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Subscription Reminder Modal */}
        <Modal
          visible={showSubscriptionReminder}
          transparent
          animationType="fade"
        >
          <View style={subscriptionReminderStyles.overlay}>
            <View style={subscriptionReminderStyles.container}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={subscriptionReminderStyles.gradient}
              >
                <Text style={subscriptionReminderStyles.title}>
                  💰 Save More with Subscription!
                </Text>
                <Text style={subscriptionReminderStyles.subtitle}>
                  Get up to 20% off all rides + VR experiences + Priority drivers
                </Text>
                <Text style={subscriptionReminderStyles.question}>
                  Are you sure you don't want to save more?
                </Text>
                
                <View style={subscriptionReminderStyles.buttonRow}>
                  <TouchableOpacity 
                    style={subscriptionReminderStyles.cancelButton}
                    onPress={handleSubscriptionReminderClose}
                  >
                    <Text style={subscriptionReminderStyles.cancelText}>Book Without</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={subscriptionReminderStyles.acceptButton}
                    onPress={handleSubscriptionReminderAccept}
                  >
                    <Text style={subscriptionReminderStyles.acceptText}>Show Plans</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>
        </Modal>

        {/* Subscription Selection Modal */}
        <SubscriptionModal
          visible={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          onSelectTier={handleSubscriptionSelect}
          hasCurrentRide={true}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

// Dark map style
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#1d2c4d" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#8ec3b9" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#1a3646" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#304a7d" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#0e1626" }]
  }
];

// Main Styles 
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  backIcon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  headerTitle: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.heading,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 28,
  },

  // Real Map Section
  realMapContainer: {
    height: height * 0.2, // 20% of screen height
    position: 'relative',
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  realMap: {
    flex: 1,
  },
  mapInfoOverlay: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
    right: spacing.xs,
  },
  mapInfoText: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#FFFFFF',
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.medium,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  vehicleMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  vehicleMarkerText: {
    fontSize: 12,
  },

  scrollContainer: {
    flex: 1,
  },

  // Route Section
  routeSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  routePreview: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: borderRadius.xs,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  routeFrom: {
    fontSize: fonts.sizes.xs,
    color: '#FFFFFF',
    flex: 1,
  },
  routeArrow: {
    fontSize: fonts.sizes.xs,
    color: '#4facfe',
    marginHorizontal: spacing.xs,
  },
  routeTo: {
    fontSize: fonts.sizes.xs,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'right',
  },
  routeDistance: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },

  // Vehicle Section - SMALLER CARDS
  vehicleSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  vehicleCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: borderRadius.xs,
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.xs / 2,
    marginBottom: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
    minHeight: 20,
  },
  vehicleCardSelected: {
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    borderColor: '#4facfe',
  },
  vehicleIcon: {
    fontSize: 10,
    marginRight: spacing.xs / 2,
    width: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: fonts.sizes.xs / 1.2,
    fontFamily: fonts.medium,
    color: '#FFFFFF',
  },
  vehicleCount: {
    fontSize: fonts.sizes.xs / 1.3,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  vehicleRight: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehiclePrice: {
    fontSize: fonts.sizes.xs / 1.1,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
    marginRight: spacing.xs / 2,
  },
  vehicleGFEL: {
    fontSize: fonts.sizes.xs / 1.2,
    color: '#4facfe',
  },

  // AI Section
  aiSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  aiButton: {
    borderRadius: borderRadius.xs,
    overflow: 'hidden',
  },
  aiGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
  },
  aiIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  aiContent: {
    flex: 1,
  },
  aiTitle: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
  },
  aiSubtitle: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 1,
  },
  savingsIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
  },
  savingsText: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
  },

  // Competitor Info Section
  competitorInfoSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  competitorTitle: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  competitorContainer: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: borderRadius.xs,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  competitorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  competitorLabel: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  competitorPrice: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.bold,
    color: '#ff6b6b',
  },
  nexrideLabel: {
    fontSize: fonts.sizes.xs,
    color: '#4facfe',
    fontFamily: fonts.bold,
  },
  nexridePrice: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.bold,
    color: '#4facfe',
  },

  // Summary Section
  summarySection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: borderRadius.xs,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryValue: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
  },
  nrxText: {
    color: '#4facfe',
  },
  savingsRow: {
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    marginHorizontal: -spacing.xs,
    marginBottom: -spacing.xs,
    padding: spacing.xs,
    borderBottomLeftRadius: borderRadius.xs,
    borderBottomRightRadius: borderRadius.xs,
  },
  savingsLabel: {
    fontSize: fonts.sizes.xs,
    color: '#4facfe',
    fontFamily: fonts.bold,
  },
  savingsAmount: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.bold,
    color: '#4facfe',
  },

  // Book Section
  bookSection: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  bookButton: {
    borderRadius: borderRadius.xs,
    overflow: 'hidden',
    height: 36,
  },
  bookGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
  },
});

// Subscription Reminder Styles
const subscriptionReminderStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '60%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    padding: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 6,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 8,
  },
  question: {
    fontSize: 7,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
    lineHeight: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cancelButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    minWidth: 50,
  },
  acceptButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    minWidth: 50,
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 6,
    fontWeight: '600',
    textAlign: 'center',
  },
  acceptText: {
    color: '#667eea',
    fontSize: 6,
    fontWeight: 'bold',
    textAlign: 'center',
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
    height: '85%',
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
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tierCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tierCardSelected: {
    transform: [{ scale: 1.02 }],
  },
  tierGradient: {
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 20,
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    left: 20,
    right: 20,
    backgroundColor: '#ff6b6b',
    paddingVertical: 8,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  popularText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tierHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 16,
  },
  tierName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priceSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
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
  continueSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  continueButton: {
    borderRadius: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
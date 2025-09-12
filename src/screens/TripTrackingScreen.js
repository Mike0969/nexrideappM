import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';
import ChipConnectionsBG from '../components/ChipConnectionsBG';
import VRExperienceSelector from '../components/VRExperienceSelector';
import VRLibrary from '../components/VRLibrary';
import VR360Viewer from '../components/VR360Viewer';

// SIMPLE DEBUG SUBSCRIPTION MODAL
const SubscriptionModal = ({ visible, onClose, onSelectTier }) => {
  const [selectedTier, setSelectedTier] = useState(null);

  const subscriptionTiers = [
    { id: 'comfort', name: 'Comfort', price: 5, popular: false },
    { id: 'ultra', name: 'Ultra', price: 15, popular: true }
  ];

  const handleContinue = () => {
    if (!selectedTier) {
      Alert.alert('⚠️ Select Plan', 'Please select a subscription plan');
      return;
    }
    onSelectTier(selectedTier);
  };

  console.log('Modal visible:', visible);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          width: '85%',
          backgroundColor: '#1a1d3a',
          borderRadius: 16,
          padding: 20,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: 20,
          }}>
            📋 Choose Subscription Plan
          </Text>
          
          {subscriptionTiers.map((tier) => (
            <TouchableOpacity 
              key={tier.id}
              style={{
                backgroundColor: selectedTier?.id === tier.id ? '#4facfe' : 'rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                borderWidth: 2,
                borderColor: selectedTier?.id === tier.id ? '#FFFFFF' : 'transparent',
              }}
              onPress={() => setSelectedTier(tier)}
            >
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#FFFFFF',
              }}>
                {tier.name} - ${tier.price}/month
              </Text>
              {tier.popular && (
                <Text style={{ color: '#ff6b6b', fontSize: 12, fontWeight: 'bold' }}>
                  MOST POPULAR
                </Text>
              )}
            </TouchableOpacity>
          ))}
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
            <TouchableOpacity 
              style={{
                backgroundColor: '#666',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 8,
              }}
              onPress={onClose}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{
                backgroundColor: selectedTier ? '#4facfe' : '#666',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 8,
              }}
              onPress={handleContinue}
              disabled={!selectedTier}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function TripTrackingScreen({ navigation, route }) {
  const { state } = useApp();
  
  // Get dynamic trip data from route params
  const tripData = route.params || {};
  const vehicleName = tripData.vehicle || 'NexComfort';
  const tripPrice = tripData.price || 18;
  const destination = tripData.destination || 'Dubai Mall';
  const gfelRewards = tripData.nrx || 4.5;
  const tripEta = tripData.eta || 5;
  
  const [tripStatus, setTripStatus] = useState('driver_coming');
  const [etaCounter, setEtaCounter] = useState(tripEta);
  const [driverLocation, setDriverLocation] = useState('0.5 km away');
  const [tripProgress, setTripProgress] = useState(0);

  // VR State
  const [showVRSelector, setShowVRSelector] = useState(false);
  const [showVRLibrary, setShowVRLibrary] = useState(false);
  const [showVRViewer, setShowVRViewer] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedVRExperience, setSelectedVRExperience] = useState(null);

  // Simulate trip progress
  useEffect(() => {
    const interval = setInterval(() => {
      setEtaCounter(prev => Math.max(0, prev - 0.1));
      setTripProgress(prev => Math.min(100, prev + 2));
      
      if (etaCounter <= 1 && tripStatus === 'driver_coming') {
        setTripStatus('in_progress');
        setDriverLocation('Arrived');
      } else if (tripProgress >= 90 && tripStatus === 'in_progress') {
        setTripStatus('arriving');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [etaCounter, tripStatus]);

  const hasVRAccess = () => {
    return true;
  };

  const handleCallDriver = () => {
    Alert.alert('📞 Call Driver', 'Calling Ahmed (4.9⭐)\n+971 50 123 4567', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Alert.alert('📱', 'Dialing...') }
    ]);
  };

  const handleMessageDriver = () => {
    Alert.alert('💬 Message Driver', 'Quick messages:\n• "I\'m at the main entrance"\n• "Running 2 minutes late"\n• "Thank you!"');
  };

  const handleVREntertainment = () => {
    if (!hasVRAccess()) {
      Alert.alert(
        '🥽 VR Entertainment Hub', 
        '🎮 Available VR Experiences:\n\n🎬 Netflix VR Cinema\n🎯 AR Games Collection\n🌍 Virtual Travel Tours\n🎨 Art Gallery VR\n🎵 Concert Experiences\n\n✨ Premium VR with NexRide Pro!',
        [
          { text: 'Browse VR', onPress: () => {
            Alert.alert('🔒 Subscription Required', 'VR features are available for Comfort and Ultra subscribers.\n\nUpgrade to access immersive VR experiences!', [
              { text: 'Maybe Later', style: 'cancel' },
              { text: 'View Plans', onPress: () => {
                console.log('Opening subscription modal...');
                setShowSubscriptionModal(true);
              }}
            ]);
          }},
          { text: 'Later', style: 'cancel' }
        ]
      );
    } else {
      setShowVRSelector(true);
    }
  };

  const handleBrowseLibrary = () => setShowVRLibrary(true);
  const handleLaunchVRExperience = (experienceId) => {
    setSelectedVRExperience(experienceId);
    setShowVRViewer(true);
  };

  const handleSubscriptionSelect = (tier) => {
    console.log('Selected tier:', tier);
    setShowSubscriptionModal(false);
    
    navigation.navigate('Payment', {
      subscription: {
        tier: tier.id,
        name: tier.name,
        price: tier.price,
        includeWithRide: false
      },
      vehicle: vehicleName,
      destination: destination,
      price: tripPrice,
      fromVR: true
    });
  };

  const handleEmergency = () => {
    Alert.alert('🚨 Emergency', 'Emergency services activated!');
  };

  const handleCancelTrip = () => {
    Alert.alert('❌ Cancel Trip?', 'Cancellation fee may apply.', [
      { text: 'Keep Trip', style: 'cancel' },
      { text: 'Cancel Trip', style: 'destructive', onPress: () => navigation.navigate('Home') }
    ]);
  };

  const getStatusMessage = () => {
    switch (tripStatus) {
      case 'driver_coming': return 'Driver is on the way';
      case 'in_progress': return 'Trip in progress';
      case 'arriving': return 'Arriving at destination';
      default: return 'Preparing trip...';
    }
  };

  const getStatusColor = () => {
    switch (tripStatus) {
      case 'driver_coming': return ['#4facfe', '#00f2fe'];
      case 'in_progress': return ['#00f2fe', '#4facfe'];
      case 'arriving': return ['#ffa500', '#ff8c00'];
      default: return ['#4facfe', '#00f2fe'];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0a0e27', '#1a1d3a', '#2d3561']} style={styles.gradient}>
        <ChipConnectionsBG tint="#C7CED8" opacity={0.20} style={StyleSheet.absoluteFill} />
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Status Header */}
          <View style={styles.statusHeader}>
            <LinearGradient colors={getStatusColor()} style={styles.statusGradient}>
              <Text style={styles.statusTitle}>{getStatusMessage()}</Text>
              <Text style={styles.statusSubtitle}>
                {tripStatus === 'driver_coming' ? `ETA: ${Math.ceil(etaCounter)} min` : `${tripProgress.toFixed(0)}% Complete`}
              </Text>
            </LinearGradient>
          </View>

          {/* Live Map Tracking */}
          <TouchableOpacity style={styles.mapSection}>
            <LinearGradient colors={['rgba(79, 172, 254, 0.1)', 'rgba(0, 242, 254, 0.1)']} style={styles.mapContainer}>
              <Text style={styles.mapTitle}>🗺️ Live Tracking</Text>
              <Text style={styles.mapStatus}>Driver: {driverLocation}</Text>
              <Text style={styles.mapRoute}>Downtown → {destination}</Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <LinearGradient colors={['#4facfe', '#00f2fe']} style={[styles.progressFill, { width: `${tripProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{tripProgress.toFixed(0)}%</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Driver Info */}
          <View style={styles.driverSection}>
            <View style={styles.driverCard}>
              <View style={styles.driverInfo}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverAvatarText}>👨‍💼</Text>
                </View>
                <View style={styles.driverDetails}>
                  <Text style={styles.driverName}>Ahmed Al-Rashid</Text>
                  <Text style={styles.driverRating}>⭐ 4.9 • 2,450 trips</Text>
                  <Text style={styles.driverVehicle}>🚙 Toyota Camry • ABC 123</Text>
                </View>
              </View>
              <View style={styles.driverActions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCallDriver}>
                  <Text style={styles.actionIcon}>📞</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleMessageDriver}>
                  <Text style={styles.actionIcon}>💬</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* VR Entertainment Section */}
          <View style={styles.vrSection}>
            <TouchableOpacity style={styles.vrButton} onPress={handleVREntertainment}>
              <LinearGradient colors={['#9c27b0', '#e91e63']} style={styles.vrGradient}>
                <Text style={styles.vrIcon}>🥽</Text>
                <View style={styles.vrContent}>
                  <Text style={styles.vrTitle}>VR Entertainment Hub</Text>
                  <Text style={styles.vrSubtitle}>Movies, Games & Virtual Tours</Text>
                </View>
                <Text style={styles.vrArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Trip Details */}
          <View style={styles.tripSection}>
            <Text style={styles.sectionTitle}>Trip Details</Text>
            <View style={styles.tripCard}>
              <View style={styles.tripRow}>
                <Text style={styles.tripLabel}>Vehicle</Text>
                <Text style={styles.tripValue}>{vehicleName}</Text>
              </View>
              <View style={styles.tripRow}>
                <Text style={styles.tripLabel}>Price</Text>
                <Text style={styles.tripValue}>${tripPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.tripRow}>
                <Text style={styles.tripLabel}>GFEL Rewards</Text>
                <Text style={[styles.tripValue, styles.nrxText]}>+{gfelRewards} GFEL</Text>
              </View>
              <View style={styles.tripRow}>
                <Text style={styles.tripLabel}>Distance</Text>
                <Text style={styles.tripValue}>12.5 km</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
              <Text style={styles.emergencyText}>🚨 Emergency</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelTrip}>
              <Text style={styles.cancelText}>❌ Cancel Trip</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* VR Modals */}
        <VRExperienceSelector
          visible={showVRSelector}
          onClose={() => setShowVRSelector(false)}
          onSelectExperience={(experienceId) => {
            setShowVRSelector(false);
            handleLaunchVRExperience(experienceId);
          }}
          onBrowseLibrary={handleBrowseLibrary}
        />

        <VRLibrary
          visible={showVRLibrary}
          onClose={() => setShowVRLibrary(false)}
          onLaunchExperience={(experienceId) => {
            setShowVRLibrary(false);
            handleLaunchVRExperience(experienceId);
          }}
        />

        <VR360Viewer
          visible={showVRViewer}
          onClose={() => setShowVRViewer(false)}
          experience={selectedVRExperience}
        />

        {/* DEBUG: Simple Subscription Modal */}
        <SubscriptionModal
          visible={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          onSelectTier={handleSubscriptionSelect}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

// All original styles stay the same
const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContainer: { flex: 1 },

  statusHeader: { paddingHorizontal: spacing.md, paddingTop: spacing.lg, marginBottom: spacing.sm },
  statusGradient: { borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center' },
  statusTitle: { fontSize: fonts.sizes.lg, fontFamily: fonts.bold, color: '#FFFFFF' },
  statusSubtitle: { fontSize: fonts.sizes.base, color: 'rgba(255, 255, 255, 0.9)', marginTop: spacing.xs },

  mapSection: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  mapContainer: { borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: 'rgba(199,206,216,0.25)', minHeight: 120 },
  mapTitle: { fontSize: fonts.sizes.base, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  mapStatus: { fontSize: fonts.sizes.sm, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', marginTop: spacing.xs },
  mapRoute: { fontSize: fonts.sizes.sm, color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginTop: spacing.xs },
  progressContainer: { marginTop: spacing.sm, alignItems: 'center' },
  progressBar: { width: '100%', height: 6, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: fonts.sizes.xs, color: '#4facfe', marginTop: spacing.xs, fontFamily: fonts.bold },

  driverSection: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  driverCard: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: borderRadius.lg, padding: spacing.md, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(199,206,216,0.25)' },
  driverInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  driverAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(79, 172, 254, 0.2)', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  driverAvatarText: { fontSize: 24 },
  driverDetails: { flex: 1 },
  driverName: { fontSize: fonts.sizes.base, fontFamily: fonts.bold, color: '#FFFFFF' },
  driverRating: { fontSize: fonts.sizes.sm, color: 'rgba(255, 255, 255, 0.8)', marginTop: 2 },
  driverVehicle: { fontSize: fonts.sizes.sm, color: 'rgba(255, 255, 255, 0.7)', marginTop: 2 },
  driverActions: { flexDirection: 'row' },
  actionButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(79, 172, 254, 0.2)', alignItems: 'center', justifyContent: 'center', marginLeft: spacing.sm, borderWidth: 1, borderColor: 'rgba(79, 172, 254, 0.3)' },
  actionIcon: { fontSize: 18 },

  vrSection: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  vrButton: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  vrGradient: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  vrIcon: { fontSize: 32, marginRight: spacing.md },
  vrContent: { flex: 1 },
  vrTitle: { fontSize: fonts.sizes.base, fontFamily: fonts.bold, color: '#FFFFFF' },
  vrSubtitle: { fontSize: fonts.sizes.sm, color: 'rgba(255, 255, 255, 0.9)', marginTop: 2 },
  vrArrow: { fontSize: fonts.sizes.lg, color: '#FFFFFF' },

  tripSection: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  sectionTitle: { fontSize: fonts.sizes.sm, fontFamily: fonts.bold, color: '#FFFFFF', marginBottom: spacing.sm },
  tripCard: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: 'rgba(199,206,216,0.25)' },
  tripRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  tripLabel: { fontSize: fonts.sizes.sm, color: 'rgba(255, 255, 255, 0.8)' },
  tripValue: { fontSize: fonts.sizes.sm, fontFamily: fonts.bold, color: '#FFFFFF' },
  nrxText: { color: '#4facfe' },

  actionSection: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, flexDirection: 'row', justifyContent: 'space-between' },
  emergencyButton: { backgroundColor: 'rgba(255, 0, 0, 0.2)', borderWidth: 1, borderColor: 'rgba(255, 0, 0, 0.4)', borderRadius: borderRadius.lg, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  emergencyText: { color: '#ff4444', fontSize: fonts.sizes.sm, fontFamily: fonts.bold },
  cancelButton: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(199,206,216,0.25)', borderRadius: borderRadius.lg, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  cancelText: { color: 'rgba(255, 255, 255, 0.8)', fontSize: fonts.sizes.sm, fontFamily: fonts.medium },
});

// src/screens/DestinationScreen.js - FINAL VERSION WITH BETTER ANDROID LAYOUT

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';
import ChipConnectionsBG from '../components/ChipConnectionsBG';

export default function DestinationScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Handle keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Handle route params
  useEffect(() => {
    if (route.params?.selectedDestination) {
      const destination = route.params.selectedDestination;
      setSelectedDestination(destination);
      setSearchQuery(destination.name);
      
      if (route.params?.quickDestination) {
        setTimeout(() => {
          handleContinue();
        }, 500);
      }
    }
  }, [route.params]);

  // ALL DESTINATIONS (for search suggestions)
  const allDestinations = [
    { id: '1', name: 'Dubai Mall', address: 'Downtown Dubai', icon: '🏬', lat: 25.1972, lng: 55.2796, estimatedTime: '15 min', estimatedCost: '$12' },
    { id: '2', name: 'Burj Khalifa', address: 'Downtown Dubai', icon: '🏗️', lat: 25.1972, lng: 55.2742, estimatedTime: '15 min', estimatedCost: '$12' },
    { id: '3', name: 'Dubai International Airport', address: 'Garhoud', icon: '✈️', lat: 25.2532, lng: 55.3657, estimatedTime: '25 min', estimatedCost: '$28' },
    { id: '4', name: 'DIFC', address: 'Financial Centre', icon: '🏢', lat: 25.2127, lng: 55.2804, estimatedTime: '12 min', estimatedCost: '$8' },
    { id: '5', name: 'Dubai Marina', address: 'Marina District', icon: '🌊', lat: 25.0772, lng: 55.1385, estimatedTime: '18 min', estimatedCost: '$16' },
    { id: '6', name: 'Mall of the Emirates', address: 'Al Barsha', icon: '🛍️', lat: 25.1189, lng: 55.2006, estimatedTime: '20 min', estimatedCost: '$18' },
    { id: '7', name: 'Palm Jumeirah', address: 'The Palm', icon: '🌴', lat: 25.1124, lng: 55.1390, estimatedTime: '22 min', estimatedCost: '$20' },
    { id: '8', name: 'Dubai Fountain', address: 'Downtown Dubai', icon: '⛲', lat: 25.1951, lng: 55.2742, estimatedTime: '15 min', estimatedCost: '$12' },
    { id: '9', name: 'Burj Al Arab', address: 'Jumeirah', icon: '🏨', lat: 25.1413, lng: 55.1853, estimatedTime: '25 min', estimatedCost: '$22' },
    { id: '10', name: 'Dubai Creek', address: 'Deira', icon: '🚢', lat: 25.2382, lng: 55.3371, estimatedTime: '18 min', estimatedCost: '$14' },
    { id: '11', name: 'Atlantis The Palm', address: 'Palm Jumeirah', icon: '🏖️', lat: 25.1308, lng: 55.1172, estimatedTime: '28 min', estimatedCost: '$25' },
    { id: '12', name: 'Dubai Opera', address: 'Downtown Dubai', icon: '🎭', lat: 25.1937, lng: 55.2721, estimatedTime: '16 min', estimatedCost: '$13' },
    { id: '13', name: 'Gold Souk', address: 'Deira', icon: '💰', lat: 25.2697, lng: 55.2972, estimatedTime: '20 min', estimatedCost: '$16' },
    { id: '14', name: 'Ski Dubai', address: 'Mall of the Emirates', icon: '⛷️', lat: 25.1189, lng: 55.2006, estimatedTime: '20 min', estimatedCost: '$18' },
    { id: '15', name: 'Dubai Miracle Garden', address: 'Dubailand', icon: '🌺', lat: 25.0597, lng: 55.2429, estimatedTime: '30 min', estimatedCost: '$26' },
    { id: '16', name: 'JBR Beach', address: 'Jumeirah Beach Residence', icon: '🏖️', lat: 25.0778, lng: 55.1364, estimatedTime: '22 min', estimatedCost: '$19' },
    { id: '17', name: 'Dubai Frame', address: 'Zabeel Park', icon: '🖼️', lat: 25.2358, lng: 55.3026, estimatedTime: '18 min', estimatedCost: '$15' },
    { id: '18', name: 'La Mer', address: 'Jumeirah', icon: '🏖️', lat: 25.1979, lng: 55.2361, estimatedTime: '20 min', estimatedCost: '$17' },
    { id: '19', name: 'City Walk', address: 'Al Safa', icon: '🚶', lat: 25.2031, lng: 55.2594, estimatedTime: '17 min', estimatedCost: '$14' },
    { id: '20', name: 'Dubai Hills Mall', address: 'Dubai Hills Estate', icon: '🛒', lat: 25.1034, lng: 55.2456, estimatedTime: '25 min', estimatedCost: '$21' },
    { id: '21', name: 'Global Village', address: 'Dubailand', icon: '🌍', lat: 25.0690, lng: 55.3063, estimatedTime: '35 min', estimatedCost: '$28' },
    { id: '22', name: 'Ibn Battuta Mall', address: 'Jebel Ali', icon: '🕌', lat: 25.0446, lng: 55.1179, estimatedTime: '32 min', estimatedCost: '$26' }
  ];

  // POPULAR DESTINATIONS (shown in interface)
  const popularDestinations = [
    { id: '1', name: 'Dubai Mall', address: 'Downtown Dubai', icon: '🏬', lat: 25.1972, lng: 55.2796, estimatedTime: '15 min', estimatedCost: '$12' },
    { id: '2', name: 'Burj Khalifa', address: 'Downtown Dubai', icon: '🏗️', lat: 25.1972, lng: 55.2742, estimatedTime: '15 min', estimatedCost: '$12' },
    { id: '3', name: 'Dubai International Airport', address: 'Garhoud', icon: '✈️', lat: 25.2532, lng: 55.3657, estimatedTime: '25 min', estimatedCost: '$28' },
    { id: '4', name: 'DIFC', address: 'Financial Centre', icon: '🏢', lat: 25.2127, lng: 55.2804, estimatedTime: '12 min', estimatedCost: '$8' },
    { id: '5', name: 'Dubai Marina', address: 'Marina District', icon: '🌊', lat: 25.0772, lng: 55.1385, estimatedTime: '18 min', estimatedCost: '$16' },
    { id: '6', name: 'Mall of the Emirates', address: 'Al Barsha', icon: '🛍️', lat: 25.1189, lng: 55.2006, estimatedTime: '20 min', estimatedCost: '$18' }
  ];

  // Filter suggestions based on search (use ALL destinations)
  const filteredSuggestions = allDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    setShowSuggestions(text.length > 0);
    
    if (selectedDestination && text !== selectedDestination.name) {
      setSelectedDestination(null);
    }
  };

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination);
    setSearchQuery(destination.name);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const handleContinue = () => {
    if (selectedDestination) {
      navigation.navigate('RideBooking', {
        destination: selectedDestination
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedDestination(null);
    setShowSuggestions(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <LinearGradient colors={['#0a0e27', '#1a1d3a', '#2d3561']} style={styles.gradient}>
          {/* subtle chip-style background */}
          <ChipConnectionsBG tint="#C7CED8" opacity={0.20} style={StyleSheet.absoluteFill} />
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Where to?</Text>
            <View style={styles.locationFlag}>
              <Text style={styles.flagIcon}>🇦🇪</Text>
              <Text style={styles.flagText}>Dubai</Text>
            </View>
          </View>

          {/* Map Container - UNIFIED MAPVIEW */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: selectedDestination ? selectedDestination.lat : 25.2048,
                longitude: selectedDestination ? selectedDestination.lng : 55.2708,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              showsUserLocation={true}
              showsMyLocationButton={false}
              zoomEnabled={true}
              scrollEnabled={true}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              {selectedDestination && (
                <Marker
                  coordinate={{
                    latitude: selectedDestination.lat,
                    longitude: selectedDestination.lng,
                  }}
                  title={selectedDestination.name}
                  description={selectedDestination.address}
                  pinColor="#4facfe"
                />
              )}
            </MapView>
            
            {/* Map overlay info */}
            {selectedDestination && (
              <View style={styles.mapOverlay}>
                <Text style={styles.overlayTitle}>📍 {selectedDestination.name}</Text>
                <Text style={styles.overlaySubtitle}>{selectedDestination.address}</Text>
              </View>
            )}
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search destination..."
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={searchQuery}
                onChangeText={handleSearchChange}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Content Area */}
          <View style={styles.contentContainer}>
            
            {/* Suggestions */}
            {showSuggestions && searchQuery.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Suggestions:</Text>
                <ScrollView style={styles.suggestionsList} keyboardShouldPersistTaps="handled">
                  {filteredSuggestions.map((destination) => (
                    <TouchableOpacity
                      key={destination.id}
                      style={styles.suggestionItem}
                      onPress={() => handleDestinationSelect(destination)}
                    >
                      <Text style={styles.suggestionIcon}>{destination.icon}</Text>
                      <View style={styles.suggestionInfo}>
                        <Text style={styles.suggestionName}>{destination.name}</Text>
                        <Text style={styles.suggestionAddress}>{destination.address}</Text>
                      </View>
                      <Text style={styles.suggestionArrow}>📍</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Popular Destinations */}
            {!showSuggestions && (
              <View style={styles.popularContainer}>
                <Text style={styles.popularTitle}>Popular Destinations</Text>
                <ScrollView 
                  style={styles.popularList} 
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.popularListContent}
                >
                  {popularDestinations.map((destination) => (
                    <TouchableOpacity
                      key={destination.id}
                      style={[
                        styles.popularItem,
                        selectedDestination?.id === destination.id && styles.popularItemSelected
                      ]}
                      onPress={() => handleDestinationSelect(destination)}
                    >
                      <Text style={styles.popularIcon}>{destination.icon}</Text>
                      <View style={styles.popularInfo}>
                        <Text style={styles.popularName}>{destination.name}</Text>
                        <Text style={styles.popularAddress}>{destination.address}</Text>
                      </View>
                      <View style={styles.popularMeta}>
                        <Text style={styles.popularTime}>{destination.estimatedTime}</Text>
                        <Text style={styles.popularCost}>{destination.estimatedCost}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Fixed Bottom Button */}
          {!keyboardVisible && (
            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity 
                style={[
                  styles.continueButton,
                  !selectedDestination && styles.continueButtonDisabled
                ]} 
                onPress={handleContinue}
                disabled={!selectedDestination}
              >
                <LinearGradient
                  colors={selectedDestination ? ['#4facfe', '#00f2fe'] : ['#666', '#888']}
                  style={styles.continueGradient}
                >
                  <Text style={styles.continueButtonText}>
                    {selectedDestination ? `Continue to ${selectedDestination.name}` : 'Select a destination'}
                  </Text>
                  <Text style={styles.continueArrow}>→</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    // ANDROID ONLY - Better centering and spacing
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingBottom: Platform.OS === 'android' ? 25 : 0,
  },
  
  // Header - UPDATED FOR BETTER ANDROID LAYOUT
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === 'android' ? spacing.sm : spacing.md,
    paddingBottom: spacing.sm,
    zIndex: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  backIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: fonts.bold,
  },
  headerTitle: {
    fontSize: fonts.sizes.xl,
    fontFamily: fonts.heading,
    color: '#FFFFFF',
  },
  locationFlag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4facfe',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  flagIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  flagText: {
    fontSize: fonts.sizes.sm,
    color: '#FFFFFF',
    fontFamily: fonts.bold,
  },

  // Map - UNIFIED
  mapContainer: {
    height: 200,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: '#1a1d3a',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(79, 172, 254, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    zIndex: 10,
  },
  overlayTitle: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.bold,
  },
  overlaySubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: fonts.sizes.xs,
    marginTop: 2,
  },

  // Search
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: '#FFFFFF',
    paddingVertical: spacing.md,
    minHeight: 50,
    fontFamily: fonts.medium,
  },
  clearButton: {
    padding: spacing.xs,
  },
  clearIcon: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Content - UPDATED FOR BETTER ANDROID CENTERING
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    // ANDROID ONLY - Center content better
    justifyContent: Platform.OS === 'android' ? 'flex-start' : 'flex-start',
    marginTop: Platform.OS === 'android' ? spacing.sm : 0,
  },

  // Suggestions
  suggestionsContainer: {
    flex: 1,
  },
  suggestionsTitle: {
    fontSize: fonts.sizes.base,
    fontFamily: fonts.bold,
    color: '#4facfe',
    marginBottom: spacing.sm,
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  suggestionIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionName: {
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.medium,
    color: '#FFFFFF',
  },
  suggestionAddress: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  suggestionArrow: {
    fontSize: 14,
  },

  // Popular Destinations
  popularContainer: {
    flex: 1,
  },
  popularTitle: {
    fontSize: fonts.sizes.base,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  popularList: {
    flex: 1,
  },
  popularListContent: {
    paddingBottom: spacing.xl,
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
    minHeight: 60,
  },
  popularItemSelected: {
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    borderColor: '#4facfe',
  },
  popularIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
    width: 24,
  },
  popularInfo: {
    flex: 1,
  },
  popularName: {
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.medium,
    color: '#FFFFFF',
  },
  popularAddress: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  popularMeta: {
    alignItems: 'flex-end',
  },
  popularTime: {
    fontSize: fonts.sizes.xs,
    color: '#4facfe',
    fontFamily: fonts.bold,
  },
  popularCost: {
    fontSize: fonts.sizes.sm,
    color: '#43e97b',
    fontFamily: fonts.bold,
    marginTop: 2,
  },

  // Bottom Button - UPDATED FOR BETTER ANDROID SPACING
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg + 15, // Extra padding for Android
    paddingTop: spacing.sm,
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
  },
  continueButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  continueButtonText: {
    fontSize: fonts.sizes.base,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
    marginRight: spacing.sm,
  },
  continueArrow: {
    fontSize: fonts.sizes.base,
    color: '#FFFFFF',
  },
});
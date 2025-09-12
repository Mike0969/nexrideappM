import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';

// Simple destination matching
const DESTINATIONS = [
  { name: 'Dubai Mall', keywords: ['dubai mall', 'mall'] },
  { name: 'Burj Khalifa', keywords: ['burj khalifa', 'khalifa', 'burj'] },
  { name: 'Dubai Marina', keywords: ['marina'] },
  { name: 'Downtown Dubai', keywords: ['downtown'] },
  { name: 'Jumeirah Beach', keywords: ['jumeirah', 'beach'] },
  { name: 'Dubai International Airport', keywords: ['airport'] },
  { name: 'DIFC', keywords: ['difc'] },
  { name: 'JBR', keywords: ['jbr'] },
  { name: 'Business Bay', keywords: ['business bay'] },
  { name: 'Palm Jumeirah', keywords: ['palm'] }
];

const VEHICLES = [
  { id: 'economy', name: 'NexEconomy', keywords: ['economy', 'cheap', 'basic'] },
  { id: 'comfort', name: 'NexComfort', keywords: ['comfort', 'comfortable'] },
  { id: 'luxury', name: 'NexLuxury', keywords: ['luxury', 'premium', 'expensive'] },
  { id: 'xl', name: 'NexXL', keywords: ['xl', 'big', 'large', '6 seat'] }
];

export default function VoiceConfirmationScreen({ navigation, route }) {
  const { voiceText = "No input" } = route.params || {};

  // Parse voice command
  const parseCommand = (text) => {
    const lowerText = text.toLowerCase();
    
    // Find vehicle
    let vehicle = VEHICLES[0]; // Default to economy
    for (const v of VEHICLES) {
      if (v.keywords.some(keyword => lowerText.includes(keyword))) {
        vehicle = v;
        break;
      }
    }
    
    // Find destination  
    let destination = null;
    for (const d of DESTINATIONS) {
      if (d.keywords.some(keyword => lowerText.includes(keyword))) {
        destination = d;
        break;
      }
    }
    
    return { vehicle, destination };
  };

  const { vehicle, destination } = parseCommand(voiceText);

  const handleConfirm = () => {
    navigation.navigate('RideBooking', {
      voiceBooking: true,
      preSelectedVehicle: vehicle.id,
      preSelectedDestination: destination
    });
  };

  const handleTryAgain = () => {
    navigation.goBack();
  };

  const handleEditManually = () => {
    navigation.navigate('RideBooking');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0a0e27', '#1a1d3a', '#2d3561']} style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🎤 Voice Command</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Voice Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You said:</Text>
          <View style={styles.card}>
            <Text style={styles.voiceText}>"{voiceText}"</Text>
          </View>
        </View>

        {/* Understood */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I understood:</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Vehicle:</Text>
              <Text style={styles.value}>{vehicle.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Destination:</Text>
              <Text style={[styles.value, !destination && styles.error]}>
                {destination ? destination.name : '❌ Not clear'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {destination ? (
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <LinearGradient colors={['#00ff00', '#44ff44']} style={styles.buttonGradient}>
                <Text style={styles.confirmText}>✅ Confirm & Book</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity style={styles.editButton} onPress={handleEditManually}>
            <Text style={styles.editText}>✏️ Edit Manually</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.retryButton} onPress={handleTryAgain}>
            <Text style={styles.retryText}>🎤 Try Again</Text>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 16, color: '#FFFFFF' },
  headerTitle: {
    flex: 1,
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: { width: 32 },

  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  voiceText: {
    fontSize: fonts.sizes.base,
    color: '#FFFFFF',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  value: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  error: { color: '#ff4444' },

  actions: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginTop: 'auto',
    paddingBottom: spacing.xl,
  },
  confirmButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    height: 50,
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: fonts.sizes.base,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    borderRadius: borderRadius.lg,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.4)',
  },
  editText: {
    fontSize: fonts.sizes.base,
    fontWeight: '600',
    color: '#4facfe',
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  retryText: {
    fontSize: fonts.sizes.base,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
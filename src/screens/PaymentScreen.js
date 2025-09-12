import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';
import ChipConnectionsBG from '../components/ChipConnectionsBG';

export default function PaymentScreen({ navigation, route }) {
  const { state } = useApp();
  const [selectedPayment, setSelectedPayment] = useState('nrx');
  const [isProcessing, setIsProcessing] = useState(false);

  // Detect if this is subscription-only or ride booking
  const isSubscriptionOnly = route?.params?.subscription && !route?.params?.vehicle;
  
  // Get trip data from route params with proper fallbacks
  const tripData = route?.params || {};
  
  // Subscription data (if available)
  const subscriptionData = tripData.subscription || null;
  
  // Ride data with fallbacks
  const rideData = {
    vehicle: tripData.vehicle || 'NexComfort',
    price: tripData.price || 0,
    nrx: tripData.nrx || 0,
    destination: tripData.destination || 'Destination',
    eta: tripData.eta || 5,
    originalPrice: tripData.originalPrice || tripData.price || 0,
    seats: tripData.seats || 4
  };

  const paymentMethods = [
    {
      id: 'nrx',
      name: 'GFEL Crypto Wallet',
      icon: '💰',
      balance: state.nrxBalance,
      type: 'crypto',
      discount: 5, // 5% discount for GFEL
    },
    {
      id: 'cash',
      name: 'Cash Wallet',
      icon: '💳',
      balance: '250.00',
      type: 'cash',
      discount: 0,
    },
    {
      id: 'card1',
      name: 'ADCB Credit Card',
      icon: '💳',
      balance: '•••• 4567',
      type: 'card',
      discount: 0,
    },
    {
      id: 'card2',
      name: 'Emirates NBD Debit',
      icon: '💳',
      balance: '•••• 8901',
      type: 'card',
      discount: 0,
    },
    {
      id: 'apple',
      name: 'Apple Pay',
      icon: '📱',
      balance: 'Touch ID',
      type: 'digital',
      discount: 0,
    },
    {
      id: 'google',
      name: 'Google Pay',
      icon: '📱',
      balance: 'Fingerprint',
      type: 'digital',
      discount: 0,
    },
  ];

  const selectedMethod = paymentMethods.find(m => m.id === selectedPayment);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Calculate final price based on flow type
  const calculateFinalPrice = () => {
    let basePrice = 0;
    
    if (isSubscriptionOnly && subscriptionData) {
      // Subscription only - use subscription price
      basePrice = subscriptionData.price || 0;
    } else {
      // Ride booking - use ride price
      basePrice = rideData.price || 0;
    }
    
    const discount = selectedMethod?.discount || 0;
    return Math.max(0, basePrice - (basePrice * discount / 100));
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      
      if (isSubscriptionOnly) {
        // Subscription only flow
        Alert.alert(
          '✅ Payment Successful!',
          `Thank you for subscribing to ${subscriptionData?.name || 'Premium'}!\n\nPaid $${calculateFinalPrice().toFixed(2)} with ${selectedMethod.name}\n\nYour subscription is now active.`,
          [
            { 
              text: 'Great!', 
              onPress: () => navigation.navigate('Home') 
            }
          ]
        );
      } else {
        // Ride booking flow - ✅ FIXED: Pass final discounted price to TripTracking
        const finalTripData = {
          ...rideData,
          price: calculateFinalPrice(), // ✅ USE FINAL PRICE AFTER ALL DISCOUNTS
          originalPrice: rideData.price, // Keep original for reference
          discount: selectedMethod?.discount || 0,
          paymentMethod: selectedMethod.name,
          finalAmount: calculateFinalPrice(),
          nrx: Math.round(calculateFinalPrice() * 0.25) // Recalculate NRX based on final price
        };
        
        Alert.alert(
          '✅ Payment Successful!',
          `Paid $${calculateFinalPrice().toFixed(2)} with ${selectedMethod.name}\n\nYour ride is confirmed!\nDriver will be assigned shortly.`,
          [
            { 
              text: 'Track Ride', 
              onPress: () => navigation.navigate('TripTracking', finalTripData) 
            }
          ]
        );
      }
    }, 2000);
  };

  const handleAddPayment = () => {
    Alert.alert(
      '💳 Add Payment Method',
      'Choose payment method to add:\n\n• Credit/Debit Card\n• Bank Account\n• PayPal\n• Crypto Wallet',
      [
        { text: 'Credit Card', onPress: () => Alert.alert('💳', 'Card setup coming soon!') },
        { text: 'Bank Account', onPress: () => Alert.alert('🏦', 'Bank linking coming soon!') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0e27', '#1a1d3a', '#2d3561']}
        style={styles.gradient}
      >
        {/* subtle chip-style background */}
        <ChipConnectionsBG tint="#C7CED8" opacity={0.20} style={StyleSheet.absoluteFill} />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Trip Summary */}
          <View style={styles.tripSummary}>
            <LinearGradient
              colors={['rgba(79, 172, 254, 0.1)', 'rgba(0, 242, 254, 0.1)']}
              style={styles.summaryCard}
            >
              <Text style={styles.summaryTitle}>
                {isSubscriptionOnly ? 'Subscription Summary' : 'Trip Summary'}
              </Text>
              
              {isSubscriptionOnly ? (
                /* Subscription Summary */
                <>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Plan</Text>
                    <Text style={styles.summaryValue}>{subscriptionData?.name || 'Premium'}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Duration</Text>
                    <Text style={styles.summaryValue}>Monthly</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Base Price</Text>
                    <Text style={styles.summaryValue}>${subscriptionData?.price || 0}</Text>
                  </View>
                </>
              ) : (
                /* Ride Summary */
                <>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Vehicle</Text>
                    <Text style={styles.summaryValue}>{rideData.vehicle}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Destination</Text>
                    <Text style={styles.summaryValue}>{rideData.destination}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Base Price</Text>
                    <Text style={styles.summaryValue}>${rideData.price}</Text>
                  </View>
                </>
              )}
              
              {selectedMethod?.discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.discountLabel}>GFEL Discount ({selectedMethod.discount}%)</Text>
                  <Text style={styles.discountValue}>-${(calculateFinalPrice() * selectedMethod.discount / (100 - selectedMethod.discount)).toFixed(2)}</Text>
                </View>
              )}
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>${calculateFinalPrice().toFixed(2)}</Text>
              </View>
              
              {!isSubscriptionOnly && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>GFEL Rewards</Text>
                  <Text style={styles.nrxValue}>+{Math.round(calculateFinalPrice() * 0.25)} GFEL</Text>
                </View>
              )}
            </LinearGradient>
          </View>

          {/* Payment Methods */}
          <View style={styles.paymentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Payment Methods</Text>
              <TouchableOpacity onPress={handleAddPayment}>
                <Text style={styles.addButton}>+ Add</Text>
              </TouchableOpacity>
            </View>
            
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentCard,
                  selectedPayment === method.id && styles.paymentCardSelected
                ]}
                onPress={() => setSelectedPayment(method.id)}
              >
                <View style={styles.paymentLeft}>
                  <Text style={styles.paymentIcon}>{method.icon}</Text>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentName}>{method.name}</Text>
                    <Text style={styles.paymentBalance}>
                      {method.type === 'crypto' ? `${method.balance} GFEL` : method.balance}
                    </Text>
                  </View>
                </View>
                <View style={styles.paymentRight}>
                  {method.discount > 0 && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{method.discount}% OFF</Text>
                    </View>
                  )}
                  <View style={[
                    styles.radioButton,
                    selectedPayment === method.id && styles.radioButtonSelected
                  ]}>
                    {selectedPayment === method.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Security Notice */}
          <View style={styles.securitySection}>
            <Text style={styles.securityText}>
              🔒 Your payment is secured with 256-bit encryption and processed through certified payment gateways.
            </Text>
          </View>

          {/* Confirm Payment Button */}
          <View style={styles.confirmSection}>
            <TouchableOpacity 
              style={[styles.confirmButton, isProcessing && styles.confirmButtonProcessing]} 
              onPress={handleConfirmPayment}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={isProcessing ? ['#666', '#888'] : ['#4facfe', '#00f2fe']}
                style={styles.confirmGradient}
              >
                <Text style={styles.confirmButtonText}>
                  {isProcessing ? '⏳ Processing...' : `Confirm Payment • $${calculateFinalPrice().toFixed(2)}`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  },
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
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  backIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  headerTitle: {
    flex: 1,
    fontSize: fonts.sizes.base,
    fontFamily: fonts.heading,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  scrollContainer: {
    flex: 1,
  },

  // Trip Summary
  tripSummary: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  summaryCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  summaryTitle: {
    fontSize: fonts.sizes.base,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryValue: {
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
  },
  discountLabel: {
    fontSize: fonts.sizes.sm,
    color: '#4facfe',
    fontFamily: fonts.bold,
  },
  discountValue: {
    fontSize: fonts.sizes.sm,
    color: '#4facfe',
    fontFamily: fonts.bold,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: spacing.xs,
    marginTop: spacing.xs,
  },
  totalLabel: {
    fontSize: fonts.sizes.base,
    color: '#FFFFFF',
    fontFamily: fonts.bold,
  },
  totalValue: {
    fontSize: fonts.sizes.base,
    color: '#FFFFFF',
    fontFamily: fonts.bold,
  },
  nrxValue: {
    fontSize: fonts.sizes.sm,
    color: '#4facfe',
    fontFamily: fonts.bold,
  },

  // Payment Methods
  paymentSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fonts.sizes.base,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
  },
  addButton: {
    fontSize: fonts.sizes.sm,
    color: '#4facfe',
    fontFamily: fonts.medium,
  },
  paymentCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
  },
  paymentCardSelected: {
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    borderColor: '#4facfe',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.medium,
    color: '#FFFFFF',
  },
  paymentBalance: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  paymentRight: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  discountBadge: {
    backgroundColor: '#4facfe',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    marginRight: spacing.sm,
  },
  discountText: {
    fontSize: fonts.sizes.xs,
    color: '#FFFFFF',
    fontFamily: fonts.bold,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#4facfe',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4facfe',
  },

  // Security Section
  securitySection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  securityText: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Confirm Button
  confirmSection: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  confirmButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    height: 48,
  },
  confirmButtonProcessing: {
    opacity: 0.7,
  },
  confirmGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: fonts.sizes.base,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
  },
});
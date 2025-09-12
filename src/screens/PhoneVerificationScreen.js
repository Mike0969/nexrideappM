import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';

export default function PhoneVerificationScreen({ navigation, route }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(26);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

  const phoneNumber = route?.params?.phone || '+971 50 123 4567';

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits entered
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleVerify();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredCode = code.join('');
    if (enteredCode.length === 6) {
      // Navigate to main app
      navigation.navigate('Home');
    }
  };

  const handleResend = () => {
    if (canResend) {
      setTimer(26);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      // Focus first input
      inputs.current[0]?.focus();
    }
  };

  const handleChangeNumber = () => {
    navigation.goBack();
  };

  const handleEmailInstead = () => {
    navigation.navigate('EmailVerification');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0e27', '#1a1d3a', '#2d3561']}
        style={styles.gradient}
      >
        {/* Web3 Background Effects */}
        <View style={styles.backgroundEffects}>
          <LinearGradient
            colors={['transparent', '#4facfe', 'transparent']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[styles.glowLine, styles.line1]}
          />
          <LinearGradient
            colors={['transparent', '#00f2fe', 'transparent']}
            start={{x: 1, y: 0}}
            end={{x: 0, y: 1}}
            style={[styles.glowLine, styles.line2]}
          />
          <View style={[styles.particle, styles.particle1]} />
          <View style={[styles.particle, styles.particle2]} />
        </View>

        <KeyboardAvoidingView 
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  style={styles.logo}
                >
                  <Text style={styles.logoText}>N</Text>
                </LinearGradient>
                <Text style={styles.appName}>NexRide</Text>
              </View>
            </View>

            {/* Verification Content */}
            <View style={styles.verificationContainer}>
              <Text style={styles.title}>Verify Phone</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code we sent via SMS.
              </Text>

              {/* Phone Tabs */}
              <View style={styles.tabContainer}>
                <View style={[styles.tab, styles.activeTab]}>
                  <Text style={styles.activeTabText}>Phone</Text>
                </View>
                <TouchableOpacity 
                  style={styles.tab}
                  onPress={handleEmailInstead}
                >
                  <Text style={styles.tabText}>Email</Text>
                </TouchableOpacity>
                <View style={styles.tab}>
                  <Text style={styles.tabText}>Social</Text>
                </View>
              </View>

              {/* Phone Number Display */}
              <View style={styles.phoneContainer}>
                <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                <TouchableOpacity onPress={handleChangeNumber}>
                  <Text style={styles.changeButton}>Change</Text>
                </TouchableOpacity>
              </View>

              {/* Code Input */}
              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => inputs.current[index] = ref}
                    style={[
                      styles.codeInput,
                      digit ? styles.codeInputFilled : null
                    ]}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              {/* Resend Timer */}
              <View style={styles.resendContainer}>
                {canResend ? (
                  <TouchableOpacity onPress={handleResend}>
                    <Text style={styles.resendButton}>Resend code</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.timerText}>
                    Resend code in {timer}s
                  </Text>
                )}
              </View>

              {/* GFEL Balance Display */}
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceText}>0.00 GFEL</Text>
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  code.every(d => d) ? styles.continueButtonActive : null
                ]}
                onPress={handleVerify}
                disabled={!code.every(d => d)}
              >
                <LinearGradient
                  colors={code.every(d => d) ? ['#4facfe', '#00f2fe'] : ['#333', '#555']}
                  style={styles.continueGradient}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Email Alternative */}
              <TouchableOpacity onPress={handleEmailInstead}>
                <Text style={styles.emailAlternative}>Use email instead</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  backgroundEffects: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glowLine: {
    position: 'absolute',
    height: 1,
    opacity: 0.2,
  },
  line1: {
    width: '60%',
    top: '20%',
    right: '10%',
    transform: [{ rotate: '25deg' }],
  },
  line2: {
    width: '45%',
    top: '70%',
    left: '15%',
    transform: [{ rotate: '-20deg' }],
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#4facfe',
    borderRadius: 1.5,
    opacity: 0.4,
  },
  particle1: {
    top: '30%',
    left: '80%',
  },
  particle2: {
    top: '60%',
    right: '20%',
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  verificationContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: fonts.sizes['2xl'],
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: spacing.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  activeTab: {
    backgroundColor: '#4facfe',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.base,
    fontWeight: '600',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: fonts.sizes.base,
    fontWeight: '500',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
  },
  phoneNumber: {
    fontSize: fonts.sizes.lg,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  changeButton: {
    fontSize: fonts.sizes.base,
    color: '#4facfe',
    fontWeight: '600',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.lg,
  },
  codeInput: {
    width: 45,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: borderRadius.md,
    textAlign: 'center',
    fontSize: fonts.sizes.xl,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  codeInputFilled: {
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    borderColor: '#4facfe',
  },
  resendContainer: {
    marginBottom: spacing.xl,
  },
  resendButton: {
    color: '#4facfe',
    fontSize: fonts.sizes.base,
    fontWeight: '600',
  },
  timerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: fonts.sizes.base,
  },
  balanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xl,
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.base,
    fontWeight: '600',
  },
  continueButton: {
    width: '100%',
    height: 56,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  continueButtonActive: {
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
  },
  emailAlternative: {
    color: '#4facfe',
    fontSize: fonts.sizes.base,
    fontWeight: '500',
  },
});
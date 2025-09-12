import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import ChipConnectionsBG from '../components/ChipConnectionsBG';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletStep, setWalletStep] = useState('connecting');
  const [showOverlay, setShowOverlay] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [scriptText, setScriptText] = useState('');

  const overlayAnim = useRef(new Animated.Value(40)).current;
  // force-play video once its first bytes are loaded
  const overlayVideoRef = useRef(null);
  const scriptOpacity = useRef(new Animated.Value(0)).current;

  // Wallet Button Animations
  const cryptoParticles = useRef([]).current;
  const blockchainPulse = useRef(new Animated.Value(0)).current;
  const cryptoGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize crypto particle animations
    for (let i = 0; i < 20; i++) {
      cryptoParticles[i] = new Animated.Value(0);
    }
    
    startCryptoAnimations();
  }, []);

  const startCryptoAnimations = () => {
    // Blockchain pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(blockchainPulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(blockchainPulse, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Crypto glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(cryptoGlow, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(cryptoGlow, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Crypto particles
    cryptoParticles.forEach((anim, index) => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 4000 + (index * 200),
          useNativeDriver: true,
        })
      ).start();
    });
  };

  const renderCryptoParticles = () => {
    return cryptoParticles.map((anim, index) => {
      const angle = (index / cryptoParticles.length) * 2 * Math.PI;
      const radius = 40 + (index % 2) * 10;
      
      const translateX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [
          Math.cos(angle) * radius,
          Math.cos(angle + Math.PI * 2) * radius
        ],
      });
      
      const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [
          Math.sin(angle) * radius,
          Math.sin(angle + Math.PI * 2) * radius
        ],
      });

      const opacity = anim.interpolate({
        inputRange: [0, 0.3, 0.7, 1],
        outputRange: [0, 1, 1, 0],
      });

      return (
        <Animated.View
          key={index}
          style={[
            styles.cryptoParticle,
            {
              transform: [{ translateX }, { translateY }],
              opacity,
            }
          ]}
        />
      );
    });
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    navigation.navigate('Home');
  };

  const handleWalletConnect = () => {
    // show overlay; wait for video ready to coordinate script & navigation
    overlayAnim.setValue(40);      // reset scroll position
    setShowScript(false);          // hide script until delay
    setShowOverlay(true);
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality coming soon!');
  };

  const WalletConnectModal = () => (
    <Modal
      visible={showWalletModal}
      transparent
      animationType="fade"
    >
      <View style={walletModalStyles.overlay}>
        <View style={walletModalStyles.container}>
          <LinearGradient
            colors={['#000011', '#001122', '#002244']}
            style={walletModalStyles.gradient}
          >
            {walletStep === 'connecting' && (
              <View style={walletModalStyles.content}>
                <Text style={walletModalStyles.icon}>🔗</Text>
                <Text style={walletModalStyles.title}>Connecting to Blockchain</Text>
                <Text style={walletModalStyles.subtitle}>Establishing secure connection...</Text>
                <View style={walletModalStyles.loader}>
                  <Text style={walletModalStyles.dots}>●●●</Text>
                </View>
              </View>
            )}
            
            {walletStep === 'assembling' && (
              <View style={walletModalStyles.content}>
                <Text style={walletModalStyles.icon}>⛓️</Text>
                <Text style={walletModalStyles.title}>Assembling Crypto Network</Text>
                <Text style={walletModalStyles.subtitle}>Building blockchain architecture...</Text>
                <LinearGradient
                  colors={['#00FFFF', '#4169E1']}
                  style={walletModalStyles.progressBar}
                >
                  <Text style={walletModalStyles.progressText}>Deploying Smart Contracts...</Text>
                </LinearGradient>
              </View>
            )}
            
            {walletStep === 'welcome' && (
              <View style={walletModalStyles.content}>
                <Text style={walletModalStyles.icon}>✨</Text>
                <Text style={walletModalStyles.title}>Welcome to Web3, John!</Text>
                <Text style={walletModalStyles.subtitle}>Blockchain connection established</Text>
                <Text style={walletModalStyles.success}>Ready for decentralized rides</Text>
              </View>
            )}
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );

  const pulseScale = blockchainPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const glowOpacity = cryptoGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0e27', '#1a1d3a', '#2d3561']}
        style={styles.gradient}
      >
        {/* silver circuit background */}
        <ChipConnectionsBG opacity={0.20} tint="#C7CED8" />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView 
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to your NexRide account</Text>
              </View>

              {/* Crypto Wallet Connect Button */}
              <TouchableOpacity
                style={styles.walletConnectPro}
                onPress={handleWalletConnect}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="wallet-outline"
                  size={18}
                  color="#8FB3FF"
                  style={{ marginRight: spacing.sm }}
                />
                <Text style={styles.walletConnectProText}>WalletConnect</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Login Form */}
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter email"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                </View>

                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>Continue with Email</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>
                  Don't have an account?{' '}
                  <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signUpLink}>Sign Up</Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Full-screen 3-second overlay while connecting */}
        {showOverlay && (
          <View style={overlayStyles.container}>
            <Video
              source={require('../../assets/connect/connecting_trimmed.mp4')}
              style={StyleSheet.absoluteFill}
              ref={overlayVideoRef}
              shouldPlay
              isLooping={false}
              isMuted
              playsInSilentModeIOS
              resizeMode={ResizeMode.COVER}
              progressUpdateIntervalMillis={50}
              onLoad={() =>
                overlayVideoRef.current?.setStatusAsync?.({
                  shouldPlay: true,
                  isMuted: true,
                  rate: 1.0,
                  positionMillis: 1, // skip first black frame
                })
              }
              onReadyForDisplay={() => {
                /* Sequence: wait 1s, phrase1, phrase2, final phrase (total ~3.3s) */
                const fadeIn  = () =>
                  Animated.timing(scriptOpacity, { toValue: 1, duration: 200, useNativeDriver: true });
                const fadeOut = () =>
                  Animated.timing(scriptOpacity, { toValue: 0, duration: 200, useNativeDriver: true });

                setTimeout(() => {
                  setShowScript(true);
                  // Phrase 1
                  setScriptText('Connecting to wallet...');
                  fadeIn().start(() => {
                    setTimeout(() => {
                      fadeOut().start(() => {
                        // Phrase 2
                        setScriptText('Authorizing secure session...');
                        fadeIn().start(() => {
                          setTimeout(() => {
                            fadeOut().start(() => {
                              // Final phrase (longer hold)
                              setScriptText('Hello John, connection successful');
                              fadeIn().start(() => {
                                setTimeout(() => {
                                  setShowOverlay(false);
                                  navigation.navigate('Home');
                                }, 1100);
                              });
                            });
                          }, 600);
                        });
                      });
                    }, 600);
                  });
                }, 1000); // initial video-only second
              }}
            />
            {showScript && (
              <Animated.Text
                style={[
                  overlayStyles.scrollingText,
                  { opacity: scriptOpacity },
                ]}
              >
                {scriptText}
              </Animated.Text>
            )}
          </View>
        )}

        <WalletConnectModal />
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
  backButton: {
    marginTop: spacing.lg,
    marginLeft: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    zIndex: 1,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.base,
    fontWeight: '500',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
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
  },

  // Crypto Wallet Connect Button
  walletConnectButton: {
    marginBottom: spacing.lg,
  },
  walletButtonContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 12,
  },
  walletButtonGradient: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    position: 'relative',
    overflow: 'hidden',
  },
  cryptoParticleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cryptoParticle: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  walletButtonContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  walletIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  walletButtonText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  walletSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: fonts.sizes.xs,
    marginTop: 2,
    letterSpacing: 1,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: fonts.sizes.sm,
    marginHorizontal: spacing.md,
  },

  // Form (Smaller)
  formContainer: {
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: fonts.sizes.sm,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(143, 179, 255, 0.35)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fonts.sizes.base,
    color: '#FFFFFF',
    minHeight: 44,
  },
  /* Compact WalletConnect button */
  walletConnectPro: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 224, 255, 0.08)',
    borderColor: 'rgba(0, 224, 255, 0.24)',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  walletConnectProText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.base,
    fontWeight: '600',
  },
  forgotPasswordText: {
    color: '#4facfe',
    fontSize: fonts.sizes.xs,
    textAlign: 'right',
    marginBottom: spacing.md,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.base,
    fontWeight: 'bold',
  },
  signUpContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  signUpText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: fonts.sizes.sm,
  },
  signUpLink: {
    color: '#4facfe',
    fontWeight: '600',
    marginTop: 2,
  },
});

// Overlay Styles (video + scrolling text)
const overlayStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  scrollingText: {
    position: 'absolute',
    bottom: 80,
    left: 24,
    right: 24,
    color: '#FFFFFF',
    fontSize: fonts.sizes.base,
    fontWeight: '600',
    lineHeight: 24,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

// Wallet Modal Styles
const walletModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#00FFFF',
  },
  gradient: {
    padding: spacing.xl,
    minHeight: 200,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  loader: {
    marginTop: spacing.md,
  },
  dots: {
    fontSize: 24,
    color: '#00FFFF',
    letterSpacing: 4,
  },
  progressBar: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  success: {
    fontSize: fonts.sizes.base,
    color: '#00FFFF',
    fontWeight: 'bold',
    marginTop: spacing.sm,
  },
});
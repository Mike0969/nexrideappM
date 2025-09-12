import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: '#6C5CE7',        // neon purple
  secondary: '#00D1FF',      // neon cyan
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#0A0F1F',     // very dark blue
  backgroundDark: '#070A14',
  card: '#0F172A',
  cardDark: '#0B1220',
  text: '#E6EAF2',
  textDark: '#F8FAFF',
  textSecondary: '#96A2C2',
  border: '#1E2A44',
  borderDark: '#0F1A2B',
  gradient: ['#0A0F1F', '#0E1B3A', '#1B3B6F']
};

export const fonts = {
  // Web3 typography
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  bold: 'Inter_600SemiBold',
  heading: 'SpaceGrotesk_700Bold',
  headingSemi: 'SpaceGrotesk_600SemiBold',
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.background,
    fontSize: fonts.sizes.base,
    fontFamily: fonts.bold,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  /* --- New tokens for glass cards & effects --- */
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(199,206,216,0.25)',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  glowOutline: {
    shadowColor: '#00E0FF',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  pressScale: {
    transform: [{ scale: 0.98 }],
  },
});

export const screenWidth = width;
export const screenHeight = height;
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/globalStyles';

const { width } = Dimensions.get('window');

const NeonWaves = ({ height = 140, speed = 8000, opacity = 0.3, position = 'bottom' }) => {
  // Animation values for both wave layers
  const waveOnePosition = useRef(new Animated.Value(0)).current;
  const waveTwoPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create looping animations for both waves in opposite directions
    Animated.loop(
      Animated.timing(waveOnePosition, {
        toValue: 1,
        duration: speed,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(waveTwoPosition, {
        toValue: 1,
        duration: speed * 1.5, // Slightly slower for variation
        useNativeDriver: true,
      })
    ).start();
  }, [speed]);

  // Interpolate the wave positions for translation
  const waveOneTranslate = waveOnePosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0],
  });

  const waveTwoTranslate = waveTwoPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  // Calculate position styles
  const positionStyles = {};
  if (position === 'bottom') {
    positionStyles.bottom = 0;
  } else if (position === 'top') {
    positionStyles.top = 0;
  }

  return (
    <View style={[styles.container, positionStyles, { height }]}>
      {/* First wave layer */}
      <Animated.View
        style={[
          styles.waveContainer,
          { 
            height: height * 0.6,
            opacity,
            transform: [{ translateX: waveOneTranslate }],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.wave}
        />
      </Animated.View>

      {/* Second wave layer */}
      <Animated.View
        style={[
          styles.waveContainer,
          { 
            height: height * 0.8,
            opacity: opacity * 0.7,
            top: height * 0.2,
            transform: [{ translateX: waveTwoTranslate }],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.secondary, colors.primary, 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.wave}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  waveContainer: {
    position: 'absolute',
    width: width * 2, // Double width for full animation cycle
    left: 0,
  },
  wave: {
    flex: 1,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 60,
  },
});

export default NeonWaves;

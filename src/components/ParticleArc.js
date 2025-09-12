import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

// Create animated SVG Path component
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function ParticleArc({
  width = screenWidth,
  height = 180,
  thickness = 6,
  duration = 1500,
  style,
}) {
  // Animation value for dash offset
  const dashOffset = useRef(new Animated.Value(0)).current;
  
  // Calculate path dimensions
  const margin = width * 0.1;
  const arcWidth = width - (margin * 2);
  // make the wave “taller / ample”
  const arcHeight = height * 0.9;
  
  // Calculate path points
  const startX = margin;
  const startY = height * 0.8;
  const endX = width - margin;
  const endY = height * 0.8;
  
  // Create arc path
  const arcPath = `M${startX},${startY} A${arcWidth/2},${arcHeight} 0 0 1 ${endX},${endY}`;
  
  // Dash pattern
  // denser particle pattern (tweak for visibility)
  const dashGap = 3;
  const dashWidth = 4;
  const dashPattern = `${dashWidth},${dashGap}`;
  const dashPeriod = (dashWidth + dashGap) * 40; // Enough segments to cover path

  // Phase-shifted offsets to create a thicker particle band
  const phase2 = useRef(new Animated.Value(-(dashWidth + dashGap) / 2)).current;
  const phase3 = useRef(new Animated.Value(-(dashWidth + dashGap))).current;
  const offset2 = Animated.add(dashOffset, phase2);
  const offset3 = Animated.add(dashOffset, phase3);
  
  useEffect(() => {
    // Start animation on mount
    Animated.timing(dashOffset, {
      toValue: -dashPeriod,
      duration: duration,
      useNativeDriver: false, // strokeDashoffset is not supported by native driver
      easing: Easing.linear,
    }).start();
    
    // Optional: to loop animation
    // Animated.loop(
    //   Animated.timing(dashOffset, {
    //     toValue: -dashPeriod,
    //     duration: duration,
    //     useNativeDriver: false,
    //     easing: Easing.linear,
    //   }),
    //   { iterations: 2 }
    // ).start();
  }, []);
  
  return (
    <View style={[styles.container, { width, height }, style]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colors.secondary} stopOpacity="1" />
            <Stop offset="1" stopColor={colors.primary} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        {/* Underlying glow stroke */}
        <Path
          d={arcPath}
          stroke="url(#arcGrad)"
          strokeWidth={thickness * 2.4}
          strokeLinecap="round"
          opacity={0.28}
          fill="none"
        />
        <AnimatedPath
          d={arcPath}
          stroke="url(#arcGrad)"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={dashPattern}
          strokeDashoffset={dashOffset}
          fill="none"
        />
        {/* phase-shifted paths for thicker particle band */}
        <AnimatedPath
          d={arcPath}
          stroke="url(#arcGrad)"
          strokeWidth={thickness * 0.9}
          strokeLinecap="round"
          strokeDasharray={dashPattern}
          strokeDashoffset={offset2}
          fill="none"
        />
        <AnimatedPath
          d={arcPath}
          stroke="url(#arcGrad)"
          strokeWidth={thickness * 0.7}
          strokeLinecap="round"
          strokeDasharray={dashPattern}
          strokeDashoffset={offset3}
          fill="none"
        />
      </Svg>
      
      {/* Left endpoint glow */}
      <View style={[styles.endpoint, { 
        left: startX - 7,
        top: startY - 7,
        backgroundColor: colors.secondary
      }]} />
      
      {/* Right endpoint glow */}
      <View style={[styles.endpoint, { 
        left: endX - 7,
        top: endY - 7,
        backgroundColor: colors.secondary
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  },
  endpoint: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
});

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const GRID_STEP = 60;

export default function ChipConnectionsBG({ opacity = 0.07, tint = '#00E0FF', style }) {
  // Calculate grid parameters
  const numHorizontalLines = Math.ceil(height / GRID_STEP) + 1;
  const numVerticalLines = Math.ceil(width / GRID_STEP) + 1;
  
  // Generate intersection points for potential nodes
  const intersections = [];
  for (let i = 0; i < numHorizontalLines; i++) {
    for (let j = 0; j < numVerticalLines; j++) {
      // Only add ~20% of intersections as nodes
      if (Math.random() > 0.8) {
        intersections.push({
          x: j * GRID_STEP,
          y: i * GRID_STEP,
          radius: Math.random() > 0.7 ? 2.5 : 1.5,
        });
      }
    }
  }

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id="traceGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={tint} stopOpacity={opacity * 0.8} />
            <Stop offset="1" stopColor={tint} stopOpacity={opacity * 0.4} />
          </LinearGradient>
        </Defs>

        {/* Horizontal grid lines */}
        {Array.from({ length: numHorizontalLines }).map((_, i) => (
          <Line
            key={`h-${i}`}
            x1="0"
            y1={i * GRID_STEP}
            x2={width}
            y2={i * GRID_STEP}
            stroke={tint}
            strokeWidth={0.7}
            opacity={opacity}
          />
        ))}

        {/* Vertical grid lines */}
        {Array.from({ length: numVerticalLines }).map((_, i) => (
          <Line
            key={`v-${i}`}
            x1={i * GRID_STEP}
            y1="0"
            x2={i * GRID_STEP}
            y2={height}
            stroke={tint}
            strokeWidth={0.7}
            opacity={opacity}
          />
        ))}

        {/* Diagonal lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Line
            key={`d1-${i}`}
            x1={width * 0.2 + i * GRID_STEP}
            y1="0"
            x2="0"
            y2={height * 0.2 + i * GRID_STEP}
            stroke={tint}
            strokeWidth={1.0}
            opacity={opacity * 0.8}
          />
        ))}

        {Array.from({ length: 5 }).map((_, i) => (
          <Line
            key={`d2-${i}`}
            x1={width * 0.6 + i * GRID_STEP}
            y1="0"
            x2={width}
            y2={height * 0.6 + i * GRID_STEP}
            stroke={tint}
            strokeWidth={1.0}
            opacity={opacity * 0.8}
          />
        ))}

        {/* Circuit traces (curved paths) */}
        <Path
          d={`M ${width * 0.1},${height * 0.2} 
              C ${width * 0.3},${height * 0.3} 
                ${width * 0.5},${height * 0.4} 
                ${width * 0.7},${height * 0.3}`}
          stroke="url(#traceGradient)"
          strokeWidth={2.5}
          fill="none"
          opacity={opacity * 0.6}
        />

        <Path
          d={`M ${width * 0.2},${height * 0.7} 
              C ${width * 0.4},${height * 0.8} 
                ${width * 0.6},${height * 0.6} 
                ${width * 0.8},${height * 0.7}`}
          stroke={tint}
          strokeWidth={2}
          fill="none"
          opacity={opacity * 0.6}
        />

        <Path
          d={`M ${width * 0.8},${height * 0.1} 
              C ${width * 0.7},${height * 0.3} 
                ${width * 0.6},${height * 0.5} 
                ${width * 0.3},${height * 0.6}`}
          stroke={tint}
          strokeWidth={1.8}
          fill="none"
          opacity={opacity * 0.6}
        />

        {/* Nodes at intersections */}
        {intersections.map((point, index) => (
          <Circle
            key={`node-${index}`}
            cx={point.x}
            cy={point.y}
            r={point.radius}
            fill={tint}
            opacity={opacity * 0.5}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
});

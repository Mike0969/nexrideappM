// src/components/PriceAnimation.js

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { fonts } from '../styles/globalStyles';

const { width } = Dimensions.get('window');

export default function PriceAnimation({ 
  savings, 
  showAnimation = false, 
  onAnimationComplete,
  style 
}) {
  const confettiAnimations = useRef([]);
  const savingsAnimation = useRef(new Animated.Value(0)).current;
  const bounceAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (showAnimation && savings > 0) {
      startSavingsAnimation();
      startConfettiAnimation();
    }
  }, [showAnimation, savings]);

  const startSavingsAnimation = () => {
    // Reset animation
    savingsAnimation.setValue(0);
    bounceAnimation.setValue(1);

    // Animated sequence
    Animated.sequence([
      // Scale up the savings amount
      Animated.timing(savingsAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Bounce effect
      Animated.spring(bounceAnimation, {
        toValue: 1.2,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
      // Return to normal size
      Animated.spring(bounceAnimation, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  };

  const startConfettiAnimation = () => {
    // Create confetti pieces
    const confettiPieces = Array.from({ length: 15 }, (_, index) => {
      const animatedValue = new Animated.Value(0);
      confettiAnimations.current[index] = animatedValue;

      // Random horizontal position
      const xPosition = Math.random() * width;
      
      // Animate falling confetti
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000 + Math.random() * 1000,
        useNativeDriver: true,
      }).start();

      return {
        id: index,
        animatedValue,
        xPosition,
        color: ['#FFD700', '#FF6B6B', '#4FACFE', '#43E97B', '#FF8C00'][Math.floor(Math.random() * 5)],
        size: 8 + Math.random() * 4,
      };
    });

    return confettiPieces;
  };

  const getConfettiTransform = (piece) => {
    const translateY = piece.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-50, 400],
    });

    const rotate = piece.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const opacity = piece.animatedValue.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [1, 1, 0],
    });

    return {
      transform: [
        { translateX: piece.xPosition },
        { translateY },
        { rotate },
      ],
      opacity,
    };
  };

  if (!showAnimation) return null;

  const confettiPieces = startConfettiAnimation();

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      {/* Confetti Animation */}
      {confettiPieces.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.confettiPiece,
            {
              backgroundColor: piece.color,
              width: piece.size,
              height: piece.size,
            },
            getConfettiTransform(piece),
          ]}
        />
      ))}

      {/* Savings Amount Animation */}
      <Animated.View
        style={[
          styles.savingsContainer,
          {
            opacity: savingsAnimation,
            transform: [
              { scale: bounceAnimation },
              {
                translateY: savingsAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.savingsIcon}>🎉</Text>
        <Text style={styles.savingsText}>You Saved</Text>
        <Text style={styles.savingsAmount}>${savings.toFixed(2)}</Text>
        <Text style={styles.savingsSubtext}>Better than 94% of users!</Text>
      </Animated.View>

      {/* Pulse Rings */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            opacity: savingsAnimation.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.8, 0],
            }),
            transform: [
              {
                scale: savingsAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.pulseRing,
          styles.pulseRingDelay,
          {
            opacity: savingsAnimation.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [0, 0.6, 0],
            }),
            transform: [
              {
                scale: savingsAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 2.5],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

// Coin Drop Animation Component
export function CoinDropAnimation({ count = 5, style }) {
  const coinAnimations = useRef([]).current;

  useEffect(() => {
    // Create coin animations
    for (let i = 0; i < count; i++) {
      const animatedValue = new Animated.Value(0);
      coinAnimations[i] = animatedValue;

      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        delay: i * 200,
        useNativeDriver: true,
      }).start();
    }
  }, [count]);

  return (
    <View style={[styles.coinContainer, style]} pointerEvents="none">
      {Array.from({ length: count }, (_, index) => {
        const animatedValue = coinAnimations[index] || new Animated.Value(0);
        
        return (
          <Animated.Text
            key={index}
            style={[
              styles.coin,
              {
                left: 50 + index * 20,
                transform: [
                  {
                    translateY: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 100],
                    }),
                  },
                  {
                    rotate: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '720deg'],
                    }),
                  },
                ],
                opacity: animatedValue.interpolate({
                  inputRange: [0, 0.8, 1],
                  outputRange: [1, 1, 0],
                }),
              },
            ]}
          >
            🪙
          </Animated.Text>
        );
      })}
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
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confettiPiece: {
    position: 'absolute',
    borderRadius: 2,
  },
  savingsContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(67, 233, 123, 0.9)',
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#43E97B',
  },
  savingsIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  savingsText: {
    fontSize: fonts.sizes.base,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  savingsAmount: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  savingsSubtext: {
    fontSize: fonts.sizes.sm,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  pulseRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#43E97B',
  },
  pulseRingDelay: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  coinContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  coin: {
    position: 'absolute',
    fontSize: 24,
  },
});
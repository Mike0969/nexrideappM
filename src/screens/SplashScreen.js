import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Video, ResizeMode, Audio } from 'expo-av';

const { height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  // controls showing logo only when first frame of video is ready
  const [videoReady, setVideoReady] = useState(false);
  // reference to force-play video as soon as it is loaded
  const videoRef = useRef(null);
  /* ensure video audio plays even when iOS device is on silent */
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: false,
    }).catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      {/* Splash video */}
      <Video
        /* trimmed 150 ms, includes audio */
        source={require('../../assets/splash/starting_video_app_fast_audio.mp4')}
        style={StyleSheet.absoluteFill}
        ref={videoRef}
        shouldPlay
        isLooping={false}
        onLoadStart={() => setVideoReady(false)}
        onReadyForDisplay={() => setVideoReady(true)}
        onLoad={async () => {
          try {
            await videoRef.current?.setStatusAsync?.({
              shouldPlay: true,
              isMuted: false,
              rate: 1.0,
              positionMillis: 1, // skip potential black frame
            });
          } catch {}
        }}
        volume={1}
        rate={1.0}
        isMuted={false}
        playsInSilentModeIOS
        resizeMode={ResizeMode.COVER}
        onPlaybackStatusUpdate={(s) => {
          if (s.didJustFinish) {
            setTimeout(() => navigation.replace('Welcome'), 200);
          }
        }}
      />

      {/* Brand logo + title (only after first video frame is ready) */}
      <View
        style={[
          styles.brand,
          {
            top: videoReady ? Math.round(height * 0.08) : Math.round(height * 0.45),
          },
        ]}
      >
        <Image
          source={require('../../assets/brand/nexride-badge.png')}
          style={styles.brandIcon}
          resizeMode="contain"
        />
        <Text style={styles.brandTitle}>NexRide</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  statusContainer: { position: 'absolute', bottom: 100, alignItems: 'center' },
  statusText: { fontSize: 14, color: '#4169E1' },
  brand: {
    position: 'absolute',
    top: Math.round(height * 0.08),
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 8,
  },
  logo: {
    width: 220,
    height: 80,
    borderRadius: 0,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: '#072c5e',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
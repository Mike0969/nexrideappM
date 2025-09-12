import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, borderRadius } from '../styles/globalStyles';

export default function VR360Viewer({ visible, onClose, experience }) {
  const [isLoading, setIsLoading] = useState(true);

  // Demo VR experiences with 360° images
  const vrExperiences = {
    burj_khalifa: {
      name: 'Burj Khalifa View',
      description: 'Experience Dubai from the world\'s tallest building',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=2048&h=1024',
      icon: '🏗️'
    },
    dubai_mall: {
      name: 'Dubai Mall Interior',
      description: 'Virtual tour of the world\'s largest shopping mall',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2048&h=1024',
      icon: '🏬'
    },
    palm_jumeirah: {
      name: 'Palm Jumeirah Beach',
      description: 'Relaxing beach views from the iconic Palm island',
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=2048&h=1024',
      icon: '🌴'
    },
    marina_sunset: {
      name: 'Dubai Marina Sunset',
      description: 'Stunning sunset views over Dubai Marina',
      imageUrl: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=2048&h=1024',
      icon: '🌅'
    },
    dubai_skyline: {
      name: 'Dubai Skyline VR Tour',
      description: 'Immersive 360° tour of Dubai landmarks',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=2048&h=1024',
      icon: '🌆'
    },
    arabian_quest: {
      name: 'Arabian Adventure Quest',
      description: 'Interactive desert adventure experience',
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=2048&h=1024',
      icon: '🐪'
    }
  };

  const currentExperience = vrExperiences[experience] || vrExperiences.burj_khalifa;

  // Simple 360° viewer HTML using CSS transforms (no external dependencies)
  const vrHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>NexRide VR Experience</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        body { 
          margin: 0; 
          padding: 0;
          font-family: Arial, sans-serif; 
          background: #000;
          overflow: hidden;
          touch-action: pan-x pan-y;
        }
        
        .vr-container {
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
          background: #000;
        }
        
        .vr-image {
          width: 200%;
          height: 200%;
          background-image: url('${currentExperience.imageUrl}');
          background-size: cover;
          background-position: center;
          position: absolute;
          top: -50%;
          left: -50%;
          transition: transform 0.1s ease-out;
          cursor: grab;
        }
        
        .vr-image:active {
          cursor: grabbing;
        }
        
        .ui-overlay {
          position: fixed;
          top: 20px;
          left: 20px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 15px;
          border-radius: 10px;
          font-family: Arial, sans-serif;
          z-index: 1000;
          max-width: 300px;
        }
        
        .experience-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #4facfe;
        }
        
        .experience-desc {
          font-size: 12px;
          opacity: 0.9;
        }
        
        .controls-hint {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 12px;
          z-index: 1000;
          text-align: center;
        }
        
        .loading {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 18px;
          z-index: 1000;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="loading" id="loading">
        <div>🥽</div>
        <div>Loading VR Experience...</div>
      </div>
      
      <div class="vr-container">
        <div class="vr-image" id="vrImage"></div>
        
        <div class="ui-overlay">
          <div class="experience-title">${currentExperience.icon} ${currentExperience.name}</div>
          <div class="experience-desc">${currentExperience.description}</div>
        </div>
        
        <div class="controls-hint">
          📱 Move your phone to look around • Drag to explore • Tilt for immersion
        </div>
      </div>

      <script>
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        
        const vrImage = document.getElementById('vrImage');
        const loading = document.getElementById('loading');
        
        // Hide loading after a short delay
        setTimeout(() => {
          loading.style.display = 'none';
        }, 1500);
        
        // Mouse/Touch events for desktop and mobile
        function getEventPos(e) {
          return {
            x: e.touches ? e.touches[0].clientX : e.clientX,
            y: e.touches ? e.touches[0].clientY : e.clientY
          };
        }
        
        function startDrag(e) {
          isDragging = true;
          const pos = getEventPos(e);
          startX = pos.x - currentX;
          startY = pos.y - currentY;
          e.preventDefault();
        }
        
        function drag(e) {
          if (!isDragging) return;
          
          const pos = getEventPos(e);
          currentX = pos.x - startX;
          currentY = pos.y - startY;
          
          // Limit movement
          currentX = Math.max(-50, Math.min(50, currentX));
          currentY = Math.max(-50, Math.min(50, currentY));
          
          vrImage.style.transform = \`translate(\${currentX}px, \${currentY}px) scale(1.1)\`;
          e.preventDefault();
        }
        
        function endDrag(e) {
          isDragging = false;
          e.preventDefault();
        }
        
        // Mouse events
        vrImage.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        // Touch events
        vrImage.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', endDrag, { passive: false });
        
        // Device orientation for mobile VR effect
        if (window.DeviceOrientationEvent) {
          window.addEventListener('deviceorientation', function(e) {
            if (e.beta !== null && e.gamma !== null) {
              const tiltX = e.gamma * 0.5; // Left/right tilt
              const tiltY = e.beta * 0.3; // Forward/back tilt
              
              if (!isDragging) {
                vrImage.style.transform = \`translate(\${tiltX}px, \${tiltY}px) scale(1.1)\`;
              }
            }
          });
        }
        
        // Auto-rotate demo
        let autoRotate = true;
        let rotationAngle = 0;
        
        function autoRotateView() {
          if (autoRotate && !isDragging) {
            rotationAngle += 0.2;
            const x = Math.sin(rotationAngle * 0.01) * 20;
            const y = Math.cos(rotationAngle * 0.01) * 10;
            vrImage.style.transform = \`translate(\${x}px, \${y}px) scale(1.1)\`;
          }
          requestAnimationFrame(autoRotateView);
        }
        
        autoRotateView();
        
        // Stop auto-rotate on interaction
        vrImage.addEventListener('mousedown', () => autoRotate = false);
        vrImage.addEventListener('touchstart', () => autoRotate = false);
      </script>
    </body>
    </html>
  `;

  const handleClose = () => {
    setIsLoading(true);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#0a0e27', '#1a1d3a']}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>VR Experience</Text>
            <TouchableOpacity 
              style={styles.helpButton}
              onPress={() => Alert.alert('VR Controls', '📱 Move your phone to look around\n👆 Tap and drag to explore\n🔄 Auto-rotation for immersion\n🥽 Use VR headset for full experience')}
            >
              <Text style={styles.helpIcon}>?</Text>
            </TouchableOpacity>
          </View>

          {/* VR WebView */}
          <View style={styles.vrContainer}>
            <WebView
              source={{ html: vrHTML }}
              style={styles.webview}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              allowsInlineMediaPlaybook={true}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={false}
              scrollEnabled={false}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
            
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <LinearGradient
                  colors={['rgba(79, 172, 254, 0.2)', 'rgba(0, 242, 254, 0.2)']}
                  style={styles.loadingContainer}
                >
                  <Text style={styles.loadingIcon}>🥽</Text>
                  <Text style={styles.loadingText}>Loading VR Experience...</Text>
                  <Text style={styles.loadingSubtext}>Preparing immersive view</Text>
                </LinearGradient>
              </View>
            )}
          </View>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
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
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  helpButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpIcon: {
    fontSize: 16,
    color: '#4facfe',
    fontWeight: 'bold',
  },
  vrContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  loadingIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  loadingText: {
    fontSize: fonts.sizes.lg,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  loadingSubtext: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
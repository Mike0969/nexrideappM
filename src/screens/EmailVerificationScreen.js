// src/screens/EmailVerificationScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSignUp } from "@clerk/clerk-expo";
import { syncUserToSupabase } from "../utils/syncUser"; // helper we wrote before
import { colors, fonts, spacing, borderRadius } from "../styles/globalStyles";

export default function EmailVerificationScreen({ navigation, route }) {
  const { signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);

      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        await syncUserToSupabase({ auth_method: "email" });
        navigation.replace("Home");
      } else {
        Alert.alert("Verification", "Unexpected status: " + result.status);
      }
    } catch (err) {
      console.error("Email verification error", err);
      Alert.alert("Verification Failed", err.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0a0e27", "#1a1d3a", "#2d3561"]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify Your Email</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.instructions}>
            Enter the 6-digit code we sent to your email.
          </Text>

          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="Enter code"
            placeholderTextColor="rgba(255,255,255,0.4)"
          />

          <TouchableOpacity
            style={[styles.verifyButton, loading && { opacity: 0.6 }]}
            onPress={handleVerify}
            disabled={loading || code.length < 6}
          >
            <LinearGradient
              colors={["#4facfe", "#00f2fe"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.verifyText}>
                {loading ? "Verifying..." : "Verify Email"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { fontSize: 16, color: "#fff" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: fonts.sizes.lg,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: "center",
  },
  instructions: {
    fontSize: fonts.sizes.base,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  input: {
    width: "70%",
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: "rgba(255,255,255,0.1)",
    textAlign: "center",
    fontSize: 22,
    color: "#fff",
    letterSpacing: 8,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  verifyButton: {
    width: "80%",
    height: 50,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  buttonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyText: {
    fontSize: fonts.sizes.base,
    fontWeight: "bold",
    color: "#fff",
  },
});
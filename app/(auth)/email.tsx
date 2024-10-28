import { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUserStore } from "@/zustand/user";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { sendEmailVerification } from "firebase/auth";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";

function EmailVerifyScreen() {
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const auth = FIREBASE_AUTH;
  const userEmail = user?.email || "";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (verificationSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setVerificationSent(false);
    }
    return () => clearInterval(timer);
  }, [verificationSent, countdown]);

  const handleSendVerificationLink = async () => {
    setLoading(true);
    try {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        await sendEmailVerification(auth.currentUser);
        alert("Verification link sent to your email.");
        setVerificationSent(true);
        setCountdown(60);
      } else if (auth.currentUser?.emailVerified) {
        router.replace("/");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDone = async () => {
    setLoading(true);
    try {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        router.replace("/");
      } else {
        alert(
          "Email not verified. Please check your spam folder and try again."
        );
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Use theme colors for button and text
  const buttonBackground = useThemeColor(
    { light: "#000", dark: "#FFF" },
    "background"
  );
  const buttonText = useThemeColor({ light: "#FFF", dark: "#000" }, "text");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          <ThemedText style={styles.message}>
            We need to verify your email: {userEmail}
          </ThemedText>
          {verificationSent ? (
            <>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: buttonBackground }]}
                onPress={handleDone}
                disabled={loading}
              >
                <ThemedText
                  type="default"
                  style={[styles.buttonText, { color: buttonText }]}
                >
                  {loading
                    ? "Processing..."
                    : countdown > 0
                    ? `Done (${countdown}s)`
                    : "Resend Verification Link"}
                </ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: buttonBackground }]}
              onPress={handleSendVerificationLink}
              disabled={loading}
            >
              <ThemedText
                type="default"
                style={[styles.buttonText, { color: buttonText }]}
              >
                {loading ? "Processing..." : "Send Verification Link"}
              </ThemedText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: buttonBackground }]}
            onPress={() => router.replace("/(auth)/signin")}
            disabled={loading}
          >
            <ThemedText
              type="default"
              style={[styles.buttonText, { color: buttonText }]}
            >
              Cancel
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    marginTop: 32,
    margin: 6,
  },
  message: {
    fontFamily: "SpaceMonoB",
    fontSize: 24,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EmailVerifyScreen;

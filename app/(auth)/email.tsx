import { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { sendEmailVerification } from "firebase/auth";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";

function EmailVerifyScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [verificationSent, setVerificationSent] = useState<boolean>(false);

  const currentUser = FIREBASE_AUTH.currentUser;
  const userEmail = currentUser?.email || "";

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
    setSending(true);
    try {
      await currentUser?.reload();
      if (currentUser && !currentUser.emailVerified) {
        await sendEmailVerification(currentUser);
        setVerificationSent(true);
        setCountdown(60);
      } else {
        router.replace("/");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSending(false);
    }
  };

  const handleDone = async () => {
    setLoading(true);
    try {
      await currentUser?.reload();
      if (currentUser?.emailVerified) {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
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
                  {loading ? "Processing..." : `Done (${countdown}s)`}
                </ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: buttonBackground }]}
              onPress={handleSendVerificationLink}
              disabled={sending}
            >
              <ThemedText
                type="default"
                style={[styles.buttonText, { color: buttonText }]}
              >
                {sending ? "Sending..." : "Send Verification Link"}
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

          <ThemedView style={styles.reminderContainer}>
            <ThemedText style={styles.reminderText}>
              * Didn't receive the email? Check your spam folder or request a
              new one shortly.
            </ThemedText>
          </ThemedView>
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
  reminderContainer: {
    marginTop: 32,
  },
  reminderText: {
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default EmailVerifyScreen;

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";

import { FIREBASE_AUTH } from "@/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response.user) {
        if (response.user.emailVerified) {
          router.replace("/");
        } else {
          router.replace("/(auth)/email");
        }
      } else {
        router.replace("/(auth)/signin");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/signin-background.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
          <Text style={styles.title}>Welcome Back, Foodies</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#FFFFFF"
            value={email}
            textContentType="none"
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#FFFFFF"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              style={styles.button}
              onPress={signIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <View style={styles.actionBlock}>
          <TouchableOpacity
            onPress={() => {
              router.replace("/(auth)/signup");
            }}
          >
            <Text style={styles.signUpLink}>Get an account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.replace("/(auth)/reset");
            }}
          >
            <Text style={styles.signUpLink}>Forgot credential</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  keyboardView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    alignSelf: "center",
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
  },
  input: {
    width: 300,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    color: "#FFFFFF",
  },
  button: {
    width: 300,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginTop: 16,
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  actionBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    marginTop: 32,
  },
  signUp: {
    color: "white",
  },
  signUpLink: {
    color: "white",
  },
});

import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  Text,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";

export default function CreateModal() {
  const [expanded, setExpanded] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const buttonAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const toggleMenu = () => {
    if (expanded) {
      // Collapse the menu immediately
      setExpanded(false);
      buttonAnims.forEach((anim) => anim.setValue(0));
      overlayOpacity.setValue(0);
      rotateAnim.setValue(0);
    } else {
      // Expand the menu
      setExpanded(true);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        ...buttonAnims.map((anim, index) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 150 + index * 150,
            useNativeDriver: true,
          })
        ),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const animatedOverlayStyle = {
    opacity: overlayOpacity,
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const animatedRotateStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const buttonLabels = ["Write a post", "Scan Receipt", "Diet Camera"];

  return (
    <View style={styles.container}>
      {expanded && (
        <Modal transparent={true} animationType="fade">
          <Animated.View
            style={[StyleSheet.absoluteFill, animatedOverlayStyle]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={toggleMenu}
            >
              <BlurView
                intensity={15}
                style={styles.overlay}
                tint={Platform.OS === "ios" ? "default" : "light"}
              />
            </TouchableOpacity>
          </Animated.View>
          {(["pencil", "receipt", "camera"] as const).map((icon, index) => (
            <Animated.View
              key={icon}
              style={[
                styles.button,
                { bottom: 70 + index * 70, opacity: buttonAnims[index] },
                { transform: [{ scale: buttonAnims[index] }] },
                styles.centeredButton,
              ]}
            >
              <TouchableOpacity
                style={styles.optionButtonContainer}
                onPress={() => {
                  if (index === 0) {
                    // Navigate to the blog creation screen
                    toggleMenu();
                    router.push("/community/creation");
                  }
                  if (index === 1) {
                    // Navigate to the Scan Receipt Screen
                    toggleMenu();
                    router.push("/record/AddReceipt");
                  }
                  if (index === 2) {
                    // Navigate to the Diet Camera Screen
                    toggleMenu();
                    router.push("/record/AddDiet");
                  }
                  console.log("hander for", buttonLabels[index]);
                }}
              >
                <ThemedView style={styles.optionButton}>
                  <Ionicons name={icon} size={24} color="white" />
                </ThemedView>
                <Text style={styles.optionButtonText}>
                  {buttonLabels[index]}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
          <Animated.View style={[styles.modalFab, animatedRotateStyle]}>
            <TouchableOpacity onPress={toggleMenu}>
              <Ionicons name="add" size={42} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </Modal>
      )}
      <ThemedView style={[styles.fab]}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // You can adjust the opacity value for more or less darkness
  },
  fab: {
    bottom: -5,
    backgroundColor: "#D1382C",
    width: 45,
    height: 45,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalFab: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 8 : 25,
    alignSelf: "center",
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    backgroundColor: "#A9A9A9",
  },
  button: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredButton: {
    left: "50%",
    transform: [{ translateX: -25 }],
  },
  optionButtonContainer: {
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  optionButton: {
    backgroundColor: "#D1382C",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  optionButtonText: {
    fontFamily: "SpaceMonoB",
    color: "#FFFFFF",
    marginLeft: 10,
    fontSize: 18,
  },
});

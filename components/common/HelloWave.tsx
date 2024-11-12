import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";

export function HelloWave({ emoji = "👋" }) {
  const rotationAnimation = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      // Trigger the animation when the screen is focused
      rotationAnimation.value = withRepeat(
        withSequence(
          withTiming(25, { duration: 150 }),
          withTiming(0, { duration: 150 })
        ),
        4 // Run the animation 4 times
      );

      return () => {
        rotationAnimation.value = 0;
      };
    }, [])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ThemedText style={styles.text}>{emoji}</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 26,
    lineHeight: 32,
    marginTop: -2,
  },
});

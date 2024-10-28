import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";

function StackHeader({ title }: { title: string }) {
  const navigation = useNavigation();

  // Get theme colors dynamically
  const headerBackgroundColor = useThemeColor({}, "background");
  const headerTintColor = useThemeColor({}, "text");
  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.safeArea, { backgroundColor: headerBackgroundColor }]}
    >
      <View
        style={[
          styles.headerContainer,
          { backgroundColor: headerBackgroundColor },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ThemedText style={{ color: headerTintColor }}>
            <Ionicons name="return-down-back" size={26} />
          </ThemedText>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <ThemedText type="defaultSemiBold" style={{ color: headerTintColor }}>
            {title}
          </ThemedText>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFF",
  },
  headerContainer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    elevation: 5,
  },
  backButton: {
    position: "absolute",
    left: 15,
    zIndex: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StackHeader;

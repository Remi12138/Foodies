import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HelloWave } from "@/components/common/HelloWave";
import { useUserStore } from "@/zustand/user";
import { useState } from "react";
import AvatarPickerModal from "./AvatarPickerModal";
import UserCidInfo from "./UserCidInfo";

export default function WelcomeBar() {
  const { user } = useUserStore();
  const [isAvatarPickerVisible, setAvatarPickerVisible] = useState(false);

  const openAvatarPicker = () => {
    setAvatarPickerVisible(true);
  };

  const closeAvatarPicker = () => {
    setAvatarPickerVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={openAvatarPicker}>
        <Image
          source={
            user?.avatar !== ""
              ? { uri: user?.avatar }
              : require("@/assets/images/avatar-placeholder.jpg")
          }
          style={styles.avatar}
        />
      </TouchableOpacity>
      <View style={styles.userInfoContainer}>
        <View style={styles.nameAndWave}>
          <ThemedText style={styles.userNameText}>{user?.name}</ThemedText>
          <HelloWave />
        </View>
        <UserCidInfo userCid={user?.cid ?? ""} />
      </View>
      <AvatarPickerModal
        isVisible={isAvatarPickerVisible}
        onClose={closeAvatarPicker}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
  },
  userInfoContainer: {
    paddingVertical: 8,
    flexDirection: "column",
    position: "relative",
  },
  nameAndWave: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userNameText: {
    fontFamily: "SpaceMonoB",
    fontSize: 36,
    lineHeight: 42,
  },
});

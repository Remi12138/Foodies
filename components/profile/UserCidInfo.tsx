import { StyleSheet, View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";

interface UserCidInfoProps {
  userCid: string;
}

function UserCidInfo({ userCid }: UserCidInfoProps) {
  const [showCopyButton, setShowCopyButton] = useState(false);

  const handleCidPress = () => {
    setShowCopyButton(!showCopyButton);
  };

  const copyCidToClipboard = async () => {
    if (userCid) {
      await Clipboard.setStringAsync(`@${userCid}`);
      setShowCopyButton(false); // Hide the button after copying
    }
  };

  return (
    <View style={styles.cidContainer}>
      <TouchableOpacity onPress={handleCidPress}>
        <ThemedText style={styles.userCidText}>@{userCid}</ThemedText>
      </TouchableOpacity>
      {showCopyButton && (
        <TouchableOpacity
          style={styles.copyButton}
          onPress={copyCidToClipboard}
        >
          <ThemedText style={styles.copyButtonText}>Copy</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cidContainer: {
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  userCidText: {
    fontFamily: "SpaceMonoI",
    color: "#666",
    fontSize: 16,
    lineHeight: 24,
  },
  copyButton: {
    height: 24,
    marginLeft: 8,
    paddingHorizontal: 12,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  copyButtonText: {
    lineHeight: 20,
    fontFamily: "SpaceMonoB",
    fontSize: 12,
  },
});

export default UserCidInfo;

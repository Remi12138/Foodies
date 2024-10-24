import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";

interface FollowingData {
  id: string;
  name: string;
  memo: string;
}

const followingData: FollowingData[] = [
  { id: "1", name: "John Doe", memo: "Loves hiking and outdoor adventures." },
  { id: "2", name: "Jane Smith", memo: "Avid reader and coffee enthusiast." },
  { id: "3", name: "Michael Johnson", memo: "Tech geek and music lover." },
  { id: "4", name: "Emily Davis", memo: "Yoga instructor and wellness coach." },
];

export default function FollowingList() {
  const renderFollowingItem = ({ item }: { item: FollowingData }) => (
    <View style={styles.followingItemContainer}>
      <View>
        <ThemedText>{item.name}</ThemedText>
        <ThemedText style={styles.memoText}>{item.memo}</ThemedText>
      </View>
      <TouchableOpacity style={styles.unfollowButton}>
        <ThemedText>Unfollow</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={followingData}
      renderItem={renderFollowingItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.followingContainer}
    />
  );
}

const styles = StyleSheet.create({
  followingContainer: {
    height: "100%",
    padding: 16,
  },
  followingItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    marginBottom: 8,
  },
  memoText: {
    fontSize: 12,
    color: "#555",
  },
  unfollowButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
});

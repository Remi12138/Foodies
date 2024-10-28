import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { HelloWave } from "@/components/common/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import FollowingList from "@/components/message/FollowingView";
import ChatView from "@/components/message/ChatView";
import React from "react";

export default function FriendScreen() {
  const [isMapView, setIsMapView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  const toggleMapView = () => {
    setIsMapView((prev) => !prev);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedView style={{ flexDirection: "row" }}>
          <ThemedText type="title">People</ThemedText>
          <HelloWave emoji="🤓" />
        </ThemedView>
        <View style={styles.iconRowContainer}>
          <TouchableOpacity style={styles.mapToggle} onPress={toggleMapView}>
            <Ionicons name="search" size={24} />
          </TouchableOpacity>
        </View>
      </ThemedView>
      <ThemedView style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#000000"
            style={styles.loadingIndicator}
          />
        ) : (
          <ThemedView>
            <ThemedView
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                paddingVertical: 16,
              }}
            >
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setActiveTab("chat")}
              >
                <Ionicons
                  name={
                    activeTab === "chat" ? "chatbubbles" : "chatbubbles-outline"
                  }
                  size={40}
                  color="#000"
                />
                <ThemedText>Chat</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setActiveTab("friends")}
              >
                <Ionicons
                  name={activeTab === "friends" ? "people" : "people-outline"}
                  size={40}
                  color="#000"
                />
                <ThemedText>Friends</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setActiveTab("following")}
              >
                <Ionicons
                  name={activeTab === "following" ? "eye" : "eye-outline"}
                  size={40}
                  color="#000"
                />
                <ThemedText>Following</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setActiveTab("followers")}
              >
                <Ionicons
                  name={
                    activeTab === "followers"
                      ? "footsteps"
                      : "footsteps-outline"
                  }
                  size={40}
                  color="#000"
                />
                <ThemedText>Followers</ThemedText>
              </TouchableOpacity>
            </ThemedView>
            {activeTab === "chat" && <ChatView />}
            {activeTab === "friends" && (
              <ThemedView style={styles.dummyContainer}>
                <ThemedText>
                  Friends view with some dummy friends list...
                </ThemedText>
              </ThemedView>
            )}
            {activeTab === "following" && <FollowingList />}
            {activeTab === "followers" && (
              <ThemedView style={styles.dummyContainer}>
                <ThemedText>
                  Followers view with some dummy followers list...
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  iconRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    alignItems: "center",
  },
  mapToggle: {
    padding: 8,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  dummyContainer: {
    padding: 16,
    alignItems: "center",
  },
});

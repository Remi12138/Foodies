import { HelloWave } from "@/components/common/HelloWave";
import { Ionicons } from "@expo/vector-icons";

import { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

import CommunityBar from "@/components/community/CommunityBar";
import Blogs from "@/components/community/BlogsView";
import { useBlogStore } from "@/zustand/blog";
import BlogCollectionView from "@/components/community/BlogCollectionView";
import React from "react";

export default function CommunityScreen() {
  const [isFavView, setIsFavView] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchBlogs = useBlogStore((state) => state.fetchFakeBlogs);

  const toggleFavView = () => {
    setIsFavView((prev) => !prev);
  };

  useEffect(() => {
    handleGetBlogs();
  }, []);

  // Retrieve blogs from Zustand store
  const blogs = useBlogStore((state) => state.blogs);

  async function handleGetBlogs() {
    // Show loading indicator
    setLoading(true);
    await fetchBlogs();
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedView style={{ flexDirection: "row" }}>
          <ThemedText type="title">Community</ThemedText>
          <HelloWave emoji="💡" />
        </ThemedView>
        <TouchableOpacity style={styles.mapToggle} onPress={toggleFavView}>
          <ThemedText>
            <Ionicons
              name={isFavView ? "ice-cream-outline" : "bookmarks-outline"}
              size={24}
            />
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={{ flex: 1 }}>
        <CommunityBar />
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#000000"
            style={styles.loadingIndicator}
          />
        ) : isFavView ? (
          <BlogCollectionView />
        ) : (
          <Blogs data={blogs} />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: 199,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  titleContainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mapToggle: {
    padding: 8,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

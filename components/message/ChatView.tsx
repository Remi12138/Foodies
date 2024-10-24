import React from "react";
import { FlatList, View, StyleSheet, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";

interface ChatMessage {
  id: string;
  name: string;
  message: string;
  time: string;
}

const chatMessages: ChatMessage[] = [
  {
    id: "1",
    name: "Pizza Palace",
    message: "Your order is on the way!",
    time: "10:30 AM",
  },
  {
    id: "2",
    name: "Burger Joint",
    message: "I'm comming over now!",
    time: "11:15 AM",
  },
  {
    id: "3",
    name: "Sushi World",
    message: "New seasonal menu is here!",
    time: "1:45 PM",
  },
  {
    id: "4",
    name: "Taco Town",
    message: "Happy Hour starts at 5 PM!",
    time: "3:00 PM",
  },
];

export default function ChatView() {
  const renderChatItem = ({ item }: { item: ChatMessage }) => (
    <View style={styles.chatItemContainer}>
      <Image
        source={{ uri: "https://dummyimage.com/50x50/cccccc/000000&text=F" }}
        style={styles.avatar}
      />
      <View style={styles.messageContainer}>
        <ThemedText style={styles.nameText}>{item.name}</ThemedText>
        <ThemedText style={styles.messageText}>{item.message}</ThemedText>
      </View>
      <ThemedText style={styles.timeText}>{item.time}</ThemedText>
    </View>
  );

  return (
    <FlatList
      data={chatMessages}
      renderItem={renderChatItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.chatContainer}
    />
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    height: "100%",
    padding: 16,
  },
  chatItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    marginBottom: 8,
    position: "relative",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
  },
  nameText: {
    fontWeight: "bold",
  },
  messageText: {
    fontSize: 14,
    color: "#555",
  },
  timeText: {
    fontSize: 12,
    color: "#888",
    position: "absolute",
    top: 8,
    right: 8,
  },
});

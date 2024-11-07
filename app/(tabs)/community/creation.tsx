import StackHeader from "@/components/common/StackHeader";
import { ThemedText } from "@/components/ThemedText";
import React, { useState } from "react";
import { TextInput, Button, StyleSheet, ScrollView } from "react-native";

const BlogCreationScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  const handleCreateBlog = () => {
    // Perform the blog creation action, e.g., saving to a database or state
    console.log({ title, content, rating });
    alert("Blog created successfully!");
  };

  return (
    <>
      <StackHeader title="Write a post" />
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText style={styles.label}>Title</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter blog title"
          value={title}
          onChangeText={setTitle}
        />

        <ThemedText style={styles.label}>Content</ThemedText>
        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Enter blog content"
          value={content}
          onChangeText={setContent}
          multiline
        />

        <Button title="Create Blog" onPress={handleCreateBlog} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  contentInput: {
    height: 100,
    textAlignVertical: "top",
  },
});

export default BlogCreationScreen;

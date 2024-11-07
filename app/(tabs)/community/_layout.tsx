import { Stack } from "expo-router";

export default function CommunityLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#F4511E",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false, headerTitle: "Community" }}
      />
      <Stack.Screen
        name="collections"
        options={{ headerShown: false, headerTitle: "Collections" }}
      />
      <Stack.Screen
        name="creation"
        options={{ headerShown: false, title: "Create a blog" }}
      />
      <Stack.Screen
        name="blog"
        options={{ headerShown: false, title: "Blog Details" }}
      />
    </Stack>
  );
}

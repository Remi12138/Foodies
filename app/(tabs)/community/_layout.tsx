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
        options={{ headerShown: false, headerTitle: "Home" }}
      />
      <Stack.Screen name="collections" options={{ title: "My collections" }} />
      <Stack.Screen name="creation" options={{ title: "Create a blog" }} />
    </Stack>
  );
}

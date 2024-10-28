import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitle: "Me",
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false, headerTitle: "Me" }}
      />
      <Stack.Screen name="account" />
    </Stack>
  );
}

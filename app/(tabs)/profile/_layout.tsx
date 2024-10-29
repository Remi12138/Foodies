import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        // headerShown: false,
        // headerTitle: "Me",
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
        options={{ headerShown: false, headerTitle: "Me" }}
      />
      <Stack.Screen name="myreceipts" options={{ title: "My Receipts" }} />
      <Stack.Screen name="addreceipt" options={{ title: "Add Receipt" }} />
      <Stack.Screen name="mydiets" options={{ title: "My Diets" }} />
      <Stack.Screen name="adddiet" options={{ title: "Add Diet" }} />
      <Stack.Screen name="account" />
    </Stack>
  );
}

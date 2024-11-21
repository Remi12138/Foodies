import { Stack } from "expo-router";

export default function RecordLayout() {
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
        options={{ headerShown: false, headerTitle: "Record" }}
      />
      <Stack.Screen name="MyReceipts" options={{ title: "My Receipts" }} />
      <Stack.Screen name="AddReceipt" options={{ title: "Add Receipt" }} />
      <Stack.Screen name="MyDiets" options={{ title: "My Diets" }} />
      <Stack.Screen name="AddDiet" options={{ title: "Add Diet" }} />
      <Stack.Screen name="AnalysisPreview" options={{ title: "Analysis Preview" }} />
      <Stack.Screen name="AnalysisDetail" options={{ title: "Detail" }} />
      <Stack.Screen name="EditDiet" options={{ title: "Edit Diet" }} />
      <Stack.Screen name="EditReceipt" options={{ title: "Edit Receipt" }} />
    </Stack>
  );
}

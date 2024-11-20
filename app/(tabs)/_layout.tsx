import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import CreateModal from "./create";
import React from "react";
import { Platform } from "react-native";
import { ThemedView } from "@/components/ThemedView";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemedView
      style={{
        flex: 1,
      }}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarStyle: {
            paddingBottom: Platform.OS === "android" ? 10 : 0,
            height: Platform.OS === "android" ? 60 : 50,
          },
        }}
      >
        <Tabs.Screen
          name="community"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "pizza" : "pizza-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            tabBarLabel: "Create",
            tabBarButton: () => <CreateModal />,
          }}
        />
        <Tabs.Screen
          name="record"
          options={{
            title: "Record",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                // name={focused ? 'fast-food' : 'fast-food-outline'}
                name={focused ? "receipt" : "receipt-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Me",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "person" : "person-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </ThemedView>
  );
}

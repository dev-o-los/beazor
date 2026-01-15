import { Tabs } from "expo-router";
import React from "react";

export default function TabsNavigation() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ headerShown: false }} />
      <Tabs.Screen name="list" options={{ headerShown: false }} />
    </Tabs>
  );
}

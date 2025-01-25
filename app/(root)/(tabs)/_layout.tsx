import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";

import { icons, images } from "@/constants";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View className="flex justify-center items-center relative">
    {focused && (
      <View className="absolute -top-3 w-16 h-16 bg-[#3532D7] rounded-full" />
    )}
    <Image
      source={source}
      resizeMode="contain"
      className={`w-6 h-6 ${focused ? "tint-white" : "tint-gray-400"}`}
    />
  </View>
);

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#F5F5F5", // Tab background
          height: 72,
          borderTopWidth: 2, // Top border
          borderTopColor: "#3532D7", // Border color
          borderLeftWidth: 0, // No side borders
          borderRightWidth: 0, // No side borders
          justifyContent: "center", // Align content in the center
        },
      }}
    >
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.wallet} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "Support",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.support} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="driver"
        options={{
          title: "driver",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={images.scooter} focused={focused} />
          ),
        }}
      />

    </Tabs>
  );
}

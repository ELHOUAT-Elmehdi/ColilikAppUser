import { Stack } from "expo-router";

export default function driverLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="driver"
        options={{
          title: "driver",
          headerShown: false,
        }}
      />
    </Stack>
  );
}

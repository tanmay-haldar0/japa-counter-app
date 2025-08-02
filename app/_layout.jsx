import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function Layout() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Japa Counter", // ✅ This sets the app bar title
            headerShown: true,     // ✅ Ensure header is shown
          }}
        />
      </Stack>
    </>
  );
}

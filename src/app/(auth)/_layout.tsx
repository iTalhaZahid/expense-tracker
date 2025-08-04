import { Stack } from "expo-router";

export default function RootLayout() {
  return (

    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // optional: 'fade', 'fade_from_bottom', etc.
      }}
    >
      {/* Screens auto-discovered from app/ folder */}
    </Stack>
  );
}

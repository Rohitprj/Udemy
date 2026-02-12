import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <SafeAreaProvider>
      {/* <StatusBar
        style={scheme === "dark" ? "light" : "dark"}
        backgroundColor={scheme === "dark" ? "#000" : "#fff"}
      /> */}
      <StatusBar style={scheme === "dark" ? "dark" : "light"} />
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}

import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <StatusBar style={scheme === "dark" ? "dark" : "light"} />
      {/*
        A root layout must render a navigator or a <Slot /> on the first render.
        The previous implementation only rendered a <Stack /> which caused
        navigation attempts before the layout mounted.  By exposing a Slot here
        we guarantee the router has something to mount immediately.  The stack
        navigator can now be specified inside a nested layout (e.g. app/index)
        or in the screens themselves.  For simplicity we keep the existing stack
        in a separate layout if needed, but the root component itself no longer
        performs any navigation logic directly.
      */}
      <Slot />
    </SafeAreaProvider>
  );
}

import { Redirect } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { initializeAuth, useAuthStore } from "../src/stores/authStore";
export default function Home() {
  const { user } = useAuthStore();
  const [initializing, setInitializing] = React.useState(true);

  useEffect(() => {
    initializeAuth().finally(() => setInitializing(false));
  }, []);

  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (user === null) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});

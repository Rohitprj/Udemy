import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import CourseList from "../src/screens/CourseList";
import { useAuthStore } from "../src/stores/authStore";

export default function Home() {
  const { user, tryAutoLogin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    tryAutoLogin();
  }, []);

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [user]);

  if (!user) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <CourseList />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});

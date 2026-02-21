import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import CourseList from "../src/screens/CourseList";
import { useAuthStore } from "../src/stores/authStore";
export default function Home() {
  const { user, tryAutoLogin } = useAuthStore();
  const [initializing, setInitializing] = React.useState(true);

  React.useEffect(() => {
    // perform auto-login once and mark when we're done so that we don't
    // redirect to the login screen while the token lookup is in flight.
    tryAutoLogin().finally(() => setInitializing(false));
  }, []);

  // show a loading indicator while we're waiting for tryAutoLogin to finish
  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // if the user is still null after initialization, redirect using the
  // <Redirect> component instead of calling router.replace directly.  this
  // avoids the "navigate before mounting" warning because the redirect is
  // handled during render rather than in a side effect.
  if (user === null) {
    return <Redirect href="/login" />;
  }

  // otherwise, we have a user object and can render the main course list
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

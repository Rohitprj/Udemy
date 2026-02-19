import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function WebviewScreen() {
  const params = useLocalSearchParams();
  const html = (params.html as string) || "<h1>No content</h1>";

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: String(html) }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" />}
        onError={(e) => console.warn("webview error", e)}
        javaScriptEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
});

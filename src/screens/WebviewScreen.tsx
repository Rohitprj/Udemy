import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";

export default function WebviewScreen() {
  const params = useLocalSearchParams();
  const html = params.html || "<h1>No content</h1>";

  return (
    <View className="flex-1">
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

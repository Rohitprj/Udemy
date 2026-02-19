import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../src/stores/authStore";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user.avatar || "https://i.pravatar.cc/150?img=3" }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.stats}>
        <Text style={styles.statText}>Courses Enrolled: 0</Text>
        <Text style={styles.statText}>Progress: 0%</Text>
      </View>

      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  name: { fontSize: 20, fontWeight: "700", marginTop: 12 },
  email: { color: "#6b7280", marginTop: 4 }, // gray-500
  stats: { marginTop: 16, width: "100%", paddingHorizontal: 16 },
  statText: { fontSize: 16, marginBottom: 6 },
  logoutButton: {
    backgroundColor: "#dc2626", // red-600
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
    width: "80%",
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "600" },
});

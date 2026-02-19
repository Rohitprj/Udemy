import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../src/stores/authStore";
import { LoginInput, loginSchema } from "../src/validation/authSchema";

export default function LoginScreen() {
  const { login, loading } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data.email, data.password);
      router.replace("/");
    } catch (e) {
      alert("Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={(t) => setValue("email", t)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {errors.email && (
        <Text style={styles.error}>{errors.email.message as string}</Text>
      )}

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={(t) => setValue("password", t)}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message as string}</Text>
      )}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={styles.primaryButton}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/register")}
        style={styles.link}
      >
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  header: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  error: { color: "#ef4444", marginBottom: 6 }, // red-500
  primaryButton: {
    backgroundColor: "#2563eb", // blue-600
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: { color: "#ffffff", fontWeight: "600" },
  link: { marginTop: 12, alignItems: "center" },
  linkText: { color: "#2563eb" },
});

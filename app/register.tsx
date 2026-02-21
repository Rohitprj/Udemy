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
import api from "../src/api/axios";
import { RegisterInput, registerSchema } from "../src/validation/authSchema";

export default function RegisterScreen() {
  const router = useRouter();

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "USER", // default role
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await api.post("/api/v1/users/register", data);

      alert("Registration successful");
      router.replace("/profile");
    } catch (error: any) {
      console.log(error?.response?.data || error);
      alert("Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        onChangeText={(t) => setValue("username", t)}
      />
      {errors.username && (
        <Text style={styles.error}>{errors.username.message}</Text>
      )}

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        onChangeText={(t) => setValue("email", t)}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={(t) => setValue("password", t)}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      {/* Simple Role Toggle */}
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => setValue("role", "USER")}
        >
          <Text>USER</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => setValue("role", "ADMIN")}
        >
          <Text>ADMIN</Text>
        </TouchableOpacity>
      </View>

      {errors.role && <Text style={styles.error}>{errors.role.message}</Text>}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={styles.primaryButton}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Register</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.switchText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  switchText: {
    textAlign: "center",
    color: "#2563eb",
    fontWeight: "600",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  error: {
    color: "#ef4444",
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});

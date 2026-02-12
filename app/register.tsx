import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
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
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await api.post("/api/v1/users/register", data);
      alert("Registration successful");
      router.replace("/login");
    } catch (e) {
      alert("Registration failed");
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-2xl font-bold mb-6">Register</Text>

      <TextInput
        placeholder="Name"
        className="border p-3 rounded mb-2"
        onChangeText={(t) => setValue("name", t)}
      />
      {errors.name && (
        <Text className="text-red-500">{errors.name.message}</Text>
      )}

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        className="border p-3 rounded mb-2"
        onChangeText={(t) => setValue("email", t)}
      />
      {errors.email && (
        <Text className="text-red-500">{errors.email.message}</Text>
      )}

      <TextInput
        placeholder="Password"
        secureTextEntry
        className="border p-3 rounded mb-2"
        onChangeText={(t) => setValue("password", t)}
      />
      {errors.password && (
        <Text className="text-red-500">{errors.password.message}</Text>
      )}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className="bg-green-600 p-4 rounded mt-4 items-center"
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold">Register</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

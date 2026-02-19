// import { Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function Index() {
//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <View>
//         <Text>Edit app/index.tsx to edit this screen.</Text>
//       </View>
//     </SafeAreaView>
//   );
// }

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "expo-router";
// import React from "react";
// import { useForm } from "react-hook-form";
// import {
//   ActivityIndicator,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useAuthStore } from "../src/stores/authStore";
// import { LoginInput, loginSchema } from "../src/validation/authSchema";

// export default function LoginScreen() {
//   const { login, loading } = useAuthStore();
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<LoginInput>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: LoginInput) => {
//     try {
//       await login(data.email, data.password);
//       router.replace("/");
//     } catch (e) {
//       alert("Login failed");
//     }
//   };

//   return (
//     <View className="flex-1 justify-center p-6 bg-white">
//       <Text className="text-2xl font-bold mb-6">Login</Text>

//       <TextInput
//         placeholder="Email"
//         className="border p-3 rounded mb-2"
//         onChangeText={(t) => setValue("email", t)}
//         autoCapitalize="none"
//       />
//       {errors.email && (
//         <Text className="text-red-500">{errors.email.message}</Text>
//       )}

//       <TextInput
//         placeholder="Password"
//         secureTextEntry
//         className="border p-3 rounded mb-2"
//         onChangeText={(t) => setValue("password", t)}
//       />
//       {errors.password && (
//         <Text className="text-red-500">{errors.password.message}</Text>
//       )}

//       <TouchableOpacity
//         onPress={handleSubmit(onSubmit)}
//         className="bg-blue-600 p-4 rounded mt-4 items-center"
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text className="text-white font-semibold">Login</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={() => router.push("/register")}
//         className="mt-4"
//       >
//         <Text className="text-center text-blue-600">
//           Don't have an account? Register
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// import { Redirect } from "expo-router";
// import React from "react";

// const Index = () => {
//   return <Redirect href="/login" />;
// };

// export default Index;

import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
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
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

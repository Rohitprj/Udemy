import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Image, Text, View } from "react-native";
import api from "../api/axios";

export default function CourseDetail() {
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/v1/public/randomproducts");
        setCourse(res.data?.data?.[0] || res.data?.[0]);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, [id]);

  if (!course)
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );

  return (
    <View className="flex-1 p-3">
      <Image
        source={{ uri: course.image || "https://picsum.photos/300" }}
        style={{ height: 200, borderRadius: 8 }}
      />
      <Text className="text-xl font-bold mt-3">
        {course.title || course.name}
      </Text>
      <Text className="text-gray-600 mt-2">
        {course.description || "No description"}
      </Text>
      <Button
        title="Open Content"
        onPress={() =>
          router.push({
            pathname: "/webview",
            params: {
              html: `<h1>${course.title}</h1><p>${course.description}</p>`,
            },
          })
        }
      />
    </View>
  );
}

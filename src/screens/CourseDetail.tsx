import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
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
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: course.image || "https://picsum.photos/300" }}
        style={styles.image}
      />
      <Text style={styles.title}>{course.title || course.name}</Text>
      <Text style={styles.description}>
        {course.description || "No description"}
      </Text>
      <View style={styles.button}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#ffffff",
  },
  image: {
    height: 200,
    borderRadius: 8,
    width: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
  },
  description: {
    color: "#4b5563",
    marginTop: 8,
    fontSize: 14,
  },
  button: {
    marginTop: 16,
    width: "40%",
  },
});

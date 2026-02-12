import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, TextInput, View } from "react-native";
import api from "../api/axios";
import CourseCard from "../components/CourseCard";

export default function CourseList() {
  const [courses, setCourses] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const [pRes, uRes] = await Promise.all([
        api.get("/api/v1/public/randomproducts"),
        api.get("/api/v1/public/randomusers"),
      ]);
      setCourses(pRes.data?.data || pRes.data || []);
      setInstructors(uRes.data?.data || uRes.data || []);
    } catch (e) {
      console.warn("fetch courses failed", e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const filtered = courses.filter(
    (c) =>
      c.title?.toLowerCase().includes(query.toLowerCase()) ||
      c.description?.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <View className="flex-1 p-2">
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search courses"
        className="p-2 border rounded mb-2"
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) =>
          item.id?.toString() || item._id?.toString() || String(Math.random())
        }
        renderItem={({ item }) => (
          <CourseCard
            id={item.id}
            title={item.title || item.name || "Untitled Course"}
            instructor={instructors[0]?.name || "Instructor"}
            thumbnail={item.image || item.thumbnail}
            onPress={() => router.push(`/course/${item.id || item._id}`)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

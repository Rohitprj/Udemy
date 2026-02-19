import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  id: string;
  title: string;
  instructor: string;
  thumbnail?: string;
  onPress?: () => void;
};

export default function CourseCard({
  id,
  title,
  instructor,
  thumbnail,
  onPress,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        source={{ uri: thumbnail || "https://picsum.photos/80" }}
        style={styles.thumbnail}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.instructor}>{instructor}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb", // gray-200
    alignItems: "center",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  instructor: {
    fontSize: 14,
    color: "#4b5563", // gray-600
    marginTop: 4,
  },
});

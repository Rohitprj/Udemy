import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

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
    <TouchableOpacity
      onPress={onPress}
      className="flex-row p-3 border-b border-gray-200"
    >
      <Image
        source={{ uri: thumbnail || "https://picsum.photos/80" }}
        style={{ width: 80, height: 80, borderRadius: 8 }}
      />
      <View className="flex-1 ml-3 justify-center">
        <Text className="text-base font-semibold">{title}</Text>
        <Text className="text-sm text-gray-600">{instructor}</Text>
      </View>
    </TouchableOpacity>
  );
}

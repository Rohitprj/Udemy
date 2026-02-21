import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Users",
          headerTitle: "Random Users",
          tabBarLabel: "Users",
          tabBarIcon: ({ color }) => (
            <EvilIcons name="user" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          title: "Product",
          headerTitle: "Procuct",
          tabBarLabel: "Users",
          tabBarIcon: ({ color }) => (
            <AntDesign name="product" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

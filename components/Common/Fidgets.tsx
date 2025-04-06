import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";

const Fidgets = () => {
  const fidgets = [
    {
      title: "Gurugram",
      description: "30°",
      icon: "🌙",
    },
    {
      title: "Air Quality · 170",
      description: "Moderate",
      icon: "⚠️",
    },
    {
      title: "Weather 28°",
      description: "Sunny",
      icon: "☀️",
    },
    {
      title: "News",
      description: "News",
      icon: "📰",
    },
  ];

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      horizontal
    >
      {/* Location Card */}
      {fidgets.map((fidget) => (
        <View style={styles.card}>
          <Text style={styles.location}>{fidget.title}</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{fidget.description}</Text>
            <Text style={styles.icon}>{fidget.icon}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Fidgets;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 15,
    padding: 15,
    minWidth: 120,
    maxHeight: 80,
    justifyContent: "space-between",
  },
  location: {
    color: "#fff",
    fontSize: 16,
  },
  description: {
    color: "#fff",
    fontSize: 12,
  },
  icon: {
    color: "#fff",
    fontSize: 12,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
});

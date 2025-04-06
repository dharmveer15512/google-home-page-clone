import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";

const Stories = () => {
  // Sample data - replace with your actual data
  const stories = [
    {
      id: "1",
      image: "https://picsum.photos/200/300",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      username: "John Doe",
      time: "2d",
      icon: "https://picsum.photos/200/300",
      from: "Amazon",
    },
    {
      id: "2",
      image: "https://picsum.photos/200/300",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      username: "John Doe",
      time: "1d",
      icon: "https://picsum.photos/200/300",
      from: "Flipkart",
    },
  ];

  return (
    <View style={styles.container}>
      {stories.map((story) => (
        <TouchableOpacity key={story.id} style={styles.storyContainer}>
          <View style={styles.storyRing}>
            <Image source={{ uri: story.image }} style={styles.storyImage} />
          </View>
          <Text numberOfLines={5} style={styles.username}>{story.description}</Text>
          <View style={styles.timeContainer}>
            <View style={styles.fromContainer}>
              <Image source={{ uri: story.icon }} style={styles.icon} />
              <Text style={styles.from}>{story.from}</Text>
            </View>
            <Text style={styles.time}>{story.time}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Stories;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  storyContainer: {
    marginRight: 15,
    width: "100%",
    marginTop: 8,
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 8,
  },
  storyRing: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  storyImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  username: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  from: {
    marginLeft: 5,
    fontSize: 12,
    color: "#fff",
  },
  fromContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  time: {
    fontSize: 12,
    color: "#fff",
  },
});

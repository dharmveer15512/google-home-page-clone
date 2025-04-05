import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ViewProps,
} from "react-native";
import React from "react";
import Animated from "react-native-reanimated";

const Header = ({
  onProfilePress,
  ...props
}: { onProfilePress: () => void } & ViewProps) => {
  return (
    <Animated.View
      onLayout={props?.onLayout}
      style={[styles.container, props?.style]}
    >
      <Image
        source={require("../../assets/images/google.png")}
        style={styles.leftLogo}
      />
      <View>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/google.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>Search</Text>
        </View>
        <Image
          source={{
            uri: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_dark_color_272x92dp.png",
          }}
          style={styles.logoBig}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity
        style={styles.userNameContainer}
        onPress={onProfilePress}
      >
        <Text style={styles.userName}>D</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  logo: {
    width: 25,
    height: 25,
  },
  logoBig: {
    width: "100%",
    height: 40,
    alignSelf: "center",
    marginVertical: 20,
    marginTop: 30,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#000",
  },
  userNameContainer: {
    padding: 10,
    borderRadius: 100,
    backgroundColor: "#000",
    height: 45,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    includeFontPadding: false,
  },
  logoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    includeFontPadding: false,
  },
  leftLogo: {
    width: 40,
    height: 40,
  },
});

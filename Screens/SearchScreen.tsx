import {
  StyleSheet,
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
  Platform,
  Modal,
  Button,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import ProfileModal from "../components/Common/ProfileModal";
import Header from "../components/Common/Header";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  Easing,
} from "react-native-reanimated";
import VoiceSearchModal from "../components/VoiceSearch/VoiceSearchModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextInputsAndSearchHistory from "../components/TextSearchPage/TextInputsAndSearchHistory";
const SearchScreen = () => {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isVoiceSearchModalVisible, setIsVoiceSearchModalVisible] =
    useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerOpacity = useSharedValue(1);

  const [focused, setFocused] = useState(false);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container]}>
      <VoiceSearchModal
        visible={isVoiceSearchModalVisible}
        onClose={() => setIsVoiceSearchModalVisible(false)}
      />
      <ProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
      />
      <Header
        onLayout={({ nativeEvent }) => {
          setHeaderHeight(() => nativeEvent.layout.height);
        }}
        style={headerAnimatedStyle}
        onProfilePress={() => setIsProfileModalVisible(true)}
      />

      <View style={styles.searchContainer}>
        <Ionicons
          style={{ zIndex: 1 }}
          name={focused ? "arrow-back" : "search"}
          size={20}
          color="#9AA0A6"
          onPress={() => setFocused(true)}
        />
        <TouchableOpacity
          onPress={() => setFocused(true)}
          style={styles.searchInputContainer}
        >
          <TextInput
            editable={false}
            clearTextOnFocus
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#9AA0A6"
            submitBehavior="submit"
            enterKeyHint="search"
            returnKeyLabel="Search"
            returnKeyType="search"
            onPress={() => setFocused(true)}
          />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <Ionicons
            onPress={() => setIsVoiceSearchModalVisible(true)}
            name="mic"
            size={20}
            color="#9AA0A6"
          />
          <Ionicons name="camera" size={20} color="#9AA0A6" />
        </View>
      </View>

      {focused && (
        <TextInputsAndSearchHistory
          visible={focused}
          onClose={() => {
            setFocused(false);
          }}
          headerOpacity={headerOpacity}
          focused={focused}
          setFocused={setFocused}
          setIsVoiceSearchModalVisible={() => {
            setFocused(false);
            setIsVoiceSearchModalVisible(true);
          }}
          headerHeight={headerHeight}
        />
      )}

      {!focused && (
        <View style={styles.quickAccessContainer}>
          <TouchableOpacity style={styles.quickAccessItem}>
            <View style={[styles.iconCircle, { backgroundColor: "#000" }]}>
              <Ionicons name="images" size={24} color="#fff" />
            </View>
            <Text style={styles.quickAccessText}>Images</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAccessItem}>
            <View style={[styles.iconCircle, { backgroundColor: "#000" }]}>
              <Ionicons name="language" size={24} color="#fff" />
            </View>
            <Text style={styles.quickAccessText}>Translate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAccessItem}>
            <View style={[styles.iconCircle, { backgroundColor: "#000" }]}>
              <Ionicons name="school" size={24} color="#fff" />
            </View>
            <Text style={styles.quickAccessText}>Education</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAccessItem}>
            <View style={[styles.iconCircle, { backgroundColor: "#000" }]}>
              <Ionicons name="musical-notes" size={24} color="#fff" />
            </View>
            <Text style={styles.quickAccessText}>Music</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 24,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    marginLeft: 10,
    fontSize: 18,
    height: 40,
  },
  quickAccessContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  quickAccessItem: {
    alignItems: "center",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickAccessText: {
    color: "#000",
    fontSize: 12,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    height: 40,
  },
  historyContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 16,
  },
  historyText: {
    fontSize: 16,
    color: "#202124",
  },
});

import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Easing, withTiming } from "react-native-reanimated";
import { addSearchHistory } from "../../redux/slices/searchHistorySlice";

const TextInputsAndSearchHistory = ({
  headerHeight,
  focused,
  setFocused,
  setIsVoiceSearchModalVisible,
  headerOpacity,
  onClose,
  visible,
}: {
  headerHeight: number;
  focused: boolean;
  setFocused: (focused: boolean) => void;
  setIsVoiceSearchModalVisible: (isVoiceSearchModalVisible: boolean) => void;
  headerOpacity: SharedValue<number>;
  onClose: () => void;
  visible: boolean;
}) => {
  const searchBarTop = useSharedValue(headerHeight);
  const searchBarScale = useSharedValue(1);
  const searchBarMargin = useSharedValue(20);
  const [searchQuery, setSearchQuery] = useState("");
  const textInputRef = useRef<TextInput>(null);
  const searchHistory = useSelector(
    (state: RootState) => state.searchHistory.value
  );
  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: searchBarTop.value },
      { scale: searchBarScale.value },
    ],
    marginHorizontal: searchBarMargin.value,
  }));
  const animateOnFocus = (focused: boolean) => {
    if (focused) {
      Haptics.selectionAsync();
    }
    setFocused(focused);
    headerOpacity.value = withTiming(focused ? 1 : 1, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    searchBarTop.value = withTiming(focused ? 20 : headerHeight * 2, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    searchBarScale.value = withTiming(focused ? 0.95 : 1, {
      duration: 300,
    });

    searchBarMargin.value = withTiming(focused ? 0 : 20, {
      duration: 300,
    });

    setTimeout(() => {
      if (!focused) {
        // textInputRef.current?.blur();
        // setSearchQuery("");
        // onClose();
      }
    }, 300);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (visible) {
      animateOnFocus(true);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent={false}>
      <View>
        <Animated.View style={[searchBarAnimatedStyle, { zIndex: 1 }]}>
          <View style={styles.searchContainer}>
            <Ionicons
              style={{ zIndex: 1 }}
              onPress={() => {
                if (focused) {
                  animateOnFocus(false);
                }
              }}
              name={focused ? "arrow-back" : "search"}
              size={20}
              color="#9AA0A6"
            />
            <TouchableOpacity style={styles.searchInputContainer}>
              <TextInput
                ref={textInputRef}
                clearTextOnFocus
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#9AA0A6"
                onFocus={() => animateOnFocus(true)}
                onBlur={() => animateOnFocus(false)}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                submitBehavior="submit"
                enterKeyHint="search"
                returnKeyLabel="Search"
                returnKeyType="search"
                onSubmitEditing={() => {
                  if (searchQuery) {
                    dispatch(addSearchHistory(searchQuery));
                  }
                }}
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

          <View style={styles.historyContainer}>
            {focused && searchQuery.length === 0 && (
              <FlatList
                data={searchHistory}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.historyItem}>
                    <Ionicons name="time-outline" size={20} color="#9AA0A6" />
                    <Text style={styles.historyText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default TextInputsAndSearchHistory;

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

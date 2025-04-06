import {
  Button,
  FlatList,
  InputAccessoryView,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TextInputsAndSearchHistory = ({
  headerHeight,
  focused,
  setFocused,
  setIsVoiceSearchModalVisible,
  headerOpacity,
  onClose,
  visible,
  query = "",
  setIsImageCaptureModalVisible,
}: {
  headerHeight: number;
  focused: boolean;
  setFocused: (focused: boolean) => void;
  setIsVoiceSearchModalVisible: (isVoiceSearchModalVisible: boolean) => void;
  headerOpacity: SharedValue<number>;
  onClose: () => void;
  visible: boolean;
  query: string;
  setIsImageCaptureModalVisible: (isImageCaptureModalVisible: boolean) => void;
}) => {
  const insets = useSafeAreaInsets();

  const searchBarTop = useSharedValue(headerHeight);
  const searchBarScale = useSharedValue(1);
  const searchBarMargin = useSharedValue(20);
  const [searchQuery, setSearchQuery] = useState(query);
  const textInputRef = useRef<TextInput>(null);
  const searchHistory = useSelector(
    (state: RootState) => state.searchHistory.value
  );
  const [searchResults, setSearchResults] = useState<
    {
      id: number;
      title: string;
      description: string;
      url: string;
      source: string;
      imageUrl?: string;
    }[]
  >([]);
  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: searchBarTop.value },
      { scale: searchBarScale.value },
    ],
    marginHorizontal: searchBarMargin.value,
  }));
  const animateOnFocus = (focused: boolean) => {
    if (focused) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
    setFocused(focused);
    headerOpacity.value = withTiming(focused ? 1 : 1, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    searchBarTop.value = withTiming(focused ? insets.top : headerHeight, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    searchBarScale.value = withTiming(focused ? 0.95 : 1, {
      duration: 300,
    });

    searchBarMargin.value = withTiming(focused ? 0 : 20, {
      duration: 300,
    });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (visible) {
      animateOnFocus(true);
    }
  }, [visible]);

  const onSearch = (query: string) => {
    setSearchQuery(query);

    const results = Array.from({ length: 10 }, (_, index) => {
      return {
        id: index,
        title: `Product ${query} ${index}`,
        description: `Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum ${query} ${index}`,
        url:
          index % 2 === 0
            ? "https://en.wikipedia.org/wiki"
            : "https://www.amazon.com",
        source: index % 2 === 0 ? "Wikipedia" : "Amazon",
        imageUrl: "https://picsum.photos/200/300",
      };
    });

    setSearchResults(results);
  };
  const inputAccessoryViewID = "keyboardClose";

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
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#9AA0A6"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                submitBehavior="submit"
                enterKeyHint="search"
                returnKeyLabel="Search"
                returnKeyType="search"
                onSubmitEditing={(e) => {
                  if (searchQuery && searchQuery !== searchHistory?.[0]) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                    dispatch(addSearchHistory(searchQuery));
                    onSearch(searchQuery);
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
              <Ionicons
                onPress={() => setIsImageCaptureModalVisible(true)}
                name="camera"
                size={20}
                color="#9AA0A6"
              />
            </View>
          </View>

          <View style={styles.historyContainer}>
            {focused && searchQuery.length === 0 && (
              <FlatList
                data={searchHistory}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchQuery(item);
                      onSearch(item);
                    }}
                    style={styles.historyItem}
                  >
                    <Ionicons name="time-outline" size={20} color="#9AA0A6" />
                    <Text style={styles.historyText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            {focused && searchQuery.length !== 0 && (
              <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                data={searchResults}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.searchResultItem}>
                    <View style={styles.resultHeader}>
                      {item.imageUrl && (
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={styles.sourceLogo}
                        />
                      )}
                      <Text style={styles.sourceUrl}>{item.url}</Text>
                    </View>
                    <Text style={styles.resultTitle}>{item.title}</Text>
                    <Text style={styles.resultDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  platformIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchResultItem: {
    paddingVertical: 12,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  sourceLogo: {
    width: 16,
    height: 16,
    marginRight: 8,
    borderRadius: 8,
  },
  sourceUrl: {
    fontSize: 12,
    color: "#000",
  },
  resultTitle: {
    fontSize: 16,
    color: "#1a0dab",
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#e8eaed",
  },
});

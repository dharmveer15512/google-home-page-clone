import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  cancelAnimation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Audio } from "expo-av";
const VoiceSearchModal = ({
  onClose,
  visible,
  onQueryChange,
}: {
  onClose: () => void;
  visible: boolean;
  onQueryChange: (query: string) => void;
}) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcription, setTranscription] = useState("");
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      scale.value = 1;
      // Start the animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1, // Infinite repeat
        true // Reverse
      );

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync();

      recordingRef.current = recording;
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;
      cancelAnimation(scale);
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      setRecording(null);

      // 🔊 Send to backend for transcription
      if (uri) {
        const text = await transcribeAudio(uri);
        setTranscription(text);
        onQueryChange(text);
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const transcribeAudio = async (uri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "audio/m4a",
      name: "recording.m4a",
    } as any);

    // for now mocking the transcription
    return "Hello, how are you?";
    // const response = await fetch(
    //   "https://api.openai.com/v1/audio/transcriptions",
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: "Bearer YOUR_OPENAI_API_KEY",
    //     },
    //     body: formData,
    //   }
    // );

    // const result = await response.json();
    // return result.text || "Could not transcribe.";
  };

  useEffect(() => {
    if (visible) requestMicrophonePermission();
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, [visible]);

  const dots = [
    { color: "#4285F4" }, // Blue
    { color: "#EA4335" }, // Red
    { color: "#FBBC05" }, // Yellow
    { color: "#34A853" }, // Green
  ];

  const scale = useSharedValue(1);
  const insets = useSafeAreaInsets();

  const requestMicrophonePermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Microphone permission denied",
        "Please enable microphone permission in settings",
        [
          {
            text: "Enable",
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
    } else {
      startRecording();
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <View
          style={{
            position: "absolute",
            top: insets.top + 20,
            left: 20,
            zIndex: 1,
          }}
        >
          <Pressable onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
        <Text style={styles.speakText}>Speak now</Text>
        <View style={styles.dotsContainer}>
          {dots.map((dot, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: dot.color },
                useAnimatedStyle(() => ({
                  transform: [{ scale: scale.value }],
                })),
              ]}
            />
          ))}
        </View>

        <Pressable onPress={stopRecording} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Stop recording</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default VoiceSearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 200,
  },
  speakText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "300",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    padding: 100,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: "#2A2A2A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

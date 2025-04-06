import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo for icons
import { useSafeAreaInsets } from "react-native-safe-area-context";
const ProfileModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  // const insets = useSafeAreaInsets();

  const menuItems = [
    { icon: "person", label: "Manage your Google Account" },
    { icon: "glasses-outline", label: "Turn on Incognito" },
    { icon: "time-outline", label: "Search history" },
    { icon: "trash-outline", label: "Delete last 15 mins" },
    { icon: "shield-checkmark-outline", label: "SafeSearch" },
    { icon: "heart-outline", label: "Interests" },
    { icon: "key-outline", label: "Passwords" },
    { icon: "person-circle-outline", label: "Your profile" },
    { icon: "diamond-outline", label: "Search personalisation" },
    { icon: "settings-outline", label: "Settings" },
    { icon: "help-circle-outline", label: "Help and feedback" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { paddingTop: 10 }]}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileLetter}>D</Text>
            </View>
          </View>

          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Ionicons name={item.icon as any} size={24} color="#000" />
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Privacy Policy</Text>
            <Text style={styles.footerDot}>•</Text>
            <Text style={styles.footerText}>Terms of Service</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "90%",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#666",
    alignItems: "center",
    justifyContent: "center",
  },
  profileLetter: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 16,
  },
  menuText: {
    color: "#000",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 16,
    gap: 8,
  },
  footerText: {
    color: "#000",
    fontSize: 14,
  },
  footerDot: {
    color: "#000",
    fontSize: 14,
  },
});

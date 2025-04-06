import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import React from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo for icons
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useAuth,
  useOAuth,
  useUser,
  useClerk,
  useSSO,
} from "@clerk/clerk-expo";
const ProfileModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  // const insets = useSafeAreaInsets();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();
  const { startSSOFlow } = useSSO();
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
    {
      icon: "log-out-outline",
      label: "Sign out",
      onPress: () => {
        clerk.signOut();
      },
    },
  ];

  const { startOAuthFlow } = useOAuth({
    strategy: "oauth_google",
    redirectUrl: "demo://oauth-callback",
  });

  const handleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        console.log("Signed in with Google!");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

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
              {isSignedIn ? (
                <Text style={styles.profileLetter}>
                  {user?.firstName?.charAt(0)}
                </Text>
              ) : (
                <AntDesign name="user" size={24} color="#fff" />
              )}
            </View>
          </View>

          {isSignedIn ? (
            menuItems.map((item, index) => (
              <TouchableOpacity
                onPress={item.onPress}
                key={index}
                style={styles.menuItem}
              >
                <Ionicons name={item.icon as any} size={24} color="#000" />
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Pressable style={styles.footer} onPress={() => handleSignIn()}>
              <Text style={styles.footerText}>Sign in</Text>
            </Pressable>
          )}

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

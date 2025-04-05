import {
  Modal,
  StyleSheet,
  View,
  Text,
  Button,
  SafeAreaView,
} from "react-native";
import { store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store";
import { Provider } from "react-redux";
import SearchScreen from "./Screens/SearchScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useState } from "react";
import VoiceSearchModal from "./components/VoiceSearch/VoiceSearchModal";

export default function Index() {
  const [isVoiceSearchModalVisible, setIsVoiceSearchModalVisible] =
    useState(true);
  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, paddingTop: 20, backgroundColor: "white" }}
        >
          <SearchScreen />
        </SafeAreaView>
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
  );
}

const styles = StyleSheet.create({});

import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store";
import { Provider } from "react-redux";
import SearchScreen from "./Screens/SearchScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import * as WebBrowser from "expo-web-browser";
// export const useWarmUpBrowser = () => {
//   React.useEffect(() => {
//     // Warm up the android browser to improve UX
//     // https://docs.expo.dev/guides/authentication/#improving-user-experience
//     void WebBrowser.warmUpAsync()
//     return () => {
//       void WebBrowser.coolDownAsync()
//     }
//   }, [])
// }

WebBrowser.maybeCompleteAuthSession();
export default function Index() {
  // useWarmUpBrowser();
  return (
    <ClerkProvider
    publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    tokenCache={tokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({});

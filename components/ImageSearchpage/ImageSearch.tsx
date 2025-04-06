import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Button, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ImagePickerWithCrop from "./ImagePickerWithCrop";
import ExpoImageManipulator from "../../Libraries/ExpoImageManipulator";
import SearchBottomSheet from "./SearchBottomSheet";
export default function ImageSearch({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const uri = await cameraRef.current.takePictureAsync({
        quality: 1,
      });
      setImage(uri?.uri || null);
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <ExpoImageManipulator
          SearchBottomSheet={<SearchBottomSheet image={image} />}
          onClose={() => {
            setImage(null);
          }}
          inset={insets}
          squareAspect={true}
          btnTexts={{
            crop: "Crop",
            rotate: "Rotate",
            done: "Done",
            processing: "Processing...",
          }}
          dragVelocity={0}
          resizeVelocity={0}
          photo={{ uri: image }}
          isVisible={true}
          onPictureChoosed={(data: any) => {
            setImage(data.uri);
          }}
          onToggleModal={() => {}}
          saveOptions={{
            compress: 1,
            format: "png",
            base64: true,
          }}
        />
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing={"back"}>
          <Ionicons
            style={[styles.backButton, { top: insets.top }]}
            name="chevron-back-outline"
            size={35}
            color="#fff"
            onPress={onClose}
          />
          <Pressable
            style={[styles.buttonContainer, { bottom: insets.bottom }]}
            onPress={takePhoto}
          >
            <View style={styles.button}>
              <AntDesign name="search1" size={30} color="#000" />
            </View>
          </Pressable>
          <View
            style={[styles.imagePickerContainer, { bottom: insets.bottom }]}
          >
            <ImagePickerWithCrop onImagePicked={(image) => setImage(image)} />
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
    padding: 2,
    borderRadius: 100,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: "#fff",
    height: 60,
    width: 60,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  imagePickerContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 2,
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});

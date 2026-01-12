// components/camera/CameraCapture.tsx
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

type Props = {
  onCapture: (photoUri: string) => void;
};

export default function CameraCapture({ onCapture }: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [preview, setPreview] = useState<string | null>(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>
          Precisamos de permissão para acessar a câmera
        </Text>

        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Permitir câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function takePicture() {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
      // Em alguns aparelhos, skipProcessing pode causar preview branco.
      // Se quiser testar, habilite depois:
      // skipProcessing: true,
    });

    // Debug opcional:
    // console.log("PHOTO URI:", photo.uri);

    setPreview(photo.uri);
    onCapture(photo.uri);
  }

  function retake() {
    setPreview(null);
  }

  return (
    <View style={styles.container}>
      {preview ? (
        <>
          <Image
            source={{ uri: preview }}
            style={styles.preview}
            resizeMode="cover"
          />

          <TouchableOpacity style={styles.retakeButton} onPress={retake}>
            <Ionicons name="refresh" size={22} color="#fff" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <CameraView ref={cameraRef} style={styles.camera} facing="front" />

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Ionicons name="camera" size={28} color="#000" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

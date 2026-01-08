// components/camera/styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    height: 400,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },

  camera: {
    flex: 1,
  },

  // Para evitar preview branco: garanta dimensões explícitas
  preview: {
    width: "100%",
    height: "100%",
  },

  captureButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#fff",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  retakeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 999,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  permissionText: {
    textAlign: "center",
  },

  button: {
    marginTop: 12,
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
  },
});

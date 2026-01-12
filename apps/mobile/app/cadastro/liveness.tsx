import React, { useMemo, useState } from "react";
import { Platform, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

export default function LivenessWebScreen() {
  const uri = useMemo(() => "http://192.168.18.5:5174", []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | { title: string; description?: string }>(null);
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <WebView
        key={reloadKey}
        source={{ uri }}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        onLoadStart={() => {
          setLoading(true);
          setError(null);
          console.log("WEBVIEW load start:", uri);
        }}
        onLoadEnd={() => {
          setLoading(false);
          console.log("WEBVIEW load end:", uri);
        }}
        onError={(e) => {
          setLoading(false);
          console.log("WEBVIEW onError:", e.nativeEvent);
          setError({
            title: "Falha ao carregar a página",
            description: `${e.nativeEvent.description} (${e.nativeEvent.url})`,
          });
        }}
        onHttpError={(e) => {
          console.log("WEBVIEW onHttpError:", e.nativeEvent);
          // Isso pega erro HTTP do carregamento do HTML principal (não de requests internos)
          setError({
            title: "Erro HTTP ao abrir a página",
            description: `Status ${e.nativeEvent.statusCode} em ${e.nativeEvent.url}`,
          });
        }}
        onPermissionRequest={(event: { grant: () => void }) => {
          if (Platform.OS === "android") event.grant();
        }}
        onMessage={(event: WebViewMessageEvent) => {
          const raw = event.nativeEvent.data;
          try {
            const data = JSON.parse(raw);
            console.log("WEBVIEW MSG:", data);
          } catch {
            console.log("WEBVIEW RAW:", raw);
          }
        }}
      />

      {/* Loader por cima enquanto carrega */}
      {loading && (
        <View
          style={{
            position: "absolute",
            inset: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
          }}
        >
          <ActivityIndicator />
          <Text style={{ marginTop: 12 }}>Carregando liveness…</Text>
        </View>
      )}

      {/* Fallback de erro (evita ficar “branco” sem feedback) */}
      {error && (
        <View
          style={{
            position: "absolute",
            inset: 0,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            backgroundColor: "#fff",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
            {error.title}
          </Text>
          {!!error.description && (
            <Text style={{ textAlign: "center", marginBottom: 16 }}>{error.description}</Text>
          )}
          <TouchableOpacity
            onPress={() => setReloadKey((k) => k + 1)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: "#111",
            }}
          >
            <Text style={{ color: "#fff" }}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

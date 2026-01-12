import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

type PermissionRequestEvent = { grant: () => void };

export default function LivenessWeb() {
  const httpsUrl = "https://lounge-farms-sig-informal.trycloudflare.com";

  const [reloadKey, setReloadKey] = useState(0);

  const uri = useMemo(() => `${httpsUrl}/?v=${reloadKey}`, [reloadKey]);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        key={uri} // <-- força remontar e evita cache
        source={{ uri }}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
        mixedContentMode="always"
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        onPermissionRequest={(event: PermissionRequestEvent) => event.grant()}
        onLoadStart={() => console.log("WEBVIEW load start:", uri)}
        onLoadEnd={() => console.log("WEBVIEW load end:", uri)}
        onMessage={(event: WebViewMessageEvent) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log("WEBVIEW MSG:", data);
          } catch {
            console.log("WEBVIEW RAW:", event.nativeEvent.data);
          }
        }}
      />

      {/* botão simples para forçar reload se necessário */}
      <View style={{ position: "absolute", bottom: 24, right: 24 }}>
        <TouchableOpacity
          onPress={() => setReloadKey((k) => k + 1)}
          style={{ padding: 10, backgroundColor: "#111", borderRadius: 10 }}
        >
          <Text style={{ color: "#fff" }}>Recarregar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

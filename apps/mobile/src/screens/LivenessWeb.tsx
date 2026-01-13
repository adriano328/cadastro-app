import React, { useMemo, useState, useEffect } from "react";
import { View, Text } from "react-native";
import { WebView } from "react-native-webview";

export default function LivenessWeb() {
  const httpsBase = "https://genetic-interventions-sugar-least.trycloudflare.com";

  const [v] = useState(() => Date.now());
  const uri = useMemo(() => `${httpsBase}/?v=${v}`, [httpsBase, v]);

  useEffect(() => {
    console.log("RN LivenessWeb URI:", uri);
  }, [uri]);

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 8, fontSize: 12 }} numberOfLines={2}>
        URI (deveria ser HTTPS): {uri}
      </Text>

      <WebView
        key={uri}
        cacheEnabled={false}
        incognito
        source={{ uri }}
        javaScriptEnabled
        domStorageEnabled
        onLoadStart={(e) => console.log("WEBVIEW load start:", e.nativeEvent.url)}
        onLoadEnd={(e) => console.log("WEBVIEW load end:", e.nativeEvent.url)}
      />
    </View>
  );
}

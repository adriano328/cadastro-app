import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { createLivenessSession } from "../../services/liveness/createSession";

type RNMessage =
  | { type: "SESSION_CREATED"; sessionId: string }
  | { type: "ANALYSIS_COMPLETE"; sessionId: string }
  | { type: "ERROR"; step?: "ENV" | "PROBE" | "CREATE_SESSION" | "LIVENESS"; message: string; raw?: any };

function postToReactNative(payload: RNMessage) {
  (window as any).ReactNativeWebView?.postMessage(JSON.stringify(payload));
}

export default function AppLiveness() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionRequestedRef = useRef(false);

  const resetAndRetry = useCallback(() => {
    sessionRequestedRef.current = false;
    setSessionId(null);
    setError(null);
  }, []);

  /**
   * Diagnóstico do ambiente: secure context + mediaDevices/getUserMedia
   * - Se getUserMedia não existir, não adianta tentar iniciar o FaceLivenessDetector.
   * - Se existir mas falhar, reporta o motivo (NotAllowedError, NotFoundError etc).
   */
  const probeCamera = useCallback(async (): Promise<boolean> => {
    const env = {
      origin: window.location.origin,
      isSecureContext: window.isSecureContext,
      hasMediaDevices: !!navigator.mediaDevices,
      hasGetUserMedia: !!navigator.mediaDevices?.getUserMedia,
    };

    console.log("LIVENESS ENV:", env);

    if (!env.isSecureContext) {
      const message =
        "Contexto inseguro. Abra esta página em HTTPS (trycloudflare/ngrok) para liberar a câmera.";
      setError(message);
      postToReactNative({ type: "ERROR", step: "ENV", message, raw: env });
      return false;
    }

    if (!env.hasGetUserMedia) {
      const message =
        "getUserMedia indisponível neste WebView (sem suporte WebRTC/câmera).";
      setError(message);
      postToReactNative({ type: "ERROR", step: "ENV", message, raw: env });
      return false;
    }

    try {
      const stream = await navigator.mediaDevices!.getUserMedia({
        video: true,
        audio: false,
      });
      stream.getTracks().forEach((t) => t.stop());
      return true;
    } catch (e: any) {
      const message =
        "Falha ao abrir a câmera via getUserMedia (permissão negada ou câmera indisponível).";
      const raw = { name: e?.name, message: e?.message, env };
      console.error("PROBE getUserMedia error:", raw);

      setError(message);
      postToReactNative({ type: "ERROR", step: "PROBE", message, raw });
      return false;
    }
  }, []);

  const startSession = useCallback(async () => {
    if (sessionRequestedRef.current) return;
    sessionRequestedRef.current = true;

    setLoading(true);
    setError(null);

    try {
      // 1) Garante que o ambiente suporta câmera antes de criar a sessão
      const ok = await probeCamera();
      if (!ok) {
        sessionRequestedRef.current = false;
        return;
      }

      // 2) Cria a sessão no backend
      const { sessionId: newSessionId } = await createLivenessSession();

      if (!newSessionId) {
        throw new Error("sessionId não retornado pela API");
      }

      setSessionId(newSessionId);

      postToReactNative({
        type: "SESSION_CREATED",
        sessionId: newSessionId,
      });
    } catch (err: any) {
      sessionRequestedRef.current = false;

      const message = err?.message ?? "Falha ao criar sessão. Tente novamente.";
      setError(message);

      postToReactNative({
        type: "ERROR",
        step: "CREATE_SESSION",
        message,
        raw: err,
      });
    } finally {
      setLoading(false);
    }
  }, [probeCamera]);

  useEffect(() => {
    startSession();
  }, [startSession]);

  const containerStyle: React.CSSProperties = {
    maxWidth: 520,
    margin: "40px auto",
    padding: 16,
    textAlign: "center",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  };

  if (loading && !sessionId) {
    return (
      <div style={containerStyle}>
        <p>Preparando câmera e sessão de validação facial…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <p style={{ marginBottom: 16 }}>{error}</p>
        <button
          style={buttonStyle}
          onClick={() => {
            resetAndRetry();
            startSession();
          }}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: 16 }}>Validação Facial (Liveness)</h2>

      {sessionId ? (
        <FaceLivenessDetector
          sessionId={sessionId}
          region="us-east-1"
          onAnalysisComplete={() => {
            console.log("✅ Liveness concluído");
            postToReactNative({ type: "ANALYSIS_COMPLETE", sessionId });
          }}
          onError={(err: any) => {
            console.error("Erro no Liveness:", err);

            let message = "Falha durante a validação facial";
            if (err?.state === "MOBILE_LANDSCAPE_ERROR") {
              message = "Use o celular em modo retrato (vertical) para continuar.";
            }
            if (err?.state === "CAMERA_ACCESS_ERROR") {
              message =
                "Não foi possível acessar a câmera. Verifique permissões do app e suporte do WebView.";
            }

            setError(message);

            postToReactNative({
              type: "ERROR",
              step: "LIVENESS",
              message,
              raw: err,
            });
          }}
        />
      ) : (
        <button style={buttonStyle} onClick={startSession}>
          Iniciar validação facial
        </button>
      )}
    </div>
  );
}

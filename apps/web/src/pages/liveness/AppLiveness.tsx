import { useCallback, useEffect, useRef, useState } from "react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { createLivenessSession } from "../../services/liveness/createSession";

type RNMessage =
  | { type: "SESSION_CREATED"; sessionId: string }
  | { type: "ANALYSIS_COMPLETE"; sessionId: string }
  | { type: "ERROR"; step?: string; message: string; raw?: any };

function postToReactNative(payload: RNMessage) {
  (window as any).ReactNativeWebView?.postMessage(JSON.stringify(payload));
}

export default function AppLiveness() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionRequestedRef = useRef(false);

  useEffect(() => {
    console.log("isSecureContext:", window.isSecureContext);
    console.log("mediaDevices:", navigator.mediaDevices);
    console.log("getUserMedia:", navigator.mediaDevices?.getUserMedia);
  }, []);

  const resetAndRetry = useCallback(() => {
    sessionRequestedRef.current = false;
    setSessionId(null);
    setError(null);
  }, []);

  const startSession = useCallback(async () => {
    if (sessionRequestedRef.current) return;
    sessionRequestedRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const result = await createLivenessSession();
      const newSessionId = result.sessionId;

      setSessionId(newSessionId);

      postToReactNative({
        type: "SESSION_CREATED",
        sessionId: newSessionId,
      });
    } catch (err: any) {
      sessionRequestedRef.current = false;

      const message =
        err?.message ??
        "Falha ao criar sessão. Tente novamente.";

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
  }, []);

  useEffect(() => {
    startSession();
  }, [startSession]);

  const containerStyle: React.CSSProperties = {
    maxWidth: 520,
    margin: "40px auto",
    padding: 16,
    textAlign: "center",
    fontFamily:
      "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
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

            postToReactNative({
              type: "ANALYSIS_COMPLETE",
              sessionId,
            });
          }}
          onError={(err: any) => {
            console.error("Erro no Liveness:", err);

            let message = "Falha durante a validação facial";

            if (err?.state === "MOBILE_LANDSCAPE_ERROR") {
              message = "Use o celular em modo retrato (vertical) para continuar.";
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

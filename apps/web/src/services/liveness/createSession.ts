// src/services/liveness/createSession.ts
import type { AxiosError } from "axios";
import { api } from "../../api/api";

export type CreateSessionResponse = { sessionId: string };

type Diagnose = {
  type: "CORS_OR_NETWORK" | "HTTP_ERROR" | "UNKNOWN";
  message: string;
  status?: number;
  url?: string;
  hint?: string;
};

function diagnoseAxiosError(err: AxiosError<any>): Diagnose {
  const url = `${(err.config?.baseURL as string | undefined) ?? ""}${err.config?.url ?? ""}`;

  // Quando é CORS/preflight bloqueado, timeout de rede, DNS etc.
  // axios costuma vir com response undefined.
  if (!err.response) {
    const isTimeout = err.code === "ECONNABORTED";
    return {
      type: "CORS_OR_NETWORK",
      message: err.message || "Network error",
      url,
      hint: isTimeout
        ? "Timeout: verifique rede/porta/timeout"
        : "Provável CORS/preflight bloqueado (Postman funciona, browser falha). Verifique OPTIONS e Access-Control-Allow-* no backend.",
    };
  }

  // Erro HTTP real (4xx/5xx)
  return {
    type: "HTTP_ERROR",
    message: err.response.data?.message ?? err.message ?? "HTTP error",
    status: err.response.status,
    url,
    hint:
      "Erro retornado pelo servidor. Se for 500, ver logs do backend; se for 401/403, ver auth/headers.",
  };
}

export async function createLivenessSession(): Promise<CreateSessionResponse> {
  try {
    const res = await api.post<CreateSessionResponse>("/liveness/criar-sessao", {});
    const data = res.data;

    if (!data?.sessionId) {
      throw new Error("sessionId não retornado pela API");
    }
    return data;
  } catch (error) {
    const err = error as AxiosError<any>;
    const diag = diagnoseAxiosError(err);

    console.error("createLivenessSession diagnostic:", diag);

    // Repassa uma mensagem clara para UI
    throw new Error(
      diag.type === "CORS_OR_NETWORK"
        ? `Falha de rede/CORS ao criar sessão. ${diag.hint ?? ""}`
        : `Falha ao criar sessão (${diag.status}). ${diag.message}`
    );
  }
}

// src/api/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://85.31.63.50:1030",
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  console.log("[API][REQ]", {
    method: config.method,
    url: `${config.baseURL ?? ""}${config.url ?? ""}`,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log("[API][RES]", {
      url: `${res.config.baseURL ?? ""}${res.config.url ?? ""}`,
      status: res.status,
      data: res.data,
    });
    return res;
  },
  (error) => {
    // Aqui pega CORS (Network Error) e erros HTTP (4xx/5xx)
    console.log("[API][ERR]", {
      message: error?.message,
      code: error?.code,
      url: `${error?.config?.baseURL ?? ""}${error?.config?.url ?? ""}`,
      method: error?.config?.method,
      status: error?.response?.status,
      data: error?.response?.data,
      responseHeaders: error?.response?.headers,
    });
    return Promise.reject(error);
  }
);

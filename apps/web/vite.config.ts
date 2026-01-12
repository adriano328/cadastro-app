import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    // evita bloqueio por host desconhecido vindo do tunnel
    allowedHosts: true,
  },
});

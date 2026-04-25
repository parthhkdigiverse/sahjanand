import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, ".."), "");
  const backendPort = env.BACKEND_PORT || "8002";
  const frontendPort = parseInt(env.FRONTEND_PORT || "3550");

  return {
    vite: {
      define: {
        __BACKEND_PORT__: JSON.stringify(backendPort),
      },
      server: {
        port: frontendPort,
        strictPort: true,
        host: true,
        hmr: {
          clientPort: 443, // Standard for HTTPS proxy
          protocol: 'wss',
        },
        proxy: {
          "/api": {
            target: `http://127.0.0.1:${backendPort}`,
            changeOrigin: true,
            secure: false,
          },
          "/uploads": {
            target: `http://127.0.0.1:${backendPort}`,
            changeOrigin: true,
            secure: false,
          },
        },
      },
    },
  };
});

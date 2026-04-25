import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, ".."), "");
  const backendPort = env.BACKEND_PORT || "8002";
  const frontendPort = parseInt(env.FRONTEND_PORT || "3550");

  // On server: APP_HOST=0.0.0.0 → bind all interfaces + WSS HMR
  // On local:  APP_HOST=127.0.0.1 (or unset) → localhost only + standard HMR
  const isServer = env.APP_HOST === "0.0.0.0";

  return {
    vite: {
      define: {
        __BACKEND_PORT__: JSON.stringify(backendPort),
      },
      server: {
        port: frontendPort,
        strictPort: true,
        host: isServer ? true : false,
        hmr: env.VITE_HMR_HOST ? {
          host: env.VITE_HMR_HOST,
          clientPort: 443,
          protocol: 'wss',
        } : true,
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

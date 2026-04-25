import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, ".."), "");
  return {
    vite: {
      define: {
        __BACKEND_PORT__: JSON.stringify(env.BACKEND_PORT || "8002"),
      },
      server: {
        port: parseInt(env.FRONTEND_PORT || "3535"),
        strictPort: true,
        host: true,
        proxy: {
          "/api": {
            target: `http://127.0.0.1:${env.BACKEND_PORT || "8002"}`,
            changeOrigin: true,
          },
          "/uploads": {
            target: `http://127.0.0.1:${env.BACKEND_PORT || "8002"}`,
            changeOrigin: true,
          },
        },
      },
    },
  };
});

import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, ".."), "");
  return {
    vite: {
      server: {
        port: parseInt(env.FRONTEND_PORT || "3535"),
        strictPort: true,
      },
    },
  };
});

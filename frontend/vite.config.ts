import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8000",
      "/songs": "http://127.0.0.1:8000",
      "/history": "http://127.0.0.1:8000",
      "/generated": "http://127.0.0.1:8000",
      "/download": "http://127.0.0.1:8000",
      "/generate-inspiration": "http://127.0.0.1:8000",
      "/generation-status": "http://127.0.0.1:8000",
      "/health": "http://127.0.0.1:8000",
    },
  },
});

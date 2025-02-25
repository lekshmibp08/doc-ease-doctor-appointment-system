import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: { 
      "/api": {
        target: "http://localhost:5000",
        secure: false,
        changeOrigin: true,
      },
    },
  },

  resolve: {
    alias: {
      stream: "stream-browserify",
    },
  },

  define: {
    global: "window", // Fixes the "global is not defined" issue
  },
});

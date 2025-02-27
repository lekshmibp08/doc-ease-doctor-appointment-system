import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.VITE_BASE_URL

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: { 
      "/api": {
        target: BASE_URL || "http://localhost:5000",
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

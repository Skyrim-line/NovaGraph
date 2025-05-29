import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/NovaGraphWeb/",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        kuzuTest: path.resolve(__dirname, "src/wasm/Kuzu/services/index.html"),
      },
    },
  },
});

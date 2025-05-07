import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: "src/loader/ee-loader.js",
      formats: ["es"],
      fileName: (format) => `ee-loader.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  server: {
    headers: {
      "Content-Type": "application/javascript",
    },
  },
});

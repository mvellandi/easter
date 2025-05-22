import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // Base public path when served in development or production
  base: "/easter/",

  // Project root directory
  root: "src",

  // Plugins
  plugins: [
    tailwindcss(),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("ee-"),
        },
      },
    }),
  ],

  // Development server options
  server: {
    port: 5173,
    open: false,
    host: true,
    hmr: true,
  },

  // Build options
  build: {
    outDir: "../easter",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue"],
          core: ["./src/core/core.js"],
        },
      },
    },
  },

  // Resolve options
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },

  // Public directory for static assets
  publicDir: "public",
});

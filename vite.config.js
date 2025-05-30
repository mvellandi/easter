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
    outDir: "../docs",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        bootdev: resolve(__dirname, "src/bootdev.html"),
      },
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

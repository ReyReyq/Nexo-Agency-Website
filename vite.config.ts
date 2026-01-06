import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import preload from "vite-plugin-preload";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    compression({ algorithm: "gzip" }),
    compression({ algorithm: "brotliCompress", ext: ".br" }),
    // Modulepreload only critical entry chunks - reduces head parsing overhead
    // Only preload react-vendor and framer-motion (needed for hero animations)
    // Other chunks load on-demand when routes are accessed
    preload({
      // Only preload essential entry-related chunks, not all lazy routes
      includeDynamicImports: false,
    }),
    mode === "analyze" && visualizer({
      filename: "stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Dedupe Three.js to prevent multiple instances
      "three": path.resolve(__dirname, "./node_modules/three"),
    },
    dedupe: ["three", "react", "react-dom"],
  },
  optimizeDeps: {
    include: ["three", "@react-three/fiber", "@react-three/drei"],
  },
  build: {
    minify: "esbuild",
    rollupOptions: {
      output: {
        // Use function-based manualChunks for proper code-splitting with lazy imports
        // This ensures Three.js stays in its own chunk when lazy-loaded
        manualChunks(id) {
          // React core - needed on every page
          if (id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router-dom/")) {
            return "react-vendor";
          }

          // Three.js and related packages - lazy loaded, separate chunk
          // This chunk will only load when Globe, Ballpit, PixelTrail, Silk, or ASCIIText are used
          if (id.includes("node_modules/three/") ||
              id.includes("node_modules/@react-three/")) {
            return "three-vendor";
          }

          // Cobe (Globe library) - separate from Three.js
          if (id.includes("node_modules/cobe/")) {
            return "cobe-vendor";
          }

          // Radix UI components - common UI primitives
          if (id.includes("node_modules/@radix-ui/")) {
            return "ui-vendor";
          }

          // Framer Motion - animation library
          if (id.includes("node_modules/framer-motion/")) {
            return "framer-motion";
          }

          // GSAP - animation library
          if (id.includes("node_modules/gsap/")) {
            return "gsap-vendor";
          }
        },
      },
    },
  },
}));

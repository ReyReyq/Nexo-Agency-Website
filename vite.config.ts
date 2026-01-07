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
    // NOTE: Disabling vite-plugin-preload because Vite 5+ handles modulepreload natively
    // The native behavior is better: it only preloads direct imports, not lazy chunks
    // Keeping the plugin disabled reduces head parsing overhead and avoids preloading
    // lazy-loaded chunks like three-vendor (800KB) that aren't needed for initial render
    // preload({...}),
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
  // CSS optimization settings
  css: {
    // Enable CSS code splitting - each async chunk gets its own CSS
    // This reduces initial CSS payload and loads route-specific CSS on demand
    devSourcemap: true,
  },
  build: {
    minify: "esbuild",
    // Enable CSS code splitting (default in Vite 5+, explicit for clarity)
    cssCodeSplit: true,
    // Inline assets smaller than 4KB to reduce HTTP requests
    assetsInlineLimit: 4096,
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

          // OGL - WebGL library used by Orb, PrismaticBurst, FaultyTerminal, RippleGrid
          // Separate chunk allows lazy loading of graphics effects
          if (id.includes("node_modules/ogl/")) {
            return "ogl-vendor";
          }

          // Embla Carousel - only needed on pages with carousels
          if (id.includes("node_modules/embla-carousel")) {
            return "embla-vendor";
          }

          // Lucide icons - tree-shake but keep commonly used together
          if (id.includes("node_modules/lucide-react/")) {
            return "icons-vendor";
          }

          // TanStack Query - data fetching library
          if (id.includes("node_modules/@tanstack/")) {
            return "query-vendor";
          }

          // Lenis - smooth scroll library
          if (id.includes("node_modules/lenis/")) {
            return "lenis-vendor";
          }

          // Split-type - text animation library
          if (id.includes("node_modules/split-type/")) {
            return "split-type-vendor";
          }

          // Matter.js - physics library
          if (id.includes("node_modules/matter-js/")) {
            return "matter-vendor";
          }

          // Canvas Confetti - celebration effects
          if (id.includes("node_modules/canvas-confetti/")) {
            return "confetti-vendor";
          }
        },
        // Optimize asset file names for better caching
        assetFileNames: (assetInfo) => {
          // Keep CSS files with hash for cache busting
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
}));

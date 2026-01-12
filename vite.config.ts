import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import preload from "vite-plugin-preload";
import { VitePWA } from "vite-plugin-pwa";

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
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'NEXO Agency',
        short_name: 'NEXO',
        description: 'Digital Agency - Web Design, Development & Marketing',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Precache core assets but exclude large portfolio images (they'll be runtime cached)
        globPatterns: ['**/*.{js,css,html,ico,woff2}', 'images/hero/**/*.{png,webp,avif}', 'images/gallery/**/*.{png,webp,avif}'],
        // Exclude portfolio folder from precaching (large images, runtime cached instead)
        globIgnores: ['**/portfolio/**', '**/node_modules/**'],
        // Increase limit for hero images, but portfolio will use runtime caching
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(avif|webp|png|jpg|jpeg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
              }
            }
          },
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources'
            }
          }
        ]
      }
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
    // Pre-bundle these for faster dev server startup, but they will be chunked separately in production
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
    // Disable module preload entirely - this prevents:
    // 1. The preload polyfill from being bundled into vendor chunks (which would cause them to load on every page)
    // 2. The <link rel="modulepreload"> tags from being generated for lazy-loaded chunks
    // This is safe because:
    // - Modern browsers support dynamic import() natively
    // - Lazy chunks will still load on-demand when the component is rendered
    // - We're using React.lazy() with Suspense for proper loading states
    modulePreload: false,
    rollupOptions: {
      output: {
        // Use function-based manualChunks for proper code-splitting with lazy imports
        // IMPORTANT: Don't assign Vite's internal helpers (like __vite__preload) to vendor chunks
        // This is done by checking that the id is an actual module path, not a virtual module
        manualChunks(id, { getModuleInfo }) {
          // Skip virtual modules, Vite internals, and already-processed chunks
          // This prevents Vite's preload helper from being bundled into vendor chunks
          if (!id.includes('node_modules') || id.startsWith('\0') || id.includes('?')) {
            return undefined;
          }

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

          // NOTE: Framer Motion is NOT chunked separately to avoid circular dependency
          // with react-vendor. It will be bundled with the code that imports it.
          // This prevents the "Cannot read properties of undefined (reading 'createContext')" error

          // GSAP - animation library
          if (id.includes("node_modules/gsap/")) {
            return "gsap-vendor";
          }

          // OGL - WebGL library used by Orb, PrismaticBurst, FaultyTerminal, RippleGrid
          // Separate chunk allows lazy loading of graphics effects
          if (id.includes("node_modules/ogl/")) {
            return "ogl-vendor";
          }

          // Matter.js - physics engine used by FallingText
          if (id.includes("node_modules/matter-js/")) {
            return "matter-vendor";
          }

          // Embla Carousel - only needed on pages with carousels
          if (id.includes("node_modules/embla-carousel")) {
            return "embla-vendor";
          }

          // NOTE: Lucide icons NOT chunked separately to avoid circular dependency with react-vendor

          // NOTE: TanStack Query NOT chunked separately to avoid circular dependency with react-vendor

          // Lenis - smooth scroll library
          if (id.includes("node_modules/lenis/")) {
            return "lenis-vendor";
          }

          // Split-type - text animation library
          if (id.includes("node_modules/split-type/")) {
            return "split-type-vendor";
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

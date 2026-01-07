import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heebo: ['Heebo', 'sans-serif'],
        display: ['Clash Display', 'Heebo', 'sans-serif'],
      },
      fontSize: {
        // Fluid typography using clamp() for responsive scaling
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.35vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.6vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.25rem + 1.25vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 1.75rem + 2.5vw, 3rem)',
        'fluid-5xl': 'clamp(3rem, 2rem + 5vw, 4rem)',
        'fluid-hero': 'clamp(2.5rem, 2rem + 4vw, 5rem)',
      },
      containers: {
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      minWidth: {
        'touch': '44px',
      },
      minHeight: {
        'touch': '44px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
        lg: {
          css: {
            maxWidth: 'none',
          },
        },
        xl: {
          css: {
            maxWidth: 'none',
          },
        },
        '2xl': {
          css: {
            maxWidth: 'none',
          },
        },
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          // Bright variant for decorative elements on dark backgrounds only
          bright: "hsl(var(--primary-bright))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        glass: "hsl(var(--glass))",
        "hero-bg": "hsl(var(--hero-bg))",
        "hero-fg": "hsl(var(--hero-fg))",
        "neon-pink": "hsl(var(--neon-pink))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Common project colors - replace arbitrary hex values with these
        nexo: {
          dark: "#0a0a0a",      // Near black - footer, darkest bg
          charcoal: "#1a1a1a", // Very dark gray - text, buttons, borders
          graphite: "#2a2a2a", // Dark gray - hover states
          slate: "#3d3d3d",    // Dark gray - body text
          steel: "#4a4a4a",    // Medium-dark gray - secondary text
          ash: "#6a6a6a",      // Medium gray - muted text
          silver: "#9a9a9a",   // Light gray - placeholder text
          smoke: "#c0c0c0",    // Very light gray - subtle elements
          mist: "#e5e5e5",     // Border gray
          light: "#FAF9F6",    // Off-white/cream - light backgrounds
          section: "#FAFAFA",  // Light section bg
        },
        brand: {
          purple: "#8330c2",    // Primary purple accent
          "purple-light": "#9e4cdc", // Lighter purple
          violet: "#a474ff",   // Light violet
          cyan: "#17f1d1",     // Cyan/teal accent
          orange: "#FFAB70",   // Orange accent
        },
        // Accessible color variants - use when contrast is critical
        accessible: {
          // Note: The default --primary is now WCAG AA compliant (4.6:1) in light mode
          // These variants are for special cases requiring even higher contrast
          // For WCAG AAA (7:1 contrast), use on light backgrounds
          "primary-aaa": "#9E006F",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Standardized transition timing functions
      // Usage: ease-nexo-default, ease-nexo-smooth, etc.
      transitionTimingFunction: {
        'nexo-default': 'cubic-bezier(0.4, 0, 0.2, 1)',     // Standard smooth ease-out
        'nexo-smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',  // Natural ease
        'nexo-snappy': 'cubic-bezier(0.4, 0, 0, 1)',        // Fast, responsive
        'nexo-enter': 'cubic-bezier(0, 0, 0.2, 1)',         // Entrance animations
        'nexo-exit': 'cubic-bezier(0.4, 0, 1, 1)',          // Exit animations
        'nexo-expressive': 'cubic-bezier(0.16, 1, 0.3, 1)', // Dramatic, hero sections
        'nexo-gentle': 'cubic-bezier(0.22, 1, 0.36, 1)',    // Subtle UI changes
      },
      keyframes: {
        "accordion-down": {
          from: {
            opacity: "0",
            transform: "scaleY(0)",
          },
          to: {
            opacity: "1",
            transform: "scaleY(1)",
          },
        },
        "accordion-up": {
          from: {
            opacity: "1",
            transform: "scaleY(1)",
          },
          to: {
            opacity: "0",
            transform: "scaleY(0)",
          },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%, -40%) scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        "shimmer-slide": "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
        spotlight: "spotlight 2s ease 0.75s 1 forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
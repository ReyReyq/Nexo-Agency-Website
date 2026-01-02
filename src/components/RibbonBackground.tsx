import { useMemo, memo } from "react";

/**
 * RibbonBackground - High-Contrast, Gradient Vector Ribbons
 *
 * Design: Bold, sharp, gradient-filled strokes that act as a premium
 * graphical background element. No blurs, high visibility.
 *
 * Performance optimizations:
 * - Wrapped with React.memo to prevent re-renders when parent state changes
 * - Uses useMemo for stable style objects to prevent unnecessary re-renders
 * - Unique gradient IDs to prevent conflicts with other ribbon components
 * - CSS handles reduced-motion preference directly (no JS state needed)
 */

// Memoized animation styles to prevent object recreation on re-renders
const animationStyles = {
  ribbon1: { animationDelay: "0s" },
  ribbon2: { animationDelay: "0.3s", animationDuration: "12s" },
  ribbon3: { animationDelay: "0.6s", animationDuration: "14s" },
  ribbon4: { animationDelay: "1s", animationDuration: "13s" },
  ribbon5: { animationDelay: "1.3s", animationDuration: "11s" },
  ribbon6: { animationDelay: "1.5s", animationDuration: "15s" },
  ribbon7: { animationDelay: "1.8s", animationDuration: "14s" },
  ribbon8: { animationDelay: "2s", animationDuration: "13s" },
  ribbon9: { animationDelay: "2.2s", animationDuration: "12s" },
} as const;

const RibbonBackground = memo(() => {
  // Memoize CSS to prevent re-injection on re-renders
  const cssStyles = useMemo(() => `
    .ribbon-background {
      position: absolute;
      inset: 0;
      overflow: visible;
      pointer-events: none;
      z-index: 0;
    }

    .ribbon-svg {
      position: absolute;
      width: 100%;
      height: 200%;
      min-width: 1200px;
      top: 0;
    }

    .ribbon-path {
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      mix-blend-mode: multiply;
    }

    @keyframes ribbonFloat {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(20px) rotate(0.5deg);
      }
    }

    @keyframes ribbonDraw {
      from {
        stroke-dashoffset: 4000;
      }
      to {
        stroke-dashoffset: 0;
      }
    }

    .ribbon-anim {
      stroke-dasharray: 4000;
      stroke-dashoffset: 0;
      animation:
        ribbonDraw 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards,
        ribbonFloat 10s ease-in-out infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      .ribbon-anim {
        animation: none;
        transition: none;
      }
    }
  `, []);

  return (
    <div className="ribbon-background">
      <style>{cssStyles}</style>

      <svg
        className="ribbon-svg"
        viewBox="0 0 1440 1800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* Gradient 1: Deep Purple to Hot Pink - unique ID for RibbonBackground */}
          <linearGradient id="ribbon-grad-purple-pink" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" /> {/* Violet-600 */}
            <stop offset="100%" stopColor="#DB2777" /> {/* Pink-600 */}
          </linearGradient>

          {/* Gradient 2: Royal Blue to Cyan - unique ID for RibbonBackground */}
          <linearGradient id="ribbon-grad-blue-cyan" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" /> {/* Blue-600 */}
            <stop offset="100%" stopColor="#0891B2" /> {/* Cyan-600 */}
          </linearGradient>

          {/* Gradient 3: Subtle Gold/Orange - unique ID for RibbonBackground */}
          <linearGradient id="ribbon-grad-warm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* ========== CENTER IS CLEAR (420-1020px x 250-650px) ========== */}

        {/*
           Ribbon 1: TOP-LEFT - Sweeping Arc
           Graceful S-curve from left edge, staying in corner
        */}
        <path
          className="ribbon-path ribbon-anim"
          d="M -50,100 Q 150,30 280,80 Q 410,130 350,220"
          stroke="url(#ribbon-grad-purple-pink)"
          strokeWidth="55"
          opacity="0.5"
          style={animationStyles.ribbon1}
        />

        {/*
           Ribbon 2: TOP-RIGHT - Cascading Loop
           Flowing loop from top-right corner with pretzel overlap
        */}
        <path
          className="ribbon-path ribbon-anim"
          d="M 1490,50 Q 1350,30 1280,100 Q 1210,170 1260,250 Q 1310,330 1220,300"
          stroke="url(#ribbon-grad-purple-pink)"
          strokeWidth="65"
          opacity="0.45"
          style={animationStyles.ribbon2}
        />

        {/*
           Ribbon 3: LEFT EDGE - Vertical Accent
           S-curve along left edge connecting top and bottom zones
        */}
        <path
          className="ribbon-path ribbon-anim"
          d="M -40,350 Q 100,380 130,480 Q 160,580 80,650 Q 0,720 100,800"
          stroke="url(#ribbon-grad-blue-cyan)"
          strokeWidth="50"
          opacity="0.4"
          style={animationStyles.ribbon3}
        />

        {/*
           Ribbon 4: BOTTOM-LEFT - Rising Wave
           Upward wave from bottom-left corner
        */}
        <path
          className="ribbon-path ribbon-anim"
          d="M -30,950 Q 100,870 180,780 Q 260,690 340,740 Q 420,790 380,700"
          stroke="url(#ribbon-grad-blue-cyan)"
          strokeWidth="60"
          opacity="0.5"
          style={animationStyles.ribbon4}
        />

        {/*
           Ribbon 5: BOTTOM-RIGHT - Elegant Swoop
           Smooth curve from bottom-right toward center-bottom
        */}
        <path
          className="ribbon-path ribbon-anim"
          d="M 1500,950 Q 1400,880 1320,800 Q 1240,720 1140,770 Q 1040,820 1000,740"
          stroke="url(#ribbon-grad-warm)"
          strokeWidth="55"
          opacity="0.55"
          style={animationStyles.ribbon5}
        />

        {/* ========== CONTINUATION RIBBONS INTO ABOUT SECTION ========== */}

        {/*
           Ribbon 6: LEFT EDGE CONTINUATION - Flowing into AboutSection
           S-curve continuing from left side into the next section
        */}
        <path
          className="ribbon-path ribbon-anim"
          d="M 100,800 Q 180,900 120,1000 Q 60,1100 150,1200 Q 240,1300 180,1400"
          stroke="url(#ribbon-grad-purple-pink)"
          strokeWidth="50"
          opacity="0.4"
          style={animationStyles.ribbon6}
        />

        {/*
           Ribbon 7: RIGHT EDGE CONTINUATION - Flowing diagonal
           Sweeping curve on right side continuing into AboutSection
        */}
        <path
          className="ribbon-path ribbon-anim"
          d="M 1320,800 Q 1400,900 1350,1050 Q 1300,1200 1380,1350 Q 1460,1500 1380,1600"
          stroke="url(#ribbon-grad-blue-cyan)"
          strokeWidth="55"
          opacity="0.45"
          style={animationStyles.ribbon7}
        />

        {/*
           Ribbon 8: BOTTOM CENTER-LEFT - Subtle accent
           Gentle wave in the lower AboutSection area
        */}
        <path
          className="ribbon-path ribbon-anim"
          d="M -40,1100 Q 100,1150 200,1250 Q 300,1350 250,1450"
          stroke="url(#ribbon-grad-warm)"
          strokeWidth="45"
          opacity="0.35"
          style={animationStyles.ribbon8}
        />

        {/*
           Ribbon 9: BOTTOM CENTER-RIGHT - Flowing accent
           Complements the left side ribbon
        */}
        <path
          className="ribbon-path ribbon-anim"
          d="M 1490,1200 Q 1350,1280 1280,1400 Q 1210,1520 1300,1600"
          stroke="url(#ribbon-grad-purple-pink)"
          strokeWidth="48"
          opacity="0.38"
          style={animationStyles.ribbon9}
        />

      </svg>
    </div>
  );
});

RibbonBackground.displayName = 'RibbonBackground';

export default RibbonBackground;

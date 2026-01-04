import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { LucideIcon } from "lucide-react";

interface ValueItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface OrbitValuesProps {
  values: ValueItem[];
  centerText?: string;
  centerSubtext?: string;
}

const OrbitValues = ({ values, centerText = "NEXO", centerSubtext = "הערכים שלנו" }: OrbitValuesProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Slow continuous rotation
  useEffect(() => {
    if (isPaused || activeIndex !== null) return;

    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.3) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [isPaused, activeIndex]);

  const handleCardClick = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const getCardPosition = (index: number, total: number) => {
    const angle = (index * (360 / total) + rotation) * (Math.PI / 180);
    const radius = 280; // Distance from center
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y, angle: index * (360 / total) + rotation };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[450px] sm:h-[550px] md:h-[700px] flex items-center justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        {values.map((_, index) => {
          const pos = getCardPosition(index, values.length);
          const centerX = containerRef.current?.clientWidth ? containerRef.current.clientWidth / 2 : 350;
          const centerY = 350;
          return (
            <motion.line
              key={`line-${index}`}
              x1={centerX}
              y1={centerY}
              x2={centerX + pos.x}
              y2={centerY + pos.y}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: 1,
                opacity: activeIndex === null ? 0.5 : activeIndex === index ? 1 : 0.1
              }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
        {/* Orbit circle */}
        <motion.circle
          cx="50%"
          cy="350"
          r="280"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeDasharray="8 8"
          opacity={0.2}
          animate={{ rotate: rotation }}
          style={{ transformOrigin: "center" }}
        />
      </svg>

      {/* Center element */}
      <motion.div
        className="absolute z-20 flex flex-col items-center justify-center"
        animate={{
          scale: activeIndex !== null ? 0.8 : 1,
          opacity: activeIndex !== null ? 0.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/30 flex items-center justify-center">
          <div className="text-center">
            <span className="text-2xl font-black text-primary">{centerText}</span>
            <p className="text-xs text-hero-fg/60 mt-1">{centerSubtext}</p>
          </div>
        </div>
      </motion.div>

      {/* Orbiting cards */}
      {values.map((value, index) => {
        const pos = getCardPosition(index, values.length);
        const isActive = activeIndex === index;
        const IconComponent = value.icon;

        return (
          <motion.div
            key={value.title}
            className="absolute cursor-pointer"
            style={{
              left: "50%",
              top: "50%",
            }}
            animate={{
              x: isActive ? -100 : pos.x - 50,
              y: isActive ? -100 : pos.y - 50,
              scale: isActive ? 1.5 : 1,
              zIndex: isActive ? 30 : 10,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            onClick={() => handleCardClick(index)}
          >
            <motion.div
              className={`
                w-[100px] h-[100px] rounded-2xl
                ${isActive ? 'w-[200px] h-[200px]' : ''}
                bg-hero-bg/80 backdrop-blur-md border border-primary/20
                flex flex-col items-center justify-center
                hover:border-primary/50 transition-colors
                shadow-lg shadow-primary/5
              `}
              animate={{
                filter: activeIndex !== null && !isActive ? "blur(4px)" : "blur(0px)",
                opacity: activeIndex !== null && !isActive ? 0.4 : 1,
              }}
              whileHover={{ scale: isActive ? 1 : 1.1 }}
            >
              {/* Icon */}
              <motion.div
                className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-2"
                animate={{
                  scale: isActive ? 1.2 : 1,
                  rotate: isActive ? 360 : 0
                }}
                transition={{ duration: 0.5 }}
              >
                <IconComponent className="w-6 h-6 text-primary" />
              </motion.div>

              {/* Title */}
              <motion.h3
                className="text-sm font-bold text-hero-fg text-center px-2"
                animate={{ scale: isActive ? 0.9 : 1 }}
              >
                {value.title}
              </motion.h3>

              {/* Description - only visible when active */}
              <AnimatePresence>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-xs text-hero-fg/70 text-center px-4 mt-2 leading-relaxed"
                  >
                    {value.desc}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Glow effect when active */}
            {isActive && (
              <motion.div
                className="absolute inset-0 -z-10 rounded-2xl bg-primary/20 blur-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, scale: 0.8 }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Click hint */}
      <motion.p
        className="absolute bottom-4 text-sm text-hero-fg/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: activeIndex === null ? 1 : 0 }}
      >
        לחצו על ערך כדי לקרוא עוד
      </motion.p>

      {/* Active card overlay for mobile/better readability */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-hero-bg/50 backdrop-blur-sm z-25 pointer-events-none"
            onClick={() => setActiveIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrbitValues;

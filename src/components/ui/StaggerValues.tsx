import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";

// Card sizing - responsive breakpoints
const CARD_SIZE_LG = 340;
const CARD_SIZE_MD = 280;
const CARD_SIZE_SM = 240;

// Border and corner styling
const BORDER_SIZE = 1;
const CORNER_CLIP = 40;
const CORNER_LINE_LEN = Math.sqrt(
  CORNER_CLIP * CORNER_CLIP + CORNER_CLIP * CORNER_CLIP
);

// Animation values
const ROTATE_DEG = 2.5;
const STAGGER = 15;
const CENTER_STAGGER = -50;
const SECTION_HEIGHT = 550;

// Types
export interface ValueItem {
  title: string;
  desc: string;
}

interface StaggerValuesProps {
  values: ValueItem[];
  className?: string;
}

interface ValueCardProps {
  position: number;
  value: ValueItem & { tempId: number };
  handleMove: (position: number) => void;
  cardSize: number;
}

export const StaggerValues: React.FC<StaggerValuesProps> = ({ values, className = "" }) => {
  const [cardSize, setCardSize] = useState(CARD_SIZE_LG);
  const [valueItems, setValueItems] = useState<(ValueItem & { tempId: number })[]>(
    values.map((v, i) => ({ ...v, tempId: i }))
  );

  const handleMove = (position: number) => {
    const copy = [...valueItems];

    if (position > 0) {
      for (let i = position; i > 0; i--) {
        const firstEl = copy.shift();
        if (!firstEl) return;
        copy.push({ ...firstEl, tempId: Math.random() });
      }
    } else {
      for (let i = position; i < 0; i++) {
        const lastEl = copy.pop();
        if (!lastEl) return;
        copy.unshift({ ...lastEl, tempId: Math.random() });
      }
    }

    setValueItems(copy);
  };

  useEffect(() => {
    const handleSetCardSize = () => {
      const isLarge = window.matchMedia("(min-width: 768px)").matches;
      const isMedium = window.matchMedia("(min-width: 480px)").matches;
      setCardSize(isLarge ? CARD_SIZE_LG : isMedium ? CARD_SIZE_MD : CARD_SIZE_SM);
    };

    handleSetCardSize();
    window.addEventListener("resize", handleSetCardSize);
    return () => window.removeEventListener("resize", handleSetCardSize);
  }, []);

  // Update valueItems when values prop changes
  useEffect(() => {
    setValueItems(values.map((v, i) => ({ ...v, tempId: i })));
  }, [values]);

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height: SECTION_HEIGHT }}
    >
      {valueItems.map((v, idx) => {
        let position = 0;

        if (valueItems.length % 2) {
          position = idx - (valueItems.length + 1) / 2;
        } else {
          position = idx - valueItems.length / 2;
        }

        return (
          <ValueCard
            key={v.tempId}
            value={v}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}

      {/* Navigation Arrows */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-4">
        <button
          onClick={() => handleMove(1)}
          className="group grid h-12 w-12 place-content-center rounded-full border border-primary/20 bg-hero-bg/60 backdrop-blur-sm text-hero-fg/70 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110"
          aria-label="Previous value"
        >
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button
          onClick={() => handleMove(-1)}
          className="group grid h-12 w-12 place-content-center rounded-full border border-primary/20 bg-hero-bg/60 backdrop-blur-sm text-hero-fg/70 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110"
          aria-label="Next value"
        >
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

const ValueCard: React.FC<ValueCardProps> = ({ position, value, handleMove, cardSize }) => {
  const isActive = position === 0;

  return (
    <motion.div
      initial={false}
      onClick={() => handleMove(position)}
      className="absolute left-1/2 top-1/2 cursor-pointer"
      animate={{
        width: cardSize,
        height: cardSize,
        x: `calc(-50% + ${position * (cardSize / 1.5)}px)`,
        y: `calc(-50% + ${
          isActive ? CENTER_STAGGER : position % 2 ? STAGGER : -STAGGER
        }px)`,
        rotate: isActive ? 0 : position % 2 ? ROTATE_DEG : -ROTATE_DEG,
        zIndex: isActive ? 10 : 0,
      }}
      transition={{
        type: "spring",
        mass: 3,
        stiffness: 400,
        damping: 50,
      }}
    >
      {/* Wrapper for shadow to avoid clip-path issues */}
      <div 
        className="relative w-full h-full"
        style={{ 
          filter: isActive ? "drop-shadow(0 20px 40px hsl(var(--primary) / 0.2))" : "none"
        }}
      >
        <div
          className={`
            w-full h-full p-6 sm:p-8 transition-colors duration-500 flex flex-col
            ${isActive
              ? "bg-primary border-primary/50"
              : "bg-hero-bg/80 backdrop-blur-md border-primary/20"
            }
          `}
          style={{
            borderWidth: BORDER_SIZE,
            borderStyle: "solid",
            clipPath: `polygon(0% 0%, calc(100% - ${CORNER_CLIP}px) 0%, 100% ${CORNER_CLIP}px, 100% 100%, 0% 100%)`,
          }}
        >
          {/* Glass overlay for inactive cards */}
          {!isActive && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          )}

          {/* Title */}
          <h3
            className={`text-lg sm:text-xl font-bold mb-3 mt-4 ${
              isActive ? "text-primary-foreground" : "text-hero-fg"
            }`}
          >
            {value.title}
          </h3>

          {/* Description */}
          <p
            className={`text-sm sm:text-base leading-relaxed ${
              isActive ? "text-primary-foreground/80" : "text-hero-fg/60"
            }`}
          >
            {value.desc}
          </p>

          {/* Active indicator dot */}
          {isActive && (
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-foreground/50"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            />
          )}

          {/* THE FIX: The diagonal corner line - placed outside the clipPath div but inside the wrapper */}
          <span
            className={`${isActive ? "bg-primary-foreground/30" : "bg-primary/30"}`}
            style={{
              position: "absolute",
              right: -1, 
              top: CORNER_CLIP - (BORDER_SIZE * 1.5),
              width: CORNER_LINE_LEN + 2,
              height: BORDER_SIZE,
              transform: "rotate(-45deg)",
              transformOrigin: "top right",
              zIndex: 20
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default StaggerValues;

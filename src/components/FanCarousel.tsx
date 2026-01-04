import { useState, useRef, memo, useMemo, useCallback, useEffect } from "react";
import { motion, useMotionValue, animate, PanInfo, AnimationPlaybackControls } from "framer-motion";

interface CardData {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  primaryColor: string;
  stat?: { value: string; label: string };
}

interface FanCarouselProps {
  cards: CardData[];
  onCardChange?: (index: number) => void;
}

// Memoized card component for better performance
const CarouselCard = memo(({
  card,
  index,
  activeIndex,
  style,
  isActive,
  onClick,
}: {
  card: CardData;
  index: number;
  activeIndex: number;
  style: ReturnType<typeof getCardStyle>;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        transformOrigin: "center bottom",
        zIndex: style.zIndex,
        willChange: isActive ? "transform" : "auto",
      }}
      initial={false}
      animate={{
        x: style.x,
        y: style.y,
        rotate: style.rotate,
        scale: style.scale,
        opacity: style.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 35,
        mass: 0.8,
      }}
      onClick={onClick}
      whileHover={isActive ? { scale: style.scale + 0.02, y: style.y - 5 } : {}}
    >
      {/* Card - Clean, editorial design */}
      <div
        className={`w-[220px] h-[300px] sm:w-[260px] sm:h-[340px] md:w-[280px] md:h-[360px] rounded-2xl overflow-hidden transform-gpu ${
          isActive ? "shadow-2xl" : "shadow-lg"
        }`}
        style={{
          background: card.color,
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Card content - Typography focused */}
        <div className="relative w-full h-full p-5 sm:p-6 md:p-7 flex flex-col justify-end" dir="rtl">
          {/* Subtle gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

          {/* Card number - editorial style */}
          <span className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 text-[3rem] sm:text-[3.5rem] md:text-[4rem] font-black text-white/15 leading-none select-none">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Content */}
          <div className="relative z-10">
            <span className="text-white/70 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block tracking-wide">
              {card.subtitle}
            </span>
            <h3 className="text-lg sm:text-xl md:text-[1.5rem] font-bold text-white mb-2 sm:mb-3 leading-[1.2] tracking-tight">
              {card.title}
            </h3>
            <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
              {card.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

CarouselCard.displayName = "CarouselCard";

// Calculate card positions - extracted for performance
const getCardStyle = (index: number, activeIndex: number, totalCards: number) => {
  const offset = index - activeIndex;
  const absOffset = Math.abs(offset);

  // Fan effect - cards spread out with rotation
  const rotation = offset * 12;
  const translateX = offset * 90;
  const translateY = absOffset * 12;
  const scale = 1 - absOffset * 0.08;
  const zIndex = totalCards - absOffset;
  const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.2;

  return {
    x: translateX,
    y: translateY,
    rotate: rotation,
    scale,
    zIndex,
    opacity,
  };
};

const FanCarousel = ({ cards, onCardChange }: FanCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(1); // Start with middle card
  const containerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);

  // Track active animation for cleanup
  const animationRef = useRef<AnimationPlaybackControls | null>(null);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      // Cancel any active drag animation on unmount
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, []);

  // Memoized drag end handler
  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    let newIndex = activeIndex;

    if (offset < -threshold || velocity < -500) {
      newIndex = Math.min(activeIndex + 1, cards.length - 1);
    } else if (offset > threshold || velocity > 500) {
      newIndex = Math.max(activeIndex - 1, 0);
    }

    setActiveIndex(newIndex);
    onCardChange?.(newIndex);

    // Cancel previous animation before starting new one
    if (animationRef.current) {
      animationRef.current.stop();
    }

    // Animate drag back to center and track for cleanup
    animationRef.current = animate(dragX, 0, { type: "spring", stiffness: 300, damping: 30 });
  }, [activeIndex, cards.length, onCardChange, dragX]);

  // Memoized card click handler
  const handleCardClick = useCallback((index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      onCardChange?.(index);
    }
  }, [activeIndex, onCardChange]);

  // Create stable click handlers for each card
  const cardClickHandlers = useMemo(() =>
    cards.map((_, index) => () => handleCardClick(index)),
    [cards, handleCardClick]
  );

  // Memoize card styles
  const cardStyles = useMemo(() =>
    cards.map((_, index) => getCardStyle(index, activeIndex, cards.length)),
    [activeIndex, cards.length]
  );

  return (
    <div className="relative w-full h-[340px] sm:h-[400px] md:h-[440px] px-4 sm:px-6 lg:px-8 flex items-center justify-center select-none">
      {/* Drag container */}
      <motion.div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: "1200px",
          x: dragX,
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        {cards.map((card, index) => (
          <CarouselCard
            key={card.id}
            card={card}
            index={index}
            activeIndex={activeIndex}
            style={cardStyles[index]}
            isActive={index === activeIndex}
            onClick={cardClickHandlers[index]}
          />
        ))}
      </motion.div>

      {/* Dots indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-2.5 md:gap-3 z-30">
        {cards.map((_, index) => (
          <motion.button
            key={index}
            onClick={cardClickHandlers[index]}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-300`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Go to card ${index + 1}`}
          >
            <span
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-6 sm:w-7 h-2 bg-gray-900"
                  : "w-2 h-2 bg-gray-400 hover:bg-gray-500"
              }`}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FanCarousel;

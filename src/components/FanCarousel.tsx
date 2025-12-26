import { useState, useRef, memo, useMemo } from "react";
import { motion, useMotionValue, animate, PanInfo } from "framer-motion";

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
        className={`w-[280px] h-[360px] rounded-2xl overflow-hidden transform-gpu ${
          isActive ? "shadow-2xl" : "shadow-lg"
        }`}
        style={{
          background: card.color,
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Card content - Typography focused */}
        <div className="relative w-full h-full p-7 flex flex-col justify-end" dir="rtl">
          {/* Subtle gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

          {/* Card number - editorial style */}
          <span className="absolute top-6 right-6 text-[4rem] font-black text-white/15 leading-none select-none">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Content */}
          <div className="relative z-10">
            <span className="text-white/70 text-sm font-medium mb-2 block tracking-wide">
              {card.subtitle}
            </span>
            <h3 className="text-[1.5rem] font-bold text-white mb-3 leading-[1.2] tracking-tight">
              {card.title}
            </h3>
            <p className="text-white/75 text-sm leading-relaxed">
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

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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

    // Animate drag back to center
    animate(dragX, 0, { type: "spring", stiffness: 300, damping: 30 });
  };

  const handleCardClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      onCardChange?.(index);
    }
  };

  // Memoize card styles
  const cardStyles = useMemo(() =>
    cards.map((_, index) => getCardStyle(index, activeIndex, cards.length)),
    [activeIndex, cards.length]
  );

  return (
    <div className="relative w-full h-[440px] flex items-center justify-center select-none">
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
            onClick={() => handleCardClick(index)}
          />
        ))}
      </motion.div>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-30">
        {cards.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleCardClick(index)}
            className={`rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-7 h-2 bg-gray-900"
                : "w-2 h-2 bg-gray-400 hover:bg-gray-500"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default FanCarousel;

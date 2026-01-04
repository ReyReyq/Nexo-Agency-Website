import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const CARD_SIZE_LG = 365;
const CARD_SIZE_SM = 290;

const BORDER_SIZE = 2;
const CORNER_CLIP = 50;
const CORNER_LINE_LEN = Math.sqrt(
  CORNER_CLIP * CORNER_CLIP + CORNER_CLIP * CORNER_CLIP
);

const ROTATE_DEG = 2.5;
const STAGGER = 15;
const CENTER_STAGGER = -65;
const SECTION_HEIGHT = 650;

export const StaggerTestimonials = () => {
  const [cardSize, setCardSize] = useState(CARD_SIZE_LG);
  const [testimonials, setTestimonials] = useState(TESTIMONIAL_DATA);

  const handleMove = (position: number) => {
    const copy = [...testimonials];
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
    setTestimonials(copy);
  };

  useEffect(() => {
    const handleSetCardSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? CARD_SIZE_LG : CARD_SIZE_SM);
    };
    handleSetCardSize();
    window.addEventListener("resize", handleSetCardSize);
    return () => window.removeEventListener("resize", handleSetCardSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-hero-bg py-20"
      style={{ height: SECTION_HEIGHT }}
    >
      <div className="container mx-auto px-6 text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-black text-hero-fg mb-4">
          מה הלקוחות <span className="text-gradient">מספרים</span>
        </h2>
      </div>

      <div className="relative h-[450px]">
        {testimonials.map((t, idx) => {
          let position = 0;
          if (testimonials.length % 2) {
            position = idx - (testimonials.length + 1) / 2;
          } else {
            position = idx - testimonials.length / 2;
          }

          return (
            <TestimonialCard
              key={t.tempId}
              testimonial={t}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-6">
        <button
          onClick={() => handleMove(1)}
          className="group grid h-14 w-14 place-content-center rounded-full border border-primary/20 bg-hero-bg/60 backdrop-blur-sm text-hero-fg/70 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button
          onClick={() => handleMove(-1)}
          className="group grid h-14 w-14 place-content-center rounded-full border border-primary/20 bg-hero-bg/60 backdrop-blur-sm text-hero-fg/70 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

const TestimonialCard = ({ position, testimonial, handleMove, cardSize }: any) => {
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
        y: `calc(-50% + ${isActive ? CENTER_STAGGER : position % 2 ? STAGGER : -STAGGER}px)`,
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
          filter: isActive ? "drop-shadow(0 20px 30px rgba(0,0,0,0.2))" : "none"
        }}
      >
        <div
          className={`
            w-full h-full p-8 transition-colors duration-500 flex flex-col justify-between
            ${isActive ? "bg-primary text-white" : "bg-white text-black"}
          `}
          style={{
            border: `${BORDER_SIZE}px solid black`,
            clipPath: `polygon(0% 0%, calc(100% - ${CORNER_CLIP}px) 0%, 100% ${CORNER_CLIP}px, 100% 100%, 0% 100%)`,
          }}
        >
          <div>
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${isActive ? "fill-white text-white" : "fill-primary text-primary"}`} />
              ))}
            </div>
            <p className={`text-lg md:text-xl font-medium italic leading-relaxed`}>
              "{testimonial.testimonial}"
            </p>
          </div>

          <div className="flex items-center gap-4 border-t border-current/10 pt-6">
            <img
              src={testimonial.imgSrc}
              alt={testimonial.by}
              className="h-12 w-12 rounded-full object-cover border-2 border-current"
            />
            <div className="text-right">
              <p className="font-bold">{testimonial.by}</p>
              <p className={`text-xs opacity-70`}>{testimonial.role}</p>
            </div>
          </div>

          {/* THE FIX: The diagonal corner line - placed outside the clipPath div but inside the wrapper */}
          <span
            className="absolute block bg-black"
            style={{
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

const TESTIMONIAL_DATA = [
  {
    tempId: 0,
    testimonial: "העבודה עם נקסו הייתה המהלך הכי חכם שעשינו השנה. האוטומציה שפיתחו לנו חסכה לנו עשרות שעות עבודה שבועיות.",
    by: "דנה רון",
    role: "מנכ״לית TechFlow",
    imgSrc: "/images/gallery/editorial-woman-smile.jpg",
  },
  {
    tempId: 1,
    testimonial: "האתר החדש שלנו הוא פשוט מכונת מכירות. אחוזי ההמרה עלו ב-40% תוך חודש אחד בלבד מההשקה.",
    by: "יוסי כהן",
    role: "סמנכ״ל שיווק, CloudNine",
    imgSrc: "/images/gallery/portrait-professional-man.jpg",
  },
  {
    tempId: 2,
    testimonial: "מיתוג חזק, שירות אישי ורמה מקצועית שלא פגשנו בארץ. נקסו הם לא ספקים, הם שותפים אמיתיים לדרך.",
    by: "מיכל לוי",
    role: "מייסדת StartupHub",
    imgSrc: "/images/gallery/editorial-woman-laughing.jpg",
  },
  {
    tempId: 3,
    testimonial: "הצ'אטבוט שנקסו בנו לנו מטפל ב-70% מהפניות שלנו באופן אוטומטי. הלקוחות מרוצים והצוות שלנו פנוי למשימות מורכבות.",
    by: "אבי שלום",
    role: "מנהל תפעול, GlobalEdge",
    imgSrc: "/images/gallery/portrait-business-man.jpg",
  }
];

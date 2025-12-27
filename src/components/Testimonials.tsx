import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Quote, ChevronRight, ChevronLeft, Star } from "lucide-react";

// Animation variants - defined outside component to prevent recreation
const testimonialVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
};

// Avatar images optimized to 150px with WebP format for small file sizes
// TODO: Consider converting external Unsplash URLs to local optimized images for better performance
const testimonials = [
  {
    name: "דנה כהן",
    role: "מנכ״לית, TechFlow",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80&fm=webp&fit=crop",
    content: "NEXO שינו לנו את הפנים של העסק. האתר החדש הכפיל את כמות הפניות תוך חודשיים. הצוות מקצועי, יצירתי ותמיד זמין. ממליצה בחום!",
    rating: 5,
  },
  {
    name: "יוסי לוי",
    role: "בעלים, CloudNine",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&fm=webp&fit=crop",
    content: "עבדנו עם הרבה סוכנויות, אבל NEXO זה משהו אחר לגמרי. הם לא רק בנו לנו אתר - הם הבינו את העסק שלנו ויצרו חוויה שמוכרת.",
    rating: 5,
  },
  {
    name: "מיכל אברהם",
    role: "סמנכ״לית שיווק, GrowthLabs",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80&fm=webp&fit=crop",
    content: "הפתרון של ה-AI שהם פיתחו לנו חסך לנו 20 שעות עבודה בשבוע. השירות יוצא דופן והתוצאות מדברות בעד עצמן.",
    rating: 5,
  },
  {
    name: "אבי שמעון",
    role: "מייסד, StartupHub",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&fm=webp&fit=crop",
    content: "המיתוג שקיבלנו מ-NEXO הפך אותנו ממותג סטארט-אפ קטן למותג שנראה כמו חברה גדולה. עבודה מקצועית ברמה הגבוהה ביותר.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Memoized navigate function - restarts interval after manual navigation
  const navigate = useCallback((dir: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDirection(dir);
    setCurrent((prev) => {
      if (dir === 1) return (prev + 1) % testimonials.length;
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
    // Restart the auto-advance interval after manual navigation
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
  }, []);

  // Memoized navigation handlers
  const handlePrev = useCallback(() => navigate(-1), [navigate]);
  const handleNext = useCallback(() => navigate(1), [navigate]);

  // Memoized dot click handler - restarts interval after manual navigation
  const handleDotClick = useCallback((index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    // Restart the auto-advance interval after manual navigation
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
  }, [current]);

  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <Quote className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-tight mb-4">
            מה הלקוחות
            <br />
            <span className="text-gradient">אומרים עלינו</span>
          </h2>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative min-h-[400px] flex items-center justify-center">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={testimonialVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-full"
              >
                <div className="glass rounded-3xl p-8 md:p-12 text-center">
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(testimonials[current].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star className="w-6 h-6 fill-primary text-primary" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-xl md:text-2xl lg:text-3xl text-foreground font-medium leading-relaxed mb-8">
                    "{testimonials[current].content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={testimonials[current].image}
                      alt={testimonials[current].name}
                      loading="lazy"
                      decoding="async"
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                    />
                    <div className="text-right">
                      <div className="font-bold text-foreground text-lg">
                        {testimonials[current].name}
                      </div>
                      <div className="text-muted-foreground">
                        {testimonials[current].role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current
                      ? "w-8 bg-primary"
                      : "w-2 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

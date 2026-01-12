import { memo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";
import type { LandingTestimonialsContent, LandingTestimonial } from "@/types/landingPage";

// Animation constants
const INITIAL_FADE_UP = { opacity: 0, y: 40 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const IN_VIEW_OPTIONS = { once: true, margin: "-100px" as const };

interface TestimonialCardProps {
  testimonial: LandingTestimonial;
  index: number;
  accentColor: string;
  isInView: boolean;
}

const TestimonialCard = memo(({ testimonial, index, accentColor, isInView }: TestimonialCardProps) => {
  const rotations = [-2, 1.5, -1, 2, -1.5];
  const rotation = rotations[index % rotations.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotation * 2 }}
      animate={isInView ? { opacity: 1, y: 0, rotate: rotation } : {}}
      whileHover={{ rotate: 0, scale: 1.03, y: -5 }}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.5 }}
      className="group relative"
    >
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-nexo-mist/50 h-full flex flex-col">
        {/* Quote Icon */}
        <Quote
          className="w-10 h-10 mb-4 opacity-20"
          style={{ color: accentColor }}
        />

        {/* Quote */}
        <p className="text-nexo-charcoal text-base sm:text-lg leading-relaxed mb-6 flex-1">
          "{testimonial.quote}"
        </p>

        {/* Rating */}
        {testimonial.rating && (
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < testimonial.rating!
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* Author */}
        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: accentColor }}
          >
            {testimonial.author.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-nexo-charcoal">{testimonial.author}</p>
            <p className="text-nexo-steel text-sm">
              {testimonial.role}
              {testimonial.company && ` | ${testimonial.company}`}
            </p>
          </div>
        </div>

        {/* Decorative accent */}
        <div
          className="absolute bottom-0 left-0 w-full h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </motion.div>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

export interface LandingTestimonialsProps {
  content: LandingTestimonialsContent;
  accentColor: string;
}

const LandingTestimonials = memo(({ content, accentColor }: LandingTestimonialsProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-white relative overflow-hidden"
      dir="rtl"
    >
      {/* Background decorations */}
      <div
        className="absolute top-20 right-20 w-64 h-64 rounded-full blur-[100px] opacity-10"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="absolute bottom-20 left-20 w-80 h-80 rounded-full blur-[120px] opacity-10"
        style={{ backgroundColor: accentColor }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={INITIAL_FADE_UP}
          animate={isInView ? ANIMATE_VISIBLE : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 w-20 mx-auto mb-6 origin-center"
            style={{ backgroundColor: accentColor }}
          />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-nexo-charcoal mb-4">
            {content.title}
          </h2>

          {content.subtitle && (
            <p className="text-nexo-steel text-lg sm:text-xl">
              {content.subtitle}
            </p>
          )}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {content.items.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              index={index}
              accentColor={accentColor}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

LandingTestimonials.displayName = 'LandingTestimonials';

export default LandingTestimonials;

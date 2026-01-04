import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import { LucideIcon } from "lucide-react";

interface ValueItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface ScrollTriggeredValuesProps {
  values: ValueItem[];
}

const ScrollTriggeredValues = ({ values }: ScrollTriggeredValuesProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {values.map((value, index) => (
            <ValueCard key={value.title} value={value} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const ValueCard = ({ value, index }: { value: { icon: LucideIcon; title: string; desc: string }; index: number }) => {
  const IconComponent = value.icon;

  return (
    <div className="group relative h-[450px] w-[450px] overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-hero-bg to-hero-bg border border-primary/20">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 transition-opacity duration-500 group-hover:opacity-40">
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-primary blur-3xl" />
      </div>

      {/* Number watermark */}
      <span className="absolute top-4 right-6 text-8xl font-black text-primary/10 transition-all duration-300 group-hover:text-primary/20">
        0{index + 1}
      </span>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-10">
        {/* Icon */}
        <motion.div
          className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
          whileHover={{ rotate: 10 }}
        >
          <IconComponent className="w-8 h-8 text-primary" />
        </motion.div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-black text-hero-fg mb-4">
          {value.title}
        </h3>

        {/* Description */}
        <p className="text-base md:text-lg text-hero-fg/70 leading-relaxed">
          {value.desc}
        </p>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent transition-colors duration-300 group-hover:border-primary/30" />
    </div>
  );
};

export default ScrollTriggeredValues;

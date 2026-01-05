import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Vibrant card colors for bento grid
export const bentoCardColors = [
  "bg-emerald-300",
  "bg-indigo-300",
  "bg-rose-300",
  "bg-amber-300",
  "bg-cyan-300",
];

// Arrow Icon for bento cards
const BentoArrowIcon = memo(({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
));

BentoArrowIcon.displayName = "BentoArrowIcon";

// Bento Spring Card component with 3 stacked layers
export interface BentoSpringCardProps {
  name: string;
  description: string;
  colorClass: string;
  index: number;
  href: string;
}

const BentoSpringCard = memo(({ name, description, colorClass, index, href }: BentoSpringCardProps) => {
  return (
    <Link to={href} className="block h-full w-full">
      <motion.div
        whileHover="hovered"
        className={`group h-full w-full border-2 border-black ${colorClass}`}
        dir="rtl"
      >
        {/* Layer 2 (middle) */}
        <motion.div
          initial={{ x: 0, y: 0 }}
          variants={{ hovered: { x: -5, y: -5 } }}
          transition={{ type: "spring", bounce: 0.5 }}
          className={`-m-0.5 h-full border-2 border-black ${colorClass}`}
        >
          {/* Layer 3 (top - main content) */}
          <motion.div
            initial={{ x: 0, y: 0 }}
            variants={{ hovered: { x: -5, y: -5 } }}
            transition={{ type: "spring", bounce: 0.5 }}
            className={`relative -m-0.5 flex h-full flex-col justify-between overflow-hidden border-2 border-black ${colorClass} p-3 md:p-4`}
          >
            {/* Arrow + Title */}
            <p className="flex items-center text-sm font-medium uppercase md:text-base">
              <BentoArrowIcon className="-mr-5 ml-1 h-4 w-4 opacity-0 transition-all duration-300 group-hover:mr-0 group-hover:opacity-100 md:h-5 md:w-5" />
              <span className="font-bold leading-tight">{name}</span>
            </p>

            {/* Description + Button */}
            <div>
              <p className="text-[11px] leading-relaxed line-clamp-2 transition-[margin] duration-300 group-hover:mb-8 md:text-xs md:line-clamp-3">
                {description}
              </p>
              <span className="absolute bottom-1 left-1 right-1 translate-y-full border-2 border-black bg-white px-2 py-1.5 text-xs font-bold uppercase text-center opacity-0 transition-all duration-300 hover:bg-black hover:text-white group-hover:translate-y-0 group-hover:opacity-100 md:bottom-1.5 md:left-1.5 md:right-1.5 md:px-3 md:py-2 md:text-sm">
                למידע נוסף
              </span>
            </div>

            {/* Rotating text circle in corner */}
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute -left-2 -top-2 h-12 w-12 md:h-14 md:w-14"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <defs>
                <path
                  id={`relatedCirclePath-${index}`}
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                />
              </defs>
              <text className="fill-black text-[10px] font-bold uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <textPath href={`#relatedCirclePath-${index}`}>
                  למידע נוסף * למידע נוסף * למידע נוסף *
                </textPath>
              </text>
            </motion.svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  );
});

BentoSpringCard.displayName = "BentoSpringCard";

export default BentoSpringCard;

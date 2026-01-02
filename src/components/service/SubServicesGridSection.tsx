import { memo, useMemo } from "react";
import { motion, MotionConfig } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import type { Service } from "@/data/services";

// Vibrant card colors
const cardColors = [
  "bg-emerald-300",
  "bg-indigo-300",
  "bg-rose-300",
  "bg-amber-300",
  "bg-cyan-300",
];

interface SubServicesGridSectionProps {
  service: Service;
}

// Arrow Icon for cards
const ArrowIcon = memo(({ className }: { className?: string }) => (
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

ArrowIcon.displayName = "ArrowIcon";

// Title Card component - small card for the section title
interface TitleCardProps {
  accentColor: string;
}

const TitleCard = memo(({ accentColor }: TitleCardProps) => {
  return (
    <div
      className="flex h-full w-full items-center justify-center border-2 border-black bg-violet-200 p-3"
      dir="rtl"
    >
      <h2 className="text-center text-sm font-bold leading-tight md:text-base">
        <span style={{ color: accentColor }}>השירותים</span>
        <br />
        <span className="text-neutral-800">שלנו בתחום</span>
      </h2>
    </div>
  );
});

TitleCard.displayName = "TitleCard";

// Compact Spring Card component with 3 stacked layers
interface SpringCardProps {
  name: string;
  description: string;
  colorClass: string;
  index: number;
  href?: string;
}

const SpringCard = memo(({ name, description, colorClass, index, href }: SpringCardProps) => {
  const CardWrapper = href ? Link : "div";
  const wrapperProps = href ? { to: href } : {};

  return (
    <MotionConfig transition={{ type: "spring", bounce: 0.5 }}>
      <CardWrapper {...wrapperProps as any} className="block h-full w-full">
        <motion.div
          whileHover="hovered"
          className={`group h-full w-full border-2 border-black ${colorClass}`}
          dir="rtl"
        >
          {/* Layer 2 (middle) */}
          <motion.div
            initial={{ x: 0, y: 0 }}
            variants={{ hovered: { x: -5, y: -5 } }}
            className={`-m-0.5 h-full border-2 border-black ${colorClass}`}
          >
            {/* Layer 3 (top - main content) */}
            <motion.div
              initial={{ x: 0, y: 0 }}
              variants={{ hovered: { x: -5, y: -5 } }}
              className={`relative -m-0.5 flex h-full flex-col justify-between overflow-hidden border-2 border-black ${colorClass} p-3 md:p-4`}
            >
              {/* Arrow + Title */}
              <p className="flex items-center text-sm font-medium uppercase md:text-base">
                <ArrowIcon className="-mr-5 ml-1 h-4 w-4 opacity-0 transition-all duration-300 group-hover:mr-0 group-hover:opacity-100 md:h-5 md:w-5" />
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
                    id={`circlePath-${index}`}
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  />
                </defs>
                <text className="fill-black text-[10px] font-bold uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <textPath href={`#circlePath-${index}`}>
                    למידע נוסף • למידע נוסף • למידע נוסף •
                  </textPath>
                </text>
              </motion.svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </CardWrapper>
    </MotionConfig>
  );
});

SpringCard.displayName = "SpringCard";

// E-commerce CTA Banner component - Bento style card with 3 stacked layers
const EcommerceCTA = memo(() => {
  return (
    <Link to="/services/ecommerce" className="mt-12 block md:mt-16">
      <MotionConfig transition={{ type: "spring", bounce: 0.5 }}>
        <motion.div
          whileHover="hovered"
          className="group h-24 w-full rounded-2xl border-2 border-black bg-emerald-400 md:h-28 md:rounded-3xl"
          dir="rtl"
        >
          {/* Layer 2 (middle) */}
          <motion.div
            initial={{ x: 0, y: 0 }}
            variants={{ hovered: { x: -6, y: -6 } }}
            className="-m-0.5 h-full rounded-2xl border-2 border-black bg-emerald-400 md:rounded-3xl"
          >
            {/* Layer 3 (top - main content) */}
            <motion.div
              initial={{ x: 0, y: 0 }}
              variants={{ hovered: { x: -6, y: -6 } }}
              className="relative -m-0.5 flex h-full items-center justify-between rounded-2xl border-2 border-black bg-emerald-400 px-5 py-4 md:rounded-3xl md:px-8 md:py-5"
            >
              {/* Content */}
              <div className="flex items-center gap-3 md:gap-4">
                {/* Shopping cart icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-emerald-300 text-black transition-colors duration-300 md:h-14 md:w-14">
                  <ShoppingCart className="h-6 w-6 md:h-7 md:w-7" />
                </div>

                {/* Text */}
                <div className="flex flex-col">
                  <span className="text-base font-bold text-black md:text-lg">
                    מחפשים חנות אונליין?
                  </span>
                  <span className="text-sm text-black/70 md:text-base">
                    צפו בשירותי המסחר האלקטרוני שלנו
                  </span>
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="flex items-center gap-2 text-black">
                <span className="hidden text-sm font-bold md:inline">לשירותי E-commerce</span>
                <ArrowIcon className="-mr-5 h-6 w-6 opacity-0 transition-all duration-300 group-hover:mr-0 group-hover:opacity-100 md:h-7 md:w-7" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </MotionConfig>
    </Link>
  );
});

EcommerceCTA.displayName = "EcommerceCTA";

// Main component
const SubServicesGridSection = memo(({ service }: SubServicesGridSectionProps) => {
  // Get sub-services
  const subServices = service.subServices || [];

  // Prepare card data with colors and hrefs
  const cardData = useMemo(() => {
    return subServices.map((sub, index) => ({
      ...sub,
      colorClass: cardColors[index % cardColors.length],
      href: `/services/${service.slug}/${sub.id}`,
    }));
  }, [subServices, service.slug]);

  // Don't render if no items
  if (cardData.length === 0) {
    return null;
  }

  // Bento Layout (RTL - right to left, visually):
  // +----------+------------------+------------------+
  // | TITLE    |                  |                  |
  // | (small)  |  Service 2       |  Service 1       |
  // +----------+  (tall)          |  (tall)          |
  // | Service 3|                  |                  |
  // +----------+------------------+------------------+
  // |              Service 5      |     Service 4    |
  // +-----------------------------+------------------+

  return (
    <section className="bg-neutral-100 px-4 py-12 md:px-8 md:py-16" dir="rtl">
      <div className="mx-auto max-w-6xl">
        {/* Bento Grid Layout - Desktop */}
        <div
          className="hidden md:grid gap-3 md:gap-4"
          style={{
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gridTemplateRows: "130px 185px 185px",
            gridTemplateAreas: `
              "title s2 s1 s1"
              "s3 s2 s1 s1"
              "s5 s5 s4 s4"
            `,
            height: "540px",
          }}
        >
          {/* Title Card - top right (first in RTL) */}
          <div style={{ gridArea: "title" }}>
            <TitleCard accentColor={service.accentColor} />
          </div>

          {/* Service 1 - Large card spanning 2x2 */}
          {cardData[0] && (
            <div style={{ gridArea: "s1" }}>
              <SpringCard
                name={cardData[0].name}
                description={cardData[0].description}
                colorClass={cardData[0].colorClass}
                index={0}
                href={cardData[0].href}
              />
            </div>
          )}

          {/* Service 2 - Tall card spanning 2 rows */}
          {cardData[1] && (
            <div style={{ gridArea: "s2" }}>
              <SpringCard
                name={cardData[1].name}
                description={cardData[1].description}
                colorClass={cardData[1].colorClass}
                index={1}
                href={cardData[1].href}
              />
            </div>
          )}

          {/* Service 3 - Small card */}
          {cardData[2] && (
            <div style={{ gridArea: "s3" }}>
              <SpringCard
                name={cardData[2].name}
                description={cardData[2].description}
                colorClass={cardData[2].colorClass}
                index={2}
                href={cardData[2].href}
              />
            </div>
          )}

          {/* Service 4 - Wide card */}
          {cardData[3] && (
            <div style={{ gridArea: "s4" }}>
              <SpringCard
                name={cardData[3].name}
                description={cardData[3].description}
                colorClass={cardData[3].colorClass}
                index={3}
                href={cardData[3].href}
              />
            </div>
          )}

          {/* Service 5 - Wide card */}
          {cardData[4] && (
            <div style={{ gridArea: "s5" }}>
              <SpringCard
                name={cardData[4].name}
                description={cardData[4].description}
                colorClass={cardData[4].colorClass}
                index={4}
                href={cardData[4].href}
              />
            </div>
          )}
        </div>

        {/* Mobile Layout - Stacked cards */}
        <div className="md:hidden flex flex-col gap-3">
          {/* Title Card */}
          <div className="h-16">
            <TitleCard accentColor={service.accentColor} />
          </div>

          {/* Service Cards */}
          {cardData.slice(0, 5).map((item, index) => (
            <div key={item.id} className="h-[180px]">
              <SpringCard
                name={item.name}
                description={item.description}
                colorClass={item.colorClass}
                index={index}
                href={item.href}
              />
            </div>
          ))}
        </div>

        {/* E-commerce CTA - Only show on web-development page */}
        {service.id === "web-development" && <EcommerceCTA />}
      </div>
    </section>
  );
});

SubServicesGridSection.displayName = "SubServicesGridSection";

export default SubServicesGridSection;

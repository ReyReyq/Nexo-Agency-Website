import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Ear, Users, RefreshCw, TrendingUp, LucideIcon } from "lucide-react";

interface Principle {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
}

const principles: Principle[] = [
  {
    icon: Ear,
    title: "הקשבה לפני הכל",
    desc: "לפני שאנחנו מתחילים לעצב או לפתח, אנחנו מקשיבים. מבינים את העסק שלכם מבפנים, את האתגרים, את החלומות. רק מתוך הבנה עמוקה נולדים פתרונות אמיתיים.",
    color: "bg-blue-500",
  },
  {
    icon: Users,
    title: "שותפות אמיתית",
    desc: "אתם לא לקוחות, אתם שותפים. בכל שלב של הדרך אנחנו חושבים יחד, מקבלים החלטות יחד, וחוגגים הצלחות יחד. השקיפות המלאה שלנו היא לא סיסמה - היא הדרך שבה אנחנו עובדים.",
    color: "bg-purple-500",
  },
  {
    icon: RefreshCw,
    title: "גמישות יצירתית",
    desc: "התוכניות הכי טובות יודעות להשתנות. אנחנו מתאימים את עצמנו לכל פנייה בדרך, לכל תובנה חדשה, לכל הזדמנות שצצה. הגמישות שלנו היא הכוח שלכם.",
    color: "bg-emerald-500",
  },
  {
    icon: TrendingUp,
    title: "תוצאות שמדברות",
    desc: "בסוף היום, מה שחשוב זה מה שקורה אצלכם בעסק. אנחנו מודדים הצלחה לא בשעות עבודה, אלא בצמיחה שלכם, בלידים שמגיעים, בלקוחות שחוזרים.",
    color: "bg-orange-500",
  },
];

export const StackedPrinciples = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-background">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Side: Static Content */}
          <div className="max-w-xl order-2 lg:order-1" dir="rtl">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6">
                איך אנחנו <span className="text-primary">עובדים</span>
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8">
                כל פרויקט הוא מסע משותף. אנחנו לא מאמינים בתבניות קבועות או בתהליכים נוקשים - אנחנו מאמינים בכם.
                בגישה שמתאימה את עצמה לצרכים שלכם, לקצב שלכם, ולחזון שלכם. 
              </p>
              
              {/* Progress Indicator */}
              <div className="flex gap-2 mt-12">
                {principles.map((_, index) => {
                  const range = [index / principles.length, (index + 1) / principles.length];
                  const opacity = useTransform(scrollYProgress, range, [0.3, 1]);
                  const scale = useTransform(scrollYProgress, range, [1, 1.2]);
                  
                  return (
                    <motion.div
                      key={index}
                      style={{ opacity, scale }}
                      className="w-12 h-1.5 rounded-full bg-primary"
                    />
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Side: Stacking Cards */}
          <div className="relative h-[350px] sm:h-[420px] md:h-[500px] w-full max-w-lg mx-auto order-1 lg:order-2">
            {principles.map((principle, index) => (
              <PrincipleCard
                key={index}
                principle={principle}
                index={index}
                total={principles.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PrincipleCardProps {
  principle: Principle;
  index: number;
  total: number;
  progress: any;
}

const PrincipleCard = ({ principle, index, total, progress }: PrincipleCardProps) => {
  const Icon = principle.icon;
  
  // Define visibility range for this card
  const start = index / total;
  const end = 1;
  
  // Transform values
  const y = useTransform(progress, [0, start, start + 0.1], [400, 400, 0]);
  const scale = useTransform(progress, [start, start + 0.1, 1], [0.8, 1, 1 - (total - index) * 0.03]);
  const opacity = useTransform(progress, [start - 0.1, start], [0, 1]);
  const rotate = useTransform(progress, [start, start + 0.1], [index % 2 ? 5 : -5, 0]);

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity,
        rotate,
        zIndex: index,
        top: index * 20, // Slight offset for stacking effect
      }}
      className="absolute inset-0 w-full h-full"
    >
      <div className="w-full h-full glass rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between border border-white/10 shadow-2xl overflow-hidden group">
        {/* Background Accent */}
        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-20 transition-colors duration-500 ${principle.color}`} />
        
        <div className="relative z-10" dir="rtl">
          <div className={`w-16 h-16 rounded-2xl ${principle.color} flex items-center justify-center mb-8 shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          
          <span className="text-sm font-black text-primary/50 uppercase tracking-widest mb-2 block">
            עיקרון {String(index + 1).padStart(2, '0')}
          </span>
          
          <h3 className="text-3xl md:text-4xl font-black text-foreground mb-6 leading-tight">
            {principle.title}
          </h3>
          
          <p className="text-muted-foreground text-lg leading-relaxed">
            {principle.desc}
          </p>
        </div>

        <div className="relative z-10 flex justify-between items-center mt-8">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                {i}
              </div>
            ))}
          </div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-tighter">
            Nexo methodology // 2025
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StackedPrinciples;

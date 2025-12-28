import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Users, Target, Lightbulb, Calendar, Trophy, Heart, Zap, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import GlassNavbar from "@/components/GlassNavbar";
import CustomCursor from "@/components/CustomCursor";
import Contact from "@/components/Contact";

const milestones = [
  { year: "2005", title: "הקמת NEXO", desc: "התחלנו כסטודיו קטן עם חזון גדול" },
  { year: "2010", title: "100 לקוחות", desc: "הגענו לאבן דרך משמעותית ראשונה" },
  { year: "2015", title: "הרחבה בינלאומית", desc: "פתחנו פרויקטים מעבר לים" },
  { year: "2020", title: "מחלקת AI", desc: "השקנו יחידה ייעודית לבינה מלאכותית" },
  { year: "2024", title: "500+ פרויקטים", desc: "ממשיכים להוביל את השוק" },
];

// Team member images: 400px for portrait cards, WebP format
// TODO: Consider converting external Unsplash URLs to local optimized images for better performance
const team = [
  {
    name: "דניאל כהן",
    role: "מנכ״ל ומייסד",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fm=webp&fit=crop",
    bio: "20+ שנות ניסיון בתעשייה"
  },
  {
    name: "מיכל לוי",
    role: "סמנכ״לית קריאייטיב",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&fm=webp&fit=crop",
    bio: "מובילה את החזון העיצובי"
  },
  {
    name: "יונתן שפירא",
    role: "מנהל טכנולוגיות",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&fm=webp&fit=crop",
    bio: "מוביל חדשנות טכנולוגית"
  },
  {
    name: "נועה אברהם",
    role: "מנהלת אסטרטגיה",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&fm=webp&fit=crop",
    bio: "מתרגמת חזון לתוצאות"
  },
];

const values = [
  { 
    icon: Target, 
    title: "מצוינות ללא פשרות", 
    desc: "אנחנו לא מסתפקים ב״מספיק טוב״. כל פרויקט מקבל את המיטב שלנו, ללא קשר לגודל או לתקציב." 
  },
  { 
    icon: Heart, 
    title: "שותפות אמיתית", 
    desc: "אנחנו לא ספקים - אנחנו שותפים. ההצלחה שלכם היא ההצלחה שלנו, והכישלון שלכם הוא הכישלון שלנו." 
  },
  { 
    icon: Zap, 
    title: "חדשנות מתמדת", 
    desc: "העולם הדיגיטלי משתנה בכל יום. אנחנו תמיד צעד אחד קדימה, לומדים טכנולוגיות חדשות ומייישמים גישות פורצות דרך." 
  },
  { 
    icon: Trophy, 
    title: "תוצאות מדידות", 
    desc: "יפה זה לא מספיק. אנחנו מודדים הצלחה בצמיחה, בהמרות ובROI. המספרים מדברים בעד עצמם." 
  },
];

const About = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <CustomCursor />
      <GlassNavbar />

      {/* Hero */}
      <section className="min-h-screen flex items-center bg-hero-bg pt-20">
        <div className="container mx-auto px-6">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 60 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={isHeroInView ? { width: 80 } : {}}
              transition={{ duration: 0.6 }}
              className="h-1 bg-primary mb-8"
            />
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-hero-fg leading-[0.9] mb-8">
              הסיפור
              <br />
              <span className="text-gradient">שלנו.</span>
            </h1>
            
            <p className="text-hero-fg/70 text-xl md:text-2xl leading-relaxed max-w-2xl">
              כבר שני עשורים אנחנו מובילים את המהפכה הדיגיטלית בישראל. 
              בנינו מאות מותגים, השקנו אלפי פרויקטים, ושינינו את הדרך שבה עסקים חושבים על דיגיטל.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-foreground mb-16"
          >
            אבני הדרך שלנו
          </motion.h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute right-8 top-0 bottom-0 w-px bg-border" />

            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-8 mb-12"
              >
                {/* Dot */}
                <div className="w-16 flex-shrink-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                </div>
                
                {/* Content */}
                <div className="flex-1 glass rounded-2xl p-6 md:p-8">
                  <span className="text-primary font-bold text-lg">{milestone.year}</span>
                  <h3 className="text-2xl font-bold text-foreground mt-2">{milestone.title}</h3>
                  <p className="text-muted-foreground mt-2">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 bg-hero-bg">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black text-hero-fg mb-6">
              הערכים שמנחים אותנו
            </h2>
            <p className="text-hero-fg/70 text-lg">
              ארבעה עקרונות שמובילים כל החלטה, כל פרויקט וכל אינטראקציה עם לקוחותינו.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-dark rounded-2xl p-8"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-hero-fg mb-3">{value.title}</h3>
                <p className="text-hero-fg/70 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          >
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-foreground">
                הצוות שלנו
              </h2>
              <p className="text-muted-foreground text-lg mt-4 max-w-xl">
                אנשים מוכשרים שמאחורי כל פרויקט מוצלח. צוות מגוון של מומחים בתחומם.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              הצטרפו לצוות
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={533}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
                <p className="text-muted-foreground text-sm mt-1">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </div>
  );
};

export default About;

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import Contact from "@/components/Contact";

// Project images: 800px for card display, WebP format
const projects = [
  {
    id: "techflow",
    title: "TechFlow",
    category: "אתר + מיתוג",
    description: "מיתוג מלא ופלטפורמה דיגיטלית לסטארט-אפ טכנולוגי",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&fm=webp&fit=crop",
    results: ["340% עלייה בהמרות", "2M משתמשים חדשים", "גיוס סבב A"],
    tags: ["מיתוג", "פיתוח", "אסטרטגיה"],
  },
  {
    id: "cloudnine",
    title: "CloudNine",
    category: "חנות אונליין",
    description: "חנות E-commerce מותאמת אישית עם חוויית משתמש יוצאת דופן",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80&fm=webp&fit=crop",
    results: ["500% עלייה במכירות", "NPS של 92", "זמן טעינה 0.8s"],
    tags: ["E-commerce", "UX/UI", "פיתוח"],
  },
  {
    id: "growthlabs",
    title: "GrowthLabs",
    category: "AI + אוטומציה",
    description: "מערכת AI מתקדמת לניתוח נתונים והמלצות אוטומטיות",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&fm=webp&fit=crop",
    results: ["20 שעות חיסכון שבועי", "98% דיוק", "ROI של 800%"],
    tags: ["AI", "אוטומציה", "אנליטיקס"],
  },
  {
    id: "startphub",
    title: "StartupHub",
    category: "מיתוג מלא",
    description: "זהות מותגית חדשה למרכז יזמות מוביל",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&fm=webp&fit=crop",
    results: ["200% עלייה בפניות", "15 שותפויות חדשות", "פרס עיצוב"],
    tags: ["מיתוג", "עיצוב", "אסטרטגיה"],
  },
  {
    id: "fintech",
    title: "FinSecure",
    category: "אפליקציית פינטק",
    description: "אפליקציה מאובטחת לניהול השקעות ותיקים פיננסיים",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&fm=webp&fit=crop",
    results: ["1M הורדות", "4.9 דירוג", "SOC2 מוסמך"],
    tags: ["אפליקציה", "פינטק", "אבטחה"],
  },
  {
    id: "ecolife",
    title: "EcoLife",
    category: "קמפיין דיגיטלי",
    description: "קמפיין שיווקי רב-ערוצי למותג קיימות",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80&fm=webp&fit=crop",
    results: ["10M חשיפות", "250K עוקבים חדשים", "פרס קריאייטיב"],
    tags: ["שיווק", "קמפיין", "סושיאל"],
  },
];

const categories = ["הכל", "מיתוג", "פיתוח", "AI", "שיווק", "E-commerce"];

const Portfolio = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const [activeCategory, setActiveCategory] = useState("הכל");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const filteredProjects = activeCategory === "הכל" 
    ? projects 
    : projects.filter(p => p.tags.some(tag => tag.includes(activeCategory) || activeCategory.includes(tag)));

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      {/* Hero */}
      <section className="min-h-[60vh] flex items-center bg-hero-bg pt-20">
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
              העבודות
              <br />
              <span className="text-gradient">שלנו.</span>
            </h1>
            
            <p className="text-hero-fg/70 text-xl md:text-2xl leading-relaxed max-w-2xl">
              מבחר פרויקטים שמדגימים את היכולות שלנו. כל פרויקט הוא סיפור הצלחה.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-background border-b border-border sticky top-16 z-30 backdrop-blur-sm bg-background/90">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                className="group cursor-pointer"
              >
                <Link to={`/portfolio/${project.id}`}>
                  {/* Image */}
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={500}
                      animate={{ scale: hoveredProject === project.id ? 1.05 : 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full object-cover"
                    />
                    <motion.div
                      animate={{ opacity: hoveredProject === project.id ? 0.9 : 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-hero-bg via-hero-bg/30 to-transparent"
                    />
                    
                    {/* Overlay Content */}
                    <motion.div
                      animate={{ 
                        opacity: hoveredProject === project.id ? 1 : 0,
                        y: hoveredProject === project.id ? 0 : 20 
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                        <ExternalLink className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </motion.div>

                    {/* Category Tag */}
                    <div className="absolute top-4 right-4">
                      <span className="text-xs font-medium text-hero-fg/80 bg-hero-bg/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      
                      {/* Results */}
                      <div className="flex flex-wrap gap-2">
                        {project.results.map((result, i) => (
                          <span key={i} className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {result}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.div
                      animate={{ x: hoveredProject === project.id ? 0 : 10, opacity: hoveredProject === project.id ? 1 : 0 }}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center flex-shrink-0"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-hero-bg">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-black text-hero-fg mb-6">
              הפרויקט הבא
              <br />
              <span className="text-gradient">יכול להיות שלכם.</span>
            </h2>
            <p className="text-hero-fg/70 text-lg mb-8">
              מוכנים להצטרף לרשימת ההצלחות שלנו?
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-colors"
            >
              בואו נדבר
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Contact />
    </div>
  );
};

export default Portfolio;

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Instagram, Facebook, Linkedin, Phone, Mail, MapPin, ArrowUpRight, CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import MagneticButton from "@/components/MagneticButton";

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500" },
  { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
  { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
  { icon: Phone, href: "#", label: "WhatsApp", color: "hover:bg-green-500" },
];

const ContactPage = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    budget: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast({
      title: "ההודעה נשלחה בהצלחה!",
      description: "נחזור אליך תוך 24 שעות.",
    });
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", phone: "", company: "", budget: "", message: "" });
    }, 3000);
  };

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
              בואו
              <br />
              <span className="text-gradient">נדבר.</span>
            </h1>
            
            <p className="text-hero-fg/70 text-xl md:text-2xl leading-relaxed max-w-2xl">
              יש לכם פרויקט בראש? נשמח לשמוע על החזון שלכם ולעזור להגשים אותו.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Left - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-8">
                דרכים ליצור קשר
              </h2>

              {/* Contact Cards */}
              <div className="space-y-4 mb-12">
                <motion.a
                  href="mailto:hello@nexo.agency"
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="group flex items-center gap-4 p-6 rounded-2xl border border-border hover:border-primary/50 transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm mb-1">אימייל</p>
                    <p className="text-foreground text-lg font-medium">hello@nexo.agency</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.a>

                <motion.a
                  href="tel:+972501234567"
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="group flex items-center gap-4 p-6 rounded-2xl border border-border hover:border-primary/50 transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm mb-1">טלפון</p>
                    <p className="text-foreground text-lg font-medium">050-123-4567</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.a>

                <motion.a
                  href="https://wa.me/972501234567"
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="group flex items-center gap-4 p-6 rounded-2xl border border-border hover:border-primary/50 transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm mb-1">וואטסאפ</p>
                    <p className="text-foreground text-lg font-medium">שלחו הודעה מיידית</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.a>

                <motion.div
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="group flex items-center gap-4 p-6 rounded-2xl border border-border"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm mb-1">משרדים</p>
                    <p className="text-foreground text-lg font-medium">תל אביב, ישראל</p>
                  </div>
                </motion.div>
              </div>

              {/* Social */}
              <div>
                <p className="text-muted-foreground text-sm mb-4">עקבו אחרינו</p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-14 h-14 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-transparent transition-all ${social.color}`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 rounded-3xl border border-primary/30"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <CheckCircle className="w-20 h-20 text-primary mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">תודה רבה!</h3>
                  <p className="text-muted-foreground">נחזור אליך תוך 24 שעות.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-3xl border border-border">
                  <h3 className="text-2xl font-bold text-foreground mb-6">ספרו לנו על הפרויקט</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">שם מלא *</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-12"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">חברה</label>
                      <Input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">אימייל *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-12"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">טלפון *</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">תקציב משוער</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full h-12 px-4 rounded-md border border-input bg-background text-foreground"
                    >
                      <option value="">בחרו טווח</option>
                      <option value="10-30">₪10,000 - ₪30,000</option>
                      <option value="30-50">₪30,000 - ₪50,000</option>
                      <option value="50-100">₪50,000 - ₪100,000</option>
                      <option value="100+">מעל ₪100,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">פרטים על הפרויקט *</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="min-h-[150px]"
                      placeholder="ספרו לנו על הפרויקט, המטרות והאתגרים..."
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold rounded-xl">
                    <Send className="w-5 h-5 ml-2" />
                    שלח פנייה
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    בשליחת הטופס אתם מסכימים למדיניות הפרטיות שלנו
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map / Location */}
      <section className="py-24 bg-hero-bg">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-hero-fg mb-6">
              נפגשים במשרדים?
            </h2>
            <p className="text-hero-fg/70 text-lg mb-8">
              אנחנו ממוקמים בלב תל אביב. מוזמנים לקפוץ לקפה.
            </p>
            <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-hero-fg/10 flex items-center justify-center">
              <p className="text-hero-fg/50">מפה אינטראקטיבית</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-hero-bg border-t border-hero-fg/10 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-hero-fg">NEXO</span>
              <span className="text-hero-fg/30">|</span>
              <p className="text-hero-fg/50 text-sm">© 2025 כל הזכויות שמורות</p>
            </div>
            <div className="flex gap-6 text-sm text-hero-fg/50">
              <a href="#" className="hover:text-hero-fg transition-colors">מדיניות פרטיות</a>
              <a href="#" className="hover:text-hero-fg transition-colors">תנאי שימוש</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;

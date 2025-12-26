import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Instagram, Facebook, Linkedin, Phone, Mail, MapPin, ArrowUpRight, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import RippleButton from "./RippleButton";
import Magnet from "./Magnet";

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500" },
  { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
  { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
  { icon: Phone, href: "#", label: "WhatsApp", color: "hover:bg-green-500" },
];

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast({
      title: "ההודעה נשלחה בהצלחה! 🎉",
      description: "נחזור אליך תוך 24 שעות.",
    });
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", phone: "", message: "" });
    }, 3000);
  };

  return (
    <footer id="contact" className="bg-hero-bg py-24 md:py-32 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        animate={{
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary rounded-full blur-[200px]"
      />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Large CTA Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8"
          >
            <Mail className="w-10 h-10 text-primary" />
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-hero-fg leading-[1] mb-6">
            יש לך רעיון?
            <br />
            <span className="text-gradient">בוא נדבר.</span>
          </h2>
          
          <p className="text-hero-fg/60 text-lg md:text-xl max-w-xl mx-auto">
            מוכנים להפוך את הרעיון שלך למציאות דיגיטלית מדהימה? 
            השאר פרטים ונחזור אליך תוך 24 שעות.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Contact Cards */}
            <div className="space-y-4 mb-12">
              <motion.a
                href="mailto:hello@nexo.agency"
                whileHover={{ x: 10, scale: 1.02 }}
                className="group flex items-center gap-4 p-6 rounded-2xl bg-hero-fg/5 border border-hero-fg/10 hover:border-primary/50 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-hero-fg/50 text-sm mb-1">אימייל</p>
                  <p className="text-hero-fg text-lg font-medium">hello@nexo.agency</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-hero-fg/30 group-hover:text-primary transition-colors" />
              </motion.a>

              <motion.a
                href="tel:+972501234567"
                whileHover={{ x: 10, scale: 1.02 }}
                className="group flex items-center gap-4 p-6 rounded-2xl bg-hero-fg/5 border border-hero-fg/10 hover:border-primary/50 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-hero-fg/50 text-sm mb-1">טלפון</p>
                  <p className="text-hero-fg text-lg font-medium">050-123-4567</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-hero-fg/30 group-hover:text-primary transition-colors" />
              </motion.a>

              <motion.div
                whileHover={{ x: 10, scale: 1.02 }}
                className="group flex items-center gap-4 p-6 rounded-2xl bg-hero-fg/5 border border-hero-fg/10"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-hero-fg/50 text-sm mb-1">משרדים</p>
                  <p className="text-hero-fg text-lg font-medium">תל אביב, ישראל</p>
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-hero-fg/50 text-sm mb-4">עקבו אחרינו</p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <Magnet key={index} magnetStrength={3} padding={40}>
                    <motion.a
                      href={social.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-14 h-14 rounded-xl border border-hero-fg/10 flex items-center justify-center text-hero-fg/60 hover:text-hero-fg hover:border-transparent transition-all ${social.color}`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  </Magnet>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 rounded-3xl bg-hero-fg/5 border border-primary/30"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <CheckCircle className="w-20 h-20 text-primary mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-hero-fg mb-2">תודה רבה!</h3>
                <p className="text-hero-fg/60">נחזור אליך בהקדם האפשרי.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-3xl bg-hero-fg/5 border border-hero-fg/10">
                <div className="relative">
                  <motion.label
                    animate={{ 
                      y: focusedField === 'name' || formData.name ? -24 : 0,
                      scale: focusedField === 'name' || formData.name ? 0.85 : 1,
                      color: focusedField === 'name' ? 'hsl(var(--primary))' : 'hsl(var(--hero-fg) / 0.5)'
                    }}
                    className="absolute right-0 top-4 text-hero-fg/50 pointer-events-none origin-right"
                  >
                    שם מלא
                  </motion.label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className="bg-transparent border-0 border-b-2 border-hero-fg/20 rounded-none px-0 h-14 text-lg text-hero-fg focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary text-right"
                    required
                  />
                </div>

                <div className="relative">
                  <motion.label
                    animate={{ 
                      y: focusedField === 'phone' || formData.phone ? -24 : 0,
                      scale: focusedField === 'phone' || formData.phone ? 0.85 : 1,
                      color: focusedField === 'phone' ? 'hsl(var(--primary))' : 'hsl(var(--hero-fg) / 0.5)'
                    }}
                    className="absolute right-0 top-4 text-hero-fg/50 pointer-events-none origin-right"
                  >
                    טלפון
                  </motion.label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    className="bg-transparent border-0 border-b-2 border-hero-fg/20 rounded-none px-0 h-14 text-lg text-hero-fg focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary text-right"
                    required
                  />
                </div>

                <div className="relative">
                  <motion.label
                    animate={{ 
                      y: focusedField === 'message' || formData.message ? -24 : 0,
                      scale: focusedField === 'message' || formData.message ? 0.85 : 1,
                      color: focusedField === 'message' ? 'hsl(var(--primary))' : 'hsl(var(--hero-fg) / 0.5)'
                    }}
                    className="absolute right-0 top-4 text-hero-fg/50 pointer-events-none origin-right"
                  >
                    ספרו לנו על הפרויקט
                  </motion.label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className="bg-transparent border-0 border-b-2 border-hero-fg/20 rounded-none px-0 min-h-[120px] text-lg text-hero-fg focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary text-right resize-none pt-4"
                    required
                  />
                </div>

                <Magnet magnetStrength={4} padding={80}>
                  <RippleButton
                    variant="primary"
                    size="md"
                    className="w-full mt-8"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      שלח הודעה
                    </span>
                  </RippleButton>
                </Magnet>
              </form>
            )}
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-24 pt-8 border-t border-hero-fg/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl font-black text-hero-fg">NEXO</span>
            <span className="text-hero-fg/30">|</span>
            <p className="text-hero-fg/50 text-sm">
              © 2025 NEXO AGENCY. כל הזכויות שמורות.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-hero-fg/50">
            <a href="#" className="hover:text-hero-fg transition-colors">
              מדיניות פרטיות
            </a>
            <a href="#" className="hover:text-hero-fg transition-colors">
              תנאי שימוש
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Contact;

import { motion } from "framer-motion";

const clients = [
  { name: "TechFlow", logo: "TF" },
  { name: "NovaBrand", logo: "NB" },
  { name: "DigitalPeak", logo: "DP" },
  { name: "CloudNine", logo: "C9" },
  { name: "StartupHub", logo: "SH" },
  { name: "GrowthLabs", logo: "GL" },
  { name: "InnovateCo", logo: "IC" },
  { name: "FutureTech", logo: "FT" },
];

const ClientsMarquee = () => {
  return (
    <section className="py-16 md:py-24 bg-background border-y border-border overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-muted-foreground text-sm tracking-widest uppercase mb-2">
            גאים לעבוד עם
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            מותגים שבוחרים בנו
          </h3>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />

        {/* Marquee Track */}
        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
          className="flex gap-8 md:gap-16"
        >
          {/* Double the items for seamless loop */}
          {[...clients, ...clients, ...clients, ...clients].map((client, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="flex-shrink-0 group cursor-pointer"
            >
              <div className="w-32 h-16 md:w-40 md:h-20 rounded-lg border border-border bg-card flex items-center justify-center gap-3 transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/10">
                {/* Logo Placeholder */}
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {client.logo}
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {client.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientsMarquee;

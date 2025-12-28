"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Monitor, Smartphone, Tablet, Loader2 } from 'lucide-react';

interface LiveWebsitePreviewProps {
  url: string;
  title?: string;
  brandColors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const deviceConfigs = {
  desktop: { width: '100%', height: '500px', aspectRatio: '16/10' },
  tablet: { width: '768px', height: '600px', aspectRatio: '4/3' },
  mobile: { width: '375px', height: '667px', aspectRatio: '9/16' },
};

export function LiveWebsitePreview({ url, title, brandColors }: LiveWebsitePreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isVisible, setIsVisible] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Lazy loading with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const config = deviceConfigs[device];
  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Detect if background is dark to adjust text/button colors
  const isDarkBackground = (() => {
    const bg = brandColors?.background || '#FAF9F6';
    // Convert hex to RGB and calculate relative luminance
    const hex = bg.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 0.5;
  })();

  return (
    <section
      ref={ref}
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ backgroundColor: brandColors?.background || '#FAF9F6' }}
    >
      <div className="container mx-auto px-6 md:px-12 relative z-10" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Text Content - Right side (RTL) */}
          <div className="order-2 lg:order-1">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span
                className="text-[10px] uppercase tracking-[0.3em] font-medium"
                style={{ color: brandColors?.secondary || 'hsl(var(--primary))' }}
              >
                התוצאה הסופית
              </span>
            </motion.div>

            {/* Title */}
            <div className="overflow-hidden mb-5">
              <motion.h3
                initial={{ y: "100%" }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-display font-black leading-[0.9] tracking-[-0.02em]"
                style={{ color: brandColors?.primary || '#1a1a1a' }}
              >
                האתר
                <br />
                <span style={{ color: brandColors?.secondary || 'hsl(var(--primary))' }}>
                  בפעולה
                </span>
              </motion.h3>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg font-heebo leading-relaxed mb-6 max-w-md"
              style={{ color: `${brandColors?.primary || '#1a1a1a'}99` }}
            >
              גלשו באתר החי ישירות מכאן. בחרו את סוג המכשיר לצפייה בתצוגה רספונסיבית, או פתחו את האתר בלשונית חדשה.
            </motion.p>

            {/* Device Switcher Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-3 mb-8"
            >
              <span
                className="text-sm ml-2"
                style={{ color: isDarkBackground ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}
              >
                תצוגה:
              </span>
              <button
                onClick={() => setDevice('desktop')}
                className="p-2.5 rounded-lg transition-all"
                style={{
                  backgroundColor: device === 'desktop'
                    ? (brandColors?.primary || 'hsl(var(--primary))')
                    : isDarkBackground ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
                  color: device === 'desktop'
                    ? '#fff'
                    : isDarkBackground ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)',
                  boxShadow: device === 'desktop' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
                }}
                title="מחשב"
              >
                <Monitor className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className="p-2.5 rounded-lg transition-all"
                style={{
                  backgroundColor: device === 'tablet'
                    ? (brandColors?.primary || 'hsl(var(--primary))')
                    : isDarkBackground ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
                  color: device === 'tablet'
                    ? '#fff'
                    : isDarkBackground ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)',
                  boxShadow: device === 'tablet' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
                }}
                title="טאבלט"
              >
                <Tablet className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className="p-2.5 rounded-lg transition-all"
                style={{
                  backgroundColor: device === 'mobile'
                    ? (brandColors?.primary || 'hsl(var(--primary))')
                    : isDarkBackground ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
                  color: device === 'mobile'
                    ? '#fff'
                    : isDarkBackground ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)',
                  boxShadow: device === 'mobile' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
                }}
                title="נייד"
              >
                <Smartphone className="w-5 h-5" />
              </button>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-base transition-all duration-300 group"
                style={{
                  backgroundColor: brandColors?.primary || '#1a1a1a',
                  color: brandColors?.background || '#fff'
                }}
              >
                <span>פתחו בלשונית חדשה</span>
                <ExternalLink className="w-4 h-4 transform group-hover:translate-x-[-4px] group-hover:-translate-y-1 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* Browser Mockup with Live iframe - Left side (RTL) */}
          <div className="order-1 lg:order-2" ref={containerRef}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Browser Frame */}
              <div
                className="bg-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl shadow-black/20 transition-all duration-500"
                dir="ltr"
                style={{
                  maxWidth: device === 'desktop' ? '100%' : device === 'tablet' ? '768px' : '375px',
                  margin: '0 auto'
                }}
              >
                {/* Browser Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#333] border-b border-white/5">
                  {/* Traffic Lights */}
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
                  </div>

                  {/* URL Bar */}
                  <div className="flex-1 mx-4">
                    <div className="bg-[#1a1a1a] rounded-lg px-4 py-1.5 text-sm text-white/50 font-mono flex items-center justify-center gap-2">
                      <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      {displayUrl}
                    </div>
                  </div>

                  {/* External Link */}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-white/50" />
                  </a>
                </div>

                {/* iframe Container */}
                <div
                  className="relative bg-white overflow-hidden transition-all duration-500"
                  style={{
                    height: device === 'desktop' ? '450px' : device === 'tablet' ? '550px' : '600px'
                  }}
                >
                  {isVisible && showIframe ? (
                    <>
                      {/* Loading Overlay */}
                      {!isLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="text-sm text-gray-500">טוען את האתר...</span>
                          </div>
                        </div>
                      )}

                      <iframe
                        src={url}
                        className="w-full h-full border-0"
                        onLoad={() => setIsLoaded(true)}
                        loading="lazy"
                        title={title || 'Website Preview'}
                        style={{
                          opacity: isLoaded ? 1 : 0,
                          transition: 'opacity 0.3s ease',
                          pointerEvents: 'auto'
                        }}
                      />
                    </>
                  ) : (
                    /* Click to load overlay */
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer group"
                      onClick={() => setShowIframe(true)}
                    >
                      <div className="flex flex-col items-center gap-4 text-center px-6">
                        <motion.div
                          className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                          style={{ backgroundColor: brandColors?.primary || '#1a1a1a' }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            style={{ color: brandColors?.background || '#fff' }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </motion.div>
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">לחצו לטעינת האתר החי</p>
                          <p className="text-sm text-gray-500">תוכלו לגלוש ולבדוק את האתר בפעולה</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative elements */}
              <div
                className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl"
                style={{ backgroundColor: `${brandColors?.secondary || 'hsl(var(--primary))'}20` }}
              />
              <div
                className="absolute -top-4 -left-4 w-20 h-20 rounded-full blur-xl"
                style={{ backgroundColor: `${brandColors?.accent || 'hsl(var(--primary))'}15` }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LiveWebsitePreview;

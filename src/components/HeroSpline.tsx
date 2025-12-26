'use client';

import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';
import { useState, Suspense } from 'react';

// Loading component while Spline loads
function SplineLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
    </div>
  );
}

export default function HeroSpline() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative h-screen w-full bg-[#FAFAFA] overflow-hidden">
      {/* Spline 3D Scene - LEFT SIDE */}
      <div className="absolute inset-0">
        <Suspense fallback={<SplineLoader />}>
          {!isLoaded && <SplineLoader />}
          <Spline
            scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            onLoad={() => setIsLoaded(true)}
            style={{
              width: '100%',
              height: '100%',
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
          />
        </Suspense>
      </div>

      {/* Content Section - RIGHT SIDE */}
      <div className="absolute inset-0 z-10 flex items-center justify-end pointer-events-none">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-2xl ml-auto pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-6 text-right"
              dir="rtl"
            >
              {/* Eyebrow text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block"
              >
                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
                  פלטפורמת הויזואליה המתקדמת
                </span>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight"
              >
                הדמיה חכמה
                <br />
                <span className="bg-gradient-to-l from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  בזמן אמת
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl"
              >
                צור, ערוך והדמה פרויקטים ויזואליים מורכבים עם טכנולוגיית AI מתקדמת.
                חוויה תלת-מימדית חלקה ואינטואיטיבית.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex gap-4 items-center justify-end pt-4"
              >
                <button className="group relative px-8 py-4 bg-gradient-to-l from-purple-600 via-pink-500 to-blue-500 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105">
                  <span className="relative z-10">התחל עכשיו</span>
                  <div className="absolute inset-0 bg-gradient-to-l from-purple-700 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 hover:scale-105">
                  צפה בהדגמה
                </button>
              </motion.div>

              {/* Stats/Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex gap-8 pt-8 justify-end"
              >
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">משתמשים פעילים</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">500K+</div>
                  <div className="text-sm text-gray-600">פרויקטים נוצרו</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">זמן פעילות</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/40 via-transparent to-purple-50/30" />
    </div>
  );
}

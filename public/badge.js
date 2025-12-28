/**
 * Nexo Agency Footer Credit v1.1.0
 * "Made with ❤️ by Nexo" footer attribution section
 * https://nexoagency.org
 *
 * Usage:
 * <script src="https://nexoagency.org/badge.js" async></script>
 *
 * Options (data attributes):
 * - data-theme: "auto" | "light" | "dark" (default: auto)
 * - data-lang: "auto" | "en" | "he" (default: auto - detects from page)
 * - data-style: "minimal" | "standard" (default: minimal)
 *
 * Examples:
 * English: "Made with ❤️ by Nexo"
 * Hebrew: "נוצר באהבה ע״י Nexo"
 */
(function() {
  'use strict';

  // Prevent double initialization
  if (window.__nexoCreditLoaded) return;
  window.__nexoCreditLoaded = true;

  // Configuration from script tag
  const currentScript = document.currentScript || document.querySelector('script[src*="badge.js"]');
  const config = {
    theme: currentScript?.dataset?.theme || 'auto',
    style: currentScript?.dataset?.style || 'minimal',
    lang: currentScript?.dataset?.lang || 'auto', // 'en', 'he', or 'auto'
    link: 'https://nexoagency.org'
  };

  // Translations
  const translations = {
    en: {
      madeWith: 'Made with',
      by: 'by'
    },
    he: {
      madeWith: 'נוצר באהבה',
      by: 'ע״י'
    }
  };

  // Nexo logo as inline SVG
  const NEXO_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 486 336" fill="currentColor" class="nexo-credit-logo">
    <g transform="translate(0,336) scale(0.1,-0.1)">
      <path d="M410 3350 c-63 -5 -167 -11 -230 -15 -63 -3 -130 -9 -147 -12 l-33 -5 0 -1661 0 -1660 82 6 c158 12 295 68 398 163 77 72 144 201 160 309 6 44 10 491 10 1188 l0 1117 93 0 c244 0 488 -75 697 -214 84 -57 230 -199 1290 -1262 1149 -1151 1198 -1199 1266 -1231 39 -19 100 -38 135 -44 35 -5 209 -8 387 -7 l322 3 -1487 1486 c-1377 1375 -1495 1491 -1588 1551 -229 150 -449 234 -710 272 -49 7 -173 14 -275 15 -102 1 -201 3 -220 5 -19 2 -87 0 -150 -4z"/>
      <path d="M4109 3316 c-83 -22 -133 -62 -314 -253 -99 -103 -247 -258 -330 -343 -83 -85 -226 -234 -317 -330 l-166 -175 208 -214 c115 -117 213 -211 218 -210 8 4 250 259 751 794 119 127 259 275 311 330 53 55 163 171 244 258 l148 157 -353 -1 c-247 0 -368 -4 -400 -13z"/>
      <path d="M2085 1273 c-187 -196 -279 -291 -815 -841 -200 -205 -369 -381 -376 -391 -12 -16 6 -17 339 -14 202 2 375 8 407 14 30 6 89 27 130 46 62 29 94 54 181 142 163 164 729 773 729 785 0 5 -96 106 -213 224 l-213 213 -169 -178z"/>
    </g>
  </svg>`;

  /**
   * Get the effective background color by checking multiple strategies
   */
  function getEffectiveBackgroundColor() {
    // Check body and html
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    if (bodyBg && bodyBg !== 'transparent' && bodyBg !== 'rgba(0, 0, 0, 0)') {
      return bodyBg;
    }

    const htmlBg = window.getComputedStyle(document.documentElement).backgroundColor;
    if (htmlBg && htmlBg !== 'transparent' && htmlBg !== 'rgba(0, 0, 0, 0)') {
      return htmlBg;
    }

    // Check for common dark mode indicators
    if (document.documentElement.classList.contains('dark') ||
        document.body.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark') {
      return 'rgb(15, 15, 15)';
    }

    return 'rgb(255, 255, 255)';
  }

  /**
   * Determine if a color is light using HSP
   */
  function isColorLight(color) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return true;

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    return hsp > 127.5;
  }

  /**
   * Determine the appropriate theme
   */
  function getTheme() {
    if (config.theme !== 'auto') return config.theme;
    const bgColor = getEffectiveBackgroundColor();
    return isColorLight(bgColor) ? 'light' : 'dark';
  }

  /**
   * Determine the appropriate language
   */
  function getLang() {
    if (config.lang !== 'auto') return config.lang;

    // Check HTML lang attribute
    const htmlLang = document.documentElement.lang?.toLowerCase() || '';
    if (htmlLang.startsWith('he')) return 'he';
    if (htmlLang.startsWith('en')) return 'en';

    // Check dir attribute for RTL
    const dir = document.documentElement.dir || document.body.dir;
    if (dir === 'rtl') return 'he';

    // Default to English
    return 'en';
  }

  // Heart SVG icon
  const HEART_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nexo-credit-heart">
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/>
  </svg>`;

  /**
   * Create and inject the footer credit section
   */
  function createCredit() {
    const theme = getTheme();
    const lang = getLang();
    const t = translations[lang] || translations.en;
    const isRTL = lang === 'he';

    // Theme colors - subtle, professional
    const colors = theme === 'dark'
      ? {
          bg: '#0a0a0a',
          text: 'rgba(255, 255, 255, 0.5)',
          textHover: 'rgba(255, 255, 255, 0.8)',
          border: 'rgba(255, 255, 255, 0.08)'
        }
      : {
          bg: '#fafafa',
          text: 'rgba(0, 0, 0, 0.4)',
          textHover: 'rgba(0, 0, 0, 0.7)',
          border: 'rgba(0, 0, 0, 0.06)'
        };

    // Create the credit section
    const creditSection = document.createElement('div');
    creditSection.id = 'nexo-credit-section';

    // Inject styles
    const styleId = 'nexo-credit-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        #nexo-credit-section {
          width: 100%;
          padding: 16px 20px;
          background: ${colors.bg};
          border-top: 1px solid ${colors.border};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          box-sizing: border-box;
        }

        #nexo-credit-section * {
          box-sizing: border-box;
        }

        .nexo-credit-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          color: ${colors.text};
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.02em;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .nexo-credit-link:hover {
          color: ${colors.textHover};
        }

        .nexo-credit-link:hover .nexo-credit-logo {
          transform: scale(1.1);
        }

        .nexo-credit-logo {
          width: 16px;
          height: 16px;
          transition: transform 0.2s ease;
        }

        .nexo-credit-text {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nexo-credit-name {
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .nexo-credit-heart {
          width: 14px;
          height: 14px;
          color: #FF1493;
          animation: nexo-heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes nexo-heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        .nexo-credit-link:hover .nexo-credit-heart {
          color: #E91280;
        }

        /* RTL Support */
        #nexo-credit-section[dir="rtl"] .nexo-credit-link {
          flex-direction: row;
        }

        @media (max-width: 480px) {
          #nexo-credit-section {
            padding: 12px 16px;
          }
          .nexo-credit-link {
            font-size: 11px;
          }
          .nexo-credit-logo {
            width: 14px;
            height: 14px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Set RTL direction if Hebrew
    if (isRTL) {
      creditSection.style.direction = 'rtl';
    }

    // Build the credit content
    // English: "Made with ❤️ by Nexo"
    // Hebrew: "נוצר באהבה ❤️ ע״י Nexo" (reads right-to-left)
    creditSection.innerHTML = isRTL
      ? `<a href="${config.link}"
           target="_blank"
           rel="noopener noreferrer nofollow"
           class="nexo-credit-link"
           aria-label="אתר נוצר על ידי סוכנות Nexo">
          <span class="nexo-credit-text">${t.madeWith}</span>
          ${HEART_ICON}
          <span class="nexo-credit-text">${t.by}</span>
          ${NEXO_LOGO}
          <span class="nexo-credit-name">Nexo</span>
        </a>`
      : `<a href="${config.link}"
           target="_blank"
           rel="noopener noreferrer nofollow"
           class="nexo-credit-link"
           aria-label="Website made with love by Nexo Agency">
          <span class="nexo-credit-text">${t.madeWith}</span>
          ${HEART_ICON}
          <span class="nexo-credit-text">${t.by}</span>
          ${NEXO_LOGO}
          <span class="nexo-credit-name">Nexo</span>
        </a>`;

    // Insert at the very end of the body (after footer)
    document.body.appendChild(creditSection);
  }

  /**
   * Initialize when DOM is ready
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createCredit);
    } else {
      // Small delay to ensure footer is loaded
      setTimeout(createCredit, 100);
    }
  }

  init();
})();

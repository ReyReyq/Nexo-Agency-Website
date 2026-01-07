import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';

const URL = process.argv[2] || 'https://nexo-vision-two.vercel.app';

async function runLighthouseAudit(url, device = 'mobile') {
  console.log(`\n🔍 Running Lighthouse audit on: ${url}`);
  console.log(`📱 Device: ${device}\n`);

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
  });

  const options = {
    logLevel: 'error',
    output: ['json', 'html'],
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: device,
    screenEmulation: device === 'desktop' ? {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    } : undefined,
    throttling: device === 'desktop' ? {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    } : undefined,
  };

  const result = await lighthouse(url, options);
  await chrome.kill();

  return result;
}

function formatScore(score) {
  const pct = Math.round(score * 100);
  if (pct >= 90) return `\x1b[32m${pct}\x1b[0m`; // Green
  if (pct >= 50) return `\x1b[33m${pct}\x1b[0m`; // Yellow
  return `\x1b[31m${pct}\x1b[0m`; // Red
}

function formatMetric(value, goodThreshold, poorThreshold, unit = 'ms') {
  const formatted = unit === 'ms' ? `${Math.round(value)}${unit}` : value.toFixed(3);
  if (value <= goodThreshold) return `\x1b[32m${formatted}\x1b[0m`;
  if (value <= poorThreshold) return `\x1b[33m${formatted}\x1b[0m`;
  return `\x1b[31m${formatted}\x1b[0m`;
}

async function main() {
  try {
    // Run mobile audit
    const mobileResult = await runLighthouseAudit(URL, 'mobile');
    const mobileLhr = mobileResult.lhr;
    const mobileAudits = mobileLhr.audits;

    // Run desktop audit
    const desktopResult = await runLighthouseAudit(URL, 'desktop');
    const desktopLhr = desktopResult.lhr;
    const desktopAudits = desktopLhr.audits;

    // Save HTML reports
    fs.writeFileSync('lighthouse-mobile.html', mobileResult.report[1]);
    fs.writeFileSync('lighthouse-desktop.html', desktopResult.report[1]);

    console.log('\n' + '='.repeat(70));
    console.log('                    LIGHTHOUSE PERFORMANCE REPORT');
    console.log('='.repeat(70));
    console.log(`URL: ${URL}`);
    console.log(`Date: ${new Date().toISOString()}`);
    console.log('='.repeat(70));

    // Category Scores
    console.log('\n📊 CATEGORY SCORES');
    console.log('-'.repeat(50));
    console.log('Category                  Mobile      Desktop');
    console.log('-'.repeat(50));

    const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
    for (const cat of categories) {
      const name = cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ');
      const mScore = formatScore(mobileLhr.categories[cat]?.score || 0);
      const dScore = formatScore(desktopLhr.categories[cat]?.score || 0);
      console.log(`${name.padEnd(25)} ${mScore.padStart(10)}      ${dScore}`);
    }

    // Core Web Vitals
    console.log('\n\n🎯 CORE WEB VITALS');
    console.log('-'.repeat(70));
    console.log('Metric                         Mobile              Desktop         Target');
    console.log('-'.repeat(70));

    const metrics = [
      { name: 'First Contentful Paint', id: 'first-contentful-paint', good: 1800, poor: 3000, unit: 'ms' },
      { name: 'Largest Contentful Paint', id: 'largest-contentful-paint', good: 2500, poor: 4000, unit: 'ms' },
      { name: 'Total Blocking Time', id: 'total-blocking-time', good: 200, poor: 600, unit: 'ms' },
      { name: 'Cumulative Layout Shift', id: 'cumulative-layout-shift', good: 0.1, poor: 0.25, unit: '' },
      { name: 'Speed Index', id: 'speed-index', good: 3400, poor: 5800, unit: 'ms' },
    ];

    for (const m of metrics) {
      const mVal = mobileAudits[m.id]?.numericValue || 0;
      const dVal = desktopAudits[m.id]?.numericValue || 0;
      const mFormatted = formatMetric(mVal, m.good, m.poor, m.unit);
      const dFormatted = formatMetric(dVal, m.good, m.poor, m.unit);
      const target = m.unit === 'ms' ? `<${m.good}ms` : `<${m.good}`;
      console.log(`${m.name.padEnd(30)} ${mFormatted.padStart(18)}    ${dFormatted.padStart(18)}    ${target}`);
    }

    // Opportunities (Performance Improvements)
    console.log('\n\n💡 OPPORTUNITIES FOR IMPROVEMENT (Mobile)');
    console.log('-'.repeat(70));

    const opportunities = Object.values(mobileAudits)
      .filter(a => a.details?.type === 'opportunity' && a.score !== null && a.score < 1)
      .sort((a, b) => (b.details?.overallSavingsMs || 0) - (a.details?.overallSavingsMs || 0))
      .slice(0, 10);

    if (opportunities.length === 0) {
      console.log('No significant opportunities found - great job!');
    } else {
      for (const opp of opportunities) {
        const savings = opp.details?.overallSavingsMs;
        const savingsStr = savings ? `(~${Math.round(savings)}ms savings)` : '';
        console.log(`\n❌ ${opp.title} ${savingsStr}`);
        if (opp.description) {
          console.log(`   ${opp.description.substring(0, 100)}...`);
        }

        // Show items if available
        if (opp.details?.items?.slice(0, 3)) {
          for (const item of opp.details.items.slice(0, 3)) {
            if (item.url) {
              const url = item.url.length > 60 ? item.url.substring(0, 60) + '...' : item.url;
              console.log(`   • ${url}`);
            }
          }
        }
      }
    }

    // Diagnostics
    console.log('\n\n🔬 DIAGNOSTICS (Mobile)');
    console.log('-'.repeat(70));

    const diagnostics = Object.values(mobileAudits)
      .filter(a => a.details?.type === 'table' && a.score !== null && a.score < 1 &&
                   !['opportunity'].includes(a.details?.type))
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .slice(0, 8);

    for (const diag of diagnostics) {
      const score = Math.round((diag.score || 0) * 100);
      console.log(`\n⚠️  ${diag.title} (Score: ${score})`);
      if (diag.displayValue) {
        console.log(`   Value: ${diag.displayValue}`);
      }
    }

    // LCP Element
    const lcpElement = mobileAudits['largest-contentful-paint-element'];
    if (lcpElement?.details?.items?.[0]) {
      console.log('\n\n🖼️  LCP ELEMENT');
      console.log('-'.repeat(70));
      const item = lcpElement.details.items[0];
      console.log(`Element: ${item.node?.snippet || 'Unknown'}`);
    }

    // Render Blocking Resources
    const renderBlocking = mobileAudits['render-blocking-resources'];
    if (renderBlocking?.details?.items?.length > 0) {
      console.log('\n\n🚫 RENDER-BLOCKING RESOURCES');
      console.log('-'.repeat(70));
      for (const item of renderBlocking.details.items.slice(0, 5)) {
        const url = item.url?.split('/').pop() || item.url;
        console.log(`• ${url} (${Math.round(item.wastedMs || 0)}ms)`);
      }
    }

    // Unused JavaScript
    const unusedJs = mobileAudits['unused-javascript'];
    if (unusedJs?.details?.items?.length > 0) {
      console.log('\n\n📦 UNUSED JAVASCRIPT');
      console.log('-'.repeat(70));
      const totalWasted = unusedJs.details.items.reduce((sum, i) => sum + (i.wastedBytes || 0), 0);
      console.log(`Total potential savings: ${Math.round(totalWasted / 1024)}KB`);
      for (const item of unusedJs.details.items.slice(0, 5)) {
        const url = item.url?.split('/').pop() || item.url;
        const wasted = Math.round((item.wastedBytes || 0) / 1024);
        console.log(`• ${url} (~${wasted}KB unused)`);
      }
    }

    // Third Party Summary
    const thirdParty = mobileAudits['third-party-summary'];
    if (thirdParty?.details?.items?.length > 0) {
      console.log('\n\n🌐 THIRD-PARTY IMPACT');
      console.log('-'.repeat(70));
      for (const item of thirdParty.details.items.slice(0, 5)) {
        console.log(`• ${item.entity} - ${Math.round(item.blockingTime || 0)}ms blocking`);
      }
    }

    console.log('\n\n' + '='.repeat(70));
    console.log('Reports saved: lighthouse-mobile.html, lighthouse-desktop.html');
    console.log('='.repeat(70) + '\n');

    // Save JSON summary
    const summary = {
      url: URL,
      date: new Date().toISOString(),
      mobile: {
        scores: {
          performance: Math.round(mobileLhr.categories.performance.score * 100),
          accessibility: Math.round(mobileLhr.categories.accessibility.score * 100),
          bestPractices: Math.round(mobileLhr.categories['best-practices'].score * 100),
          seo: Math.round(mobileLhr.categories.seo.score * 100),
        },
        metrics: {
          fcp: Math.round(mobileAudits['first-contentful-paint'].numericValue),
          lcp: Math.round(mobileAudits['largest-contentful-paint'].numericValue),
          tbt: Math.round(mobileAudits['total-blocking-time'].numericValue),
          cls: mobileAudits['cumulative-layout-shift'].numericValue,
          speedIndex: Math.round(mobileAudits['speed-index'].numericValue),
        },
      },
      desktop: {
        scores: {
          performance: Math.round(desktopLhr.categories.performance.score * 100),
          accessibility: Math.round(desktopLhr.categories.accessibility.score * 100),
          bestPractices: Math.round(desktopLhr.categories['best-practices'].score * 100),
          seo: Math.round(desktopLhr.categories.seo.score * 100),
        },
        metrics: {
          fcp: Math.round(desktopAudits['first-contentful-paint'].numericValue),
          lcp: Math.round(desktopAudits['largest-contentful-paint'].numericValue),
          tbt: Math.round(desktopAudits['total-blocking-time'].numericValue),
          cls: desktopAudits['cumulative-layout-shift'].numericValue,
          speedIndex: Math.round(desktopAudits['speed-index'].numericValue),
        },
      },
    };

    fs.writeFileSync('lighthouse-summary.json', JSON.stringify(summary, null, 2));

  } catch (error) {
    console.error('Error running Lighthouse:', error);
    process.exit(1);
  }
}

main();

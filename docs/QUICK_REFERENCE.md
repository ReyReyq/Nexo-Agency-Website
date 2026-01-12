# Looker Studio GA4 Quick Reference Guide

## Connection Quick Start

### Connecting GA4 in 5 Steps
1. Go to https://looker.studio
2. Click "Create" → "Report"
3. Click "Create Data Source" → "Google Analytics"
4. Click "AUTHORIZE" and grant permissions
5. Select GA4 property and click "CONNECT"

### What to Do If Connection Fails
- Verify you have Admin access to GA4 property
- Check you're using the correct Google account
- Try signing out and back in
- Clear browser cache and cookies
- Use private/incognito browser window

---

## Most Used GA4 Metrics & Dimensions

### Top 5 Metrics for Any Dashboard
| Metric | Good For | Formula |
|--------|----------|---------|
| Users | Growth tracking | Unique visitors |
| Sessions | Engagement | Site interactions |
| Conversions | Goal tracking | Goal completions |
| Revenue | E-commerce | Transaction value |
| ROAS | Ad efficiency | Revenue / Ad Spend |

### Top 5 Dimensions for Breakdown
| Dimension | Use Case |
|-----------|----------|
| Date | Time-based trends |
| Source/Medium | Traffic sources |
| Device Category | Mobile vs Desktop |
| Campaign | Campaign performance |
| Country | Geographic analysis |

---

## Chart Selection Cheat Sheet

### When to Use Each Chart Type
```
SINGLE METRIC?
├─ No breakdown needed? → Scorecard
└─ Compare to goal? → Gauge

TIME-SERIES DATA?
├─ Single metric? → Line Chart
├─ Multiple metrics? → Combo Chart
└─ Forecast needed? → Line Chart + Forecast

COMPARING CATEGORIES?
├─ Few options (2-5)? → Pie Chart
├─ Many options (5+)? → Bar Chart
└─ Rankings important? → Bar Chart

DETAILED ANALYSIS?
├─ Many dimensions? → Table
├─ Need to see relationships? → Table
└─ Multiple conditions? → Table
```

---

## Common KPI Setups

### E-Commerce Starter Dashboard
```
KPIs to Track:
- Revenue (daily, weekly, monthly)
- Average Order Value
- Conversion Rate
- Users
- Transactions

Charts:
- Revenue Trend (Line)
- Traffic by Source (Bar)
- Device Breakdown (Pie)
- Top Products (Table)
- Conversion Funnel (Table)
```

### SaaS/Lead Generation Dashboard
```
KPIs to Track:
- Users
- Engaged Sessions %
- Form Submissions
- Cost Per Lead
- Sessions

Charts:
- Visitor Trend (Line)
- Traffic by Channel (Bar)
- Conversion by Source (Table)
- Lead Quality (Scorecard)
- Device Performance (Table)
```

### Blog/Content Dashboard
```
KPIs to Track:
- Pageviews
- Avg Time on Page
- Bounce Rate
- Engagement Rate
- Traffic from Organic

Charts:
- Traffic Trend (Line)
- Top Posts (Bar)
- Traffic Source (Pie)
- Engagement Score (Table)
- Organic vs Other (Pie)
```

### Paid Ads Dashboard
```
KPIs to Track:
- ROAS
- Cost Per Conversion
- Click-Through Rate
- Conversion Rate
- Return on Investment

Charts:
- ROAS Trend (Line)
- ROAS by Campaign (Bar)
- Spend vs Revenue (Combo)
- Campaign Performance (Table)
- Efficiency Score (Gauge)
```

---

## Filter Quick Guide

### How to Add a Filter
1. Click "Add a filter"
2. Choose filter type:
   - **Date Range**: For time periods
   - **Dropdown**: For 1 selection
   - **Fixed-size list**: For multiple selections
   - **Checkbox**: For Yes/No
3. Set default value
4. Click "Apply"

### Essential Filters by Dashboard Type
```
Executive Dashboard:
- Date Range (default: Last Month)

Traffic Analysis:
- Date Range
- Source/Medium
- Device Category

Conversion Dashboard:
- Date Range
- Campaign
- Geographic Location

Multi-Client (Agency):
- Date Range
- Client Name
- Campaign Status
```

---

## Formatting Quick Tips

### Number Formatting
```
Currency: $1,234.56
Percentage: 45.2%
Decimals: 2.50 (vs 2.5)
Thousands: 1,234 (vs 1234)
Abbreviated: 1.2K (vs 1,234)
```

### Color Best Practices
```
✓ Good: High contrast between background and text
✓ Good: Consistent color meaning (Green=Good, Red=Bad)
✓ Good: Colorblind-friendly palette
✗ Avoid: Too many colors (max 5-7)
✗ Avoid: Similar colors for different meanings
✗ Avoid: Red + Green without other indicators
```

### Date Format Standards
```
US: MM/DD/YYYY
ISO: YYYY-MM-DD (Recommended for reports)
Europe: DD/MM/YYYY
Readable: Month DD, YYYY
```

---

## Performance Optimization

### Speed Up Your Dashboard

**If dashboard loads slowly:**
1. Reduce number of charts (max 8-10 per page)
2. Shorten date range (90 days instead of 1 year)
3. Limit table rows (show top 20 instead of all)
4. Remove calculated fields where possible
5. Use simpler chart types
6. Compress all images

**If reports won't send:**
1. Check recipient email addresses are valid
2. Verify report has data
3. Ensure you have scheduling permissions
4. Check data source access permissions
5. Review Looker Studio notifications

---

## Automated Report Scheduling

### Schedule Template
```
CLIENT REPORTS:
- Day: Monday
- Time: 7:00 AM
- Recipients: client@company.com, manager@agency.com
- Pages: 1-3 (Summary + Metrics)
- Frequency: Weekly
- Include: PDF only

EXECUTIVE REPORTS:
- Day: Friday
- Time: 4:00 PM
- Recipients: executive@company.com
- Pages: 1 (Summary only)
- Frequency: Weekly

TEAM REPORTS:
- Day: Tuesday
- Time: 8:00 AM
- Recipients: team@agency.com
- Pages: All
- Frequency: Daily
```

### To Create Schedule:
1. Click "Share"
2. Select "Schedule delivery"
3. Enter recipient emails
4. Choose pages
5. Set date and time
6. Select frequency
7. Click "Create schedule"

---

## Mobile Optimization

### Making Dashboards Mobile-Friendly

```
Use Responsive Layout:
✓ Automatically adjusts to screen size
✓ Charts stack vertically on mobile
✓ Touch-friendly interface
✓ Same data, cleaner view

Tips:
- Limit filters to essential ones
- Use scorecards for key metrics
- Tables show less detail on mobile
- Test on actual devices
- Verify images scale properly
```

---

## Common Issues & Fixes

### Issue: Data Shows in GA4 but Not in Looker Studio
**Solution:**
1. Check date range overlaps data collection start
2. Verify all filters are correct
3. Test with simple metric (Users) first
4. Wait 24-48 hours for data processing
5. Check data source has correct property selected

### Issue: Numbers Don't Match Between GA4 and Looker Studio
**Possible Causes:**
- Sampling applied (check date range)
- Different filters applied
- Timezone mismatch
- Custom metrics definition differs

**Solution:**
- Use same date range and filters in both
- Verify timezone in both tools
- Create test metric and compare

### Issue: Chart Is Blank or Shows "No Data"
**Solution:**
1. Check date range has data
2. Verify metric/dimension combination is valid
3. Try different chart type
4. Remove filters to test
5. Check data source connection

### Issue: Report Won't Send via Email
**Solution:**
1. Verify recipient email is valid
2. Check you have scheduling permissions
3. Confirm data source connection is active
4. Test report loads in browser first
5. Check Looker Studio status page for outages

### Issue: Dashboard Takes Too Long to Load
**Solution:**
1. Remove unused charts (max 8-10 per page)
2. Shorten date range for detailed views
3. Limit table results to top 20-50 rows
4. Use calculated fields sparingly
5. Optimize images (under 100KB each)

---

## GA4 Metrics Glossary

### Acquisition Metrics
- **Users**: Unique visitors to your site/app
- **New Users**: First-time visitors
- **Sessions**: Total user sessions (resets after 30 min inactivity)
- **Source**: Where traffic came from (google, direct, facebook, etc.)
- **Medium**: Type of traffic (organic, cpc, referral, etc.)
- **Campaign**: Marketing campaign name

### Engagement Metrics
- **Engaged Sessions**: Sessions with meaningful user interaction
- **Engagement Rate**: % of sessions that were engaged (GA4 quality metric)
- **Average Session Duration**: Time user spent in session
- **Events**: User actions (clicks, form submissions, etc.)
- **Event Count**: Total number of events fired

### Conversion Metrics
- **Conversions**: Goal/event completions (configured in GA4)
- **Conversion Rate**: % of sessions that converted
- **Transactions**: E-commerce orders completed
- **Revenue**: Total transaction value
- **Ecommerce Purchase Quantity**: Total items purchased

### Quality Metrics
- **Bounce Rate**: % of single-event sessions
- **Device Category**: Desktop, Mobile, or Tablet
- **Browser**: Browser type
- **Operating System**: Windows, Mac, iOS, Android, etc.
- **Country**: Geographic location

---

## Data Source Reference

### Looker Studio Data Source Basics
```
What is a Data Source?
- Connection between Looker Studio and GA4
- Defines available metrics and dimensions
- Manages data credentials
- Can be shared across reports

Types:
- GA4 (native Google connector)
- Google Ads
- Search Console
- Third-party (Supermetrics, etc.)

Credentials:
- Owner's Credentials: Others see same data
- Viewer's Credentials: Each person sees their own data
```

### Data Blending
```
What is Blending?
- Combining data from multiple sources
- Link by common dimension (Date, Campaign, etc.)
- Create unified dashboard

Example: GA4 + Google Ads
1. Create GA4 chart with Revenue
2. Create Google Ads chart with Cost
3. Blend on: Date, Campaign
4. Calculate: ROAS = Revenue / Cost
5. Visualize combined metric
```

---

## Template Overview

### Dashboard Templates Included
1. **Executive Summary** - One-page KPI overview
2. **Performance Dashboard** - 4-page client reporting
3. **Agency Dashboard** - Multi-client tracking
4. **E-Commerce Dashboard** - Sales and product metrics
5. **Content Dashboard** - Blog and content performance

### Using Templates
1. Start with template matching your need
2. Customize KPIs for your business
3. Update GA4 property connection
4. Adjust colors and branding
5. Test with sample data
6. Set up scheduled delivery
7. Train team on dashboard usage

---

## Reporting Best Practices

### What to Include in Client Reports
✓ Clear title and date range
✓ Executive summary (3-5 key findings)
✓ KPI scorecards (4-6 metrics)
✓ Trend charts (showing progress)
✓ Comparison data (MoM or YoY)
✓ Actionable recommendations
✓ Questions/notes section
✗ Avoid: Too many charts
✗ Avoid: Overly technical metrics
✗ Avoid: Unexplained data drops

### What to Include in Internal Reports
✓ All relevant metrics and dimensions
✓ Detailed breakdowns by channel
✓ Detailed tables for analysis
✓ Filters for deeper exploration
✓ Technical notes and disclaimers
✓ Data quality indicators
✓ Multiple pages for different analyses

---

## Advanced Features

### Calculated Metrics
```
Common Formulas:
- ROAS = Revenue / Cost
- CAC = Marketing Cost / New Customers
- LTV = Customer Lifetime Value
- CTR = Clicks / Impressions
- CPC = Cost / Clicks
```

### Blending Data
```
Steps:
1. Create base chart (GA4 revenue)
2. Create second chart (Google Ads spend)
3. Use same dimension (Date, Campaign)
4. Looker Studio automatically blends
5. Create calculated metric
```

### Real-Time Dashboards
```
For Live Monitoring:
- Add Real-Time metric
- Refresh every 30 seconds
- Show last 24 hours only
- Use simple scorecards
- Not for historical analysis
```

---

## Resources

### Official Documentation
- [Looker Studio Help](https://support.google.com/looker-studio)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9744165)
- [GA4 Metrics Definition](https://support.google.com/analytics/answer/11986666)

### Key Files in This Package
- `LOOKER_STUDIO_GA4_GUIDE.md` - Complete guide
- `implementation-guide.md` - Step-by-step setup
- `dashboard-templates.json` - Template configurations
- `QUICK_REFERENCE.md` - This file

### Support
- Check Looker Studio status: https://status.google.com/
- GA4 community: https://support.google.com/analytics/community
- Report bugs: https://issuetracker.google.com/

---

## Keyboard Shortcuts (Looker Studio)

```
Dashboard Editing:
Ctrl/Cmd + Z         Undo
Ctrl/Cmd + Shift + Z Redo
Ctrl/Cmd + C         Copy element
Ctrl/Cmd + V         Paste element
Delete               Delete selected element

Viewing Reports:
Ctrl/Cmd + P         Print
Ctrl/Cmd + S         Save changes
Escape              Exit edit mode
```

---

## Monthly Maintenance Checklist

- [ ] Review dashboard for accuracy
- [ ] Check automated schedules are sending
- [ ] Verify KPI targets are current
- [ ] Look for new insights or anomalies
- [ ] Test filters and drill-downs
- [ ] Update outdated information
- [ ] Gather team feedback
- [ ] Archive old versions
- [ ] Test on mobile devices
- [ ] Document any changes

---

## Next Steps

1. **Start Simple**: Create one-page executive dashboard first
2. **Test Thoroughly**: Verify data matches GA4 before sharing
3. **Get Feedback**: Share with team, iterate based on input
4. **Scale Up**: Add additional pages and dashboards as needed
5. **Automate**: Set up email schedules for stakeholders
6. **Optimize**: Monitor performance, make improvements
7. **Train**: Ensure team knows how to use dashboards
8. **Maintain**: Regular updates and optimization


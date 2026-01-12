# GA4 Custom Dimensions and Metrics Setup for Lead Generation Websites
## Comprehensive Research and Implementation Guide

---

## Executive Summary

This guide provides detailed recommendations for setting up GA4 custom dimensions and metrics specifically for web agency lead generation websites. It covers best practices, implementation strategies, quota management, and specific recommendations tailored to a service-based business model.

---

## Part 1: Understanding GA4 Custom Dimensions and Metrics

### What Are Custom Dimensions and Metrics?

**Custom Dimensions:** User-created attributes that extend GA4's standard data collection to capture business-specific information about users, events, or items. They enable detailed segmentation and analysis beyond GA4's predefined dimensions.

**Custom Metrics:** User-defined numerical values that track specific interactions or behaviors not covered by GA4's default metrics. Custom metrics transform event parameters into actionable quantitative insights.

### Key Difference from UA

Unlike Universal Analytics where custom dimensions had strict limits, GA4 custom dimensions and metrics provide more flexibility and are directly tied to event parameters, making implementation simpler through Google Tag Manager.

---

## Part 2: Custom Dimensions - Scope and Application

### Scope Types and Selection

#### User-Scoped Custom Dimensions (25 maximum)

**Definition:** Applied to individual users and persist across all their future events until overwritten.

**Characteristics:**
- Data remains constant throughout user session and beyond
- New values replace previous values
- Applied retroactively only from the point of registration forward
- Ideal for relatively stable user attributes

**When to Use:**
- Information that doesn't change frequently
- Attributes that should appear in all user events
- Cross-session, cross-device user attributes (when implementing with User-ID)

**Best Examples for Web Agency:**
- `user_plan_type` - Prospect, Client, Past Client, Partner
- `user_lead_source_category` - Organic Search, Paid Ads, Referral, Direct
- `user_industry_segment` - Tech, Healthcare, Finance, E-commerce, Other
- `user_company_size` - Startup, SMB, Enterprise
- `user_location_country` - Geographic location
- `user_subscription_status` - Subscribed, Unsubscribed, Bounced
- `user_first_interaction_channel` - Attribution tracking
- `user_language_preference` - Language selection or browser language

**Implementation Pattern:**
```
// In GTM - Set user-scoped dimension when user info is available
fireEvent('page_view', {
  'user_plan_type': 'prospect',
  'user_lead_source_category': 'organic'
})
```

#### Event-Scoped Custom Dimensions (50 maximum)

**Definition:** Specific to individual events; they don't carry forward to subsequent events.

**Characteristics:**
- Only associated with the specific event they're sent with
- Ideal for variable, action-specific data
- More suitable for high-cardinality data
- Can change with every event

**When to Use:**
- Data specific to individual actions or interactions
- Variable values that differ across events
- Form-specific, page-specific, or interaction-specific data
- Categorical data about user actions

**Best Examples for Web Agency:**
- `form_type` - Contact, Quote Request, Newsletter, Demo Book, Consultation
- `form_name` - specific_form_identifier
- `form_location` - Hero, Sidebar, Footer, Modal, Dedicated Page
- `form_step_number` - Step number in multi-step forms
- `page_section_viewed` - Hero, Services, Testimonials, Pricing, CTA
- `content_type` - Blog Article, Case Study, Whitepaper, Video
- `service_category` - Web Development, Digital Marketing, Branding, etc.
- `cta_button_text` - Exact text of clicked CTA
- `cta_button_location` - Where on page the CTA was located
- `video_title` - Name of watched video
- `contact_method` - Email, Phone, Chat, Form
- `page_template_type` - Home, Service, Blog, Contact, Pricing
- `product_viewed_category` - Service/product clicked
- `qualification_score` - Lead quality assessment (1-5)

**Implementation Pattern:**
```
// In GTM - Send event-scoped dimension with specific event
fireEvent('generate_lead', {
  'form_type': 'contact',
  'form_location': 'hero_section',
  'form_name': 'homepage_contact_form'
})
```

#### Item-Scoped Custom Dimensions (10 maximum, for ecommerce only)

**Note:** Primarily used for ecommerce implementations. Less relevant for service-based web agencies unless tracking service packages.

---

## Part 3: Custom Metrics for Business KPIs

### What Are Custom Metrics?

Custom metrics are always event-scoped numerical values derived from event parameters. They allow you to aggregate and analyze quantitative data specific to your business.

### Custom Metrics for Web Agency KPIs

**Quota: 50 custom metrics per standard GA4 property (125 for GA4 360)**

#### Recommended Custom Metrics

**1. Lead Quality and Scoring Metrics**

- **Metric Name:** `lead_quality_score`
  - **Purpose:** Track lead quality assessment (1-5 scale)
  - **Unit:** Standard
  - **Calculation:** Sum of quality scores assigned during lead capture
  - **Use Case:** Identify highest-value leads for priority follow-up

- **Metric Name:** `form_field_completion_percentage`
  - **Purpose:** Measure completeness of form submissions
  - **Unit:** Standard (percentage 0-100)
  - **Calculation:** (Completed fields / Total fields) × 100
  - **Use Case:** Identify abandonment patterns and form friction

**2. Engagement and Interaction Metrics**

- **Metric Name:** `content_downloads`
  - **Purpose:** Track resource downloads (whitepapers, case studies, guides)
  - **Unit:** Standard
  - **Calculation:** Count of download interactions
  - **Use Case:** Measure content engagement and intent signals

- **Metric Name:** `form_field_errors_per_submission`
  - **Purpose:** Count validation errors per form attempt
  - **Unit:** Standard
  - **Calculation:** Total field errors / Number of submissions
  - **Use Case:** Optimize form validation and UX

- **Metric Name:** `time_spent_on_service_page`
  - **Purpose:** Engagement metric for service pages
  - **Unit:** Seconds
  - **Calculation:** Time elapsed on service-specific pages
  - **Use Case:** Identify high-intent pages and service interest

- **Metric Name:** `scroll_depth_percentage`
  - **Purpose:** How far users scroll on pages
  - **Unit:** Standard (0-100)
  - **Calculation:** (Final scroll position / Page height) × 100
  - **Use Case:** Assess content visibility and page effectiveness

**3. Conversion Path Metrics**

- **Metric Name:** `pages_viewed_before_conversion`
  - **Purpose:** Count pages viewed in conversion path
  - **Unit:** Standard
  - **Calculation:** Number of pages viewed before conversion
  - **Use Case:** Understand conversion funnel length

- **Metric Name:** `time_to_conversion_minutes`
  - **Purpose:** Duration from first visit to conversion
  - **Unit:** Standard (minutes)
  - **Calculation:** (Conversion time - First interaction time) / 60
  - **Use Case:** Assess sales cycle length

**4. Campaign Performance Metrics**

- **Metric Name:** `qualified_lead_count`
  - **Purpose:** Count of leads meeting qualification criteria
  - **Unit:** Standard
  - **Calculation:** Count of leads with quality score >= 3
  - **Use Case:** Measure campaign effectiveness

- **Metric Name:** `form_completion_value`
  - **Purpose:** Assign monetary value to form completions
  - **Unit:** Currency (USD)
  - **Calculation:** Based on lead value estimation model
  - **Use Case:** Calculate ROI on marketing campaigns

**5. User Experience Metrics**

- **Metric Name:** `phone_number_calls`
  - **Purpose:** Count of phone call interactions
  - **Unit:** Standard
  - **Calculation:** Count of click-to-call events
  - **Use Case:** Track alternative conversion paths

- **Metric Name:** `live_chat_initiations`
  - **Purpose:** Count of live chat starts
  - **Unit:** Standard
  - **Calculation:** Count of chat widget initiations
  - **Use Case:** Measure real-time engagement

---

## Part 4: GA4 Limits and Quotas

### Summary Table

| Category | Standard Property | GA4 360 |
|----------|------------------|---------|
| User-Scoped Dimensions | 25 | 100 |
| Event-Scoped Dimensions | 50 | 125 |
| Item-Scoped Dimensions | 10 | 25 |
| Custom Metrics | 50 | 125 |
| Event Types | 500 distinct | 500 distinct |
| Event Parameters | 25 per event | 25 per event |
| Event Name Length | 40 characters | 40 characters |
| Parameter Name Length | 40 characters | 40 characters |
| User-Scoped Dimension Value Length | 36 characters | 36 characters |
| Event-Scoped Dimension Value Length | 100 characters | 100 characters |
| Monthly Event Limit | Unlimited* | 10 billion |

*Free GA4 has practical limits; sampling may occur with very high event volume

### Key Quota Management Rules

**Dimension Deletion Policy:**
- Must wait 48 hours after deletion before creating a new dimension
- Plan carefully before creating to avoid hitting limits
- Review existing dimensions quarterly to remove unused ones

**Parameter Naming:**
- Parameter names in events must match dimension registration names exactly
- Case-sensitive
- Limited to 40 characters
- Cannot start with numbers or special characters

**Data Processing:**
- New custom dimensions take up to 24 hours to appear in reports
- Historical data won't be populated retroactively
- Dimension registration should happen before events are sent

---

## Part 5: Best Practices for Naming and Organization

### Naming Conventions

#### General Principles

1. **Use Snake_Case for Parameter Names**
   ```
   Good: form_completion_status, lead_quality_score
   Avoid: Form Completion Status, formCompletionStatus, form-completion-status
   ```

2. **Use Clear, Descriptive Names**
   ```
   Good: contact_form_location, service_category
   Avoid: form_x, cat1, var_a
   ```

3. **Use Consistent Prefixes by Scope**
   ```
   User-Scoped: user_*,
   Example: user_plan_type, user_lead_source, user_industry

   Event-Scoped: event_*, form_*, page_*, or interaction_*
   Example: form_type, page_section, interaction_method
   ```

4. **Avoid Generic Names**
   ```
   Good: form_type_contact_form
   Avoid: form_type, type, name
   ```

5. **Be Specific with Context**
   ```
   Good: cta_button_location_hero, cta_button_text
   Avoid: button, location, text
   ```

#### Naming Examples by Category

**User Dimensions (Prefix: user_)**
```
user_plan_type
user_lead_source_category
user_industry_segment
user_company_size
user_location_country
user_subscription_status
user_first_touch_channel
```

**Form Dimensions (Prefix: form_)**
```
form_type
form_location
form_name
form_step_number
form_field_count
form_completion_status
```

**Content Dimensions (Prefix: content_)**
```
content_type
content_title
content_category
content_author
content_language
```

**Service Dimensions (Prefix: service_)**
```
service_category
service_name
service_pricing_tier
service_detail_viewed
```

**Engagement Dimensions (Prefix: engagement_)**
```
engagement_type
engagement_duration_bucket
engagement_device_type
engagement_scroll_depth
```

### Organization Strategy

**Recommended Folder/Category System:**

1. **Lead Generation Dimensions** (10-12 dimensions)
   - Form tracking
   - Lead qualification
   - Lead source attribution

2. **User Profile Dimensions** (6-8 dimensions)
   - Demographics (company size, industry, location)
   - Status (prospect, client, partner)
   - Preferences (language, subscription)

3. **Content Engagement Dimensions** (8-10 dimensions)
   - Content type and category
   - Video/resource interaction
   - Blog post details

4. **Page and Service Dimensions** (6-8 dimensions)
   - Page type and section
   - Service category
   - CTA details

5. **Conversion Path Dimensions** (4-6 dimensions)
   - Funnel stage
   - Device/browser info
   - Experiment variant

**Documentation Template:**

Create a spreadsheet with columns:
- Dimension Name
- Scope (User/Event)
- Description
- Value Examples
- Owner/Team
- Last Updated
- Status (Active/Inactive)
- Related Events

---

## Part 6: Registration and Implementation Process

### Step-by-Step Registration in GA4

**For Custom Dimensions:**

1. Navigate to Admin → Data Display → Custom Definitions
2. Select "Custom Dimensions"
3. Click "Create Custom Dimension"
4. Fill in:
   - Dimension Name (max 24 characters for user-scoped)
   - Scope (User or Event)
   - Description (optional but recommended)
   - Parameter Name (must match GTM parameter exactly)
5. Click Create
6. Verify registration successful (check Quota Information)

**For Custom Metrics:**

1. Navigate to Admin → Data Display → Custom Definitions
2. Select "Custom Metrics"
3. Click "Create Custom Metric"
4. Fill in:
   - Metric Name (max 24 characters)
   - Description (optional)
   - Event Parameters (select which event parameter to aggregate)
   - Unit (Standard, Currency, Seconds, or Percentage)
5. Click Create
6. Wait 24-48 hours for availability in reports

### Implementation via Google Tag Manager

**GTM Configuration Steps:**

1. **Create Custom Event in GTM**
   - New Tag → Google Analytics: GA4 Event
   - Set Event Name (e.g., generate_lead, form_submission)

2. **Add Event Parameters**
   - Click Add Event Parameter
   - Key: parameter_name (must match GA4 registration)
   - Value: {{variable_name}} or static value

3. **Use Predefined or Custom Variables**
   ```
   form_name: {{Form Name Variable}}
   form_location: {{Form Location Variable}}
   lead_quality_score: {{Lead Score Variable}}
   user_plan_type: {{User Plan Variable}}
   ```

4. **Test in Preview Mode**
   - Enable GTM Preview
   - Enable GA4 DebugView
   - Verify parameters appear in real-time

### Verification Checklist

- Parameter names match exactly between GTM and GA4
- Scope selection correct (user vs event)
- No special characters in parameter names
- Maximum character limits observed
- Unique parameter names (no duplicates across events)
- Documentation updated with implementation details
- Test events fired successfully in GA4 DebugView
- Wait 24 hours for dimension/metric to appear in reports

---

## Part 7: Recommended Setup for Web Agency Lead Generation

### Specific Recommendations for Nexo (Web Agency Example)

#### Phase 1: Essential Dimensions (Day 1)

**User-Scoped (6 of 25):**

1. `user_lead_source_category`
   - Values: organic, paid_search, paid_social, referral, direct, email, partnership
   - Purpose: Primary traffic attribution

2. `user_company_size`
   - Values: startup, smb_10_50, smb_51_250, enterprise_250_1k, enterprise_1k_plus
   - Purpose: Market segmentation for targeting

3. `user_industry_segment`
   - Values: tech, healthcare, finance, ecommerce, manufacturing, other
   - Purpose: Service line relevance and upsell opportunities

4. `user_location_country`
   - Values: US, CA, UK, AU, etc. (ISO country codes)
   - Purpose: Geographic market analysis

5. `user_client_status`
   - Values: prospect, current_client, past_client, partner, competitor
   - Purpose: Sales pipeline tracking and remarketing

6. `user_qualification_tier`
   - Values: hot, warm, cold, unqualified
   - Purpose: Lead prioritization for sales team

**Event-Scoped (10 of 50):**

1. `form_type`
   - Values: contact, quote_request, consultation_book, newsletter, demo_request
   - Purpose: Distinguish conversion types

2. `form_name`
   - Values: homepage_contact, services_quote, about_consultation, etc.
   - Purpose: Track specific form performance

3. `form_location`
   - Values: hero, sidebar, footer, modal, dedicated_page, sticky
   - Purpose: Optimize placement for conversions

4. `service_category_viewed`
   - Values: web_development, digital_marketing, branding, consulting, maintenance
   - Purpose: Service interest tracking

5. `page_type_viewed`
   - Values: home, service_detail, about, blog, contact, pricing, case_study
   - Purpose: Content path analysis

6. `cta_button_text`
   - Values: actual button text (Get Started, Learn More, Book Call, etc.)
   - Purpose: CTA effectiveness testing

7. `contact_method_used`
   - Values: form, phone, chat, email, social
   - Purpose: Preferred contact channel analysis

8. `qualification_response`
   - Values: interested, not_interested, needs_more_info, follow_up_needed
   - Purpose: Lead qualification capture

9. `content_resource_type`
   - Values: whitepaper, case_study, guide, video, template, checklist
   - Purpose: Content engagement tracking

10. `device_category_interaction`
    - Values: mobile, tablet, desktop
    - Purpose: Device-specific optimization

#### Phase 2: Business KPI Metrics (Week 1)

**Event-Scoped Custom Metrics:**

1. **form_completion_count**
   - Unit: Standard
   - Parameter: form_submit_count (count = 1 per submission)
   - Purpose: Total lead volume tracking

2. **qualified_lead_count**
   - Unit: Standard
   - Parameter: qualified_lead (count = 1 if qualification_tier = hot)
   - Purpose: High-value lead tracking

3. **form_completion_value**
   - Unit: Currency (USD)
   - Parameter: form_lead_value (estimated value per lead)
   - Purpose: Revenue impact analysis

4. **pages_viewed_before_conversion**
   - Unit: Standard
   - Parameter: page_count_in_session (count of pages)
   - Purpose: Engagement depth measurement

5. **form_field_completion_rate**
   - Unit: Percentage (0-100)
   - Parameter: field_completion_percentage
   - Purpose: Form UX optimization

#### Phase 3: Advanced Metrics (Month 1)

**Additional Custom Metrics:**

6. **high_intent_behavior_score**
   - Unit: Standard
   - Parameter: intent_score (calculated from multiple signals)
   - Purpose: Predictive lead scoring

7. **content_engagement_time**
   - Unit: Seconds
   - Parameter: engagement_time_seconds
   - Purpose: Content effectiveness

8. **service_exploration_depth**
   - Unit: Standard
   - Parameter: services_viewed_count
   - Purpose: Purchase intent indicator

### Events to Mark as Conversions

In GA4 Admin → Events, mark these as conversions:

1. **generate_lead** (primary conversion)
   - Trigger: Form submission
   - Priority: Highest

2. **qualify_lead** (secondary conversion)
   - Trigger: High-quality lead identification
   - Priority: High

3. **form_start** (engagement metric)
   - Trigger: User starts form interaction
   - Priority: Medium (for funnel analysis)

### Sample GTM Implementation Configuration

**Example: Contact Form Submission Event**

```
Event Name: generate_lead
Event Parameters:
  - form_type: contact
  - form_name: {{Form_Name_Variable}}
  - form_location: {{Form_Location_Variable}}
  - service_category_viewed: {{Last_Service_Viewed}}
  - pages_viewed_in_session: {{Page_Count_Variable}}
  - time_to_conversion: {{Time_Since_First_Visit}}
  - contact_method_used: form
  - user_lead_source_category: {{Traffic_Source}}
  - user_company_size: {{Company_Size_Field_Value}}
  - user_industry_segment: {{Industry_Field_Value}}
  - user_qualification_tier: {{Qualification_Score}}
  - qualified_lead: 1 (if score >= 3, else 0)
  - form_lead_value: 500 (estimated USD value)
```

---

## Part 8: Avoiding Common Mistakes

### High-Cardinality Data Pitfalls

**Problem:** Creating dimensions with too many unique values dilutes reporting and causes data to group under "(other)"

**Examples to Avoid:**
- Email addresses as dimension values
- Full form input content
- Long-tail keywords
- Individual user IDs
- Complete URLs

**Solution:**
- Use bucketing/categorization (e.g., company_size ranges)
- Use predetermined categories from dropdowns
- Limit values to meaningful groupings (max 100-200 unique values per dimension)

### Duplicate Parameter Fragmentation

**Problem:** Same data sent under different parameter names causes splits in reporting

**Examples:**
```
Bad: lead_source, source, traffic_source, utm_source
Better: user_lead_source_category (standardized, single parameter)
```

**Solution:**
- Maintain centralized parameter naming documentation
- Use single parameter for each data point
- Consolidate existing duplicates before creating dimensions

### Scope Mismatch Issues

**Problem:** Registering a parameter with wrong scope prevents proper reporting

**Scenario 1 - Incorrect:**
```
- Parameter sent as event-scoped: send form_type with each event
- Registered as user-scoped: only captures with user-property changes
- Result: Missing data in reports
```

**Scenario 2 - Correct:**
```
- Parameter sent as event-scoped: form_type sent with generate_lead event
- Registered as event-scoped: captures with each generate_lead event
- Result: Accurate form tracking
```

**Prevention:**
- Document how each parameter is sent (which events)
- Match scope to send pattern
- Test in DebugView before production

### Missing Dimension Registration

**Problem:** Sending parameters to GA4 without registering as custom dimensions

**Impact:**
- Parameters still collected but not available for reporting
- Data waste without actionable insights
- Confusion about data availability

**Solution:**
- Register dimension BEFORE or immediately after first event sends it
- Create registration spreadsheet tracking status
- Use quota information dashboard to monitor utilization

---

## Part 9: Reporting and Analysis with Custom Dimensions/Metrics

### Using Custom Dimensions in Reports

**In Standard Reports:**
1. Open any report
2. Add dimension: Click "+" next to dimensions
3. Search for custom dimension name
4. Dimension now segments report data

**In Explorations:**
1. Create new Exploration
2. Add custom dimension to Dimensions panel
3. Add metrics to Metrics panel
4. Build custom analysis

**Recommended Report Combinations:**

1. **Lead Source Performance**
   - Dimension: user_lead_source_category
   - Metrics: form_completion_count, qualified_lead_count, form_completion_value
   - Purpose: ROI by channel

2. **Service Interest Analysis**
   - Dimension: service_category_viewed
   - Metrics: pages_viewed_before_conversion, form_completion_count, form_completion_value
   - Purpose: Service line performance

3. **Form Optimization Analysis**
   - Dimension: form_location, form_type
   - Metrics: form_field_completion_rate, form_completion_count
   - Purpose: Form placement and design testing

4. **Lead Quality Funnel**
   - Dimensions: user_qualification_tier, form_type
   - Metrics: qualified_lead_count, form_completion_value
   - Purpose: Conversion quality analysis

### Dashboard Recommendations

**Create a GA4 Dashboard with:**

1. **Lead Generation Overview**
   - Total leads (form_completion_count)
   - Qualified leads (qualified_lead_count)
   - Average lead value (form_completion_value)
   - Conversion rate (conversions / sessions)

2. **Channel Performance**
   - Leads by source (user_lead_source_category)
   - Cost per lead (with CPA data)
   - Lead quality by source

3. **Form Performance**
   - Submissions by type and location
   - Field completion rates
   - Drop-off rates by step

4. **Service Performance**
   - Interest by service category
   - Service page conversion rates
   - Cross-sell opportunities

---

## Part 10: Implementation Timeline and Rollout Plan

### Week 1: Planning and Setup
- Day 1-2: Finalize dimension and metric list with stakeholder approval
- Day 2-3: Create registration spreadsheet and documentation
- Day 4-5: Set up GA4 custom dimensions (Phase 1)
- Day 6-7: Configure GTM parameters and events

### Week 2: Configuration and Testing
- Day 1-2: Register custom metrics
- Day 3-4: Complete GTM tag configuration
- Day 5-6: Test all events in GTM Preview and GA4 DebugView
- Day 7: QA and validation

### Week 3: Monitoring and Refinement
- Days 1-5: Monitor data flow in GA4
- Days 5-7: Make necessary adjustments based on real data
- Document any changes to tracking plan

### Week 4+: Advanced Setup
- Implement Phase 2 and 3 dimensions/metrics
- Create custom reports and dashboards
- Set up automated alerts and goals
- Train team on using custom data

---

## Part 11: Compliance and Privacy Considerations

### GDPR and Privacy Compliance

**Data You SHOULD NOT Send:**
- Personal Identifiable Information (PII):
  - Email addresses
  - Phone numbers
  - Full names
  - Address details
  - Social Security numbers or IDs
  - Credit card information

**Safe Practices:**
- Use hashed or anonymized identifiers if needed
- Aggregate sensitive data (e.g., company size ranges instead of revenue)
- Implement consent mechanisms for custom data collection
- Review GA4's data retention policies
- Enable data anonymization settings in GA4

### CCPA Considerations

- Provide privacy policy transparency about custom data collection
- Allow users to opt-out of custom tracking
- Implement regional compliance settings (e.g., EU vs. US)
- Document data processing purposes

### Recommended Privacy-Compliant Data

All recommended dimensions in this guide are privacy-safe:
- Company demographics (size, industry) - OK
- Service interest (what they viewed) - OK
- Lead stage information - OK
- Geographic location (country) - OK
- Device information - OK

---

## Part 12: Migration and Scaling Considerations

### Scaling Beyond Standard GA4

**When to Upgrade to GA4 360:**
- Monthly tracked events exceed 1 billion
- Need more than 50 custom dimensions/metrics
- Require dedicated support and SLAs
- Need enhanced data retention (38 months)
- Want BigQuery integration at scale

**Benefits of GA4 360 for Large Agencies:**
- 100 user-scoped dimensions (vs. 25)
- 125 event-scoped dimensions (vs. 50)
- 125 custom metrics (vs. 50)
- Higher event limits
- Custom content groups
- Advanced attribution models

### Migration Best Practices

If migrating from Universal Analytics:
- Map old custom dimensions to new GA4 structure
- Re-evaluate business requirements for new tool
- Don't replicate legacy tracking issues
- Start fresh with new organization system
- Plan for 2-4 weeks full transition period

---

## Summary: Quick Reference Checklist

### Before Creating Custom Dimensions/Metrics

- [ ] Check existing GA4 dimensions won't accomplish goal
- [ ] Determine correct scope (user vs event)
- [ ] Choose low-cardinality values (avoid unique identifiers)
- [ ] Document naming convention and value examples
- [ ] Verify quota available (haven't hit limits)
- [ ] Plan GTM implementation strategy
- [ ] Get stakeholder approval

### During Implementation

- [ ] Register dimension/metric in GA4 Admin
- [ ] Configure GTM tags with parameters
- [ ] Parameter names match registration exactly
- [ ] Test in GTM Preview and GA4 DebugView
- [ ] Document all changes in tracking plan
- [ ] Add to team documentation/wiki

### After Implementation

- [ ] Wait 24-48 hours for availability
- [ ] Verify data appears in reports
- [ ] Monitor data quality and cardinality
- [ ] Create custom reports using new dimensions
- [ ] Train team on new tracking and reporting
- [ ] Schedule quarterly review of utilization

---

## Resources and References

- [GA4 Custom Dimensions and Metrics Official Guide](https://support.google.com/analytics/answer/14240153)
- [GA4 Custom Metrics Creation Guide](https://support.google.com/analytics/answer/14239619)
- [GA4 Lead Generation Reporting](https://support.google.com/analytics/answer/12944921)
- [GA4 Recommended Events](https://support.google.com/analytics/answer/9267735)
- [GA4 Configuration Limits](https://support.google.com/analytics/answer/12229528)
- [Google Tag Manager Implementation Guides](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)

---

**Document Version:** 1.0
**Last Updated:** January 2026
**Prepared for:** Web Agency Lead Generation Implementation

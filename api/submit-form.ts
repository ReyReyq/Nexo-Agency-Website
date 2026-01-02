/**
 * Vercel Serverless Function: Form Submission Handler
 * Sends form data to Airtable and Monday.com
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface FormData {
  name: string;
  phone: string;
  email?: string;
  budget?: string;
  message?: string;
  source?: string;
}

interface TrackingData {
  currentPageUrl: string;
  currentPagePath: string;
  currentPageTitle: string;
  referrerUrl: string;
  referrerDomain: string;
  landingPageUrl: string;
  landingPagePath: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  timestamp: string;
  sessionId: string;
}

interface SubmissionPayload {
  formData: FormData;
  tracking: TrackingData;
  trafficSourceSummary: string;
}

// Budget labels mapping
const budgetLabels: Record<string, string> = {
  '2-6k': '₪2,000 - ₪6,000',
  '6-10k': '₪6,000 - ₪10,000',
  '10-20k': '₪10,000 - ₪20,000',
  '20k+': '₪20,000+',
  'not-sure': 'לא ידוע',
};

// Source labels mapping
const sourceLabels: Record<string, string> = {
  'google': 'גוגל',
  'instagram': 'אינסטגרם',
  'facebook': 'פייסבוק',
  'referral': 'המלצה',
  'portfolio': 'תיק עבודות',
  'other': 'אחר',
};

/**
 * Create record in Airtable
 */
async function createAirtableRecord(payload: SubmissionPayload): Promise<string | null> {
  const { formData, tracking, trafficSourceSummary } = payload;

  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Leads';

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.warn('Airtable credentials not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                'Name': formData.name,
                'Phone': formData.phone,
                'Email': formData.email || '',
                'Budget': budgetLabels[formData.budget || ''] || formData.budget || '',
                'Message': formData.message || '',
                'How They Found Us': sourceLabels[formData.source || ''] || formData.source || '',
                'Traffic Source': trafficSourceSummary,
                'Page Submitted From': tracking.currentPageTitle,
                'Page URL': tracking.currentPagePath,
                'Landing Page': tracking.landingPagePath,
                'UTM Source': tracking.utmSource || '',
                'UTM Medium': tracking.utmMedium || '',
                'UTM Campaign': tracking.utmCampaign || '',
                'Referrer': tracking.referrerDomain || '',
                'Submitted At': tracking.timestamp.split('T')[0],
                'Session ID': tracking.sessionId,
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Airtable error:', errorData);
      return null;
    }

    const data = await response.json();
    return data.records?.[0]?.id || null;
  } catch (error) {
    console.error('Airtable request failed:', error);
    return null;
  }
}

/**
 * Create item in Monday.com
 */
async function createMondayItem(payload: SubmissionPayload): Promise<string | null> {
  const { formData, tracking, trafficSourceSummary } = payload;

  const MONDAY_TOKEN = process.env.MONDAY_TOKEN;
  const MONDAY_BOARD_ID = process.env.MONDAY_BOARD_ID;

  if (!MONDAY_TOKEN || !MONDAY_BOARD_ID) {
    console.warn('Monday.com credentials not configured');
    return null;
  }

  // Column IDs for Monday.com board 5089364102 (Leads)
  const columnValues: Record<string, string | object> = {};

  // Phone column (lead_phone)
  if (formData.phone) {
    columnValues['lead_phone'] = { phone: formData.phone, countryShortName: 'IL' };
  }

  // Email column (lead_email)
  if (formData.email) {
    columnValues['lead_email'] = { email: formData.email, text: formData.email };
  }

  // Budget column (text_mkz7k8s)
  if (formData.budget) {
    columnValues['text_mkz7k8s'] = budgetLabels[formData.budget] || formData.budget;
  }

  // Message column (long_text_mkz7r7wy - long text requires {text: value} format)
  if (formData.message) {
    columnValues['long_text_mkz7r7wy'] = { text: formData.message };
  }

  // Source/How they found us (color_mkyb8krc - status column)
  if (formData.source) {
    columnValues['color_mkyb8krc'] = { label: sourceLabels[formData.source] || formData.source };
  }

  // Traffic source (text_mkz7w93t)
  columnValues['text_mkz7w93t'] = trafficSourceSummary;

  // Page submitted from (text_mkz7by1s)
  columnValues['text_mkz7by1s'] = tracking.currentPageTitle;

  // UTM source (text_mkz729zf)
  if (tracking.utmSource) {
    columnValues['text_mkz729zf'] = tracking.utmSource;
  }

  try {
    // Build the item name
    const itemName = `${formData.name} - ${tracking.currentPageTitle}`;

    const mutation = `
      mutation {
        create_item(
          board_id: ${MONDAY_BOARD_ID},
          item_name: "${itemName.replace(/"/g, '\\"')}",
          column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}"
        ) {
          id
        }
      }
    `;

    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Authorization': MONDAY_TOKEN,
        'Content-Type': 'application/json',
        'API-Version': '2024-01',
      },
      body: JSON.stringify({ query: mutation }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Monday.com error:', errorText);
      return null;
    }

    const data = await response.json();

    if (data.errors) {
      console.error('Monday.com GraphQL errors:', data.errors);
      return null;
    }

    return data.data?.create_item?.id || null;
  } catch (error) {
    console.error('Monday.com request failed:', error);
    return null;
  }
}

/**
 * Send notification email (optional - uses Resend)
 */
async function sendNotificationEmail(payload: SubmissionPayload): Promise<boolean> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'sales@nexoagency.com';

  if (!RESEND_API_KEY) {
    return false;
  }

  const { formData, tracking, trafficSourceSummary } = payload;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NEXO Forms <forms@nexoagency.com>',
        to: [NOTIFICATION_EMAIL],
        subject: `🔔 ליד חדש: ${formData.name} - ${tracking.currentPageTitle}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #ec4899;">ליד חדש התקבל!</h2>

            <h3>פרטי הליד:</h3>
            <ul>
              <li><strong>שם:</strong> ${formData.name}</li>
              <li><strong>טלפון:</strong> ${formData.phone}</li>
              ${formData.email ? `<li><strong>אימייל:</strong> ${formData.email}</li>` : ''}
              ${formData.budget ? `<li><strong>תקציב:</strong> ${budgetLabels[formData.budget] || formData.budget}</li>` : ''}
              ${formData.message ? `<li><strong>הודעה:</strong> ${formData.message}</li>` : ''}
              ${formData.source ? `<li><strong>איך מצאו אותנו:</strong> ${sourceLabels[formData.source] || formData.source}</li>` : ''}
            </ul>

            <h3>מקור התנועה:</h3>
            <ul>
              <li><strong>עמוד מילוי הטופס:</strong> ${tracking.currentPageTitle}</li>
              <li><strong>URL:</strong> ${tracking.currentPageUrl}</li>
              <li><strong>מקור:</strong> ${trafficSourceSummary}</li>
              ${tracking.utmCampaign ? `<li><strong>קמפיין:</strong> ${tracking.utmCampaign}</li>` : ''}
              ${tracking.landingPagePath !== tracking.currentPagePath ? `<li><strong>עמוד נחיתה:</strong> ${tracking.landingPagePath}</li>` : ''}
            </ul>

            <p style="color: #666; font-size: 12px;">
              זמן קבלה: ${new Date(tracking.timestamp).toLocaleString('he-IL')}
            </p>
          </div>
        `,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Email notification failed:', error);
    return false;
  }
}

/**
 * Main handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body as SubmissionPayload;

    // Validate required fields
    if (!payload.formData?.name || !payload.formData?.phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    // Submit to both services in parallel
    const [airtableId, mondayId] = await Promise.all([
      createAirtableRecord(payload),
      createMondayItem(payload),
    ]);

    // Send email notification (don't block on this)
    sendNotificationEmail(payload).catch(console.error);

    // Check if at least one service succeeded
    if (!airtableId && !mondayId) {
      return res.status(500).json({
        error: 'Failed to save to any service',
        details: 'Both Airtable and Monday.com submissions failed',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      airtableId,
      mondayId,
    });
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

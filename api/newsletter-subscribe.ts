/**
 * Vercel Serverless Function: Newsletter Subscription Handler
 * Saves newsletter subscriptions to Airtable
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface NewsletterPayload {
  email: string;
  source?: string;
  pageUrl?: string;
}

/**
 * Create record in Airtable Newsletter table
 */
async function createNewsletterSubscription(payload: NewsletterPayload): Promise<string | null> {
  const { email, source, pageUrl } = payload;

  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_NEWSLETTER_TABLE = process.env.AIRTABLE_NEWSLETTER_TABLE || 'Newsletter';

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.warn('Airtable credentials not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_NEWSLETTER_TABLE)}`,
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
                'Email': email,
                'Source': source || 'Website',
                'Page URL': pageUrl || '',
                'Subscribed At': new Date().toISOString().split('T')[0],
                'Status': 'Active',
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
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
    const payload = req.body as NewsletterPayload;

    // Validate email
    if (!payload.email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!isValidEmail(payload.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Save to Airtable
    const recordId = await createNewsletterSubscription(payload);

    if (!recordId) {
      return res.status(500).json({
        error: 'Failed to save subscription',
        details: 'Could not save to Airtable',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      recordId,
    });
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

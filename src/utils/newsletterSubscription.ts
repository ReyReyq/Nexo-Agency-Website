/**
 * Newsletter Subscription Utility
 * Handles newsletter form submissions to Airtable
 */

interface NewsletterPayload {
  email: string;
  source?: string;
  pageUrl?: string;
}

interface NewsletterResponse {
  success: boolean;
  message: string;
  recordId?: string;
  error?: string;
}

/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(email: string, source?: string): Promise<NewsletterResponse> {
  const payload: NewsletterPayload = {
    email,
    source: source || 'Blog',
    pageUrl: window.location.href,
  };

  try {
    const response = await fetch('/api/newsletter-subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Failed to subscribe',
        error: data.details,
      };
    }

    return {
      success: true,
      message: data.message || 'Successfully subscribed!',
      recordId: data.recordId,
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

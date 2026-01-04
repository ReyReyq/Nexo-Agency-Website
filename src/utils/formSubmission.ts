/**
 * Form Submission Service
 * Handles sending form data to the API endpoint which forwards to Airtable and Monday.com
 */

import { getTrackingData, getTrafficSourceSummary, type TrackingData } from './formTracking';

export interface FormData {
  name: string;
  phone: string;
  email?: string;
  budget?: string;
  message?: string;
  source?: string; // How they heard about us (user-selected)
}

export interface SubmissionPayload {
  formData: FormData;
  tracking: TrackingData;
  trafficSourceSummary: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  airtableId?: string;
  mondayId?: string;
  error?: string;
}

/**
 * Submit form data to both Airtable and Monday.com
 */
export const submitContactForm = async (formData: FormData): Promise<SubmissionResponse> => {
  const tracking = getTrackingData();
  const trafficSourceSummary = getTrafficSourceSummary(tracking);

  const payload: SubmissionPayload = {
    formData,
    tracking,
    trafficSourceSummary,
  };

  try {
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit form');
    }

    return {
      success: true,
      message: 'Form submitted successfully',
      airtableId: result.airtableId,
      mondayId: result.mondayId,
    };
  } catch (error) {
    console.error('Form submission error:', error);
    return {
      success: false,
      message: 'Failed to submit form',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Budget value to Hebrew label mapping
 */
export const budgetLabels: Record<string, string> = {
  '2-6k': '₪2,000 - ₪6,000',
  '6-10k': '₪6,000 - ₪10,000',
  '10-20k': '₪10,000 - ₪20,000',
  '20k+': '₪20,000+',
  'not-sure': 'עדיין לא בטוח/ה',
};

/**
 * Source value to Hebrew label mapping (must match API labels for Monday.com status column)
 */
export const sourceLabels: Record<string, string> = {
  'google': 'גוגל',
  'instagram': 'אינסטגרם',
  'facebook': 'פייסבוק',
  'referral': 'המלצה',
  'portfolio': 'תיק עבודות',
  'other': 'אחר',
};

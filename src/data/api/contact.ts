import { http } from '@/data/api/http';

export type SubmitContactInput = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export type PublicContactDetails = {
  supportEmail: string | null;
  supportPhone: string | null;
  whatsapp: string | null;
};

/** GET /api/v1/public/contact — support channels from admin Settings. */
export function getPublicContactDetails() {
  return http<PublicContactDetails>('/api/v1/public/contact');
}

/** POST /api/v1/public/contact — emails the tenant support address. */
export function submitContactMessage(input: SubmitContactInput) {
  return http<null>('/api/v1/public/contact', { body: input });
}

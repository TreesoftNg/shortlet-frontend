import { http } from '@/data/api/http';

export type SubmitContactInput = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

/** POST /api/v1/public/contact — emails the tenant’s owners/admins. */
export function submitContactMessage(input: SubmitContactInput) {
  return http<null>('/api/v1/public/contact', { body: input });
}

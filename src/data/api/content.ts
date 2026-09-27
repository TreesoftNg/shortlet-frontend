import { request } from '@/data/api/client';
import { websiteContent } from '@/data/mocks';
import type { WebsiteContent } from '@/data/types';

export async function getWebsiteContent(): Promise<WebsiteContent> {
  return request(websiteContent);
}

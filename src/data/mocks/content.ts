import type { WebsiteContent } from '@/data/types';

export const websiteContent: WebsiteContent = {
  brand_name: 'Sunmade Apartments & Suites',
  currency: 'NGN',
  currency_symbol: '₦',
  hero: {
    headline: 'Stay somewhere that feels like home.',
    subheadline:
      'Serviced shortlet apartments across Lagos & Abuja — verified, fully furnished, instantly bookable.',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=80',
  },
  trust: {
    title: 'Why guests book with Sunmade',
    subtitle:
      'Every apartment is inspected, cleaned by professionals and supported round the clock.',
    items: [
      {
        icon: 'shield-check',
        title: 'Verified apartments',
        description: 'Photos match reality, always.',
      },
      {
        icon: 'credit-card',
        title: 'Secure payments',
        description: 'Pay safely with card or transfer.',
      },
      {
        icon: 'headphones',
        title: '24/7 support',
        description: "We're a message away.",
      },
    ],
  },
  categories: [
    { id: 'all', label: 'All stays', icon: 'sparkles' },
    { id: 'studios', label: 'Studios', icon: 'building-2' },
    { id: '1-bedroom', label: '1 Bedroom', icon: 'bed-double' },
    { id: '2-bedroom', label: '2 Bedroom', icon: 'sofa' },
    { id: 'penthouses', label: 'Penthouses', icon: 'castle' },
    { id: 'pool', label: 'Pool', icon: 'waves' },
    { id: 'business', label: 'Business', icon: 'briefcase' },
    { id: 'events', label: 'Events allowed', icon: 'party-popper' },
    { id: 'waterfront', label: 'Waterfront', icon: 'sunset' },
    { id: 'power', label: '24/7 Power', icon: 'zap' },
  ],
};

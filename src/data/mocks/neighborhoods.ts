import type { Neighborhood } from '@/data/types';

export const neighborhoods: Neighborhood[] = [
  {
    id: 'nbh_lekki',
    name: 'Lekki',
    slug: 'lekki',
    city: 'Lagos',
    image:
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
    property_count: 42,
  },
  {
    id: 'nbh_vi',
    name: 'Victoria Island',
    slug: 'victoria-island',
    city: 'Lagos',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    property_count: 31,
  },
  {
    id: 'nbh_ikoyi',
    name: 'Ikoyi',
    slug: 'ikoyi',
    city: 'Lagos',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    property_count: 18,
  },
  {
    id: 'nbh_abuja',
    name: 'Abuja',
    slug: 'abuja',
    city: 'Abuja',
    image:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    property_count: 24,
  },
];

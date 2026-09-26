import { SearchPage } from '@/features/search';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  );
}

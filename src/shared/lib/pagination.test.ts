import { paginationItems } from '@/shared/lib/pagination';
import { describe, expect, it } from 'vitest';

describe('paginationItems', () => {
  it('lists every page when there are few', () => {
    expect(paginationItems(1, 3)).toEqual([
      { type: 'page', page: 1 },
      { type: 'page', page: 2 },
      { type: 'page', page: 3 },
    ]);
  });

  it('inserts ellipses around the current window', () => {
    expect(paginationItems(5, 12)).toEqual([
      { type: 'page', page: 1 },
      { type: 'ellipsis' },
      { type: 'page', page: 4 },
      { type: 'page', page: 5 },
      { type: 'page', page: 6 },
      { type: 'ellipsis' },
      { type: 'page', page: 12 },
    ]);
  });
});

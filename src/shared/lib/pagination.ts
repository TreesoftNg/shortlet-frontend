export type PaginationItem = { type: 'page'; page: number } | { type: 'ellipsis' };

/** Compact page list: `1 … 4 5 6 … 12`. */
export function paginationItems(
  current: number,
  totalPages: number,
): PaginationItem[] {
  const total = Math.max(1, totalPages);
  const page = Math.min(Math.max(1, current), total);

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => ({
      type: 'page',
      page: i + 1,
    }));
  }

  const items: PaginationItem[] = [];
  const pushPage = (n: number) => {
    if (items.some((item) => item.type === 'page' && item.page === n)) return;
    items.push({ type: 'page', page: n });
  };

  pushPage(1);
  if (page > 3) items.push({ type: 'ellipsis' });

  for (let n = page - 1; n <= page + 1; n += 1) {
    if (n > 1 && n < total) pushPage(n);
  }

  if (page < total - 2) items.push({ type: 'ellipsis' });
  pushPage(total);

  return items;
}

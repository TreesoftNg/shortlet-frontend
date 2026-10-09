import { getDefaultStay, getStayDatePresets } from '@/shared/lib/default-stay';
import { describe, expect, it } from 'vitest';

describe('default stay', () => {
  it('builds a stay window from today', () => {
    const now = new Date(2026, 9, 6); // Oct 6, 2026 local
    const stay = getDefaultStay(now);
    expect(stay.checkIn).toBe('2026-10-06');
    expect(stay.checkOut).toBe('2026-10-10');
    expect(stay.nights).toBe(4);
    expect(stay.guests).toBe(2);
  });

  it('builds relative date presets', () => {
    const now = new Date(2026, 9, 6); // Monday
    const presets = getStayDatePresets(now);
    expect(presets).toHaveLength(4);
    expect(presets[0]?.checkIn).toBe('2026-10-06');
    expect(presets[0]?.checkOut).toBe('2026-10-10');
    expect(presets[1]?.checkIn).toBe('2026-10-09'); // Friday
    expect(presets[1]?.checkOut).toBe('2026-10-11');
  });
});

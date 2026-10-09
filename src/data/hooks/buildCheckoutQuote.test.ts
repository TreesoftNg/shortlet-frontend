import { DEMO_STAY } from '@/data/demo-stay';
import { buildCheckoutQuote } from '@/data/hooks';
import { properties } from '@/data/mocks';
import { describe, expect, it } from 'vitest';

const property = properties[0]!;

describe('buildCheckoutQuote', () => {
  it('uses the selected unit nightly rate', () => {
    const unit = property.units[0]!;
    const quote = buildCheckoutQuote(property, unit.id);

    expect(quote.unit?.id).toBe(unit.id);
    expect(quote.nightly).toBe(unit.nightly_rate);
    expect(quote.nights).toBe(DEMO_STAY.nights);
    expect(quote.stay).toBe(unit.nightly_rate * DEMO_STAY.nights);
  });

  it('falls back to the first unit when id is missing', () => {
    const quote = buildCheckoutQuote(property, null);
    expect(quote.unit?.id).toBe(property.units[0]?.id);
  });

  it('totals stay + cleaning + service + deposit', () => {
    const quote = buildCheckoutQuote(property, property.units[0]!.id);
    expect(quote.total).toBe(
      quote.stay + quote.cleaning + quote.service + quote.tax + quote.deposit,
    );
  });
});

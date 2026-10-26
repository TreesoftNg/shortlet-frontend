'use client';

import { SunmadeLogo } from '@/shared/components/brand';
import {
  MARK_HOUSE_PATH,
  MARK_ROOF_PATH,
  TILE_MARK_TRANSFORM,
  TILE_RADIUS,
} from '@/shared/components/brand/geometry';
import { useState, type FormEvent } from 'react';
import { joinWaitlist, WaitlistApiError } from './api/join-waitlist';
import styles from './coming-soon.module.css';

const FACTS = ['Verified apartments', 'Fully furnished', '24/7 guest support'] as const;

function Watermark() {
  return (
    <svg className={styles.watermark} viewBox="0 0 512 512" aria-hidden>
      <rect width="512" height="512" rx={TILE_RADIUS} fill="#ffffff" />
      <g transform={TILE_MARK_TRANSFORM}>
        <path d={MARK_ROOF_PATH} fill="#F8A42F" />
        <path d={MARK_HOUSE_PATH} fill="#ffffff" />
      </g>
    </svg>
  );
}

export function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [thanksMessage, setThanksMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const result = await joinWaitlist(email);
      setThanksMessage(result.message);
    } catch (err) {
      const message =
        err instanceof WaitlistApiError
          ? err.message
          : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.panel}>
        <Watermark />
        <a className={styles.logo} href="/" aria-label="Sunmade Apartments & Suites">
          <SunmadeLogo size="26px" variant="onBrand" tagline />
        </a>
        <div className={styles.places}>
          <p className={styles.placesLabel}>Now opening in</p>
          <strong className={styles.placesCity}>Lagos</strong>
        </div>
      </aside>

      <main className={styles.content}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Coming soon</p>
          <h1 className={styles.title}>Stay somewhere that feels like home.</h1>
          <p className={styles.lead}>
            Serviced shortlet apartments in Lagos — verified, fully furnished, and ready for
            guests. Our website is nearly there; we&apos;ll be live shortly.
          </p>
          <ul className={styles.facts}>
            {FACTS.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>

          {thanksMessage ? (
            <p className={styles.thanks} role="status">
              {thanksMessage}
            </p>
          ) : (
            <>
              <form className={styles.notify} onSubmit={onSubmit}>
                <label className={styles.sr} htmlFor="coming-soon-email">
                  Email address
                </label>
                <input
                  id="coming-soon-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="Email address"
                  value={email}
                  disabled={isPending}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button type="submit" disabled={isPending}>
                  {isPending ? 'Sending…' : 'Notify me'}
                </button>
              </form>
              {error ? (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              ) : null}
            </>
          )}

          <p className={styles.fine}>© 2026 Sunmade Apartments &amp; Suites</p>
        </div>
      </main>
    </div>
  );
}

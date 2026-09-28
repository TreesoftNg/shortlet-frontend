/** True when the public site should show only the coming-soon experience. */
export function isComingSoonEnabled(): boolean {
  const value = process.env.COMING_SOON?.trim().toLowerCase();
  return value === '1' || value === 'true' || value === 'yes';
}

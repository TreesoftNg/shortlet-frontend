/**
 * Data layer conventions
 *
 * ## Where things live
 * - `api/`     — async functions only. Customer auth hits staging; listings
 *                still use mocks until those endpoints are wired.
 * - `hooks/`   — React Query hooks. Features import server data from here.
 * - `query-keys.ts` — every query key. Invalidate via these factories.
 * - `mocks/`   — fixture data used only by `api/*`.
 * - `types/`   — shared DTOs.
 * - `demo-stay.ts` — temporary stay defaults (not Zustand).
 *
 * ## React Query vs Zustand
 * | Kind of state                         | Use            |
 * |---------------------------------------|----------------|
 * | Server / list / detail / counts       | React Query    |
 * | Auth session (survive refresh)        | Zustand persist|
 * | Ephemeral UI (map pin, unit select)   | UI store / useState |
 * | Form fields on one page               | useState       |
 *
 * Do not put API responses in Zustand.
 *
 * ## Staging API (Customers)
 * Browser calls `/backend/api/v1/...` which Next rewrites to
 * `https://api-staging.sunmadeapartments.com/api/v1/...`
 * (avoids CORS; staging only allows the production Origin).
 * Send `x-tenant-slug: sunmade`. Override with `NEXT_PUBLIC_API_BASE_URL` /
 * `NEXT_PUBLIC_TENANT_SLUG` if needed.
 * Docs: https://api-staging.sunmadeapartments.com/api/docs#/Customers
 */

export {};

/**
 * Data layer conventions
 *
 * ## Where things live
 * - `api/`     — async functions only (mock today, Nest later). No React.
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
 */

export {};

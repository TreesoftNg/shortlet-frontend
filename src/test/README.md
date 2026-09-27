# Testing

## Commands

```bash
npm test           # run once (CI)
npm run test:watch # watch mode
```

## Stack

- **Vitest** — runner
- **jsdom** — DOM environment
- **Testing Library** — component interaction

## What to unit test

Prefer pure logic near the data layer:

| Area | Examples |
|------|----------|
| `src/data/api` | filtering, sorting, tab counts |
| `src/data/hooks` | `buildCheckoutQuote` |
| `src/shared/lib` | format helpers |
| Zustand UI/session stores | login/logout, selected unit |

Avoid brittle full-page UI snapshots. Feature pages are covered better by later integration/e2e tests.

## File naming

Colocate tests as `*.test.ts` / `*.test.tsx` next to the source file.

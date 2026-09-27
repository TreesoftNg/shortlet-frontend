/**
 * Design tokens. Brand colours come from the Sunmade logo (design/brand);
 * layout and surfaces mirror design/src/styles.css.
 */
export const tokens = {
  colors: {
    brand: {
      50: '#E7F1EE',
      100: '#C8E0D9',
      500: '#10695B',
      600: '#0C574B',
    },
    accent: {
      500: '#F8A42F',
    },
    ink: {
      DEFAULT: '#1B1D1F',
      2: '#4A4F55',
      3: '#80868C',
    },
    line: {
      DEFAULT: '#EAEAE6',
      2: '#F2F2EF',
    },
    bg: {
      DEFAULT: '#FFFFFF',
      soft: '#F8F7F4',
    },
    status: {
      danger: '#D9463B',
      warn: '#E69A1A',
      ok: '#1F9D55',
      info: '#3A6FF0',
    },
  },
  fonts: {
    body: `var(--font-plus-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif`,
    heading: `var(--font-plus-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif`,
  },
  radii: {
    sm: '10px',
    md: '14px',
    lg: '22px',
    full: '999px',
  },
  shadows: {
    md: '0 6px 24px rgba(20, 24, 28, 0.08)',
    lg: '0 18px 50px rgba(20, 24, 28, 0.14)',
  },
  layout: {
    frameMaxWidth: '1440px',
    pageGutter: '80px',
    navHeight: '80px',
  },
} as const;

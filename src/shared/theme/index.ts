import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { tokens } from './tokens';

const config = defineConfig({
  globalCss: {
    'html, body': {
      margin: 0,
      padding: 0,
      bg: 'bg',
      color: 'ink',
      fontFamily: 'body',
      fontSize: '15px',
      lineHeight: '1.5',
    },
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
    img: {
      display: 'block',
      objectFit: 'cover',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: tokens.colors.brand[50] },
          100: { value: tokens.colors.brand[100] },
          500: { value: tokens.colors.brand[500] },
          600: { value: tokens.colors.brand[600] },
        },
        accent: {
          500: { value: tokens.colors.accent[500] },
        },
        ink: {
          DEFAULT: { value: tokens.colors.ink.DEFAULT },
          2: { value: tokens.colors.ink[2] },
          3: { value: tokens.colors.ink[3] },
        },
        line: {
          DEFAULT: { value: tokens.colors.line.DEFAULT },
          2: { value: tokens.colors.line[2] },
        },
        bg: {
          DEFAULT: { value: tokens.colors.bg.DEFAULT },
          
          soft: { value: tokens.colors.bg.soft },
        },
        danger: { value: tokens.colors.status.danger },
        warn: { value: tokens.colors.status.warn },
        ok: { value: tokens.colors.status.ok },
        info: { value: tokens.colors.status.info },
      },
      fonts: {
        heading: { value: tokens.fonts.heading },
        body: { value: tokens.fonts.body },
      },
      radii: {
        sm: { value: tokens.radii.sm },
        md: { value: tokens.radii.md },
        lg: { value: tokens.radii.lg },
        full: { value: tokens.radii.full },
      },
      shadows: {
        md: { value: tokens.shadows.md },
        lg: { value: tokens.shadows.lg },
      },
    },
    semanticTokens: {
      colors: {
        // Primary brand surface / text aliases used across the app
        'brand.solid': { value: '{colors.brand.500}' },
        'brand.contrast': { value: 'white' },
        'brand.fg': { value: '{colors.brand.600}' },
        'brand.muted': { value: '{colors.brand.50}' },
        'fg.default': { value: '{colors.ink}' },
        'fg.muted': { value: '{colors.ink.2}' },
        'fg.subtle': { value: '{colors.ink.3}' },
        'border.default': { value: '{colors.line}' },
        'bg.canvas': { value: '{colors.bg}' },
        'bg.subtle': { value: '{colors.bg.soft}' },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
export { tokens };

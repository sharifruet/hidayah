export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** Tailwind color tokens mirrored here for places that need raw hex (icons, SVG, native modules). */
export const Palette = {
  primary: {
    50: '#eefbf3',
    100: '#d6f5e1',
    400: '#45c087',
    500: '#22a06d',
    600: '#15805a',
    700: '#12654a',
    900: '#0f4233',
  },
  gold: {
    400: '#e0b361',
    500: '#c99a45',
  },
  ink: {
    50: '#f6f7f8',
    400: '#7d879a',
    500: '#5b6579',
    800: '#20242f',
    900: '#14171f',
    950: '#0a0c11',
  },
} as const;

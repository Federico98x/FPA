import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // FIX: Use the CSS variable defined in layout.tsx
        body: ['var(--font-inter)', 'sans-serif'],
        headline: ['var(--font-inter)', 'sans-serif'],
        code: ['monospace'],
      },
      // ... (colors, borderRadius, keyframes, animation remain the same)
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

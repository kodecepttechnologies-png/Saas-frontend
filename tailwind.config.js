/**
 * Semantic theme tokens: dark violet + white + black.
 * Values live in src/index.css as CSS variables (RGB triplets) so
 * opacity modifiers like `bg-primary/20` keep working.
 *
 * Spec token -> Tailwind class
 *   primary / primary-hover / primary-active -> bg-primary, bg-primary-hover, bg-primary-active
 *   background / surface / surface-secondary -> bg-background, bg-surface, bg-surface-secondary
 *   border                                   -> border-border
 *   text-primary / text-secondary / text-muted -> text-fg, text-fg-secondary, text-fg-muted
 *   danger / success / warning               -> bg-danger, bg-success, bg-warning
 * (`fg` is used for text so `text-primary` stays unambiguous: violet text.)
 */
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: token('background'),
        surface: {
          DEFAULT: token('surface'),
          secondary: token('surface-secondary'),
        },
        border: token('border'),
        primary: {
          DEFAULT: token('primary'),
          hover: token('primary-hover'),
          active: token('primary-active'),
        },
        fg: {
          DEFAULT: token('fg'),
          secondary: token('fg-secondary'),
          muted: token('fg-muted'),
        },
        danger: token('danger'),
        success: token('success'),
        warning: token('warning'),
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        yuzu: 'var(--yuzu)',
        'yuzu-deep': 'var(--yuzu-deep)',
        leaf: 'var(--leaf)',
        capy: 'var(--capy)',
        scene: 'var(--scene)',
        'cream-3d': 'var(--cream-3d)',
      },
      fontFamily: {
        sans: ['Geist', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
        pixel: ['Silkscreen', 'monospace'],
      },
    },
  },
  plugins: [],
};

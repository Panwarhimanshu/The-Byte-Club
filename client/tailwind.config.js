/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', lg: '2rem' },
      screens: { '2xl': '1360px' },
    },
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          fg: 'rgb(var(--primary-fg) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          fg: 'rgb(var(--secondary-fg) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          fg: 'rgb(var(--accent-fg) / <alpha-value>)',
        },
        veg: '#2e9e4a',
        nonveg: '#d63b2f',
      },
      fontFamily: {
        display: ['Fredoka', 'ui-rounded', '"Segoe UI"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['clamp(2.9rem, 8.5vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-xl': ['clamp(2.4rem, 6vw, 4.75rem)', { lineHeight: '0.98', letterSpacing: '-0.015em', fontWeight: '600' }],
        'display-lg': ['clamp(1.9rem, 4.5vw, 3.4rem)', { lineHeight: '1.02', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        pill: '999px',
      },
      boxShadow: {
        card: '0 2px 4px rgb(18 28 78 / 0.06), 0 16px 34px -16px rgb(18 28 78 / 0.20)',
        lift: '0 30px 68px -22px rgb(18 28 78 / 0.30)',
        glow: '0 0 0 4px rgb(var(--primary) / 0.18)',
      },
      backgroundImage: {
        'grid-byte':
          'linear-gradient(rgb(var(--primary) / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--primary) / 0.07) 1px, transparent 1px)',
        'radial-fade':
          'radial-gradient(58% 55% at 50% 0%, rgb(var(--primary) / 0.10) 0%, transparent 72%)',
      },
      backgroundSize: {
        'grid-16': '16px 16px',
        'grid-32': '32px 32px',
      },
      keyframes: {
        'byte-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        'byte-flicker': 'byte-flicker 1.4s steps(2, jump-none) infinite',
        scan: 'scan 2.4s linear infinite',
        marquee: 'marquee 26s linear infinite',
        blink: 'blink 1s steps(1) infinite',
        rise: 'rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        wobble: 'wobble 2.6s ease-in-out infinite',
      },
      transitionTimingFunction: {
        byte: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

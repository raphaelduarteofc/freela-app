import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        brand: {
          DEFAULT: '#059669',
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Ink / Neutral
        ink: {
          DEFAULT: '#0f172a',
          soft:    '#334155',
          muted:   '#64748b',
          subtle:  '#94a3b8',
          border:  '#e2e8f0',
          surface: '#f8fafc',
        },
        // Semantic
        status: {
          draft:       '#64748b',
          open:        '#3b82f6',
          distributed: '#8b5cf6',
          accepted:    '#f59e0b',
          in_progress: '#0ea5e9',
          completed:   '#059669',
          cancelled:   '#ef4444',
          disputed:    '#f97316',
        },
        // Cert levels
        cert: {
          bronze:   '#b45309',
          prata:    '#475569',
          ouro:     '#d97706',
          diamante: '#0ea5e9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display':  ['1.5rem',  { lineHeight: '2rem',    fontWeight: '600', letterSpacing: '-0.02em' }],
        'title-1':  ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600', letterSpacing: '-0.01em' }],
        'title-2':  ['1rem',    { lineHeight: '1.5rem',  fontWeight: '600' }],
        'body-1':   ['0.875rem',{ lineHeight: '1.25rem', fontWeight: '400' }],
        'body-2':   ['0.813rem',{ lineHeight: '1.25rem', fontWeight: '400' }],
        'label':    ['0.75rem', { lineHeight: '1rem',    fontWeight: '500', letterSpacing: '0.01em' }],
        'caption':  ['0.688rem',{ lineHeight: '1rem',    fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        sidebar: '220px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'card':   '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
        'card-md':'0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        'card-lg':'0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
        'focus':  '0 0 0 3px rgb(5 150 105 / 0.2)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-in':  { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'slide-in': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'pulse-dot':{ '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-in':  'fade-in 0.15s ease-out',
        'slide-in': 'slide-in 0.25s ease-out',
        'pulse-dot':'pulse-dot 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config

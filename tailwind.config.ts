import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Landing Page Design System

        // Backgrounds
        'bg-dark': '#0B1220',
        'bg-light': '#F9FAFB',
        'bg-card': '#FFFFFF',
        'bg-card-dark': '#111827',
        'bg-footer': '#020617',

        // Primary
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          foreground: '#FFFFFF',
        },

        // Secondary (highlights, badges)
        secondary: {
          DEFAULT: '#38BDF8',
          foreground: '#0B1220',
        },

        // Text colors
        'text-dark-bg': '#E5E7EB',
        'text-dark-muted': '#9CA3AF',
        'text-light-bg': '#020617',
        'text-light-muted': '#64748B',

        // Borders
        border: {
          DEFAULT: '#CBD5E1',
          dark: '#1F2937',
        },

        // Status colors
        'status-blocked': '#DC2626',
        'status-passed': '#16A34A',
        'status-warning': '#D97706',

        // Legacy compatibility - midnight colors (for dashboard)
        midnight: {
          DEFAULT: '#1E293B',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },

        // Accent Blue (for dashboard)
        accent: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },

        // Status Colors (for dashboard)
        secure: {
          DEFAULT: '#15803D',
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },

        warning: {
          DEFAULT: '#CA8A04',
          50: '#FEFCE8',
          100: '#FEF9C3',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
        },

        critical: {
          DEFAULT: '#B91C1C',
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },

        success: {
          DEFAULT: '#15803D',
          foreground: '#FFFFFF',
        },

        danger: {
          DEFAULT: '#B91C1C',
          foreground: '#FFFFFF',
        },

        // Shadcn UI compatibility
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
        DEFAULT: '6px',
      },

      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'monospace'],
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.5' }],     // 14px
        'base': ['1rem', { lineHeight: '1.6' }],       // 16px
        'lg': ['1.125rem', { lineHeight: '1.6' }],     // 18px
        'xl': ['1.25rem', { lineHeight: '1.6' }],      // 20px
        '2xl': ['1.5rem', { lineHeight: '1.3' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '1.25' }],   // 30px
        '4xl': ['2.5rem', { lineHeight: '1.2' }],      // 40px
        '5xl': ['3rem', { lineHeight: '1.1' }],        // 48px
        '6xl': ['3.5rem', { lineHeight: '1.1' }],      // 56px - Hero headline
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.05)',
      },

      letterSpacing: {
        'tighter': '-0.02em',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.15s ease-out',
        'accordion-up': 'accordion-up 0.15s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

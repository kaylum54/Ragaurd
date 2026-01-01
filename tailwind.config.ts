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
        // Navy Clinical Design System
        // Professional navy blue + white + black accents

        // Navy Blues - Primary
        navy: {
          DEFAULT: '#1a3a5c',
          950: '#0a1628',      // Deepest navy - primary dark backgrounds
          900: '#0f2042',      // Dark navy
          800: '#1a3a5c',      // Navy
          700: '#234b72',      // Medium navy
          600: '#2d5f8a',      // Navy accent
          500: '#3b7cb8',      // Bright navy
          400: '#5a9fd4',      // Light navy
          300: '#8bbde8',      // Pale navy
          200: '#bdd9f4',      // Very light navy
          100: '#e8f2fb',      // Near white navy tint
          50: '#f4f9fd',       // Lightest navy
        },

        // White variants (for use in dark contexts)
        white: {
          DEFAULT: '#ffffff',
          90: 'rgba(255, 255, 255, 0.9)',
          80: 'rgba(255, 255, 255, 0.8)',
          60: 'rgba(255, 255, 255, 0.6)',
          40: 'rgba(255, 255, 255, 0.4)',
          20: 'rgba(255, 255, 255, 0.2)',
          10: 'rgba(255, 255, 255, 0.1)',
          '05': 'rgba(255, 255, 255, 0.05)',
        },

        // Black accents
        black: {
          DEFAULT: '#000000',
          90: 'rgba(0, 0, 0, 0.9)',
          80: 'rgba(0, 0, 0, 0.8)',
          60: 'rgba(0, 0, 0, 0.6)',
          40: 'rgba(0, 0, 0, 0.4)',
          20: 'rgba(0, 0, 0, 0.2)',
          10: 'rgba(0, 0, 0, 0.1)',
          '05': 'rgba(0, 0, 0, 0.05)',
        },

        // Semantic colors
        success: {
          DEFAULT: '#22c55e',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },

        warning: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },

        danger: {
          DEFAULT: '#ef4444',
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },

        // Legacy support for dashboard
        midnight: {
          DEFAULT: '#0a1628',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#0f2042',
          900: '#0a1628',
          950: '#050d18',
        },

        // Accent (using navy-500 as primary accent)
        accent: {
          DEFAULT: '#3b7cb8',
          50: '#f4f9fd',
          100: '#e8f2fb',
          200: '#bdd9f4',
          300: '#8bbde8',
          400: '#5a9fd4',
          500: '#3b7cb8',
          600: '#2d5f8a',
          700: '#234b72',
          800: '#1a3a5c',
          900: '#0f2042',
        },

        // Primary styling
        primary: {
          DEFAULT: '#0a1628',
          foreground: '#ffffff',
          50: '#f4f9fd',
          100: '#e8f2fb',
          200: '#bdd9f4',
          300: '#8bbde8',
          400: '#5a9fd4',
          500: '#3b7cb8',
          600: '#2d5f8a',
          700: '#234b72',
          800: '#1a3a5c',
          900: '#0f2042',
        },

        // Shadcn UI compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
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
        lg: '12px',
        md: '8px',
        sm: '4px',
        DEFAULT: '8px',
        xl: '16px',
        '2xl': '24px',
      },

      fontFamily: {
        sans: ['Inter', 'Space Grotesk', '-apple-system', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.5' }],
        'xl': ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['1.875rem', { lineHeight: '1.2' }],
        '4xl': ['2.25rem', { lineHeight: '1.1' }],
        '5xl': ['3rem', { lineHeight: '1.05' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '0.95' }],
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },

      boxShadow: {
        'navy-glow': '0 0 30px rgba(59, 124, 184, 0.2), 0 0 60px rgba(59, 124, 184, 0.1)',
        'navy-glow-lg': '0 0 40px rgba(59, 124, 184, 0.3), 0 0 80px rgba(59, 124, 184, 0.15)',
        'card-navy': '0 4px 20px rgba(10, 22, 40, 0.1)',
        'card-elevated': '0 10px 40px rgba(10, 22, 40, 0.15)',
        'glass': '0 8px 32px rgba(10, 22, 40, 0.12)',
        'card-hover': '0 20px 40px rgba(10, 22, 40, 0.15)',
      },

      keyframes: {
        // Navy Clinical Animations

        // Gradient mesh drift
        'gradient-drift': {
          '0%, 100%': { transform: 'translate(0%, 0%) rotate(0deg) scale(1)' },
          '25%': { transform: 'translate(5%, -5%) rotate(1deg) scale(1.02)' },
          '50%': { transform: 'translate(-3%, 5%) rotate(-1deg) scale(0.98)' },
          '75%': { transform: 'translate(-5%, -3%) rotate(0.5deg) scale(1.01)' },
        },

        // Security node pulse
        'node-pulse': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.5)' },
        },

        // Hero entrances
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-right': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-left': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },

        // Counter animations
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },

        // Subtle float
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },

        // Border glow
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(59, 124, 184, 0.3)' },
          '50%': { borderColor: 'rgba(59, 124, 184, 0.6)' },
        },

        // Shimmer effect
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },

        // Progress ring
        'progress-ring': {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: 'var(--progress, 0)' },
        },

        // Accordion
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },

        // Pulse subtle
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },

      animation: {
        // Background
        'gradient-drift': 'gradient-drift 20s ease-in-out infinite',
        'node-pulse': 'node-pulse 4s ease-in-out infinite',

        // Entrances
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'slide-right': 'slide-right 0.5s ease-out forwards',
        'slide-left': 'slide-left 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',

        // Counter
        'count-up': 'count-up 0.6s ease-out forwards',

        // Float
        'float': 'float 6s ease-in-out infinite',

        // Border glow
        'border-glow': 'border-glow 3s ease-in-out infinite',

        // Shimmer
        'shimmer': 'shimmer 2s linear infinite',

        // Progress
        'progress-ring': 'progress-ring 1.5s ease-out forwards',

        // Accordion
        'accordion-down': 'accordion-down 0.3s ease-out',
        'accordion-up': 'accordion-up 0.3s ease-out',

        // Pulse
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

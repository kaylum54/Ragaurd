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
        // V3 Obsidian Design System
        void: {
          DEFAULT: '#050507',
          50: '#0d0d14',
          100: '#0a0a0f',
          200: '#12121a',
          300: '#1a1a24',
          400: '#22222e',
          500: '#2a2a38',
          600: '#32323f',
          700: '#3a3a47',
        },

        // Electric Cyan - Primary Accent
        cyan: {
          DEFAULT: '#00e5ff',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00e5ff',
          600: '#00bcd4',
          700: '#0891b2',
        },

        // Violet - Secondary Accent
        violet: {
          DEFAULT: '#8b5cf6',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },

        // Neon Coral - Danger/Threat
        threat: {
          DEFAULT: '#f43f5e',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },

        // Mint Emerald - Success/Secure
        secure: {
          DEFAULT: '#10b981',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },

        // Warning
        warning: {
          DEFAULT: '#f59e0b',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },

        // White variants
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

        // Legacy navy (for dashboard)
        navy: {
          DEFAULT: '#1a3a5c',
          950: '#0a1628',
          900: '#0f2042',
          800: '#1a3a5c',
          700: '#234b72',
          600: '#2d5f8a',
          500: '#3b7cb8',
          400: '#5a9fd4',
          300: '#8bbde8',
          200: '#bdd9f4',
          100: '#e8f2fb',
          50: '#f4f9fd',
        },

        // Legacy support
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

        // Semantic aliases
        success: {
          DEFAULT: '#10b981',
          50: '#ecfdf5',
          100: '#d1fae5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },

        danger: {
          DEFAULT: '#f43f5e',
          50: '#fff1f2',
          100: '#ffe4e6',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },

        // Shadcn UI compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
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
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
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
        'cyan-glow': '0 0 30px rgba(0, 229, 255, 0.3), 0 0 60px rgba(0, 229, 255, 0.15)',
        'cyan-glow-lg': '0 0 50px rgba(0, 229, 255, 0.4), 0 0 100px rgba(0, 229, 255, 0.2)',
        'violet-glow': '0 0 30px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.15)',
        'threat-glow': '0 0 30px rgba(244, 63, 94, 0.3), 0 0 60px rgba(244, 63, 94, 0.15)',
        'card-dark': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'card-elevated': '0 20px 50px rgba(0, 0, 0, 0.5)',
      },

      keyframes: {
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
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'slide-right': 'slide-right 0.5s ease-out forwards',
        'slide-left': 'slide-left 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan-line': 'scan-line 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.3s ease-out',
        'accordion-up': 'accordion-up 0.3s ease-out',
        'count-up': 'count-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

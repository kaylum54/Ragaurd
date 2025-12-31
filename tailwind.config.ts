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
        // V3 NOIR CYBER Color System
        // Deep obsidian blacks with electric cyan accents

        // Void - Deep blacks with blue undertone
        void: {
          DEFAULT: '#050507',
          50: '#0d0d14',
          100: '#0a0a0f',
          200: '#12121a',
          300: '#1a1a24',
          400: '#22222e',
          500: '#2a2a38',
          600: '#323242',
          700: '#3a3a4c',
          800: '#424256',
          900: '#4a4a60',
        },

        // Cyan Electric - Primary accent
        cyan: {
          DEFAULT: '#00e5ff',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00e5ff',
          600: '#00bcd4',
          700: '#0891b2',
          800: '#0e7490',
          900: '#155e75',
        },

        // Violet Depth - Secondary accent
        violet: {
          DEFAULT: '#8b5cf6',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },

        // Threat - Neon coral/magenta
        threat: {
          DEFAULT: '#f43f5e',
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },

        // Secure - Mint/emerald
        secure: {
          DEFAULT: '#10b981',
          50: '#ecfdf5',
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

        // Legacy support
        midnight: {
          DEFAULT: '#0a0a0f',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#0d0d14',
          900: '#0a0a0f',
          950: '#050507',
        },

        accent: {
          DEFAULT: '#00e5ff',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00e5ff',
          600: '#00bcd4',
          700: '#0891b2',
          800: '#0e7490',
          900: '#155e75',
        },

        // Semantic colors
        primary: {
          DEFAULT: '#050507',
          foreground: '#ffffff',
        },

        success: {
          DEFAULT: '#10b981',
          foreground: '#ffffff',
        },

        danger: {
          DEFAULT: '#f43f5e',
          foreground: '#ffffff',
        },

        warning: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },

        critical: {
          DEFAULT: '#f43f5e',
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
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
        sans: ['Space Grotesk', 'Inter', '-apple-system', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.5' }],
        'xl': ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['2rem', { lineHeight: '1.2' }],
        '4xl': ['2.5rem', { lineHeight: '1.1' }],
        '5xl': ['3.5rem', { lineHeight: '1.05' }],
        '6xl': ['4.5rem', { lineHeight: '1' }],
        '7xl': ['6rem', { lineHeight: '0.95' }],
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },

      boxShadow: {
        'glow-cyan': '0 0 30px rgba(0, 229, 255, 0.3), 0 0 60px rgba(0, 229, 255, 0.1)',
        'glow-violet': '0 0 30px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.1)',
        'glow-threat': '0 0 30px rgba(244, 63, 94, 0.3), 0 0 60px rgba(244, 63, 94, 0.1)',
        'glow-secure': '0 0 30px rgba(16, 185, 129, 0.3), 0 0 60px rgba(16, 185, 129, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'dramatic': '0 50px 100px -20px rgba(0, 229, 255, 0.15)',
      },

      keyframes: {
        // V3 NOIR CYBER Animations

        // Dramatic entrance animations
        'hero-rise': {
          '0%': { opacity: '0', transform: 'translateY(60px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'hero-slide-right': {
          '0%': { opacity: '0', transform: 'translateX(-100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'hero-slide-left': {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'hero-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },

        // Glitch effect for threats
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'glitch-skew': {
          '0%, 100%': { transform: 'skew(0deg)' },
          '20%': { transform: 'skew(-1deg)' },
          '40%': { transform: 'skew(1deg)' },
          '60%': { transform: 'skew(-0.5deg)' },
          '80%': { transform: 'skew(0.5deg)' },
        },

        // Data stream / pulse effects
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.2)',
            borderColor: 'rgba(0, 229, 255, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(0, 229, 255, 0.4)',
            borderColor: 'rgba(0, 229, 255, 0.6)'
          },
        },
        'scan-beam': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'data-flow': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateX(200%)', opacity: '0' },
        },

        // Orbit / float effects
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(5px) rotate(-1deg)' },
        },
        'float-diagonal': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(10px, -15px)' },
          '50%': { transform: 'translate(-5px, -25px)' },
          '75%': { transform: 'translate(-15px, -10px)' },
        },

        // Background effects
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'noise-shift': {
          '0%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -5%)' },
          '20%': { transform: 'translate(-10%, 5%)' },
          '30%': { transform: 'translate(5%, -10%)' },
          '40%': { transform: 'translate(-5%, 15%)' },
          '50%': { transform: 'translate(-10%, 5%)' },
          '60%': { transform: 'translate(15%, 0)' },
          '70%': { transform: 'translate(0, 10%)' },
          '80%': { transform: 'translate(-15%, 0)' },
          '90%': { transform: 'translate(10%, 5%)' },
          '100%': { transform: 'translate(5%, 0)' },
        },

        // Card/element reveals
        'cascade-up': {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'cascade-left': {
          '0%': { opacity: '0', transform: 'translateX(60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'cascade-right': {
          '0%': { opacity: '0', transform: 'translateX(-60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'blur-in': {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },

        // Counter/number animations
        'count-pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },

        // Typewriter
        'typewriter': {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'blink-caret': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },

        // Radar/scanner
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'ping-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },

        // Magnetic wobble
        'magnetic-return': {
          '0%': { transform: 'translate(var(--x), var(--y))' },
          '100%': { transform: 'translate(0, 0)' },
        },

        // Line draw
        'draw-line': {
          '0%': { strokeDashoffset: '100%' },
          '100%': { strokeDashoffset: '0%' },
        },

        // Progress/ring fill
        'progress-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width, 100%)' },
        },
        'ring-fill': {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: 'var(--ring-offset, 0)' },
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

        // Shimmer
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },

        // Breathing
        'breathe': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },

      animation: {
        // Hero entrances
        'hero-rise': 'hero-rise 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'hero-slide-right': 'hero-slide-right 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'hero-slide-left': 'hero-slide-left 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'hero-fade': 'hero-fade 1.2s ease-out forwards',

        // Glitch
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'glitch-skew': 'glitch-skew 0.5s ease-in-out infinite',

        // Pulse/glow
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'scan-beam': 'scan-beam 2s ease-in-out infinite',
        'data-flow': 'data-flow 2.5s linear infinite',

        // Float
        'orbit': 'orbit 20s linear infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-diagonal': 'float-diagonal 20s ease-in-out infinite',

        // Background
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'noise-shift': 'noise-shift 8s steps(10) infinite',

        // Cascades
        'cascade-up': 'cascade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'cascade-left': 'cascade-left 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'cascade-right': 'cascade-right 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'blur-in': 'blur-in 0.8s ease-out forwards',

        // Counter
        'count-pulse': 'count-pulse 0.3s ease-out',

        // Typewriter
        'typewriter': 'typewriter 3s steps(40) forwards',
        'blink-caret': 'blink-caret 0.8s step-end infinite',

        // Radar
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'ping-ring': 'ping-ring 2s ease-out infinite',

        // Progress
        'progress-fill': 'progress-fill 1.5s ease-out forwards',
        'ring-fill': 'ring-fill 1.5s ease-out forwards',

        // Accordion
        'accordion-down': 'accordion-down 0.3s ease-out',
        'accordion-up': 'accordion-up 0.3s ease-out',

        // Shimmer
        'shimmer': 'shimmer 2s linear infinite',

        // Breathe
        'breathe': 'breathe 4s ease-in-out infinite',

        // Draw
        'draw-line': 'draw-line 1.5s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

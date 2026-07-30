/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030611',
          900: '#050816',
          850: '#080D21',
          800: '#0B1224',
          750: '#101A36',
          700: '#17254A',
        },
        navy: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
        },
        blue: {
          500: '#3B82F6',
          600: '#2563EB',
        },
        purple: {
          500: '#A855F7',
          600: '#9333EA',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
        },
        indigo: {
          500: '#6366F1',
          600: '#4F46E5',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'DM Sans', 'sans-serif'],
        heading: ['Outfit', 'Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'scan-line': 'scanLine 3s ease-in-out infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'laser-move': 'laserMove 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(-1deg)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        laserMove: {
          '0%, 100%': { top: '0%' },
          '50%': { top: '95%' },
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.5), 0 0 10px -2px rgba(6, 182, 212, 0.3)',
        'neon-blue': '0 0 25px -5px rgba(59, 130, 246, 0.5), 0 0 10px -2px rgba(59, 130, 246, 0.3)',
        'neon-purple': '0 0 25px -5px rgba(168, 85, 247, 0.5), 0 0 10px -2px rgba(168, 85, 247, 0.3)',
        'neon-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.5), 0 0 10px -2px rgba(16, 185, 129, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}

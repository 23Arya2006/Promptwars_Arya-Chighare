/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#06080C',
          900: '#0A0D14',
          850: '#0F131D',
          800: '#151B28',
          750: '#1C2333',
          700: '#232D42',
          600: '#334155',
          500: '#475569',
        },
        semantic: {
          visible: '#94A3B8',
          assumption: '#F59E0B',
          blindspot: '#EF4444',
          evidence: '#38BDF8',
          conflict: '#A855F7',
          question: '#10B981',
          secondorder: '#EC4899',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif']
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(56, 189, 248, 0.15)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.2)',
        'glow-red': '0 0 20px -3px rgba(239, 68, 68, 0.25)',
        'glow-purple': '0 0 20px -3px rgba(168, 85, 247, 0.2)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.2)',
      },
      animation: {
        'scan-line': 'scan 3s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 6s linear infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(-100%)', opacity: '0.2' },
          '50%': { transform: 'translateY(100%)', opacity: '0.8' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E6875',
          light: '#148595',
          dark: '#063D45',
          glow: 'rgba(14, 104, 117, 0.25)',
        },
        bg: {
          dark: '#F8FAFC',
          light: '#F8FAFC',
          peach: '#F8FAFC',
          'peach-light': '#F1F5F9',
          'teal-light': '#E6F3F5',
          card: '#FFFFFF',
          'card-hover': '#F8FAFC',
        },
        coral: {
          DEFAULT: '#EE6C4D',
          dark: '#DB5A3A',
          glow: 'rgba(238, 108, 77, 0.3)',
        },
        customText: {
          main: '#0F172A',
          muted: '#475569',
          dark: '#0F172A',
          'dark-muted': '#334155',
        },
        customBorder: {
          dark: '#CBD5E1',
          light: '#E2E8F0',
          teal: 'rgba(14, 104, 117, 0.3)',
        }
      },
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
      },
      borderRadius: {
        'btn': '10px',
        'btn-lg': '12px',
        'input': '14px',
        'card': '24px',
        'card-lg': '28px',
        'chip': '9999px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
      boxShadow: {
        'subtle': '0px 4px 12px rgba(15, 23, 42, 0.03)',
        'medium': '0px 8px 20px rgba(15, 23, 42, 0.05)',
        'strong': '0px 12px 28px rgba(15, 23, 42, 0.08)',
        'glass': '0px 12px 32px rgba(14, 104, 117, 0.08)',
        'teal': '0 10px 25px rgba(14, 104, 117, 0.25)',
        'coral': '0 10px 25px rgba(238, 108, 77, 0.3)',
        'card-heavy': '0px 25px 60px -15px rgba(15, 23, 42, 0.12)',
        'focus-ring': 'rgba(14, 104, 117, 0.25) 0px 0px 0px 3px',
      },
      transitionTimingFunction: {
        'fast': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(220, 50%, 45%)',
        secondary: 'hsl(150, 30%, 40%)',
        accent: 'hsl(30, 80%, 50%)',
        success: 'hsl(120, 60%, 40%)',
        warning: 'hsl(45, 80%, 50%)',
        error: 'hsl(0, 70%, 45%)',
        background: 'hsl(0, 0%, 98%)',
        surface: 'hsl(0, 0%, 100%)',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '32px',
      },
      boxShadow: {
        card: '0 8px 24px hsla(220, 50%, 45%, 0.12)',
        popover: '0 16px 48px hsla(220, 50%, 45%, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 250ms cubic-bezier(0.22,1,0.36,1)',
        'slide-in': 'slideIn 400ms cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
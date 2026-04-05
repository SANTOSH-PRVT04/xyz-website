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
          DEFAULT: '#005eb8',
          hover: '#004b93',
        },
        secondary: {
          DEFAULT: '#00a0df',
        },
        emergency: {
          DEFAULT: '#e1251b',
          hover: '#c41e15',
        },
        surface: '#ffffff',
        background: '#f5f8fc',
        text: {
          main: '#1e293b',
          muted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.04)',
        medium: '0 10px 30px rgba(0, 0, 0, 0.08)',
        primary: '0 4px 14px rgba(0, 94, 184, 0.25)',
        emergency: '0 4px 14px rgba(225, 37, 27, 0.25)',
      }
    },
  },
  plugins: [],
}

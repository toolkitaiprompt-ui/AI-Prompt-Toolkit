/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#1E3A8A',
        'vibrant-pink': '#DB2777',
        'warm-orange': '#F97316',
        'vibrant-yellow': '#FFD700',
        'electric-pink': '#FF1493',
        'bright-cyan': '#00D9FF',
        'lime-green': '#00FF41',
      },
      fontFamily: {
        'headline': ['Poppins', 'Inter', 'sans-serif'],
        'body': ['Inter', 'Segoe UI', 'sans-serif'],
        'code': ['Fira Code', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}

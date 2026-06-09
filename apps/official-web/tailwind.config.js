/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { dji: { dark: '#1a1a1a', gray: '#2d2d2d' } } } },
  plugins: [],
}

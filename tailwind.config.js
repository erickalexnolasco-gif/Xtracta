/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
        fontFamily: {
        // Reemplazamos la fuente sans por defecto
        sans: ['"Montserrat"', 'sans-serif'],
      },
      colors: {
        brand: {
          light: '#F8F9FA',
          dark: '#1A1C1E',
          accent: '#2563EB',
        }
      },
    },
  },
  // AGREGAMOS ESTO:
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
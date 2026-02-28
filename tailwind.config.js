/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
        fontFamily: {
        // Helvetica Neue como fuente principal
        sans: ['Helvetica Neue', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        
        // Museo Moderno desde Google Fonts (todas las variaciones 100-900)
        museo: ['"MuseoModerno"', 'sans-serif'],
        
        // Serif para contenido de artículos
        serif: ['Charter', 'Newsreader', 'Georgia', 'serif'],
      },
      fontWeight: {
        ultralight: '100',
        thin: '200',
        light: '300',
        normal: '400',
        medium: '500',
        bold: '700',
        heavy: '800',
        black: '900',
      },
      colors: {
        brand: {
          light: '#F8F9FA',
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
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F8E6A0',
        orange: '#FFA62B',
        blue: '#2E5AA7',
        sky: '#86C5FF',
        mint: '#A3E6B5',
        'neo-black': '#1A1A1A',
        white: '#FFFFFF',
        'dark-white': '#F9F9F9',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Outfit', 'sans-serif'],
        body: ['var(--font-body)', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        neo: '4px 4px 0px 0px #1A1A1A',
        'neo-hover': '2px 2px 0px 0px #1A1A1A',
        'neo-sm': '2px 2px 0px 0px #1A1A1A',
      },
      borderRadius: {
        'lg': '24px',
        'md': '16px',
        'sm': '8px',
      },
    },
  },
  plugins: [],
};

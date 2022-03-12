const defaultTheme = require(`tailwindcss/defaultTheme`);

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",  
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [`Inter`, ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      black: '#000',
      bluegreen: '#026670',
      purple: '#8D33D2'
    }
  },
  plugins: [],
}
 
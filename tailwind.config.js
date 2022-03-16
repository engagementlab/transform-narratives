const defaultTheme = require(`tailwindcss/defaultTheme`);

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [`Inter`, ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        large: '38px',
      },
    },
    colors: {
      base: '#606A67',
      black: '#000',
      bluegreen: '#026670',
      coated: '#2D3130',
      'green-blue': '#5EB89E',
      oasis: '#9FEDD7',
      purple: '#8D33D2',
      white: '#FFF',
    },
  },
  plugins: [],
};

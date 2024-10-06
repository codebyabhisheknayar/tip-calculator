/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00474b',
          '50': '#F3F8FB',
          '100': '#C5E4E7',
          '200': '#7bf8ff',
          '300': '#31f2ff',
          '400': '#00f8ff',
          '500': '#31C2B0',
          '600': '#00bbbf',
          '700': '#009297',
          '800': '#007177',
          '900': '#00474b',
          '950': '#00383d',
        },

      },
      fontFamily: {
        "lato": ['Space Mono', 'system-ui']
      }
    },
  },
  plugins: [],
}


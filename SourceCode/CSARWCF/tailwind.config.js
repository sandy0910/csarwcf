/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'profile-blue': '#8deefb',
        'profile-light': '#dceff1',
      },
    },
  },
  plugins: [],
}
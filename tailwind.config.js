/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/index.html", "./static/js/main.js"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};

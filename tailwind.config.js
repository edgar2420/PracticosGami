/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  safelist: [
    { pattern: /(bg|text|border)-(emerald|green|sky|indigo|violet|pink|rose|orange|yellow|amber|lime|cyan|slate|stone|neutral|purple|fuchsia)-(400|500|600|700|800|900)/ },
  ],
  plugins: [],
}

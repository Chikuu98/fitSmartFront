/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {},
      colors: {
        secondary: "#0A1C2E",
        "secondary-hover": "#FFFFFF",
        text: "#E0E0E0",
        "text-hover": "#90CAF9",
        accent: "#FF6D00",
        "accent-hover": "#DD4B00",
        neutral: "#424242",
        "neutral-hover": "#616161",
        background: "#0000",
        "background-alt": "#1C1C1C",
      },
    },
  },
  plugins: [],
};

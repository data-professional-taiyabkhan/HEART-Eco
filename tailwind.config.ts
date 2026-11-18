import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "Arial", "Helvetica", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#EAF6FF",
          100: "#D3ECFF",
          200: "#A8D9FF",
          300: "#71C0FF",
          400: "#3DA6FF",
          500: "#0089F7",
          600: "#0072D6",
          700: "#134087",
          800: "#0F2F63",
          900: "#0A1F42",
        },
      },
    },
  },
  plugins: [],
};
export default config;


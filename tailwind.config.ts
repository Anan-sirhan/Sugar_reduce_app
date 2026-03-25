import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          50: "#f3fbf8",
          100: "#ddf4ec",
          500: "#57b894",
          700: "#377d63"
        }
      }
    },
  },
  plugins: [],
};

export default config;

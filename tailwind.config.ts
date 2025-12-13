import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f6ff",
          100: "#dce9ff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e3a8a",
        },
      },
    },
  },
  plugins: [],
};

export default config;

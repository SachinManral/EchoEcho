import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundOpacity: {
        8: "0.08",
      },
      backdropBlur: {
        xl: "20px",
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lightGreen: "#2DC44D",
      },
      animationDelay: {
        "0.1s": "0.1s",
        "0.3s": "0.3s",
        "0.6s": "0.6s",
      },
    },
  },
  plugins: [],
};
export default config;

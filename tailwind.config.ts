import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Poppins",
          "Roboto",
          "Open Sans",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          0: "#FFFFFF",
          100: "#F5F8FE",
          200: "#EBF1FD",
          300: "#E0EAFC",
          400: "#D6E3FB",
          500: "#CCDCFB",
          600: "#C2D4FA",
          700: "#B8CDF9",
          800: "#ADC6F8",
          900: "#A3BFF7",
          1000: "#99B8F6",
        },
        "primary-dark": {
          0: "#E6EDFD",
          50: "#CCDCFB",
          100: "#99B8F6",
          200: "#6695F2",
          300: "#3371ED",
          400: "#004EE9",
          500: "#003EBA",
          600: "#002F8C",
          700: "#001F5D",
          800: "#00102F",
          900: "#000817",
        },
        "background-dark-90": "#111111",
        "background-dark-80": "#181a1b",
        "background-light-10": "#f8faff",
        "background-light-0": "#ffffff",
      },
      listStyleType: {
        alpha: "lower-alpha",
      },
      aspectRatio: {
        auto: "auto",
        square: "1 / 1",
        video: "16 / 9",
      },
      gridTemplateColumns: {
        "16": "repeat(16, minmax(0, 1fr))",
        "18": "repeat(18, minmax(0, 1fr))",
        "20": "repeat(20, minmax(0, 1fr))",
      },
      scale: {
        "120": "1.2",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};

export default config;
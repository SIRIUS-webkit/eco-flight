import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      0: [
        "0px",
        {
          letterSpacing: "0px",
        },
      ],
      xxsm: [
        ".5rem",
        {
          lineHeight: "14px",
        },
      ],
      xsm: [
        ".75rem",
        {
          lineHeight: "21px",
        },
      ],
      sm: [
        ".875rem",
        {
          lineHeight: "24.5px",
        },
      ],
      base: [
        "1rem",
        {
          lineHeight: "28px",
        },
      ],
      md: [
        "1.125rem",
        {
          lineHeight: "31.5px",
        },
      ],
      lg: [
        "1.25rem",
        {
          lineHeight: "35px",
        },
      ],

      xl: [
        "1.5rem",
        {
          lineHeight: "42px",
        },
      ],

      "2xl": [
        "2rem",
        {
          lineHeight: "56px",
        },
      ],

      "3xl": [
        "2.5rem",
        {
          lineHeight: "60px",
        },
      ],

      "4xl": [
        "3.5rem",
        {
          lineHeight: "98px",
        },
      ],
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "salmon-blue": "#35b9ff",
        fuchsia: "#e879f9",
        yellow: "#ffdc59",
        zic: "#09090b",
        ether: "#fe4e5b",
        white: "#ffffff",
        "light-green": "#eafaf1",
      },
    },
    screens: {
      "2xl": { min: "1536px" },
      // => @media (max-width: 1535px) { ... }
      xl: { min: "1280px" },
      // => @media (max-width: 1279px) { ... }
      lg: { min: "1024px" },
      // => @media (max-width: 1023px) { ... }
      md: { min: "768px" },
      // => @media (max-width: 767px) { ... }
      sm: { min: "600px" },
      // => @media (max-width: 639px) { ... }
      xsm: { min: "480px" },
      xlmx: { max: "1280px" },
      // => @media (max-width: 1279px) { ... }
      lgmx: { max: "1024px" },
      mx910: { max: "910px" },
      // => @media (max-width: 1023px) { ... }
      mdmx: { max: "768px" },
      // => @media (max-width: 767px) { ... }
      smmx: { max: "600px" },
      // => @media (max-width: 639px) { ... }
      xsmmx: { max: "480px" },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#4caf50", // Main primary color
          secondary: "#ff9800", // Vibrant orange for secondary
          accent: "#03a9f4", // Bright sky blue for accents
          neutral: "#212121", // Dark charcoal for neutral elements
          "base-100": "#f5f5f5", // Light off-white background
          info: "#2196f3", // Blue for information messages
          success: "#388e3c", // Dark green for success messages
          warning: "#ffc107", // Yellow-orange for warnings
          error: "#f44336", // Bright red for errors
          "light-green": "#eafaf1",
        },
      },
    ],
  },
} satisfies Config;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      logo: ["Prata", "Georgia", "Times New Roman"],
      main: ["Outfit", "Arial"],
    },
    fontWeight: {
      300: "300",
      400: "400",
      500: "500",
      600: "600",
    },
    fontSize: {
      "size-12": "12px",
      "size-14": "14px",
      "size-15": "15px",
      "size-16": "16px",
      "size-20": "20px",
      "size-24": "24px",
      "size-30": "30px",
    },
    colors: {
      white: "#FFFFFF",
      base: "#E2F1FF",
      "accent-1": "#DDFAFF",
      "accent-2": "#86B6C4",
      black: "#000000",
      "black-1": "#565757",
      "black-2": "#414141",
      "text-col-1": "#6A7281",
      "text-col-2": "#374152",
      danger: "#FF5733",
    },
    extend: {},
  },
  plugins: [],
};

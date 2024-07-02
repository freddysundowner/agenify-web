module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#5e60b9",
        gradient: {
          start: "#5e60b9",
          end: "#4eb5b5",
        },
      },
      fontFamily: {
        hero: ["Hero", "sans-serif"],
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
};

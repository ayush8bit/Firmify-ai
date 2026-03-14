/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        panel: "#0f1f33",
        accent: "#f97316",
        signal: "#22c55e",
        mist: "#dbeafe",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(14, 116, 144, 0.22)",
      },
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui"],
        body: ["Manrope", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};


import { pentatrionTw } from "../src/tailwind/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}", "../src/**/*.{ts,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {},
  },
  safelist: ["light", "dark"],
  plugins: [pentatrionTw],
};

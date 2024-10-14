import { pentatrionTw, pentatrionTypographyExtend } from "../src/tailwind";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}", "../src/**/*.{ts,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      typography: pentatrionTypographyExtend,
    },
  },
  safelist: ["light", "dark"],
  plugins: [pentatrionTw({}), typography],
};

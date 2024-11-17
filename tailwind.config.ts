import { pentatrionTw, pentatrionTypographyExtend } from "./src/tailwind/plugin";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/redux/**/*.{ts,tsx}",
    "./src/styles/**/*.{ts,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      typography: pentatrionTypographyExtend,
    },
  },
  safelist: ["light", "dark"],
  plugins: [pentatrionTw, typography],
};

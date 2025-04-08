import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

/**
 * Usage : Storybook et Vitest
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // globals: true
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],

    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: false,
  },
});

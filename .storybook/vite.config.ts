import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Usage : Storybook et Vitest
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
});

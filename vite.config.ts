import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

const projectDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "~": resolve(projectDir, "src"),
    },
  },
  test: {
    // globals: true
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],

    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: false,
  },
});

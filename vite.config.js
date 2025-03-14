import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  root: "./src/",
  envDir: "../",
  build: {
    outDir: "../dist/",
    emptyOutDir: true,
  },
  server: {
    open: false,
  },
  preview: {
    open: false,
  },
});

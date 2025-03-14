import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    // Simple plugin to serve files from outside directories
    {
      name: "serve-external-files",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          console.log(`[Vite Middleware] Request for: ${req.url}`);

          // Handle backend/prod files
          if (req.url.startsWith("/backend/prod/")) {
            const filePath = resolve(
              __dirname,
              "../backend/prod",
              req.url.replace("/backend/prod/", "").split("?")[0],
            );
            console.log(
              `[Vite Middleware] Looking for backend file at: ${filePath}`,
            );

            if (fs.existsSync(filePath)) {
              console.log(
                `[Vite Middleware] Found backend file, serving: ${filePath}`,
              );
              const content = fs.readFileSync(filePath);
              res.setHeader("Content-Type", "application/json");
              res.end(content);
              return;
            } else {
              console.log(
                `[Vite Middleware] Backend file not found: ${filePath}`,
              );
            }
          }

          // Handle static files
          if (req.url.startsWith("/static/")) {
            const filePath = resolve(
              __dirname,
              "../static",
              req.url.replace("/static/", "").split("?")[0],
            );
            console.log(
              `[Vite Middleware] Looking for static file at: ${filePath}`,
            );

            if (fs.existsSync(filePath)) {
              console.log(
                `[Vite Middleware] Found static file, serving: ${filePath}`,
              );
              const content = fs.readFileSync(filePath);
              const ext = filePath.split(".").pop().toLowerCase();
              const contentTypes = {
                json: "application/json",
                js: "application/javascript",
                css: "text/css",
                png: "image/png",
                jpg: "image/jpeg",
                jpeg: "image/jpeg",
                svg: "image/svg+xml",
                mp3: "audio/mpeg",
              };
              res.setHeader("Content-Type", contentTypes[ext] || "text/plain");
              res.end(content);
              return;
            } else {
              console.log(
                `[Vite Middleware] Static file not found: ${filePath}`,
              );
            }
          }

          next();
        });
      },
    },
  ],
  root: "./src/",
  envDir: "../",
  build: {
    outDir: "../dist/",
    emptyOutDir: true,
  },
  server: {
    open: false,
    fs: {
      allow: ["..", "../.."],
    },
  },
  preview: {
    open: false,
  },
});

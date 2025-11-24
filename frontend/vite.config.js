import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    host: "192.168.68.51",
    port: 5173,
    https: {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.crt"),
    },
  },
});

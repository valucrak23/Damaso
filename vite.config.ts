import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  // Fotos, videos y logos se cargan desde Contenido/Multimedia con su nombre de archivo.
  publicDir: path.resolve(rootDir, "Contenido/Multimedia"),
});

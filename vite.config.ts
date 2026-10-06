import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Fotos, videos y logos se cargan desde Contenido/Multimedia con su nombre de archivo.
  publicDir: "Contenido/Multimedia",
});

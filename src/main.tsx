/*
 * Revista digital del Nivel Primario · Instituto Social Militar Dr. Dámaso Centeno
 * Diseño y desarrollo web: Valentina Ijelchuk
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { signConsole } from "./signature/signature";
import "./index.css";
import "./styles/magazine.css";
import "./signature/signature.css";

signConsole();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

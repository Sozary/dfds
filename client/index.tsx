import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";

const domNode = document.getElementById("app");
if (!domNode) throw new Error("Root element not found");
const root = createRoot(domNode);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

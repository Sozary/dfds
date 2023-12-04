import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

const domNode = document.getElementById("app");
if (!domNode) throw new Error("Root element not found");
const root = createRoot(domNode);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

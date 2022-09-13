import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import { Welcome } from "./Welcome";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Website } from "./website";
import theme from "./utils/theme";
import { Dashboard } from "./dashboard";
import "./config/firebase-config";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/room/:roomId" element={<App />} />
          <Route path="/room" element={<App />} />
          <Route path="/" element={<Website />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);

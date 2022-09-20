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
import "react-credit-cards/es/styles-compiled.css";
import { Room } from "./room/room";
import { Home, Integrate, Settings } from "./dashboard/routes";

import { QueryClientProvider, QueryClient } from "react-query";
import { Success } from "./room/success";
import { Failure } from "./room/failure";
import { Analytics } from "./dashboard/routes/analytics";
import { Docs } from "./website/docs";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path="/docs" element={<Docs />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="/room" element={<Room />} />
            <Route path="/" element={<Website />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="home" element={<Home />} />
              <Route path="integrate" element={<Integrate />} />
              <Route path="settings" element={<Settings />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
            <Route path="/success" element={<Success />} />
            <Route path="/failure" element={<Failure />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

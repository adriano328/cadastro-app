import React from "react";
import ReactDOM from "react-dom/client";
import AppLiveness from "./pages/liveness/AppLiveness";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppLiveness />
  </React.StrictMode>,
);

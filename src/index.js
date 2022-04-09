import React from "react";
import ReactDOMClient from "react-dom/client";
import App from "./components/App";
import "bootstrap/dist/css/bootstrap.min.css";

const container = document.getElementById("root");

const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            border: "1px solid #e5e9e5",
            borderRadius: "8px",
            color: "#17211d",
            fontSize: "13px",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
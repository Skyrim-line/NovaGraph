import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
import NewAPP from "./new-app.jsx";
import "./index.css";

// 强制为暗黑模式
document.documentElement.classList.add("dark");
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NewAPP />
  </React.StrictMode>
);

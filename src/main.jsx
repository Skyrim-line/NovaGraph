import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./context/theme";
import { GraphProvider } from "./context/GraphUpdate";
import NewAPP from "./new-app.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <GraphProvider>
        <NewAPP />
      </GraphProvider>
    </ThemeProvider>
  </React.StrictMode>
);

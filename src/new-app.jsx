import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Guide from "./pages/guide";
import { ThemeProvider } from "./context/theme";
import "./App.css";
function NewApp() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="guide" element={<Guide />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default NewApp;

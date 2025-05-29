import { lazy } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
// import Home from "./pages/home";
import Demo from "./demopage";
const Home = lazy(() => import("./pages/home"));

function NewApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<Demo />} />
      </Routes>
    </Router>
  );
}

export default NewApp;

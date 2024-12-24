import React from "react";
import Navbar from "./components/nav";
import Footer from "./components/footer";
import { Box, Toolbar } from "@mui/material";
import { ThemeContext } from "../context/theme";
import "../App.css";
import System from "./components/Frame3.svg";

function Home() {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: theme === "light" ? "#37729C" : "#333333",
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          textAlign: "center",
          color: theme === "light" ? "#ffffff" : "#ffffff",
        }}
      >
        <Toolbar /> {/* Push content below the AppBar */}
        <div className="title">
          <div>
            <h1>Welcome to NovaGraph</h1>
            <div>
              Inspired by DuckDB-WASM, Novagraph is a web application to perform
              graph analytics written using WebAssembly. Novagraph uses C++ and
              the igraph library to perform analytical processing of graphs
              before it is rendered on the frontend.
            </div>
          </div>
          <img src={System} alt="Graph Illustration" />
        </div>
      </Box>
      <Footer />
    </Box>
  );
}

export default Home;

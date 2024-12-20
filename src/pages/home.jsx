import React from "react";
import Navbar from "./components/nav";
import Footer from "./components/footer";
import { Box, Toolbar, Typography } from "@mui/material";
import { ThemeContext } from "../context/theme";

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
        <Typography variant="h4" gutterBottom>
          Welcome to NovaGraph
        </Typography>
        <Typography variant="body1">
          Explore modern MUI and React app development.
        </Typography>
      </Box>
      <Footer />
    </Box>
  );
}

export default Home;

import React from "react";
import { Box, Typography } from "@mui/material";
import { ThemeContext } from "../../context/theme";

function Footer() {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  return (
    <Box
      component="footer"
      className="justify-center items-center"
      sx={{
        mt: "auto",
        py: 2,
        backgroundColor: theme === "light" ? "#37729C" : "#333333",
        color: "white",
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          color: theme === "light" ? "#000000" : "#ffffff",
          fontSize: "16px",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        © {new Date().getFullYear()} NovaGraph. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;

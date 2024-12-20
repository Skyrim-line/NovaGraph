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
        backgroundColor: theme === "light" ? "#3f51b5" : "#333333",
        color: "white",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" sx={{ fontSize: " 20px" }}>
        © {new Date().getFullYear()} NovaGraph. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;

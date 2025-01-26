import React from "react";
import { Box, Typography } from "@mui/material";
import { ThemeContext } from "../../context/theme";

function Footer() {
  const { currentThemeToken } = React.useContext(ThemeContext);

  return (
    <Box
      component="footer"
      className="justify-center items-center"
      sx={{
        mt: "auto",
        py: 2,
        backgroundColor: currentThemeToken.colorBgContainer, // 或你想用的 Token
        color: currentThemeToken.colorText,
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          color: currentThemeToken.colorText,
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

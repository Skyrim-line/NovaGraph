import React from "react";
import Navbar from "./components/nav";
import Footer from "./components/footer";
import { Box, Toolbar } from "@mui/material";
import { ThemeContext } from "../context/theme"; // 从这里获取主题上下文
import "../App.css";
import System from "./components/Frame3.svg";

function Home() {
  // 从 ThemeContext 中获取当前的主题信息
  const { isDarkMode, currentThemeToken } = React.useContext(ThemeContext);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        // 使用自定义的 token 来设置背景色和文本色
        backgroundColor: currentThemeToken.colorBgContainer,
        color: currentThemeToken.colorText,
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          textAlign: "center",
        }}
      >
        <Toolbar /> {/* 用来在 AppBar 下方留出空间 */}
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

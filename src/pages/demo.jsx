// Demo page for the algorithm demo
/* eslint-disable no-unused-vars */
import { useState, useContext } from 'react';
import { ConfigProvider, Layout, Breadcrumb } from 'antd';
import { DarkMode, Brightness7 } from "@mui/icons-material";
import { IconButton } from '@mui/material';
import { ThemeContext } from '../context/theme';  // 引入创建好的上下文
import LeftSider from './components/sider';
import Graph2 from '../components/Graph2';

import "../App.css";
import createModule from "../graph";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../components/Accordion";
import ImportMenu from "../components/imports/ImportMenu";
import { Algorithm } from "../algorithms";
import { algorithmConfig } from "../algorithm-config";
import AlgorithmExplanation from "../components/AlgorithmExplanation";
import { ErasBold, ErasMedium } from "../components/Eras";
import AlgorithmOutput from "../components/algorithmOutputs/AlgorithmOutput";
import AlgorithmInput from "../components/AlgorithmInput";
import { SpinnerDotted } from "spinners-react";
import AlgorithmMultiInput from "../components/AlgorithmMultiInput";
import ExportMenu from "../components/ExportMenu";
import HelperCarousel from "../components/HelperCarousel";
const { Header } = Layout;

const Demo = () => {
  // 侧边栏折叠等其他状态维持不变
  const [collapsed, setCollapsed] = useState(false);
  const [wasmModule, setWasmModule] = useState();
  const [expanded, setExpanded] = useState("panel1");


  // 从 ThemeContext 中获取主题状态和 token
  const { isDarkMode, setIsDarkMode, currentThemeToken } = useContext(ThemeContext);

  return (
    <ConfigProvider
      theme={{
        token: currentThemeToken, // 使用自定义主题 token
        components: {
          Breadcrumb: {
            separatorMargin: '20px',
            linkColor: currentThemeToken.colorText,
            linkHoverColor: currentThemeToken.colorPrimary,
            lastItemColor: currentThemeToken.colorPrimary,
            separatorColor: currentThemeToken.colorText,
          },
        }
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <LeftSider
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isDarkMode={isDarkMode}
        // 这里如果 LeftSider 需要知道是否 Dark Mode，可以通过 props 传递，也可以在 LeftSider 内自行 useContext
        />
        <Layout style={{ minHeight: '100vh' }}>
          <Header
            className='header'
            style={{
              background: currentThemeToken.color3,
            }}
          >
            <Breadcrumb
              className="title"
              items={[
                {
                  title: <a href="/">Home</a>,
                },
                {
                  title: 'Algorithm Demo',
                },
              ]}
            />
            <div className="user-guide">
              <a href="/user-guide" className="user-guide" >User Guide</a>
              <IconButton
                sx={{
                  color: isDarkMode ? "#FFD700" : "#000", // 设置图标颜色
                  transition: "color 0.3s, transform 0.3s",
                  "&:hover": {
                    color: isDarkMode ? "#FFF" : "#555",
                    transform: "scale(1.1)",
                  },
                }}
                onClick={() => setIsDarkMode(prev => !prev)}
                aria-label="toggle dark mode"
              >
                {isDarkMode
                  ? <Brightness7 sx={{ fontSize: "30px" }} />
                  : <DarkMode sx={{ fontSize: "30px" }} />}
              </IconButton>
            </div>
          </Header>
          {/* 图内容区域 */}
          <Graph2 />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Demo;

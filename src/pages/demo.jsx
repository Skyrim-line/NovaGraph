// Demo.js
import React, { useContext, useState } from 'react';
import { ConfigProvider, Layout, Breadcrumb } from 'antd';
import { DarkMode, Brightness7 } from "@mui/icons-material";
import { IconButton } from '@mui/material';

import { ThemeContext } from '../context/theme';  // 引入创建好的上下文
import "../App.css";
import LeftSider from './components/sider';
import { GraphRenderer } from '../components/GraphRenderer';

const { Header, Content } = Layout;

const Demo = () => {
  // 侧边栏折叠等其他状态维持不变
  const [collapsed, setCollapsed] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [directed, setDirected] = useState(false);
  const [renderMode, setRenderMode] = useState(1);

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
          {/* 内容区域 */}
          <Layout>
            <Content >
              <div style={{ padding: 24, background: currentThemeToken.color2 }}>
                Search Box
              </div>
              {/* 主内容区域和右侧 Sider 使用 flex 布局 */}
              <div
                style={{
                  display: 'flex',
                  background: currentThemeToken.colorBgContainer,
                  minHeight: '100vh',
                }}
              >
                {/* 左侧主内容区域 */}
                <div
                  style={{
                    flex: 1,
                    padding: '24px',
                    background: currentThemeToken.color3,
                  }}
                >
                  Bill is a cat.
                  <GraphRenderer
                    nodes={nodes}
                    links={edges}
                    directed={directed}
                    colors={colorMap}
                    mode={renderMode}
                  />
                </div>
                {/* 右侧 Sider 区域 */}
                <div
                  style={{
                    width: '200px',
                    padding: '24px',
                    background: currentThemeToken.color2,
                  }}
                >
                  Right Sider Content
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Demo;

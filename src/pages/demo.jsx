import React, { useState } from 'react';
import { Breadcrumb, ConfigProvider, Layout, Menu, theme } from 'antd';
import { DarkMode, Brightness7 } from "@mui/icons-material";
import { IconButton } from '@mui/material';
import { DesktopOutlined, PieChartOutlined } from '@ant-design/icons';
import "../App.css";

const { Header, Content, Footer, Sider } = Layout;

const Demo = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // 管理主题模式

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 自定义主题颜色
  const darkModeToken = {
    colorBgContainer: '#141414', // 背景颜色
    colorText: '#ffffff', // 文本颜色
    colorPrimary: '#FFD700', // 主色
    borderRadiusLG: '8px', // 圆角
  };

  const lightModeToken = {
    colorBgContainer: '#95CBCE', // 背景颜色
    colorText: '#000000', // 文本颜色
    colorPrimary: '#1890ff', // 主色
    borderRadiusLG: '8px', // 圆角
  };

  // 切换主题模式
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const currentThemeToken = isDarkMode ? darkModeToken : lightModeToken;

  {/* 左侧菜单栏组件 */ }
  const SideMenu = () => {
    return (
      <Menu
        theme={isDarkMode ? "dark" : "light"} // 根据主题模式设置菜单样式
        mode="inline"
        selectedKeys={['1']}
      >
        <Menu.Item key="1" icon={<PieChartOutlined />}>
          Option 1
        </Menu.Item>
        <Menu.Item key="2" icon={<DesktopOutlined />}>
          Option 2
        </Menu.Item>
      </Menu>
    );
  };



  return (
    <ConfigProvider
      theme={{
        token: currentThemeToken, // 使用自定义主题
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          width={300}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme={isDarkMode ? "dark" : "light"} // 根据主题模式设置菜单样式

        >
          <div className="font" style={{ color: isDarkMode ? '#fff' : '#000' }}>
            Novagraph
          </div>
          <SideMenu />
        </Sider>
        <Layout>
          {/* 顶部导航栏 */}
          <Header
            className={`header ${isDarkMode ? 'header-dark' : 'header-light'}`}

          >
            {/* 添加切换主题按钮 */}
            <IconButton
              sx={{
                color: isDarkMode ? "#FFD700" : "#000", // 设置图标颜色
                mx: 2,
              }}
              onClick={toggleTheme}
              aria-label="toggle dark mode"

            >
              {isDarkMode ? <Brightness7 /> : <DarkMode />}
            </IconButton>

          </Header>
          {/* 内容区域 */}
          <Content style={{ margin: '0 16px' }}>
            {/* 面包屑导航 */}
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: isDarkMode ? '#001529' : colorBgContainer, // 动态背景色
                color: isDarkMode ? '#fff' : '#000', // 动态字体颜色
                borderRadius: borderRadiusLG,
              }}
            >
              Bill is a cat.
            </div>
          </Content>
          {/* 底部版权归属*/}
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Demo;

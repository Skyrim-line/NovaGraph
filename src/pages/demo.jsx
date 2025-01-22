import React, { useState } from 'react';
import { Breadcrumb, ConfigProvider, Layout, Menu, theme } from 'antd';
import { DarkMode, Brightness7 } from "@mui/icons-material";
import { IconButton } from '@mui/material';
import { DesktopOutlined, PieChartOutlined, MailOutlined } from '@ant-design/icons';
import "../App.css";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const Demo = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // 管理主题模式

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // 自定义主题颜色
  const darkModeToken = {
    colorBgContainer: '#31363F', // 背景颜色
    colorText: '#ffffff', // 文本颜色
    colorPrimary: '#FFD700', // 主色
    borderRadiusLG: '8px', // 圆角

  };

  const lightModeToken = {
    colorBgContainer: '#95CBCE', // 背景颜色
    colorText: '#000000', // 文本颜色
    colorPrimary: '#1890ff', // 主色
    borderRadiusLG: '8px', // 圆角
    itemHoverBg: '#FFFFFF', // hover 颜色

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
      // selectedKeys={['1']}
      >
        <Menu.Item key="1" icon={<PieChartOutlined />}>
          Option 1
        </Menu.Item>
        <SubMenu key="sub1" icon={<MailOutlined />} title="SubMenu">
          <Menu.Item key="3">Option 3</Menu.Item>
          <Menu.Item key="4">Option 4</Menu.Item>
          <Menu.Item key="5">Option 5</Menu.Item>
        </SubMenu>
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
          <Content style={{ background: isDarkMode ? '#EEEEEE' : '#D9D9D9' }}>
            {/* 面包屑导航 */}
            <Breadcrumb style={{ height: '107px', margin: '16px' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div
              style={{
                padding: 24,
                minHeight: 740,
                background: isDarkMode ? '#001529' : colorBgContainer,
                color: isDarkMode ? '#fff' : '#000', // 设置文本颜色
              }}
            >
              Bill is a cat.
            </div>
          </Content>
          {/* 底部版权归属*/}
          <Footer style={{ textAlign: 'center', background: isDarkMode ? '#001529' : colorBgContainer }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Demo;

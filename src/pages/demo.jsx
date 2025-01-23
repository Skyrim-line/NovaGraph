import { useState } from 'react';
import { ConfigProvider, Layout, Menu, theme } from 'antd';
import { DarkMode, Brightness7 } from "@mui/icons-material";
import { IconButton } from '@mui/material';
import { DesktopOutlined, PieChartOutlined, MailOutlined } from '@ant-design/icons';
import { darkModeToken, lightModeToken } from './components/themeConfig'; // 引入主题配置
import "../App.css";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const Demo = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // 管理主题模式

  const currentThemeToken = isDarkMode ? darkModeToken : lightModeToken;

  {/* 左侧菜单栏组件 */ }
  const SideMenu = () => {
    return (
      <Menu
        theme={isDarkMode ? "dark" : "light"} // 根据主题模式设置菜单样式
        mode="inline"
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
          width={350}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme={isDarkMode ? "dark" : "light"} // 根据主题模式设置菜单样式
        >
          <div className="font-logo" style={{ color: isDarkMode ? '#fff' : '#000' }}>
            Novagraph
          </div>
          <SideMenu />
        </Sider>
        <Layout style={{ minHeight: '100vh' }}>
          <Header
            className={`header ${isDarkMode ? 'header-dark' : 'header-light'}`}
          >
            {/* 添加切换主题按钮 */}
            <IconButton
              sx={{
                color: isDarkMode ? "#FFD700" : "#000", // 设置图标颜色
                mx: 2,
              }}
              onClick={() => setIsDarkMode((prev) => !prev)}
              aria-label="toggle dark mode"
            >
              {isDarkMode ? <Brightness7 /> : <DarkMode />}
            </IconButton>
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

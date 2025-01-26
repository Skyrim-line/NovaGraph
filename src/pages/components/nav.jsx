import * as React from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  IconButton,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { ThemeContext } from "../../context/theme";
import LOGO from "../image/Novagraph.png";
import { Link } from "react-router-dom";
import "../../App.css";

const drawerWidth = 240;
const navItems = [
  { label: "Home", path: "/" },
  { label: "Demo", path: "/demo" },
  { label: "Contact", path: "/contact" },
];

function DrawerAppBar(props) {
  // 从 ThemeContext 中获取 isDarkMode, setIsDarkMode, 和当前的 Token
  const { isDarkMode, setIsDarkMode, currentThemeToken } =
    React.useContext(ThemeContext);

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  // 切换主题
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", backgroundColor: currentThemeToken.colorBgContainer }}
    >
      <Box sx={{ my: 2 }}>
        <Link to="/home">
          <img
            src={LOGO}
            alt="NovaGraph"
            style={{ height: "90px", width: "auto" }}
          />
        </Link>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton>
              <Link
                to={item.path}
                style={{
                  textDecoration: "none",
                  color: currentThemeToken.colorText,
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {item.label}
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        position="static"
        sx={{
          backgroundColor: currentThemeToken.colorBgContainer,
          height: { xs: "80px", sm: "140px" },
          px: 2,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mr: 2,
              display: { sm: "none" },
              color: currentThemeToken.colorText,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
              py: 4,
              ml: "auto",
              lineHeight: 1.5,
            }}
          >
            <Link to="/" className="logo-link">
              <p
                className="logo-text"
                style={{ color: currentThemeToken.colorText }}
              >
                NovaGraph
              </p>
            </Link>
          </Typography>
          {/* 右侧菜单（大屏） */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                style={{ textDecoration: "none" }}
              >
                <Button
                  sx={{
                    color: currentThemeToken.colorText,
                    px: 3,
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{
                mr: 4,
                color: currentThemeToken.colorText,
              }}
            >
              {isDarkMode ? (
                <Brightness7 sx={{ fontSize: "30px" }} />
              ) : (
                <Brightness4 sx={{ fontSize: "30px" }} />
              )}
            </IconButton>
          </Box>

          {/* 小屏下的主题切换按钮 */}
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            sx={{
              display: { xs: "block", sm: "none" },
              ml: "auto",
              color: currentThemeToken.colorText,
            }}
          >
            {isDarkMode ? (
              <Brightness7 sx={{ fontSize: "30px" }} />
            ) : (
              <Brightness4 sx={{ fontSize: "30px" }} />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* 侧边抽屉菜单（移动端） */}

      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: currentThemeToken.colorBgContainer,

          },
        }}
      >
        {drawer}
      </Drawer>

    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;

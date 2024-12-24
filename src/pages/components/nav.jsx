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
import LOGO from "./Novagraph.png";
import { Link } from "react-router-dom"; // 引入 Link
import "../../App.css";

const drawerWidth = 240;
const navItems = [
  { label: "Home", path: "/" },
  { label: "Demo", path: "/demo" },
  { label: "Contact", path: "/contact" },
];

function DrawerAppBar(props) {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
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
                  color: theme === "light" ? "#000000" : "#ffffff",
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
        color="primary"
        sx={{
          backgroundColor: theme === "light" ? "#EFBF6A" : "#333333",
          height: { xs: "80px", sm: "140px" }, // 调整移动端和桌面端高度
          px: 2, // 增加左右内边距
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
              lineHeight: 1.5, // 控制行高
            }}
          >
            <Link to="/" className="logo-link">
              <p
                className="logo-text"
                style={{ color: theme === "light" ? "#000000" : "#ffffff" }}
              >
                NovaGraph
              </p>
            </Link>
          </Typography>
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
                style={{
                  textDecoration: "none",
                }}
              >
                <Button
                  sx={{
                    color: theme === "light" ? "#000000" : "#ffffff",
                    px: 3,
                    fontSize: "1.25rem", // 字体大小
                    fontWeight: "bold", // 加粗
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
                color: theme === "light" ? "#000000" : "#ffffff",
              }}
            >
              {theme === "light" ? (
                <Brightness4 sx={{ fontSize: "30px" }} />
              ) : (
                <Brightness7 sx={{ fontSize: "30px" }} />
              )}
            </IconButton>
          </Box>

          <IconButton
            onClick={toggleTheme}
            color="inherit"
            sx={{
              display: { xs: "block", sm: "none" }, // 小屏显示
              ml: "auto",
              color: theme === "light" ? "#000000" : "#ffffff",
            }}
          >
            {theme === "light" ? (
              <Brightness4 sx={{ fontSize: "30px" }} />
            ) : (
              <Brightness7 sx={{ fontSize: "30px" }} />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: theme === "light" ? "#3f51b5" : "#333333",
              color: theme ? "#ffffff" : "#000000", // Drawer文字颜色
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;

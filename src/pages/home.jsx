import Navbar from "./components/nav";
import Footer from "./components/footer";
import { Box, Toolbar, Typography } from "@mui/material";

function Home() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, textAlign: "center" }}>
        <Toolbar /> {/* Push content below the AppBar */}
        <Typography variant="h4" gutterBottom>
          Welcome to NovaGraph
        </Typography>
        <Typography variant="body1">
          Explore modern MUI and React app development.
        </Typography>
      </Box>
      <Footer />
    </Box>
  );
}

export default Home;

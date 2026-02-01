import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const navItems = [
    { label: "API Keys", path: "/keys" },
    { label: "Documentation", path: "/docs" },
    { label: "Support", path: "/support" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(2,6,23,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1280,
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 3 },
        }}
      >
        {/* Brand */}
        <Typography
          onClick={() => navigate("/keys")}
          sx={{
            flexGrow: 1,
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: 0.5,
            color: "white",
            cursor: "pointer",
          }}
        >
          JOKALANTE
        </Typography>

        {/* Navigation */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  color: isActive ? "white" : "rgba(255,255,255,0.65)",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  fontWeight: isActive ? 600 : 400,
                  px: 2,
                  borderRadius: 2,
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.12)",
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}

          {/* Logout (discret) */}
          <Button
            onClick={logout}
            sx={{
              ml: 1,
              textTransform: "none",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.4)",
              "&:hover": {
                color: "#FCA5A5",
                backgroundColor: "transparent",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

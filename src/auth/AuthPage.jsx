import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    if (isLogin) {
      const data = new URLSearchParams();
      data.append("username", email);
      data.append("password", password);

      const res = await api.post("/platform/auth/login", data);
      localStorage.setItem("token", res.data.access_token);
      navigate("/keys");
    } else {
      await api.post("/platform/auth/register", { email, password });
      setIsLogin(true);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "radial-gradient(circle at top, #1E293B, #020617)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 500,
          px: 5,
          py: 6,
          borderRadius: 4,
          background: "rgba(255,255,255,0.96)",
        }}
      >
        <Stack spacing={4}>
          {/* Header */}
          <Stack spacing={1}>
            <Typography
              variant="h4"
              fontWeight={700}
              letterSpacing={-0.5}
            >
              {isLogin ? "Bienvenue 👋" : "Créer votre compte"}
            </Typography>

            <Typography variant="body1" color="text.secondary">
              {isLogin
                ? "Connectez-vous pour accéder à votre espace développeur."
                : "Rejoignez la plateforme et commencez à utiliser l’API."}
            </Typography>
          </Stack>

          {/* Form */}
          <Stack spacing={3}>
            <TextField
              label="Adresse email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Mot de passe"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              size="large"
              onClick={submit}
              sx={{
                py: 1.6,
                borderRadius: 3,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                color: "white",
                background:
                  "linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)",
                boxShadow:
                  "0 10px 30px rgba(79,70,229,0.35)",
                "&:hover": {
                  boxShadow:
                    "0 14px 40px rgba(79,70,229,0.45)",
                },
              }}
            >
              {isLogin ? "Se connecter" : "Créer mon compte"}
            </Button>
          </Stack>

          {/* Footer */}
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ cursor: "pointer" }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Vous n’avez pas encore de compte ? Inscription"
              : "Vous avez déjà un compte ? Connexion"}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

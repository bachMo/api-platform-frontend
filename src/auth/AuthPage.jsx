import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert
} from "@mui/material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

/* ===============================
   Helpers validation
================================ */

// Validation email simple et fiable
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validation mot de passe sécurisé
const isStrongPassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&     // au moins une majuscule
    /[0-9]/.test(password) &&     // au moins un chiffre
    /[^A-Za-z0-9]/.test(password) // au moins un caractère spécial
  );
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    setError("");

    // ===============================
    // LOGIN
    // ===============================
    if (isLogin) {
      if (!email || !password) {
        setError("Veuillez remplir tous les champs.");
        return;
      }

      try {
        const data = new URLSearchParams();
        data.append("username", email);
        data.append("password", password);

        const res = await api.post("/platform/auth/login", data);
        localStorage.setItem("token", res.data.access_token);
        navigate("/keys");
      } catch (err) {
        setError("Email ou mot de passe incorrect.");
      }
      return;
    }

    // ===============================
    // INSCRIPTION
    // ===============================
    if (!isValidEmail(email)) {
      setError("Adresse email invalide.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial."
      );
      return;
    }

    try {
      await api.post("/platform/auth/register", { email, password });
      setIsLogin(true);
      setPassword("");
    } catch (err) {
      setError("Impossible de créer le compte. Email déjà utilisé ?");
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
            <Typography variant="h4" fontWeight={700}>
              {isLogin ? "Bienvenue 👋" : "Créer votre compte"}
            </Typography>

            <Typography color="text.secondary">
              {isLogin
                ? "Connectez-vous pour accéder à votre espace développeur."
                : "Rejoignez la plateforme et commencez à utiliser l’API."}
            </Typography>
          </Stack>

          {/* Error */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Form */}
          <Stack spacing={3}>
            <TextField
              label="Adresse email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!isLogin && email && !isValidEmail(email)}
              helperText={
                !isLogin && email && !isValidEmail(email)
                  ? "Email invalide"
                  : ""
              }
            />

            <TextField
              label="Mot de passe"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText={
                !isLogin
                  ? "8 caractères min, 1 majuscule, 1 chiffre, 1 caractère spécial"
                  : ""
              }
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
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
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

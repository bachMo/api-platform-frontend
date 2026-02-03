import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import api from "../api/axios";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState([]);
  const [name, setName] = useState("");
  const [visibleKeyId, setVisibleKeyId] = useState(null);
  const [loading, setLoading] = useState(false);

  // UX states
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* =======================
     Chargement initial
  ======================= */
  useEffect(() => {
    api.get("/platform/api-keys").then((res) => setKeys(res.data));
   // console.log('chemin du backend', process.env.REACT_APP_BACK_URL)

  }, [keys]);

  /* =======================
     Création de clé
  ======================= */
  const createKey = async () => {
    if (!name.trim() || loading) return;

    try {
      setLoading(true);
      const res = await api.post("/platform/api-keys", {
        name,
        is_unlimited: false,
      });

      setKeys((prev) => [res.data, ...prev]);
      setVisibleKeyId(res.data.id);
      setName("");

      setSnackbar({
        open: true,
        message: "Clé API créée avec succès. Copiez-la maintenant.",
        severity: "success",
      });

      // Auto-masquage après 5 secondes
      setTimeout(() => setVisibleKeyId(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     Suppression confirmée
  ======================= */
  const confirmDeleteKey = async () => {
    await api.delete(`/platform/api-keys/${confirmDelete.id}`);
    setKeys((prev) => prev.filter((k) => k.id !== confirmDelete.id));
    setConfirmDelete(null);

    setSnackbar({
      open: true,
      message: "Clé API supprimée.",
      severity: "info",
    });
  };

  /* =======================
     Copie
  ======================= */
  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    setSnackbar({
      open: true,
      message: "Clé copiée dans le presse-papiers.",
      severity: "success",
    });
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", px: 2, py: 6 }}>
      {/* En-tête */}
      <Stack spacing={1} mb={5}>
        <Typography variant="h4" fontWeight={700}>
          Clés API
        </Typography>
        <Typography color="text.secondary">
          Utilisez ces clés pour authentifier vos requêtes. Ne les partagez jamais publiquement.
        </Typography>
      </Stack>

      {/* Création */}
      <Paper sx={{ p: 3, mb: 6, borderRadius: 3 }} elevation={0}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Nom de la clé"
            placeholder="Ex : Backend production"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Button
            onClick={createKey}
            disabled={loading}
            sx={{
              px: 4,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(135deg, #4F46E5, #06B6D4)",
              color: "white",
            }}
          >
            {loading ? "Création..." : "Créer la clé"}
          </Button>
        </Stack>
      </Paper>

      {/* Liste */}
      <Stack spacing={2}>
        {keys.map((k) => {
          const isVisible = visibleKeyId === k.id;

          return (
            <Paper key={k.id} sx={{ p: 3, borderRadius: 3 }} elevation={0}>
              <Typography fontWeight={600}>{k.name}</Typography>

              <Box
                sx={{
                  mt: 1.5,
                  fontFamily: "monospace",
                  background: "#F8FAFC",
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                {isVisible ? k.api_key : "••••••••••••••••••••••••••••••"}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" justifyContent="space-between">
                <Stack direction="row">
                  <Tooltip title={isVisible ? "Masquer la clé" : "Afficher la clé"}>
                    <IconButton onClick={() => setVisibleKeyId(isVisible ? null : k.id)}>
                      {isVisible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Copier la clé">
                    <IconButton onClick={() => copyKey(k.api_key)}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Tooltip title="Supprimer la clé">
                  <IconButton onClick={() => setConfirmDelete(k)} sx={{ color: "#EF4444" }}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      {/* Confirmation suppression */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Supprimer cette clé ?</DialogTitle>
        <DialogContent>
          <Typography>
            Cette action est irréversible. Les requêtes utilisant cette clé échoueront.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Annuler</Button>
          <Button color="error" onClick={confirmDeleteKey}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Paper
} from "@mui/material";
import api from "../api/axios";

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await api.get("/support");
    setTickets(res.data);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!subject.trim() || !message.trim()) return;
    await api.post("/support", { subject, initial_message: message });
    setSubject("");
    setMessage("");
    load();
  };

  const statusColor = (status) => {
    switch (status) {
      case "open": return "success";
      case "pending": return "warning";
      case "closed": return "default";
      default: return "default";
    }
  };

  return (
    <Box p={4} maxWidth={900} mx="auto">
      <Typography variant="h4" fontWeight={700} mb={3}>
        Support
      </Typography>

      {/* Formulaire de création de ticket */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Stack spacing={2}>
          <TextField
            label="Sujet"
            fullWidth
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #4F46E5, #06B6D4)",
              textTransform: "none",
              fontWeight: 600,
              alignSelf: "flex-start"
            }}
            onClick={create}
          >
            Créer ticket
          </Button>
        </Stack>
      </Paper>

      {/* Liste des tickets */}
      <Stack spacing={3}>
        {tickets.map((t) => (
          <Card key={t.id} sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={600}>{t.subject}</Typography>
                <Chip label={t.status} color={statusColor(t.status)} size="small" />
              </Stack>
              <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>{t.initial_message}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

import {
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  Stack,
  Divider,
  Alert
} from "@mui/material";
import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

/* ===============================
   CONSTANTE API (UNE SEULE FOIS)
================================ */
const API_BASE_URL = "http://localhost:8000";

/* ===============================
   Code Block UX pro
================================ */
function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Paper
      component="pre"
      elevation={0}
      sx={{
        background: "#020617",
        color: "#E5E7EB",
        p: 2.5,
        mt: 2,
        borderRadius: 2,
        fontSize: 14,
        overflowX: "auto",
        position: "relative",
        border: "1px solid #1E293B"
      }}
    >
      <Tooltip title={copied ? "Copié" : "Copier"}>
        <IconButton
          onClick={copy}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: copied ? "#22C55E" : "#38BDF8"
          }}
        >
          {copied ? <CheckCircleOutlineIcon /> : <ContentCopyIcon />}
        </IconButton>
      </Tooltip>
      {children}
    </Paper>
  );
}

/* ===============================
   Tabs Exemples
================================ */
function ExampleTabs({ curl, js, python }) {
  const [tab, setTab] = useState(0);

  return (
    <>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 3 }}>
        <Tab label="cURL" />
        <Tab label="JavaScript" />
        <Tab label="Python" />
      </Tabs>

      {tab === 0 && <CodeBlock>{curl}</CodeBlock>}
      {tab === 1 && <CodeBlock>{js}</CodeBlock>}
      {tab === 2 && <CodeBlock>{python}</CodeBlock>}
    </>
  );
}

/* ===============================
   Section API
================================ */
function ApiSection({ title, endpoint, description, tabs }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 5,
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.08)"
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>
          <Chip label="POST" color="primary" size="small" />
        </Stack>

        <Typography
          sx={{
            fontFamily: "monospace",
            background: "#F1F5F9",
            px: 2,
            py: 1,
            borderRadius: 2,
            width: "fit-content"
          }}
        >
          {API_BASE_URL}{endpoint}
        </Typography>

        <Typography color="text.secondary">
          {description}
        </Typography>

        <Divider />

        <ExampleTabs {...tabs} />
      </Stack>
    </Paper>
  );
}

/* ===============================
   PAGE DOCUMENTATION
================================ */
export default function DocsPage() {
  return (
    <Box maxWidth="1100px" mx="auto" px={2} py={6}>
      {/* Header */}
      <Stack spacing={2} mb={6}>
        <Typography variant="h3" fontWeight={800}>
          📘 Documentation – Modèles IA
        </Typography>

        <Typography color="text.secondary">
          Toutes les routes sont préfixées par <strong>/model</strong> et
          nécessitent une clé API valide.
        </Typography>

        <Alert severity="info">
          Ajoutez toujours le header <strong>x-api-key</strong> à vos requêtes.
        </Alert>

        <CodeBlock>{`x-api-key: sk_xxxxxxxxxxxxxxxxx`}</CodeBlock>
      </Stack>

      {/* ASR */}
      <ApiSection
        title="🎧 Transcription Audio (ASR)"
        endpoint="/model/asr"
        description="Transcrit un fichier audio en texte Wolof."
        tabs={{
          curl: `curl -X POST ${API_BASE_URL}/model/asr \\
  -H "x-api-key: sk_xxxxx" \\
  -F "audio=@audio.wav"`,

          js: `const fd = new FormData();
fd.append("audio", file);

fetch(\`${API_BASE_URL}/model/asr\`, {
  method: "POST",
  headers: { "x-api-key": "sk_xxxxx" },
  body: fd
})
.then(r => r.json())
.then(console.log);`,

          python: `requests.post(
  "${API_BASE_URL}/model/asr",
  headers={"x-api-key": "sk_xxxxx"},
  files={"audio": open("audio.wav","rb")}
).json()`
        }}
      />

      {/* WO → FR */}
      <ApiSection
        title="🌍 Wolof → Français"
        endpoint="/model/wo-fr"
        description="Traduit un texte Wolof en français."
        tabs={{
          curl: `curl -X POST ${API_BASE_URL}/model/wo-fr \\
  -H "x-api-key: sk_xxxxx" \\
  -F "text=Nanga def"`,

          js: `fetch(\`${API_BASE_URL}/model/wo-fr\`, {
  method: "POST",
  headers: { "x-api-key": "sk_xxxxx" },
  body: new URLSearchParams({ text: "Nanga def" })
})
.then(r => r.json())
.then(console.log);`,

          python: `requests.post(
  "${API_BASE_URL}/model/wo-fr",
  headers={"x-api-key":"sk_xxxxx"},
  data={"text":"Nanga def"}
).json()`
        }}
      />

      {/* FR → WO */}
      <ApiSection
        title="🔄 Français → Wolof"
        endpoint="/model/fr-wo"
        description="Traduit un texte français en Wolof."
        tabs={{
          curl: `curl -X POST ${API_BASE_URL}/model/fr-wo \\
  -H "x-api-key: sk_xxxxx" \\
  -F "text=Bonjour"`,

          js: `fetch(\`${API_BASE_URL}/model/fr-wo\`, {
  method: "POST",
  headers: { "x-api-key": "sk_xxxxx" },
  body: new URLSearchParams({ text: "Bonjour" })
})
.then(r => r.json())
.then(console.log);`,

          python: `requests.post(
  "${API_BASE_URL}/model/fr-wo",
  headers={"x-api-key":"sk_xxxxx"},
  data={"text":"Bonjour"}
).json()`
        }}
      />

      {/* TTS */}
      <ApiSection
        title="🔊 Text To Speech"
        endpoint="/model/tts"
        description="Convertit un texte en fichier audio WAV."
        tabs={{
          curl: `curl -X POST ${API_BASE_URL}/model/tts \\
  -H "x-api-key: sk_xxxxx" \\
  -F "text=Bonjour" \\
  --output audio.wav`,

          js: `const res = await fetch(\`${API_BASE_URL}/model/tts\`, {
  method: "POST",
  headers: { "x-api-key": "sk_xxxxx" },
  body: new URLSearchParams({ text: "Bonjour" })
});
const audio = await res.blob();`,

          python: `r = requests.post(
  "${API_BASE_URL}/model/tts",
  headers={"x-api-key":"sk_xxxxx"},
  data={"text":"Bonjour"}
)
open("audio.wav","wb").write(r.content)`
        }}
      />

      {/* FR → WO → TTS */}
      <ApiSection
        title="🗣️ Français → Wolof → Audio"
        endpoint="/model/fr-wo-tts"
        description="Traduit un texte français en Wolof puis génère l’audio."
        tabs={{
          curl: `curl -X POST ${API_BASE_URL}/model/fr-wo-tts \\
  -H "x-api-key: sk_xxxxx" \\
  -F "text=Bonjour" \\
  --output audio.wav`,

          js: `const res = await fetch(\`${API_BASE_URL}/model/fr-wo-tts\`, {
  method: "POST",
  headers: { "x-api-key": "sk_xxxxx" },
  body: new URLSearchParams({ text: "Bonjour" })
});
const audio = await res.blob();`,

          python: `r = requests.post(
  "${API_BASE_URL}/model/fr-wo-tts",
  headers={"x-api-key":"sk_xxxxx"},
  data={"text":"Bonjour"}
)
open("audio.wav","wb").write(r.content)`
        }}
      />
    </Box>
  );
}

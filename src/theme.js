import { createTheme } from "@mui/material/styles";


const theme = createTheme({
palette: {
primary: { main: "#2563eb" },
secondary: { main: "#16a34a" },
background: { default: "#f9fafb" },
},
shape: { borderRadius: 12 },
typography: {
fontFamily: "Inter, Roboto, sans-serif",
},
});


export default theme;
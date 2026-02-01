import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./auth/AuthPage";
import ApiKeysPage from "./pages/ApiKeysPage";
import SupportPage from "./pages/SupportPage";
import DocsPage from "./pages/DocsPage";
import RequireAuth from "./auth/RequireAuth";
import Navbar from "./components/Navbar";


export default function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/auth" element={<AuthPage />} />
<Route path="/" element={<RequireAuth><Navbar /><ApiKeysPage /></RequireAuth>} />
<Route path="/keys" element={<RequireAuth><Navbar /><ApiKeysPage /></RequireAuth>} />
<Route path="/support" element={<RequireAuth><Navbar /><SupportPage /></RequireAuth>} />
<Route path="/docs" element={<RequireAuth><Navbar /><DocsPage /></RequireAuth>} />
</Routes>
</BrowserRouter>
);
}
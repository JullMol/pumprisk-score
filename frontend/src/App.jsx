import { BrowserRouter, Routes, Route } from "react-router-dom";
import LeaderboardPage from "./pages/LeaderboardPage";
import StockDetailPage from "./pages/StockDetailPage";
import MethodologyPage from "./pages/MethodologyPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    /* scanline-overlay adds the subtle moving highlight line across the screen */
    <div className="scanline-overlay">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LeaderboardPage />} />
          <Route path="/stock/:symbol" element={<StockDetailPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

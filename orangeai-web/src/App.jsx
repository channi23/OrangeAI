import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Home from "./pages/home.jsx";
import Upload from "./pages/upload.jsx";
import Results from "./pages/results.jsx";

export default function App() {
  return (
    <div className="min-h-screen text-white bg-[radial-gradient(80%_60%_at_90%_10%,#0ea5e980,transparent),radial-gradient(60%_40%_at_10%_0%,#8b5cf680,transparent)]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  );
}
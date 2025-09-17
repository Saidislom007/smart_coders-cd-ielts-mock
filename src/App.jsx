// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import PrivateRoute from "./components/PrivateRoute";
// full screen qoshildi


// Pages
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Reading from "./pages/Reading";
import Writing from "./pages/Writing";
import SpeakingPage from "./pages/Speaking";
import Listening from "./pages/Listening";
import MarketPage from "./pages/MarketPage";

export default function App() {
  const [isFull, setIsFull] = useState(false);

  const toggleFullScreen = () => {
    const elem = document.documentElement;
    if (!isFull) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      setIsFull(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFull(false);
    }
  };

  return (
    <BrowserRouter>
      {/* Header doimiy bo‘ladi */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          background: "#f3f4f6",
        }}
      >
        <img
          src="./full.png"
          alt="fullscreen"
          className="h-10 cursor-pointer fixed top-2 left-1 z-50"
          onClick={toggleFullScreen}
        />
      </header>

      {/* Routing qismi */}
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LoginPage />} />

        {/* Private routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/reading"
          element={
            <PrivateRoute>
              <Reading />
            </PrivateRoute>
          }
        />
        <Route
          path="/writing"
          element={
            <PrivateRoute>
              <Writing />
            </PrivateRoute>
          }
        />
        <Route
          path="/speaking"
          element={
            <PrivateRoute>
              <SpeakingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/listening"
          element={
            <PrivateRoute>
              <Listening />
            </PrivateRoute>
          }
        />
        <Route
          path="/market"
          element={
            <PrivateRoute>
              <MarketPage />
            </PrivateRoute>
          }
        />

        {/* 404 sahifa */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

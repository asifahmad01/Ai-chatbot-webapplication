import React, { useEffect, useMemo, useState } from "react";
import AuthForm from "./components/AuthForm";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

/** ——— Theme controls ——— */
const useTheme = () => {
  const systemDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [mode, setMode] = useState(
    () => localStorage.getItem("app-theme-mode") || (systemDark ? "dark" : "light")
  );
  const [scheme, setScheme] = useState(
    () => localStorage.getItem("app-theme-scheme") || "aurora" // "aurora" | "meadow"
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-mode", mode);
    root.setAttribute("data-theme", scheme);
    localStorage.setItem("app-theme-mode", mode);
    localStorage.setItem("app-theme-scheme", scheme);
  }, [mode, scheme]);

  const toggleMode = () => setMode((m) => (m === "dark" ? "light" : "dark"));
  const toggleScheme = () => setScheme((s) => (s === "aurora" ? "meadow" : "aurora"));

  return { mode, scheme, toggleMode, toggleScheme };
};

/** ——— Welcome hero ——— */
const WelcomeHeader = ({ name }) => {
  const firstName = (name || "Friend").trim().split(" ")[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <section className="welcome-hero" aria-label="Welcome">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-bg-2" aria-hidden="true" />

      <div className="wh-card">
        <div className="wh-avatar" aria-hidden="true">
          {initial}
        </div>

        <div className="wh-text">
          <div className="wh-badge">
            <span className="wh-dot" /> Welcome to <strong>AI Bot</strong>
          </div>

          <h1 className="wh-title">
            <span className="wh-greet">{greeting},</span>{" "}
            <span className="wh-name">{firstName}</span>{" "}
            <span className="wh-wave" aria-hidden="true">👋</span>
          </h1>

          <p className="wh-sub">
            Ask anything—summaries, code help, brainstorming, or quick answers.
          </p>
        </div>
      </div>
    </section>
  );
};

/** ——— Floating theme buttons ——— */
const ThemeControls = ({ mode, scheme, onToggleMode, onToggleScheme }) => {
  const titleMode = useMemo(() => (mode === "dark" ? "Switch to light" : "Switch to dark"), [mode]);
  const titleScheme = useMemo(
    () => (scheme === "aurora" ? "Switch to Meadow theme" : "Switch to Aurora theme"),
    [scheme]
  );

  return (
    <div className="theme-controls" role="toolbar" aria-label="Appearance controls">
      <button className="btn-icon" onClick={onToggleMode} title={titleMode} aria-label={titleMode}>
        {mode === "dark" ? "🌙" : "☀️"}
      </button>
      <button
        className="btn-icon palette"
        onClick={onToggleScheme}
        title={titleScheme}
        aria-label={titleScheme}
      >
        <span className="swatch s1" />
        <span className="swatch s2" />
        <span className="swatch s3" />
      </button>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const { mode, scheme, toggleMode, toggleScheme } = useTheme();

  const handleAuthSuccess = (loggedInUser) => {
    setIsAuthenticated(true);
    setUser(loggedInUser);
  };

  return (
    <div className="app-shell">
      <ThemeControls
        mode={mode}
        scheme={scheme}
        onToggleMode={toggleMode}
        onToggleScheme={toggleScheme}
      />

      {isAuthenticated && user ? (
        <>
          <WelcomeHeader name={user.name} />
          <div className="chat-area">
            <ChatWindow
              userId={user._id}
              userName={user.name}
              mode={mode}
              scheme={scheme}
              onToggleMode={toggleMode}
              onToggleScheme={toggleScheme}
            />
          </div>
        </>
      ) : (
        <div className="auth-area">
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        </div>
      )}
    </div>
  );
};

export default App;

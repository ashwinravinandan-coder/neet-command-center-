import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { setCurrentUserId } from "./storage";

const NAVY_BG = "#0B1220";
const NAVY_CARD = "#111A2E";

function AuthForm({ mode, onSwitchMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo("Account created! Check your email to confirm, then log in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "#0B1220", border: "1px solid #2A3652", borderRadius: 10,
    padding: "12px 14px", color: "#fff", fontSize: 14, marginBottom: 12,
  };

  return (
    <form onSubmit={submit} style={{ width: "100%", maxWidth: 360 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4, textAlign: "center" }}>
        NEET 2027 Command Center
      </div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24, textAlign: "center" }}>
        {mode === "register" ? "Create your account" : "Log in to continue"}
      </div>

      <label style={{ fontSize: 12, color: "#94A3B8", display: "block", marginBottom: 4 }}>Email</label>
      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" />

      <label style={{ fontSize: 12, color: "#94A3B8", display: "block", marginBottom: 4 }}>Password</label>
      <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} placeholder="At least 6 characters" />

      {error && <div style={{ color: "#EF4444", fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
      {info && <div style={{ color: "#22C55E", fontSize: 12.5, marginBottom: 12 }}>{info}</div>}

      <button type="submit" disabled={loading} style={{
        width: "100%", background: "#3B82F6", color: "#fff", border: "none", borderRadius: 10,
        padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: loading ? "default" : "pointer",
        opacity: loading ? 0.6 : 1, marginBottom: 14,
      }}>
        {loading ? "Please wait…" : mode === "register" ? "Create Account" : "Log In"}
      </button>

      <div style={{ textAlign: "center", fontSize: 12.5, color: "#94A3B8" }}>
        {mode === "register" ? "Already have an account?" : "New here?"}{" "}
        <button type="button" onClick={onSwitchMode} style={{ background: "none", border: "none", color: "#3B82F6", fontWeight: 700, cursor: "pointer", fontSize: 12.5 }}>
          {mode === "register" ? "Log in" : "Create one"}
        </button>
      </div>
    </form>
  );
}

export default function AuthGate({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [mode, setMode] = useState("login");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) setCurrentUserId(data.session.user.id);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setCurrentUserId(newSession ? newSession.user.id : null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div style={{ minHeight: "100vh", background: NAVY_BG, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}>
        Loading…
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ minHeight: "100vh", background: NAVY_BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <AuthForm mode={mode} onSwitchMode={() => setMode(mode === "login" ? "register" : "login")} />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => supabase.auth.signOut()}
        style={{
          position: "fixed", top: 12, right: 12, zIndex: 1000, background: NAVY_CARD,
          border: "1px solid #2A3652", color: "#94A3B8", borderRadius: 8, padding: "6px 10px",
          fontSize: 11, cursor: "pointer",
        }}
      >
        Log out
      </button>
      {children}
    </div>
  );
}

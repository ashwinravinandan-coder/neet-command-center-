import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { setCurrentUserId } from "./storage";

const NAVY_BG = "#0B1220";
const NAVY_CARD = "#111A2E";

const inputStyle = {
  width: "100%", background: "#0B1220", border: "1px solid #2A3652", borderRadius: 10,
  padding: "12px 14px", color: "#fff", fontSize: 14, marginBottom: 12,
};

function BrandFooter() {
  return (
    <div style={{ textAlign: "center", marginTop: 22, fontSize: 11, color: "#475569" }}>
      Built &amp; Designed by <b style={{ color: "#64748B" }}>Ravi Nandan</b>
      <div style={{ marginTop: 2 }}>© 2026 Ravi Nandan. All rights reserved.</div>
    </div>
  );
}

/* ---------------- SPLASH SCREEN ---------------- */
function SplashScreen() {
  return (
    <div style={{
      minHeight: "100vh", background: NAVY_BG, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 20
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg, #3B82F6, #14B8A6)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, marginBottom: 18
      }}>🎯</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: 0.3 }}>NEET COMMAND CENTER</div>
      <div style={{ fontSize: 12.5, color: "#64748B", marginTop: 6, letterSpacing: 1.5 }}>STUDY &nbsp;•&nbsp; TRACK &nbsp;•&nbsp; IMPROVE</div>
      <div style={{ marginTop: 40, fontSize: 11, color: "#475569", textAlign: "center" }}>
        Built &amp; Designed by<br /><b style={{ color: "#94A3B8" }}>Ravi Nandan</b>
      </div>
    </div>
  );
}

/* ---------------- LOGIN / REGISTER ---------------- */
function AuthForm({ mode, onSwitchMode, onForgotPassword }) {
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
        setInfo("Account created! You can log in now.");
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

  return (
    <form onSubmit={submit} style={{ width: "100%", maxWidth: 360 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4, textAlign: "center" }}>
        NEET Command Center
      </div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24, textAlign: "center" }}>
        {mode === "register" ? "Create your account" : "Log in to continue"}
      </div>

      <label style={{ fontSize: 12, color: "#94A3B8", display: "block", marginBottom: 4 }}>Email</label>
      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <label style={{ fontSize: 12, color: "#94A3B8" }}>Password</label>
        {mode === "login" && (
          <button type="button" onClick={onForgotPassword} style={{ background: "none", border: "none", color: "#3B82F6", fontSize: 11.5, cursor: "pointer", padding: 0 }}>
            Forgot password?
          </button>
        )}
      </div>
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
      <BrandFooter />
    </form>
  );
}

/* ---------------- FORGOT PASSWORD ---------------- */
function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err.message || "Could not send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Check your email</div>
        <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>
          If an account exists for {email}, a password reset link has been sent.
        </div>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#3B82F6", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
          ← Back to login
        </button>
        <BrandFooter />
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ width: "100%", maxWidth: 360 }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4, textAlign: "center" }}>Reset your password</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 22, textAlign: "center" }}>
        Enter your account email — we'll send you a reset link.
      </div>
      <label style={{ fontSize: 12, color: "#94A3B8", display: "block", marginBottom: 4 }}>Email</label>
      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" />
      {error && <div style={{ color: "#EF4444", fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
      <button type="submit" disabled={loading} style={{
        width: "100%", background: "#3B82F6", color: "#fff", border: "none", borderRadius: 10,
        padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: loading ? "default" : "pointer",
        opacity: loading ? 0.6 : 1, marginBottom: 14,
      }}>
        {loading ? "Sending…" : "Send Reset Link"}
      </button>
      <div style={{ textAlign: "center" }}>
        <button type="button" onClick={onBack} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: 12.5 }}>
          ← Back to login
        </button>
      </div>
      <BrandFooter />
    </form>
  );
}

/* ---------------- SET NEW PASSWORD (after clicking email link) ---------------- */
function NewPasswordForm({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords don't match"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      onDone();
    } catch (err) {
      setError(err.message || "Could not update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ width: "100%", maxWidth: 360 }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4, textAlign: "center" }}>Set a new password</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 22, textAlign: "center" }}>Choose a new password for your account.</div>
      <label style={{ fontSize: 12, color: "#94A3B8", display: "block", marginBottom: 4 }}>New password</label>
      <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} placeholder="At least 6 characters" />
      <label style={{ fontSize: 12, color: "#94A3B8", display: "block", marginBottom: 4 }}>Confirm password</label>
      <input type="password" required minLength={6} value={confirm} onChange={e => setConfirm(e.target.value)} style={inputStyle} placeholder="Re-enter password" />
      {error && <div style={{ color: "#EF4444", fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
      <button type="submit" disabled={loading} style={{
        width: "100%", background: "#22C55E", color: "#0B1220", border: "none", borderRadius: 10,
        padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: loading ? "default" : "pointer",
        opacity: loading ? 0.6 : 1,
      }}>
        {loading ? "Updating…" : "Update Password"}
      </button>
      <BrandFooter />
    </form>
  );
}

export default function AuthGate({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [mode, setMode] = useState("login"); // login | register | forgot
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) setCurrentUserId(data.session.user.id);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
      setSession(newSession);
      setCurrentUserId(newSession ? newSession.user.id : null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined || showSplash) {
    return <SplashScreen />;
  }

  if (recoveryMode) {
    return (
      <div style={{ minHeight: "100vh", background: NAVY_BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <NewPasswordForm onDone={() => setRecoveryMode(false)} />
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ minHeight: "100vh", background: NAVY_BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        {mode === "forgot"
          ? <ForgotPasswordForm onBack={() => setMode("login")} />
          : <AuthForm mode={mode} onSwitchMode={() => setMode(mode === "login" ? "register" : "login")} onForgotPassword={() => setMode("forgot")} />
        }
      </div>
    );
  }

  return <>{children}</>;
}

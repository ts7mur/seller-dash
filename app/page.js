"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export const dynamic = "force-dynamic";

export default function Home() {
  const [session, setSession] = useState(null);   // who's logged in (null = nobody)
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // On load: check if there's already a logged-in session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    // Keep watching for login/logout so the screen updates instantly
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSignUp() {
    setMessage("Creating account...");
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? "Error: " + error.message : "Account created — now log in.");
  }

  async function handleLogin() {
    setMessage("Logging in...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage("Error: " + error.message);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (loading) return <Centered><p>Loading...</p></Centered>;

  // ---- LOGGED IN ----
  if (session) {
    return (
      <Centered>
        <h1 style={{ fontSize: 40, margin: 0 }}>Seller Dashboard</h1>
        <p style={{ color: "#9aa3b2" }}>Logged in as {session.user.email}</p>
        <p style={{ color: "#5fe39a" }}>✓ Auth working. Inventory & sales come next.</p>
        <button onClick={handleLogout} style={btn}>Sign out</button>
      </Centered>
    );
  }

  // ---- LOGGED OUT (login / signup form) ----
  return (
    <Centered>
      <h1 style={{ fontSize: 40, margin: 0 }}>Seller Dashboard</h1>
      <p style={{ color: "#9aa3b2" }}>Log in or create an account</p>
      <input style={input} placeholder="Email"
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <input style={input} placeholder="Password" type="password"
        value={password} onChange={(e) => setPassword(e.target.value)} />
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={handleLogin} style={btn}>Log in</button>
        <button onClick={handleSignUp}
          style={{ ...btn, background: "transparent", border: "1px solid #d4a843", color: "#d4a843" }}>
          Sign up
        </button>
      </div>
      {message && <p style={{ color: "#d4a843", fontSize: 14 }}>{message}</p>}
    </Centered>
  );
}

function Centered({ children }) {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
      {children}
    </main>
  );
}

const input = { padding: "12px 16px", borderRadius: 6, border: "1px solid #333",
  background: "#1a1a2e", color: "#fff", fontSize: 16, width: 280 };
const btn = { padding: "12px 24px", borderRadius: 6, border: "none",
  background: "#d4a843", color: "#0d0a1e", fontSize: 16, fontWeight: 600, cursor: "pointer" };

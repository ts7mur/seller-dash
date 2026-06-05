"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export const dynamic = "force-dynamic";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
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
  async function handleLogout() { await supabase.auth.signOut(); }

  if (loading) return <main className="auth-wrap"><p className="muted">Loading...</p></main>;

  if (session) {
    return (
      <main className="auth-wrap">
        <div className="auth-card glass rise">
          <h1 className="display-title gradient-text">Seller Dashboard</h1>
          <p className="muted">Logged in as {session.user.email}</p>
          <a className="btn" href="/inventory" style={{ textDecoration: "none", display: "inline-block" }}>Go to inventory →</a>
          <button className="btn-ghost" onClick={handleLogout}>Sign out</button>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card glass rise">
        <h1 className="display-title gradient-text">Seller Dashboard</h1>
        <p className="muted">Log in or create an account</p>
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="row-gap" style={{ justifyContent: "center" }}>
          <button className="btn" onClick={handleLogin}>Log in</button>
          <button className="btn-ghost" onClick={handleSignUp}>Sign up</button>
        </div>
        <p className="msg">{message}</p>
      </div>
    </main>
  );
}

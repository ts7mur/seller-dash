"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [status, setStatus] = useState("Checking connection...");

  useEffect(() => {
    async function check() {
      try {
        // We ask Supabase for a table that doesn't exist yet.
        // If it answers (even with "no such table"), the connection works.
        const { error } = await supabase.from("connection_test").select("*").limit(1);
        if (error && error.code === "42P01") {
          setStatus("Connected to Supabase ✓ (database is empty, that's expected)");
        } else if (error) {
          setStatus("Connected ✓ — " + error.message);
        } else {
          setStatus("Connected to Supabase ✓");
        }
      } catch (e) {
        setStatus("❌ Connection failed: " + e.message);
      }
    }
    check();
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "16px", padding: "40px" }}>
      <h1 style={{ fontSize: "42px", margin: 0 }}>Seller Dashboard</h1>
      <p style={{ fontSize: "18px", color: "#d4a843" }}>{status}</p>
      <p style={{ fontSize: "13px", opacity: 0.5 }}>Phase 0 — pipeline test</p>
    </main>
  );
}

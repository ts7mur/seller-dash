"use client";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "16px", padding: "40px" }}>
      <h1 style={{ fontSize: "42px", margin: 0 }}>Seller Dashboard</h1>
      <p style={{ fontSize: "18px", color: "#d4a843" }}>Phase 0 — Basic test (no Supabase yet)</p>
    </main>
  );
}

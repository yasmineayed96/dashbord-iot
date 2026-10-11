"use client";

import { useEffect, useState } from "react";

type Mesure = { temperature: number; date: string };

export default function Home() {
  const [mesures, setMesures] = useState<Mesure[]>([]);

  useEffect(() => {
    async function actualiser() {
      const res = await fetch("/api")
      setMesures(await res.json());
    }
    actualiser();
    const id = setInterval(actualiser, 3000);
    return () => clearInterval(id);
  }, []);

  const derniere = mesures[mesures.length - 1];

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Dashboard IoT : température</h1>
      <h2>{derniere ? `${derniere.temperature} °C` : "En attente de données..."}</h2>

      <ul>
        {[...mesures].reverse().map((m, i) => (
          <li key={i}>
            {new Date(m.date).toLocaleTimeString()} : {m.temperature} °C
          </li>
        ))}
      </ul>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";

type Mesure = {
  temperature: number;
  date: string;
};

export default function Home() {
  const [mesures, setMesures] = useState<Mesure[]>([]);
  const [connecte, setConnecte] = useState(false);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    let actif = true;

    async function actualiser() {
      try {
        const res = await fetch("/api", { cache: "no-store" });
        if (!res.ok) throw new Error("API indisponible");

        const data: Mesure[] = await res.json();

        if (actif && Array.isArray(data)) {
          setMesures(data);
          setConnecte(true);
        }
      } catch {
        if (actif) setConnecte(false);
      } finally {
        if (actif) setChargement(false);
      }
    }

    actualiser();
    const id = setInterval(actualiser, 3000);

    return () => {
      actif = false;
      clearInterval(id);
    };
  }, []);

  const derniere = mesures[mesures.length - 1];
  const historique = [...mesures].reverse().slice(0, 10);
  const graphique = mesures.slice(-10);
  const maximum = Math.max(
    30,
    ...graphique.map((m) => m.temperature)
  );
  const minimum = Math.min(
    0,
    ...graphique.map((m) => m.temperature)
  );

  const points = graphique.map((m, i) => {
    const x = graphique.length <= 1
      ? 50
      : 10 + (i / (graphique.length - 1)) * 80;
    const y = 85 - ((m.temperature - minimum) /
      Math.max(maximum - minimum, 1)) * 70;

    return { x, y, mesure: m };
  });

  const ligne = points.map((p) => `${p.x},${p.y}`).join(" ");
  const zone = points.length
    ? `10,90 ${ligne} ${points[points.length - 1].x},90`
    : "";

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="brand-icon">♨</div>
        <h2>IoT Monitor</h2>
        <p className="muted">Température</p>

        <div className="nav-active">⌂ &nbsp; Tableau de bord</div>
        <div className="nav-item">↗ &nbsp; Historique</div>

        <div className="sidebar-bottom">
          <span className="status-dot" />
          Supervision IoT
          <p>Données actualisées automatiquement</p>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">ESPACE DE SUPERVISION</p>
            <h1>Bonjour ! <span>☀️</span></h1>
            <p className="muted">
              Voici les dernières mesures de votre capteur IoT.
            </p>
          </div>

          <div className="connection">
            <span className={`status-dot ${connecte ? "" : "offline"}`} />
            {connecte ? "API connectée" : "API déconnectée"}
          </div>
        </header>

        <div className="summary-grid">
          <article className="panel temperature-card">
            <div className="round-icon lavender">♨</div>
            <div>
              <p className="card-label">Température actuelle</p>
              <div className="temperature">
                {derniere
                  ? derniere.temperature.toFixed(1)
                  : "--.-"} <span>°C</span>
              </div>
              <p className="muted small">Dernière mesure reçue</p>
            </div>
          </article>

          <article className="panel info-card mint-card">
            <div className="round-icon mint">◷</div>
            <div>
              <p className="card-label">Dernière mise à jour</p>
              <h2>
                {derniere
                  ? new Date(derniere.date).toLocaleTimeString()
                  : "--:--:--"}
              </h2>
              <p className="muted small">Actualisation toutes les 3 s</p>
            </div>
          </article>

          <article className="panel info-card blue-card">
            <div className="round-icon blue">⌁</div>
            <div>
              <p className="card-label">État du système</p>
              <h2>{connecte ? "En ligne" : "Hors ligne"}</h2>
              <p className="muted small">API REST</p>
            </div>
          </article>
        </div>

        <div className="main-grid">
          <article className="panel chart-card">
            <div className="section-heading">
              <div>
                <h2>Évolution de la température</h2>
                <p className="muted small">Les 10 dernières mesures</p>
              </div>
              <span className="pill">● En direct</span>
            </div>

            <div className="chart">
              {points.length > 0 ? (
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                  {[20, 40, 60, 80].map((y) => (
                    <line key={y} x1="10" y1={y} x2="90" y2={y}
                      className="grid-line" />
                  ))}
                  <polygon points={zone} className="chart-area" />
                  <polyline points={ligne} className="chart-line" />
                  {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="1.3"
                      className="chart-point" />
                  ))}
                </svg>
              ) : (
                <div className="empty-state">
                  {chargement
                    ? "Chargement des mesures..."
                    : "Aucune mesure disponible"}
                </div>
              )}
            </div>

            <div className="chart-caption">
              <span>Ancienne mesure</span>
              <span>Température (°C)</span>
              <span>Mesure récente</span>
            </div>

            <div className="note">
              <span className="note-icon">✦</span>
              <div>
                <strong>Suivi de température</strong>
                <p className="muted small">
                  Les données sont récupérées automatiquement depuis votre API.
                </p>
              </div>
            </div>
          </article>

          <article className="panel history-card">
            <div className="section-heading">
              <div>
                <h2>Dernières mesures</h2>
                <p className="muted small">Historique des relevés</p>
              </div>
              <span className="history-count">{historique.length}</span>
            </div>

            {historique.length > 0 ? (
              <div className="history-list">
                {historique.map((m, i) => (
                  <div className="history-row" key={`${m.date}-${i}`}>
                    <div className="history-symbol">°</div>
                    <div className="history-detail">
                      <strong>{m.temperature.toFixed(1)} °C</strong>
                      <span className="muted small">
                        {new Date(m.date).toLocaleTimeString()}
                      </span>
                    </div>
                    <span className="history-dot" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-history">
                Les mesures apparaîtront ici.
              </div>
            )}
          </article>
        </div>

        <footer>
          <span>IoT Monitor</span>
          <span>Projet de supervision IoT · Next.js & React</span>
        </footer>
      </section>
    </main>
  );
}

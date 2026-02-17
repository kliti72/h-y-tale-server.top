import { Component, createSignal, For, Show, createMemo, onMount, onCleanup } from "solid-js";
import { A } from "@solidjs/router";
import { createResource } from "solid-js";
import { ServerService } from "../services/server.service";
import { ServerResponse } from "../types/ServerResponse";

// ═══════════════════════════════════════════════
// 🕹️ LANG CONFIG
// ═══════════════════════════════════════════════
const LANG = {
  ticker: "⬡ CLASSIFICA SERVER ONLINE ◈ VOTA I MIGLIORI ◎ SCALA LA LEADERBOARD ⬟ UNISCITI ALLA RETE ",
  hero: {
    title: "LEADERBOARD",
    subtitle: "SCALA LA RETE. DOMINA IL SISTEMA.",
    tag: "// CLASSIFICHE IN TEMPO REALE",
  },
  stats: {
    votes: { label: "VOTI TOTALI", icon: "⬡" },
    servers: { label: "SERVER ATTIVI", icon: "◈" },
    active: { label: "GIOCATORI ONLINE", icon: "◎" },
  },
  periods: [
    { value: "today", label: "OGGI" },
    { value: "week", label: "SETTIMANA" },
    { value: "month", label: "MESE" },
    { value: "alltime", label: "ALL TIME" },
  ],
  types: [
    { value: "votes", label: "⬡ VOTI" },
    { value: "players", label: "◈ PLAYER" },
    { value: "trending", label: "◎ TRENDING" },
    { value: "new", label: "⬟ NUOVI" },
  ],
  search: { placeholder: "◈ CERCA NELLA RETE...", label: "SCAN SERVER" },
  table: {
    pos: "POS.",
    trend: "DELTA",
    server: "SERVER",
    value: "SCORE",
    actions: "AZIONI",
    footer: (n: number) => `◈ ${n} SERVER IN CLASSIFICA // AGGIORNAMENTO IN TEMPO REALE`,
  },
  podium: {
    ranks: ["◈ #1", "◈ #2", "◈ #3"],
    visit: "ENTRA →",
  },
  notFound: {
    title: "NESSUN SEGNALE TROVATO",
    sub: "Modifica i parametri di ricerca",
  },
  info: {
    title: "◈ COME FUNZIONA LA CLASSIFICA",
    body: "Le classifiche vengono aggiornate in tempo reale basandosi sui voti ricevuti. Più voti ha un server, più sale in classifica!",
    up: "◎ Server in ascesa nel ranking",
    down: "◎ Server in discesa nel ranking",
    medals: "◈ Medaglie per i primi 3 posti",
    vote: "⬡ Vota per spingere i tuoi server",
  },
  cta: {
    title: "HAI UN SERVER MINECRAFT?",
    sub: "Aggiungilo alla rete e scala le classifiche!",
    btn: "⬡ INSERISCI NELLA RETE",
  },
  valueLabels: {
    votes: "VOTI",
    players: "PLAYER",
    trending: "PUNTI",
    new: "GIORNI FA",
  },
  trend: { up: "▲", down: "▼", same: "—" },
  loading: "◎ INIZIALIZZAZIONE SISTEMA...",
};

// ═══════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  :root {
    --neon-pink:   #ff2d78;
    --neon-cyan:   #00f5ff;
    --neon-yellow: #ffe600;
    --neon-green:  #39ff14;
    --neon-purple: #bf5fff;
    --bg:          #020408;
    --bg-card:     #060d18;
  }

  .lb-root {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      linear-gradient(rgba(0,245,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,255,0.025) 1px, transparent 1px);
    background-size: 32px 32px;
    font-family: 'Share Tech Mono', monospace;
    color: #fff;
    position: relative;
  }

  /* scanlines */
  .lb-root::after {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  /* ── TICKER ── */
  .ticker-wrap {
    overflow: hidden;
    border-bottom: 1px solid rgba(255,45,120,0.4);
    box-shadow: 0 0 12px rgba(255,45,120,0.2);
    background: rgba(255,45,120,0.04);
    padding: 0.4rem 0;
    position: relative;
    z-index: 100;
  }
  .ticker {
    display: inline-block;
    white-space: nowrap;
    animation: marquee 25s linear infinite;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: var(--neon-pink);
    text-shadow: 0 0 8px var(--neon-pink);
    letter-spacing: 0.08em;
  }

  /* ── HERO ── */
  .lb-hero {
    position: relative;
    overflow: hidden;
    border-bottom: 2px solid rgba(0,245,255,0.15);
    padding: 3.5rem 1rem 2.5rem;
    text-align: center;
  }
  .lb-hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 60% at 50% 0%, rgba(0,245,255,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 20% 100%, rgba(255,45,120,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 80% 100%, rgba(191,95,255,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .lb-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
    pointer-events: none;
  }

  .lb-title {
    font-family: 'Press Start 2P', monospace;
    font-size: clamp(1.8rem, 6vw, 4rem);
    color: var(--neon-cyan);
    text-shadow: 0 0 10px var(--neon-cyan), 0 0 30px var(--neon-cyan), 0 0 60px rgba(0,245,255,0.4);
    margin-bottom: 0.5rem;
    animation: flicker 5s ease-in-out infinite;
    position: relative;
    z-index: 1;
  }

  .lb-subtitle {
    font-family: 'Orbitron', monospace;
    font-size: clamp(0.6rem, 2vw, 0.9rem);
    font-weight: 700;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.4rem;
    position: relative;
    z-index: 1;
  }

  .lb-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(0,245,255,0.4);
    letter-spacing: 0.15em;
    position: relative;
    z-index: 1;
  }

  /* ── STAT CARDS ── */
  .lb-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    max-width: 900px;
    margin: 2rem auto 0;
    position: relative;
    z-index: 1;
    padding: 0 1rem;
  }

  .lb-stat {
    background: var(--bg-card);
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    padding: 0.85rem 1rem;
    position: relative;
    overflow: hidden;
  }
  .lb-stat::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%);
    pointer-events: none;
  }
  .lb-stat-val {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 1.3rem;
    animation: counter-up 0.6s ease-out;
  }
  .lb-stat-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.2em;
    margin-top: 0.2rem;
  }
  .c-pink   { color: var(--neon-pink);   text-shadow: 0 0 10px var(--neon-pink);   border: 1px solid rgba(255,45,120,0.35);   box-shadow: 0 0 12px rgba(255,45,120,0.12); }
  .c-cyan   { color: var(--neon-cyan);   text-shadow: 0 0 10px var(--neon-cyan);   border: 1px solid rgba(0,245,255,0.35);    box-shadow: 0 0 12px rgba(0,245,255,0.12); }
  .c-yellow { color: var(--neon-yellow); text-shadow: 0 0 10px var(--neon-yellow); border: 1px solid rgba(255,230,0,0.35);    box-shadow: 0 0 12px rgba(255,230,0,0.12); }
  .c-green  { color: var(--neon-green);  text-shadow: 0 0 10px var(--neon-green);  border: 1px solid rgba(57,255,20,0.35);    box-shadow: 0 0 12px rgba(57,255,20,0.12); }
  .c-purple { color: var(--neon-purple); text-shadow: 0 0 10px var(--neon-purple); border: 1px solid rgba(191,95,255,0.35);   box-shadow: 0 0 12px rgba(191,95,255,0.12); }

  /* ── CONTROLS ── */
  .lb-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .ctrl-group {
    display: flex;
    gap: 0.3rem;
    flex-wrap: wrap;
  }

  .ctrl-btn {
    font-family: 'Orbitron', monospace;
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 0.45rem 0.75rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.35);
    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
    cursor: pointer;
    transition: all 0.15s;
  }
  .ctrl-btn:hover {
    color: rgba(255,255,255,0.7);
    border-color: rgba(0,245,255,0.3);
    background: rgba(0,245,255,0.05);
  }
  .ctrl-btn.active-period {
    background: rgba(0,245,255,0.1);
    border-color: var(--neon-cyan);
    color: var(--neon-cyan);
    text-shadow: 0 0 8px var(--neon-cyan);
    box-shadow: 0 0 10px rgba(0,245,255,0.15);
  }
  .ctrl-btn.active-type {
    background: rgba(255,45,120,0.1);
    border-color: var(--neon-pink);
    color: var(--neon-pink);
    text-shadow: 0 0 8px var(--neon-pink);
    box-shadow: 0 0 10px rgba(255,45,120,0.15);
  }

  .ctrl-sep {
    width: 1px;
    height: 24px;
    background: rgba(255,255,255,0.08);
    align-self: center;
  }

  .ctrl-search {
    flex: 1;
    min-width: 180px;
    background: rgba(0,245,255,0.03);
    border: 1px solid rgba(0,245,255,0.2);
    color: var(--neon-cyan);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    padding: 0.45rem 0.75rem 0.45rem 1.8rem;
    outline: none;
    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
    transition: all 0.2s;
  }
  .ctrl-search::placeholder { color: rgba(0,245,255,0.25); }
  .ctrl-search:focus {
    border-color: var(--neon-cyan);
    box-shadow: 0 0 15px rgba(0,245,255,0.15);
    background: rgba(0,245,255,0.06);
  }
  .ctrl-search-wrap { position: relative; flex: 1; min-width: 180px; }
  .ctrl-search-icon {
    position: absolute;
    left: 0.6rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(0,245,255,0.4);
    font-size: 0.7rem;
    pointer-events: none;
  }

  /* ── PODIUM ── */
  .podium-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 768px) {
    .podium-grid { grid-template-columns: 1fr; }
    .lb-stats { grid-template-columns: 1fr; }
  }

  .podium-card {
    background: var(--bg-card);
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
    padding: 1.25rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
  }
  .podium-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 50%);
    pointer-events: none;
  }
  .podium-card:hover { transform: translateY(-4px); }

  .podium-card-1 {
    border: 2px solid rgba(255,230,0,0.5);
    box-shadow: 0 0 20px rgba(255,230,0,0.12), inset 0 0 20px rgba(255,230,0,0.03);
    grid-column: 1 / -1;
  }
  .podium-card-1:hover { box-shadow: 0 0 35px rgba(255,230,0,0.2), inset 0 0 25px rgba(255,230,0,0.05); }
  .podium-card-2 {
    border: 2px solid rgba(192,192,192,0.4);
    box-shadow: 0 0 15px rgba(192,192,192,0.08);
  }
  .podium-card-2:hover { box-shadow: 0 0 25px rgba(192,192,192,0.15); }
  .podium-card-3 {
    border: 2px solid rgba(205,127,50,0.4);
    box-shadow: 0 0 15px rgba(205,127,50,0.08);
  }
  .podium-card-3:hover { box-shadow: 0 0 25px rgba(205,127,50,0.15); }

  .podium-rank {
    font-family: 'Press Start 2P', monospace;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    display: block;
  }
  .podium-rank-1 { color: var(--neon-yellow); text-shadow: 0 0 15px var(--neon-yellow); animation: float 2.5s ease-in-out infinite; }
  .podium-rank-2 { color: #c0c0c0; text-shadow: 0 0 10px #c0c0c0; }
  .podium-rank-3 { color: #cd7f32; text-shadow: 0 0 10px #cd7f32; }

  .podium-name {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 0.85rem;
    color: #fff;
    margin-bottom: 0.3rem;
    letter-spacing: 0.03em;
    transition: color 0.2s, text-shadow 0.2s;
  }
  .podium-card:hover .podium-name { color: var(--neon-cyan); text-shadow: 0 0 10px rgba(0,245,255,0.5); }

  .podium-ip {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    color: rgba(0,245,255,0.4);
    margin-bottom: 1rem;
  }

  .podium-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .podium-score {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 1.4rem;
  }
  .podium-score-label { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); margin-top: 0.1rem; }

  .podium-btn {
    font-family: 'Orbitron', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 0.5rem 1rem;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    text-decoration: none;
    transition: all 0.15s;
    display: inline-block;
  }
  .podium-btn:hover { filter: brightness(1.2); transform: scale(1.05); }
  .podium-btn-1 { background: rgba(255,230,0,0.15); border: 1px solid rgba(255,230,0,0.5); color: var(--neon-yellow); }
  .podium-btn-2 { background: rgba(192,192,192,0.1); border: 1px solid rgba(192,192,192,0.4); color: #c0c0c0; }
  .podium-btn-3 { background: rgba(205,127,50,0.1); border: 1px solid rgba(205,127,50,0.4); color: #cd7f32; }

  .trend-badge {
    font-family: 'Orbitron', monospace;
    font-size: 0.55rem;
    font-weight: 700;
    padding: 0.2rem 0.5rem;
    clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px));
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
  .trend-up   { background: rgba(57,255,20,0.1);  border: 1px solid rgba(57,255,20,0.4);  color: var(--neon-green); }
  .trend-down { background: rgba(255,45,120,0.1); border: 1px solid rgba(255,45,120,0.4); color: var(--neon-pink); }

  /* ── TABLE ── */
  .lb-table {
    background: var(--bg-card);
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
    border: 1px solid rgba(0,245,255,0.18);
    box-shadow: 0 0 20px rgba(0,245,255,0.05);
    overflow: hidden;
  }

  .lb-table-header {
    background: rgba(0,245,255,0.04);
    border-bottom: 1px solid rgba(0,245,255,0.12);
    padding: 0.65rem 1rem;
    display: grid;
    grid-template-columns: 60px 70px 1fr 100px 180px;
    gap: 0.75rem;
    font-family: 'Orbitron', monospace;
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: rgba(0,245,255,0.5);
  }

  @media (max-width: 768px) {
    .lb-table-header { display: none; }
    .lb-table-row { grid-template-columns: 1fr !important; }
  }

  .lb-table-row {
    display: grid;
    grid-template-columns: 60px 70px 1fr 120px 0px;
    gap: 0.75rem;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    align-items: center;
    transition: background 0.15s, transform 0.15s;
    cursor: pointer;
  }
  .lb-table-row:last-child { border-bottom: none; }
  .lb-table-row:hover {
    background: rgba(0,245,255,0.03);
    transform: translateX(3px);
  }

  .row-rank {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 1em;
    color: rgba(255,255,255,0.5);
  }

  .row-name {
    font-family: 'Orbitron', monospace;
    font-size: 1em;
    font-weight: 700;
    color: rgba(255,255,255,0.8);
    margin-bottom: 0.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.15s;
  }
  .lb-table-row:hover .row-name { color: var(--neon-cyan); text-shadow: 0 0 8px rgba(0,245,255,0.4); }

  .row-ip {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.58rem;
    color: rgba(0,245,255,0.35);
  }

  .row-score {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 1rem;
    color: var(--neon-pink);
    text-shadow: 0 0 8px rgba(255,45,120,0.4);
    text-align: center;
  }

  .row-actions { display: flex; gap: 0.4rem; justify-content: flex-end; }

  .row-btn {
    font-family: 'Orbitron', monospace;
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 0.45rem 0.75rem;
    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
    border: none;
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
    display: inline-block;
  }
  .row-btn:hover { filter: brightness(1.2); transform: scale(1.04); }
  .row-btn-visit { background: rgba(0,245,255,0.1); border: 1px solid rgba(0,245,255,0.3); color: var(--neon-cyan); }
  .row-btn-vote  { background: rgba(255,45,120,0.1); border: 1px solid rgba(255,45,120,0.3); color: var(--neon-pink); }

  .lb-table-footer {
    background: rgba(0,245,255,0.03);
    border-top: 1px solid rgba(0,245,255,0.08);
    padding: 0.6rem 1rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    color: rgba(0,245,255,0.3);
    text-align: center;
    letter-spacing: 0.08em;
  }

  /* ── INFO BOX ── */
  .lb-info {
    background: var(--bg-card);
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    border: 1px solid rgba(191,95,255,0.3);
    box-shadow: 0 0 15px rgba(191,95,255,0.07);
    padding: 1.25rem;
    margin-top: 1.5rem;
  }

  .lb-info-title {
    font-family: 'Orbitron', monospace;
    font-size: 0.65rem;
    font-weight: 900;
    letter-spacing: 0.15em;
    color: var(--neon-purple);
    text-shadow: 0 0 8px var(--neon-purple);
    margin-bottom: 0.6rem;
    display: block;
  }

  .lb-info-body {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(255,255,255,0.45);
    line-height: 1.6;
    margin-bottom: 0.75rem;
  }

  .lb-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .lb-info-item {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    color: rgba(255,255,255,0.35);
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  /* ── CTA ── */
  .lb-cta {
    margin-top: 1.5rem;
    text-align: center;
  }
  .lb-cta-inner {
    display: inline-block;
    background: var(--bg-card);
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
    border: 2px solid rgba(57,255,20,0.3);
    box-shadow: 0 0 20px rgba(57,255,20,0.08);
    padding: 1.5rem 2rem;
  }
  .lb-cta-title {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 0.85rem;
    color: var(--neon-green);
    text-shadow: 0 0 10px var(--neon-green);
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }
  .lb-cta-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(57,255,20,0.45);
    margin-bottom: 1rem;
  }
  .lb-cta-btn {
    font-family: 'Orbitron', monospace;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 0.75rem 1.75rem;
    background: rgba(57,255,20,0.12);
    border: 2px solid rgba(57,255,20,0.5);
    color: var(--neon-green);
    text-shadow: 0 0 8px var(--neon-green);
    box-shadow: 0 0 15px rgba(57,255,20,0.12);
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    text-decoration: none;
    display: inline-block;
    transition: all 0.2s;
  }
  .lb-cta-btn:hover {
    background: rgba(57,255,20,0.2);
    box-shadow: 0 0 25px rgba(57,255,20,0.25);
    transform: scale(1.04);
  }

  /* ── NOT FOUND ── */
  .lb-empty {
    background: var(--bg-card);
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
    border: 1px solid rgba(255,230,0,0.25);
    padding: 4rem 2rem;
    text-align: center;
  }
  .lb-empty-icon {
    font-family: 'Press Start 2P', monospace;
    font-size: 3rem;
    color: var(--neon-yellow);
    text-shadow: 0 0 15px var(--neon-yellow);
    display: block;
    margin-bottom: 1rem;
    animation: float 2.5s ease-in-out infinite;
  }
  .lb-empty-title {
    font-family: 'Orbitron', monospace;
    font-size: 0.85rem;
    font-weight: 900;
    color: var(--neon-yellow);
    letter-spacing: 0.15em;
    margin-bottom: 0.4rem;
  }
  .lb-empty-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(255,255,255,0.3);
  }

  /* ── KEYFRAMES ── */
  @keyframes marquee {
    0%   { transform: translateX(100vw); }
    100% { transform: translateX(-100%); }
  }
  @keyframes flicker {
    0%,100% { opacity:1; }
    92%     { opacity:1; }
    93%     { opacity:0.4; }
    94%     { opacity:1; }
    96%     { opacity:0.6; }
    97%     { opacity:1; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-6px); }
  }
  @keyframes counter-up {
    from { transform: translateY(16px); opacity:0; }
    to   { transform: translateY(0);    opacity:1; }
  }
  @keyframes blink {
    0%,100% { opacity:1; }
    50%     { opacity:0; }
  }
  .blink { animation: blink 1s step-end infinite; }
`;

// ─────────────────────────────────────────
type LeaderboardPeriod = "today" | "week" | "month" | "alltime";
type LeaderboardType   = "votes" | "players" | "trending" | "new";
type ServerRanking = {
  rank: number; server: ServerResponse;
  value: number; change: number;
  trend: "up" | "down" | "same";
};

const LeaderboardPage: Component = () => {

    const [allServers, setAllServers] = createSignal<ServerResponse[]>([]);

   const [initialData] = createResource(async () => {
    try {
      const result = await ServerService.getServerParams({
        page: 1,
        limit: 100,
        sort: ""
      });
      setAllServers(result.data);
      return result;
    } catch (error) {
      console.error("Errore caricamento server:", error);
      throw error;
    }
  });

  return (
    <>
      <style>{STYLES}</style>
      <div class="lb-root">

        {/* TICKER */}
        <div class="ticker-wrap">
          <span class="ticker">{LANG.ticker.repeat(6)}</span>
        </div>

        {/* HERO */}
        <div class="lb-hero">
          <div class="lb-hero-bg" />
          <div class="lb-hero-grid" />
          <div class="lb-tag">{LANG.hero.tag} <span class="blink">_</span></div>
          <div class="lb-title">{LANG.hero.title}</div>
          <div class="lb-subtitle">{LANG.hero.subtitle}</div>
        </div>

        {/* MAIN */}
        <div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem 1rem;">

          {/* CONTENT */}
          <Show
            when={allServers().length > 0}
            fallback={
              <div class="lb-empty">
                <span class="lb-empty-icon">?</span>
                <div class="lb-empty-title">{LANG.notFound.title}</div>
                <div class="lb-empty-sub">{LANG.notFound.sub}</div>
              </div>
            }
          >


            {/* TABLE RANKS  */}
            <div class="lb-table">
              <For each={allServers()}>
                {(r) => (
                  <div class="lb-table-row">
                    <div class="row-rank">#1</div>
                    <div>
                    </div>
                    <div>
                      <div class="row-name">{r.name}</div>
                      <div class="row-ip">{r.ip}</div>
                    </div>
                    <div class="row-actions">
                      <A href={`/server/${r.id}`} class="row-btn row-btn-visit">ENTRA</A>
                      <button class="row-btn row-btn-vote">⬡ VOTA</button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>

          {/* INFO */}
          <div class="lb-info">
            <span class="lb-info-title">{LANG.info.title}</span>
            <div class="lb-info-body">{LANG.info.body}</div>
            <div class="lb-info-grid">
              {[
                { icon: "▲", cls: "c-green",  text: LANG.info.up },
                { icon: "▼", cls: "c-pink",   text: LANG.info.down },
                { icon: "◈", cls: "c-yellow", text: LANG.info.medals },
                { icon: "⬡", cls: "c-cyan",   text: LANG.info.vote },
              ].map(item => (
                <div class="lb-info-item">
                  <span class={item.cls} style="font-size:0.7rem;">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default LeaderboardPage;
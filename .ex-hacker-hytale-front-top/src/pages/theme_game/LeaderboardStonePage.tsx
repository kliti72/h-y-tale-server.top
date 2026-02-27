import { Component, createSignal, For, Show, createResource } from "solid-js";
import { A } from "@solidjs/router";
import { ServerService } from "../../services/server.service";
import { ServerResponse } from "../../types/ServerResponse";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=MedievalSharp&family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');

  :root {
    --stone-dark:   #0d0b08;
    --stone-mid:    #1a1610;
    --stone-light:  #2a2318;
    --stone-border: #3d3020;
    --gold:         #c8960c;
    --gold-light:   #e8b830;
    --gold-dim:     #6b4e08;
    --rune-red:     #8b1a1a;
    --rune-blue:    #1a3a5c;
    --parchment:    #c4924a;
    --parchment-dim:#6b4e28;
    --blood:        #6b1010;
  }

  .stone-root {
    min-height: 100vh;
    background: var(--stone-dark);
    background-image:
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    font-family: 'IM Fell English', Georgia, serif;
    color: var(--parchment);
    position: relative;
    overflow-x: hidden;
  }

  /* Grain texture */
  .stone-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    opacity: 0.04;
    pointer-events: none;
    z-index: 9999;
  }

  /* ── BANNER TICKER ── */
  .stone-ticker-wrap {
    overflow: hidden;
    border-bottom: 2px solid var(--gold-dim);
    background: linear-gradient(90deg, var(--stone-dark), var(--stone-mid), var(--stone-dark));
    padding: 0.5rem 0;
    position: relative;
  }
  .stone-ticker-wrap::before,
  .stone-ticker-wrap::after {
    content: '⚔';
    position: absolute;
    top: 50%; transform: translateY(-50%);
    color: var(--gold-dim);
    font-size: 1rem;
    z-index: 2;
  }
  .stone-ticker-wrap::before { left: 1rem; }
  .stone-ticker-wrap::after  { right: 1rem; }
  .stone-ticker {
    display: inline-block;
    white-space: nowrap;
    animation: stone-marquee 30s linear infinite;
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    color: var(--gold-dim);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  /* ── HERO ── */
  .stone-hero {
    position: relative;
    text-align: center;
    padding: 4rem 1rem 3rem;
    border-bottom: 3px solid var(--stone-border);
    overflow: hidden;
  }
  .stone-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 70% at 50% 0%, rgba(200,150,12,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 20% 100%, rgba(139,26,26,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .stone-rune-border {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg,
      transparent,
      var(--gold-dim) 20%,
      var(--gold) 50%,
      var(--gold-dim) 80%,
      transparent
    );
  }

  .stone-hero-eyebrow {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.4em;
    color: var(--gold-dim);
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .stone-hero-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: clamp(2rem, 6vw, 4.5rem);
    font-weight: 900;
    color: var(--gold-light);
    text-shadow:
      0 0 20px rgba(200,150,12,0.4),
      0 2px 4px rgba(0,0,0,0.8),
      2px 2px 0 rgba(0,0,0,0.5);
    letter-spacing: 0.08em;
    margin-bottom: 0.5rem;
    position: relative;
    z-index: 1;
    animation: stone-flicker 6s ease-in-out infinite;
  }

  .stone-hero-subtitle {
    font-family: 'Cinzel', serif;
    font-size: clamp(0.55rem, 1.5vw, 0.75rem);
    letter-spacing: 0.3em;
    color: var(--parchment-dim);
    text-transform: uppercase;
    position: relative;
    z-index: 1;
  }

  .stone-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem auto;
    max-width: 400px;
  }
  .stone-divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-dim));
  }
  .stone-divider-line:last-child {
    background: linear-gradient(90deg, var(--gold-dim), transparent);
  }
  .stone-divider-rune {
    color: var(--gold);
    font-size: 1.2rem;
    text-shadow: 0 0 10px rgba(200,150,12,0.5);
  }

  /* ── STATS ── */
  .stone-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 1;
  }
  @media (max-width: 600px) { .stone-stats { grid-template-columns: 1fr; } }

  .stone-stat {
    position: relative;
    padding: 1rem;
    text-align: center;
    background: linear-gradient(160deg, var(--stone-mid), var(--stone-dark));
    border: 1px solid var(--stone-border);
    box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.6);
  }
  .stone-stat::before {
    content: '';
    position: absolute;
    inset: 2px;
    border: 1px solid rgba(200,150,12,0.08);
    pointer-events: none;
  }
  .stone-stat-val {
    font-family: 'Cinzel Decorative', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--gold-light);
    text-shadow: 0 0 15px rgba(200,150,12,0.4);
    display: block;
  }
  .stone-stat-label {
    font-family: 'Cinzel', serif;
    font-size: 0.5rem;
    letter-spacing: 0.2em;
    color: var(--parchment-dim);
    text-transform: uppercase;
    margin-top: 0.3rem;
    display: block;
  }

  /* ── PODIUM ── */
  .stone-podium {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }
  @media (max-width: 768px) { .stone-podium { grid-template-columns: 1fr; } }

  .stone-podium-card {
    position: relative;
    padding: 1.5rem;
    background: linear-gradient(160deg, var(--stone-mid) 0%, var(--stone-dark) 100%);
    box-shadow: 0 8px 24px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.03);
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
    overflow: hidden;
  }
  .stone-podium-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E");
    background-size: 150px;
    opacity: 0.05;
    pointer-events: none;
  }
  .stone-podium-card:hover { transform: translateY(-4px); }

  .stone-podium-1 {
    border: 2px solid var(--gold);
    box-shadow: 0 0 25px rgba(200,150,12,0.15), inset 0 0 30px rgba(200,150,12,0.04);
    grid-column: 1 / -1;
  }
  .stone-podium-2 { border: 2px solid rgba(180,180,180,0.4); }
  .stone-podium-3 { border: 2px solid rgba(139,90,43,0.5); }

  /* Nail corners */
  .stone-nail {
    position: absolute;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #777, #222);
    box-shadow: 0 1px 3px rgba(0,0,0,0.9);
    z-index: 2;
  }

  .stone-crown {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 0.5rem;
    animation: stone-float 3s ease-in-out infinite;
    filter: drop-shadow(0 0 8px rgba(200,150,12,0.6));
  }
  .stone-crown-2 { font-size: 1.8rem; animation-delay: 0.5s; filter: drop-shadow(0 0 5px rgba(180,180,180,0.4)); }
  .stone-crown-3 { font-size: 1.8rem; animation-delay: 1s; filter: drop-shadow(0 0 5px rgba(139,90,43,0.4)); }

  .stone-podium-name {
    font-family: 'Cinzel', serif;
    font-weight: 700;
    font-size: 1rem;
    color: #e8d5a0;
    margin-bottom: 0.2rem;
    letter-spacing: 0.03em;
  }
  .stone-podium-ip {
    font-family: 'IM Fell English', serif;
    font-size: 0.65rem;
    color: var(--parchment-dim);
    font-style: italic;
    margin-bottom: 1rem;
  }
  .stone-podium-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid var(--stone-border);
  }
  .stone-podium-score {
    font-family: 'Cinzel Decorative', serif;
    font-size: 1.5rem;
    color: var(--gold-light);
    text-shadow: 0 0 10px rgba(200,150,12,0.4);
  }
  .stone-podium-score-label {
    font-family: 'Cinzel', serif;
    font-size: 0.45rem;
    color: var(--parchment-dim);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .stone-btn {
    font-family: 'Cinzel', serif;
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 0.5rem 1rem;
    border: 1px solid var(--gold-dim);
    background: rgba(200,150,12,0.08);
    color: var(--gold);
    text-decoration: none;
    text-transform: uppercase;
    transition: all 0.15s;
    display: inline-block;
    cursor: pointer;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.3);
  }
  .stone-btn:hover {
    background: rgba(200,150,12,0.18);
    border-color: var(--gold-light);
    color: var(--gold-light);
    box-shadow: 0 0 12px rgba(200,150,12,0.2), inset 0 0 10px rgba(0,0,0,0.3);
  }
  .stone-btn-vote {
    border-color: var(--rune-red);
    background: rgba(139,26,26,0.1);
    color: #c04040;
  }
  .stone-btn-vote:hover {
    background: rgba(139,26,26,0.25);
    border-color: #c04040;
    box-shadow: 0 0 12px rgba(139,26,26,0.2);
  }

  /* ── SCROLL/TABLE ── */
  .stone-scroll {
    position: relative;
    background: linear-gradient(160deg, #120e08 0%, #0d0b07 50%, #100d08 100%);
    border: 2px solid var(--stone-border);
    box-shadow: 0 8px 32px rgba(0,0,0,0.9), inset 0 0 40px rgba(0,0,0,0.5);
    overflow: hidden;
  }
  .stone-scroll::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
    background-size: 200px;
    opacity: 0.04;
    pointer-events: none;
  }

  .stone-scroll-top {
    height: 4px;
    background: linear-gradient(90deg, transparent, var(--gold-dim) 30%, var(--gold) 50%, var(--gold-dim) 70%, transparent);
  }

  .stone-scroll-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--stone-border);
    background: linear-gradient(90deg, rgba(200,150,12,0.04), transparent);
  }
  .stone-scroll-title {
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    color: var(--gold-dim);
    text-transform: uppercase;
    flex: 1;
  }

  .stone-row {
    display: grid;
    grid-template-columns: 50px 1fr 100px 120px;
    gap: 1rem;
    padding: 0.85rem 1.25rem;
    border-bottom: 1px solid rgba(61,48,32,0.5);
    align-items: center;
    transition: background 0.15s;
    cursor: pointer;
    position: relative;
  }
  .stone-row:last-child { border-bottom: none; }
  .stone-row::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: var(--gold);
    opacity: 0;
    transition: opacity 0.15s;
  }
  .stone-row:hover { background: rgba(200,150,12,0.03); }
  .stone-row:hover::before { opacity: 0.5; }

  @media (max-width: 600px) {
    .stone-row { grid-template-columns: 40px 1fr 80px; }
    .stone-row-actions { display: none; }
  }

  .stone-row-rank {
    font-family: 'Cinzel Decorative', serif;
    font-size: 0.9rem;
    color: var(--gold-dim);
    text-align: center;
  }
  .stone-row-name {
    font-family: 'Cinzel', serif;
    font-size: 0.75rem;
    font-weight: 700;
    color: #d4c090;
    margin-bottom: 0.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.15s;
  }
  .stone-row:hover .stone-row-name { color: var(--gold-light); }
  .stone-row-ip {
    font-family: 'IM Fell English', serif;
    font-size: 0.6rem;
    color: var(--parchment-dim);
    font-style: italic;
  }
  .stone-row-score {
    font-family: 'Cinzel Decorative', serif;
    font-size: 0.9rem;
    color: var(--gold);
    text-shadow: 0 0 8px rgba(200,150,12,0.3);
    text-align: center;
  }
  .stone-row-score-label {
    font-family: 'Cinzel', serif;
    font-size: 0.4rem;
    color: var(--parchment-dim);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    text-align: center;
  }
  .stone-row-actions { display: flex; gap: 0.4rem; justify-content: flex-end; }

  .stone-scroll-footer {
    padding: 0.75rem 1.25rem;
    border-top: 1px solid var(--stone-border);
    background: rgba(200,150,12,0.02);
    text-align: center;
    font-family: 'Cinzel', serif;
    font-size: 0.5rem;
    color: var(--parchment-dim);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  /* ── EMPTY ── */
  .stone-empty {
    text-align: center;
    padding: 5rem 2rem;
    border: 1px solid var(--stone-border);
    background: linear-gradient(160deg, var(--stone-mid), var(--stone-dark));
  }
  .stone-empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; opacity: 0.4; animation: stone-float 3s ease-in-out infinite; }
  .stone-empty-title {
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    letter-spacing: 0.15em;
    color: var(--gold-dim);
    text-transform: uppercase;
    margin-bottom: 0.4rem;
  }
  .stone-empty-sub {
    font-family: 'IM Fell English', serif;
    font-size: 0.75rem;
    color: var(--parchment-dim);
    font-style: italic;
  }

  /* ── CTA ── */
  .stone-cta {
    margin-top: 2rem;
    text-align: center;
  }
  .stone-cta-inner {
    display: inline-block;
    padding: 2rem 3rem;
    background: linear-gradient(160deg, var(--stone-mid), var(--stone-dark));
    border: 2px solid var(--gold-dim);
    box-shadow: 0 0 30px rgba(200,150,12,0.08), inset 0 0 30px rgba(0,0,0,0.5);
    position: relative;
  }
  .stone-cta-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: 0.9rem;
    color: var(--gold-light);
    text-shadow: 0 0 12px rgba(200,150,12,0.4);
    letter-spacing: 0.08em;
    margin-bottom: 0.5rem;
  }
  .stone-cta-sub {
    font-family: 'IM Fell English', serif;
    font-size: 0.8rem;
    color: var(--parchment-dim);
    font-style: italic;
    margin-bottom: 1.25rem;
  }

  /* ── KEYFRAMES ── */
  @keyframes stone-marquee {
    0%   { transform: translateX(100vw); }
    100% { transform: translateX(-100%); }
  }
  @keyframes stone-flicker {
    0%,100% { opacity:1; }
    94%     { opacity:1; }
    95%     { opacity:0.6; }
    96%     { opacity:1; }
    98%     { opacity:0.8; }
    99%     { opacity:1; }
  }
  @keyframes stone-float {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-6px); }
  }
`;

const TICKER = "⚔ CLASSIFICHE DEL REGNO ◈ VOTA I PIÙ VALOROSI ◎ SCALA LA VETTA ⬟ UNISCITI ALLA GILDA ";
const CROWNS = ["👑", "🥈", "🥉"];
const CROWN_CLASSES = ["stone-podium-1", "stone-podium-2", "stone-podium-3"];
const CROWN_SIZES  = ["stone-crown", "stone-crown stone-crown-2", "stone-crown stone-crown-3"];

const LeaderboardStonePage: Component = () => {
  const [allServers, setAllServers] = createSignal<ServerResponse[]>([]);

  const [initialData] = createResource(async () => {
    try {
      const result = await ServerService.getServerParams({ page: 1, limit: 100, sort: "voti_totali:desc" });
      setAllServers(result.data);
      return result;
    } catch (e) {
      console.error("Errore:", e);
      throw e;
    }
  });

  const podium  = () => allServers().slice(0, 3);
  const theRest = () => allServers().slice(3);

  return (
    <>
      <style>{STYLES}</style>
      <div class="stone-root">

        {/* TICKER */}
        <div class="stone-ticker-wrap">
          <span class="stone-ticker">{TICKER.repeat(5)}</span>
        </div>

        {/* HERO */}
        <div class="stone-hero">
          <div class="stone-rune-border" />
          <div class="stone-hero-eyebrow">✦ Cronache del Mondo ✦</div>
          <div class="stone-hero-title">Leaderboard</div>
          <div class="stone-hero-subtitle">I Più Valorosi del Regno</div>
          <div class="stone-divider">
            <div class="stone-divider-line" />
            <span class="stone-divider-rune">⚜</span>
            <div class="stone-divider-line" />
          </div>

          {/* Stats */}
          <div class="stone-stats">
            <div class="stone-stat">
              <span class="stone-stat-val">{allServers().reduce((a, s) => a + (s.voti_totali ?? 0), 0).toLocaleString()}</span>
              <span class="stone-stat-label">⚔ Voti Totali</span>
            </div>
            <div class="stone-stat">
              <span class="stone-stat-val">{allServers().length}</span>
              <span class="stone-stat-label">🏰 Server Attivi</span>
            </div>
            <div class="stone-stat">
              <span class="stone-stat-val">{allServers().filter(s => s.voti_totali && s.voti_totali > 0).length}</span>
              <span class="stone-stat-label">🗡 Con Voti</span>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style="max-width: 1100px; margin: 0 auto; padding: 2rem 1rem;">

          <Show
            when={allServers().length > 0}
            fallback={
              <div class="stone-empty">
                <span class="stone-empty-icon">🏚</span>
                <div class="stone-empty-title">Nessun Segnale Trovato</div>
                <div class="stone-empty-sub">Il regno tace... nessun servitor risponde alla chiamata</div>
              </div>
            }
          >

            {/* PODIUM TOP 3 */}
            <Show when={podium().length > 0}>
              <div class="stone-divider" style="margin-bottom: 1.5rem;">
                <div class="stone-divider-line" />
                <span class="stone-divider-rune" style="font-family: 'Cinzel', serif; font-size: 0.6rem; color: var(--gold-dim); letter-spacing: 0.2em;">⚜ I VALOROSI ⚜</span>
                <div class="stone-divider-line" />
              </div>

              <div class="stone-podium">
                <For each={podium()}>
                  {(s, i) => (
                    <div class={`stone-podium-card ${CROWN_CLASSES[i()]}`}>
                      {/* Nail corners */}
                      <div class="stone-nail" style="top:6px; left:6px;" />
                      <div class="stone-nail" style="top:6px; right:6px;" />
                      <div class="stone-nail" style="bottom:6px; left:6px;" />
                      <div class="stone-nail" style="bottom:6px; right:6px;" />

                      <span class={CROWN_SIZES[i()]}>{CROWNS[i()]}</span>
                      <div class="stone-podium-name">{s.name}</div>
                      <div class="stone-podium-ip">{s.ip}</div>
                      <div class="stone-podium-bottom">
                        <div>
                          <div class="stone-podium-score">{s.voti_totali ?? 0}</div>
                          <div class="stone-podium-score-label">Voti</div>
                        </div>
                        <A href={`/server/${s.id}`} class="stone-btn">Entra →</A>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>

            {/* REST TABLE */}
            <Show when={theRest().length > 0}>
              <div class="stone-divider" style="margin-bottom: 1.5rem;">
                <div class="stone-divider-line" />
                <span class="stone-divider-rune" style="font-family: 'Cinzel', serif; font-size: 0.6rem; color: var(--gold-dim); letter-spacing: 0.2em;">⚜ CRONACHE ⚜</span>
                <div class="stone-divider-line" />
              </div>

              <div class="stone-scroll">
                <div class="stone-scroll-top" />
                <div class="stone-scroll-header">
                  <span style="color: var(--gold); font-size: 1rem;">📜</span>
                  <span class="stone-scroll-title">Registro dei Guerrieri</span>
                </div>

                <For each={theRest()}>
                  {(s, i) => (
                    <div class="stone-row">
                      <div class="stone-row-rank">#{i() + 4}</div>
                      <div>
                        <div class="stone-row-name">{s.name}</div>
                        <div class="stone-row-ip">{s.ip}</div>
                      </div>
                      <div>
                        <div class="stone-row-score">{s.voti_totali ?? 0}</div>
                        <div class="stone-row-score-label">voti</div>
                      </div>
                      <div class="stone-row-actions">
                        <A href={`/server/${s.id}`} class="stone-btn" style="font-size:0.5rem; padding: 0.4rem 0.7rem;">Entra</A>
                        <button class="stone-btn stone-btn-vote" style="font-size:0.5rem; padding: 0.4rem 0.7rem;">⚔ Vota</button>
                      </div>
                    </div>
                  )}
                </For>

                <div class="stone-scroll-footer">
                  ✦ {allServers().length} Servitor nel Registro · Aggiornato in Tempo Reale ✦
                </div>
              </div>
            </Show>

            {/* CTA */}
            <div class="stone-cta">
              <div class="stone-cta-inner">
                <div class="stone-nail" style="top:8px; left:8px;" />
                <div class="stone-nail" style="top:8px; right:8px;" />
                <div class="stone-nail" style="bottom:8px; left:8px;" />
                <div class="stone-nail" style="bottom:8px; right:8px;" />
                <div class="stone-cta-title">Hai un Server Minecraft?</div>
                <div class="stone-cta-sub">Unisciti alla gilda e scala le classifiche del regno</div>
                <A href="/add-server" class="stone-btn" style="font-size: 0.65rem; padding: 0.75rem 2rem;">
                  ⚜ Entra nella Gilda
                </A>
              </div>
            </div>

          </Show>
        </div>
      </div>
    </>
  );
};

export default LeaderboardStonePage;
import { Component, createSignal, For, Show, createMemo, onMount, onCleanup } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../auth/AuthContext";
import Notifications, { notify } from "../component/template/Notification";
import { marked } from "marked";

// ═══════════════════════════════════════════════
// 🕹️ LANG CONFIG
// ═══════════════════════════════════════════════
const LANG = {
  ticker: "⬡ FORUM H-YTALE ONLINE ◈ DISCUTI CON LA COMMUNITY ◎ CONDIVIDI LA TUA ESPERIENZA ⬟ RISPOSTA AI MIGLIORI ",
  hero: {
    title: "FORUM NETWORK",
    subtitle: "CONNETTI. DISCUTI. DOMINA.",
    tag: "// COMMUNITY IN TEMPO REALE",
  },
  stats: {
    online:  { label: "UTENTI ONLINE",  icon: "◈" },
    posts:   { label: "POST OGGI",      icon: "⬡" },
    topics:  { label: "TOPIC TOTALI",   icon: "◎" },
    members: { label: "MEMBRI RETE",    icon: "⬟" },
  },
  sidebar: {
    newTopic:      "⬡ NUOVO TOPIC",
    categories:    "◈ CATEGORIE",
    stats:         "◎ STATISTICHE",
    contributors:  "⬟ TOP CONTRIBUTORS",
    links:         "◈ LINK UTILI",
    statsData: [
      { label: "TOPIC TOTALI",  val: "2.847" },
      { label: "POST TOTALI",   val: "18.392" },
      { label: "MEMBRI",        val: "4.128" },
      { label: "RECORD ONLINE", val: "1.284", highlight: true },
    ],
    links: [
      { href: "/forum/rules",     label: "◎ REGOLE FORUM" },
      { href: "/forum/guidelines",label: "◈ LINEE GUIDA" },
      { href: "/forum/faq",       label: "⬡ FAQ" },
      { href: "/forum/markdown",  label: "⬟ GUIDA MARKDOWN" },
    ],
  },
  list: {
    search:       "▶ CERCA TOPIC, AUTORI, TAG...",
    sort:         "◈ ORDINA:",
    sortOpts: [
      { value: "hot",     label: "⬡ HOT" },
      { value: "recent",  label: "◎ RECENTI" },
      { value: "replies", label: "⬟ RISPOSTE" },
      { value: "views",   label: "◈ VISTE" },
    ],
    clear:        "✕ RESET FILTRI",
    showing:      "◈ MOSTRANDO",
    topics:       "TOPIC",
    reply:        "◎ RISPONDI",
    share:        "◈ CONDIVIDI",
    notFound:     "NESSUN SEGNALE",
    notFoundSub:  "Modifica categoria o ricerca",
    showAll:      "◎ MOSTRA TUTTI",
  },
  badges: {
    pinned:  "◈ PINNED",
    hot:     "⬡ HOT",
    solved:  "◎ RISOLTO",
    locked:  "⬟ BLOCCATO",
    accepted:"◎ ACCETTATA",
  },
  topic: {
    back:         "← TORNA ALLE DISCUSSIONI",
    views:        "VIEWS",
    replies:      "RISPOSTE",
    like:         "⬡ LIKE",
    share:        "◈ CONDIVIDI",
    save:         "◎ SALVA",
    replyTitle:   "◎ SCRIVI UNA RISPOSTA",
    writeTab:     "✏ SCRIVI",
    previewTab:   "◈ PREVIEW",
    placeholder:  "Scrivi la tua risposta... (supporta **Markdown**)",
    mdHint:       "◈ Markdown: **grassetto**, *corsivo*, `code`, # titoli",
    cancel:       "ANNULLA",
    publish:      "⬡ PUBBLICA RISPOSTA",
    noReplies:    "NESSUNA RISPOSTA ANCORA",
    noRepliesSub: "Sii il primo a rispondere nella rete",
    locked:       "TOPIC BLOCCATO",
    lockedSub:    "Questo topic non accetta nuove risposte",
    notAuth:      "ACCESSO RICHIESTO",
    notAuthSub:   "Devi essere nella rete per rispondere",
    login:        "⬡ ACCEDI ALLA RETE",
    quote:        "◎ CITA",
    accept:       "◎ ACCETTA RISPOSTA",
    repliesLabel: "RISPOSTE",
  },
  modal: {
    title:        "⬡ CREA NUOVO TOPIC",
    close:        "✕",
    titleLabel:   "TITOLO *",
    titlePh:      "Es: Come configurare VotePlugin su Velocity?",
    catLabel:     "CATEGORIA *",
    catDefault:   "◈ SELEZIONA CATEGORIA",
    tagsLabel:    "TAGS (OPZIONALE)",
    tagsPh:       "pvp, meta, tutorial — separati da virgola",
    tagsHint:     "◈ Aiuta gli altri a trovare il tuo topic",
    contentLabel: "CONTENUTO (MARKDOWN) *",
    contentPh:    "Scrivi il contenuto del topic...",
    mdHint:       "◈ Supporto Markdown completo",
    cancel:       "ANNULLA",
    publish:      "⬡ PUBBLICA TOPIC",
  },
  notify: {
    loginRequired:    "◈ Devi fare login per creare topic",
    noTitle:          "◈ Inserisci un titolo",
    noContent:        "◈ Il contenuto è vuoto",
    noCat:            "◈ Scegli una categoria",
    topicCreated:     "⬡ Topic pubblicato nella rete!",
    replyLogin:       "◈ Fai login per rispondere",
    noReply:          "◈ Scrivi qualcosa prima di inviare",
    replyPublished:   "⬡ Risposta pubblicata!",
    likeLogin:        "◈ Login per mettere like",
    likeAdded:        "⬡ Like aggiunto!",
    likeRemoved:      "◎ Like rimosso",
    shared:           "◈ Link copiato!",
    saved:            "◎ Topic salvato! (demo)",
    replyAccepted:    "◎ Risposta accettata! (demo)",
    replyQuoted:      "◎ Risposta quotata! (demo)",
  },
};

// ═══════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  :root {
    --pink:   #ff2d78;
    --cyan:   #00f5ff;
    --yellow: #ffe600;
    --green:  #39ff14;
    --purple: #bf5fff;
    --bg:     #020408;
    --card:   #060d18;
  }

  .f-root {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      linear-gradient(rgba(0,245,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,255,0.02) 1px, transparent 1px);
    background-size: 32px 32px;
    font-family: 'Share Tech Mono', monospace;
    color: #fff;
  }
  .f-root::after {
    content: '';
    position: fixed; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px);
    pointer-events: none; z-index: 9999;
  }

  /* TICKER */
  .f-ticker-wrap {
    overflow: hidden;
    border-bottom: 1px solid rgba(255,45,120,0.35);
    box-shadow: 0 0 10px rgba(255,45,120,0.15);
    background: rgba(255,45,120,0.03);
    padding: 0.4rem 0; position: relative; z-index: 100;
  }
  .f-ticker {
    display: inline-block; white-space: nowrap;
    animation: f-marquee 28s linear infinite;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem; letter-spacing: 0.08em;
    color: var(--pink); text-shadow: 0 0 8px var(--pink);
  }

  /* HERO */
  .f-hero {
    position: relative; overflow: hidden;
    border-bottom: 2px solid rgba(0,245,255,0.12);
    padding: 2.5rem 1rem 2rem; text-align: center;
  }
  .f-hero-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 60% at 50% 0%, rgba(0,245,255,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 20% 100%, rgba(255,45,120,0.05) 0%, transparent 70%);
    pointer-events: none;
  }
  .f-hero-title {
    font-family: 'Press Start 2P', monospace;
    font-size: clamp(1.4rem, 5vw, 3rem);
    color: var(--cyan);
    text-shadow: 0 0 10px var(--cyan), 0 0 30px var(--cyan), 0 0 60px rgba(0,245,255,0.3);
    margin-bottom: 0.4rem;
    animation: f-flicker 5s ease-in-out infinite;
    position: relative; z-index: 1;
  }
  .f-hero-sub {
    font-family: 'Orbitron', monospace;
    font-size: clamp(0.55rem, 1.5vw, 0.75rem);
    font-weight: 700; letter-spacing: 0.3em;
    color: rgba(255,255,255,0.4); margin-bottom: 0.3rem;
    position: relative; z-index: 1;
  }
  .f-hero-tag {
    font-size: 0.6rem; color: rgba(0,245,255,0.35);
    letter-spacing: 0.15em; position: relative; z-index: 1;
  }

  /* STAT CARDS */
  .f-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 0.75rem; max-width: 800px; margin: 1.5rem auto 0; padding: 0 1rem; position: relative; z-index: 1; }
  @media(max-width:640px){ .f-stats { grid-template-columns: repeat(2,1fr); } }
  .f-stat {
    background: var(--card);
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    padding: 0.75rem; text-align: center;
  }
  .f-stat-val { font-family: 'Orbitron', monospace; font-weight: 900; font-size: 1.1rem; animation: f-counter 0.6s ease-out; }
  .f-stat-label { font-size: 0.52rem; color: rgba(255,255,255,0.3); letter-spacing: 0.15em; margin-top: 0.15rem; }

  /* LAYOUT */
  .f-layout { display: flex; gap: 1.25rem; max-width: 1400px; margin: 0 auto; padding: 1.25rem 1rem; }
  @media(max-width:1024px){ .f-layout { flex-direction: column; } }

  /* SIDEBAR */
  .f-sidebar { width: 260px; flex-shrink: 0; }
  @media(max-width:1024px){ .f-sidebar { width: 100%; } }
  .f-sidebar-sticky { position: sticky; top: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }

  .f-panel {
    background: var(--card);
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    padding: 0.9rem;
  }
  .f-panel-cyan   { border: 1px solid rgba(0,245,255,0.25);    box-shadow: 0 0 12px rgba(0,245,255,0.06); }
  .f-panel-yellow { border: 1px solid rgba(255,230,0,0.25);    box-shadow: 0 0 12px rgba(255,230,0,0.06); }
  .f-panel-purple { border: 1px solid rgba(191,95,255,0.25);   box-shadow: 0 0 12px rgba(191,95,255,0.06); }
  .f-panel-pink   { border: 1px solid rgba(255,45,120,0.25);   box-shadow: 0 0 12px rgba(255,45,120,0.06); }
  .f-panel-green  { border: 1px solid rgba(57,255,20,0.25);    box-shadow: 0 0 12px rgba(57,255,20,0.06); }

  .f-panel-title {
    font-family: 'Orbitron', monospace; font-size: 0.55rem;
    font-weight: 900; letter-spacing: 0.2em;
    margin-bottom: 0.7rem; padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: block;
  }
  .f-panel-title.cyan   { color: var(--cyan);   text-shadow: 0 0 8px var(--cyan); }
  .f-panel-title.yellow { color: var(--yellow); text-shadow: 0 0 8px var(--yellow); }
  .f-panel-title.purple { color: var(--purple); text-shadow: 0 0 8px var(--purple); }
  .f-panel-title.pink   { color: var(--pink);   text-shadow: 0 0 8px var(--pink); }
  .f-panel-title.green  { color: var(--green);  text-shadow: 0 0 8px var(--green); }

  /* NEW TOPIC BTN */
  .f-new-btn {
    display: block; width: 100%;
    font-family: 'Orbitron', monospace; font-size: 0.65rem; font-weight: 900;
    letter-spacing: 0.1em; padding: 0.75rem;
    background: rgba(0,245,255,0.1);
    border: 2px solid rgba(0,245,255,0.5);
    color: var(--cyan); text-shadow: 0 0 8px var(--cyan);
    box-shadow: 0 0 15px rgba(0,245,255,0.12);
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    cursor: pointer; text-align: center;
    transition: all 0.2s;
  }
  .f-new-btn:hover {
    background: rgba(0,245,255,0.18);
    box-shadow: 0 0 25px rgba(0,245,255,0.25);
    transform: scale(1.02);
  }

  /* CAT BUTTON */
  .f-cat-btn {
    display: flex; align-items: center; gap: 0.6rem;
    width: 100%; padding: 0.5rem 0.6rem;
    font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
    background: transparent; border: 1px solid transparent;
    color: rgba(255,255,255,0.5); cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
    transition: all 0.15s; text-align: left;
    margin-bottom: 0.2rem;
  }
  .f-cat-btn:hover { background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.08); }
  .f-cat-btn.active { background: rgba(0,245,255,0.08); border-color: rgba(0,245,255,0.4); color: var(--cyan); text-shadow: 0 0 8px rgba(0,245,255,0.4); }
  .f-cat-icon { font-size: 0.9rem; flex-shrink: 0; }
  .f-cat-name { flex: 1; font-family: 'Orbitron', monospace; font-size: 0.55rem; font-weight: 700; letter-spacing: 0.05em; }
  .f-cat-count { font-size: 0.55rem; color: rgba(255,255,255,0.25); }

  /* STAT ROW */
  .f-stat-row { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .f-stat-row:last-child { border-bottom: none; }
  .f-stat-row-label { font-size: 0.6rem; color: rgba(255,255,255,0.35); }
  .f-stat-row-val { font-family: 'Orbitron', monospace; font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.7); }
  .f-stat-row-val.highlight { color: var(--green); text-shadow: 0 0 8px var(--green); }

  /* CONTRIBUTOR ROW */
  .f-contrib { display: flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.3rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .f-contrib:last-child { border-bottom: none; }
  .f-contrib-rank { font-family: 'Orbitron', monospace; font-size: 0.65rem; font-weight: 900; width: 1.5rem; text-align: center; }
  .f-contrib-avatar { font-size: 1.1rem; }
  .f-contrib-name { font-family: 'Orbitron', monospace; font-size: 0.55rem; font-weight: 700; color: rgba(255,255,255,0.7); }
  .f-contrib-posts { font-size: 0.52rem; color: rgba(255,255,255,0.25); }

  /* LINK */
  .f-link { display: block; font-size: 0.62rem; color: rgba(255,255,255,0.35); padding: 0.25rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); text-decoration: none; transition: color 0.15s; letter-spacing: 0.05em; }
  .f-link:last-child { border-bottom: none; }
  .f-link:hover { color: var(--cyan); text-shadow: 0 0 6px rgba(0,245,255,0.4); }

  /* MAIN */
  .f-main { flex: 1; min-width: 0; }

  /* BREADCRUMB */
  .f-breadcrumb { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; font-size: 0.6rem; color: rgba(255,255,255,0.3); margin-bottom: 1rem; letter-spacing: 0.05em; }
  .f-breadcrumb a { color: rgba(0,245,255,0.5); text-decoration: none; transition: color 0.15s; }
  .f-breadcrumb a:hover { color: var(--cyan); }
  .f-breadcrumb-active { color: rgba(255,255,255,0.7); }

  /* CONTROLS */
  .f-controls {
    background: var(--card);
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    border: 1px solid rgba(0,245,255,0.18);
    padding: 1rem; margin-bottom: 1rem;
  }

  .f-search-wrap { position: relative; margin-bottom: 0.75rem; }
  .f-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: rgba(0,245,255,0.4); font-size: 0.7rem; pointer-events: none; }
  .f-search {
    width: 100%; padding: 0.65rem 2.5rem 0.65rem 2rem;
    background: rgba(0,245,255,0.03); border: 1px solid rgba(0,245,255,0.2);
    color: var(--cyan); font-family: 'Share Tech Mono', monospace; font-size: 0.7rem;
    outline: none;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    transition: all 0.2s;
  }
  .f-search::placeholder { color: rgba(0,245,255,0.25); }
  .f-search:focus { border-color: var(--cyan); box-shadow: 0 0 15px rgba(0,245,255,0.15); background: rgba(0,245,255,0.05); }
  .f-search-clear { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); color: rgba(255,45,120,0.6); cursor: pointer; font-size: 0.7rem; transition: color 0.15s; background: none; border: none; }
  .f-search-clear:hover { color: var(--pink); }

  .f-sort-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
  .f-sort-label { font-family: 'Orbitron', monospace; font-size: 0.55rem; font-weight: 700; color: rgba(255,255,255,0.3); letter-spacing: 0.15em; }
  .f-sort-opts { display: flex; gap: 0.3rem; flex-wrap: wrap; }
  .f-sort-btn {
    font-family: 'Orbitron', monospace; font-size: 0.52rem; font-weight: 700;
    letter-spacing: 0.08em; padding: 0.35rem 0.65rem;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.3); cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px));
    transition: all 0.15s;
  }
  .f-sort-btn:hover { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.15); }
  .f-sort-btn.active { background: rgba(255,45,120,0.1); border-color: rgba(255,45,120,0.4); color: var(--pink); text-shadow: 0 0 6px var(--pink); }

  .f-clear-btn { font-family: 'Orbitron', monospace; font-size: 0.52rem; font-weight: 700; color: rgba(255,45,120,0.6); background: none; border: none; cursor: pointer; letter-spacing: 0.1em; transition: color 0.15s; }
  .f-clear-btn:hover { color: var(--pink); }

  .f-showing { font-size: 0.6rem; color: rgba(255,255,255,0.25); margin-top: 0.6rem; letter-spacing: 0.05em; }
  .f-showing span { color: var(--cyan); font-family: 'Orbitron', monospace; font-weight: 700; }

  /* TOPIC CARD */
  .f-topic-card {
    background: var(--card);
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    border: 1px solid rgba(0,245,255,0.12);
    padding: 1rem; margin-bottom: 0.6rem;
    cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;
  }
  .f-topic-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,245,255,0.02) 0%, transparent 50%);
    pointer-events: none;
  }
  .f-topic-card:hover {
    border-color: rgba(0,245,255,0.35);
    box-shadow: 0 0 15px rgba(0,245,255,0.08), 4px 0 0 var(--cyan);
    transform: translateX(3px);
  }
  .f-topic-card.pinned { border-color: rgba(255,230,0,0.25); }
  .f-topic-card.pinned:hover { border-color: rgba(255,230,0,0.5); box-shadow: 0 0 15px rgba(255,230,0,0.08), 4px 0 0 var(--yellow); }

  .f-topic-inner { display: flex; gap: 0.75rem; align-items: flex-start; }
  .f-topic-avatar { font-size: 1.6rem; flex-shrink: 0; opacity: 0.7; transition: opacity 0.2s; }
  .f-topic-card:hover .f-topic-avatar { opacity: 1; }

  .f-topic-body { flex: 1; min-width: 0; }

  .f-topic-badges { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.4rem; }
  .f-badge {
    font-family: 'Orbitron', monospace; font-size: 0.48rem; font-weight: 900;
    letter-spacing: 0.12em; padding: 0.15rem 0.45rem;
    clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px));
  }
  .f-badge-pinned  { background: rgba(255,230,0,0.08); border: 1px solid rgba(255,230,0,0.4); color: var(--yellow); }
  .f-badge-hot     { background: rgba(255,45,120,0.08); border: 1px solid rgba(255,45,120,0.4); color: var(--pink); }
  .f-badge-solved  { background: rgba(57,255,20,0.08);  border: 1px solid rgba(57,255,20,0.4);  color: var(--green); }
  .f-badge-locked  { background: rgba(191,95,255,0.08); border: 1px solid rgba(191,95,255,0.4); color: var(--purple); }

  .f-topic-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.3rem; }
  .f-topic-title {
    font-family: 'Orbitron', monospace; font-weight: 700; font-size: 0.75rem;
    color: rgba(255,255,255,0.85); letter-spacing: 0.02em; line-height: 1.4;
    flex: 1; transition: color 0.15s, text-shadow 0.15s;
  }
  .f-topic-card:hover .f-topic-title { color: var(--cyan); text-shadow: 0 0 8px rgba(0,245,255,0.4); }

  .f-topic-quick-stats { display: flex; gap: 0.75rem; flex-shrink: 0; }
  .f-topic-qstat { font-size: 0.6rem; color: rgba(255,255,255,0.3); font-family: 'Share Tech Mono', monospace; }
  .f-topic-qstat.green { color: rgba(57,255,20,0.6); }
  .f-topic-qstat.cyan  { color: rgba(0,245,255,0.4); }

  .f-topic-excerpt { font-size: 0.65rem; color: rgba(255,255,255,0.4); margin-bottom: 0.5rem; line-height: 1.5; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

  .f-topic-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.5rem; }
  .f-tag {
    font-size: 0.55rem; padding: 0.15rem 0.45rem;
    background: rgba(191,95,255,0.06); border: 1px solid rgba(191,95,255,0.25);
    color: rgba(191,95,255,0.7);
    clip-path: polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px));
    font-family: 'Share Tech Mono', monospace;
  }

  .f-topic-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; font-size: 0.58rem; color: rgba(255,255,255,0.25); }
  .f-topic-meta-author { color: rgba(0,245,255,0.5); font-family: 'Orbitron', monospace; font-size: 0.52rem; font-weight: 700; }
  .f-topic-meta-cat { color: rgba(255,45,120,0.5); font-family: 'Orbitron', monospace; font-size: 0.52rem; font-weight: 700; }

  .f-topic-actions { display: flex; align-items: center; gap: 0.4rem; margin-top: 0.6rem; padding-top: 0.6rem; border-top: 1px solid rgba(255,255,255,0.04); }
  .f-action-btn {
    font-family: 'Orbitron', monospace; font-size: 0.52rem; font-weight: 700;
    letter-spacing: 0.08em; padding: 0.35rem 0.65rem;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.35); cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px));
    transition: all 0.15s;
  }
  .f-action-btn:hover { color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.2); }
  .f-action-btn.liked { background: rgba(255,45,120,0.1); border-color: rgba(255,45,120,0.4); color: var(--pink); }

  /* NOT FOUND */
  .f-empty {
    background: var(--card);
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
    border: 1px solid rgba(255,230,0,0.2); padding: 3rem; text-align: center;
  }
  .f-empty-icon { font-family: 'Press Start 2P', monospace; font-size: 2.5rem; color: var(--yellow); text-shadow: 0 0 15px var(--yellow); display: block; margin-bottom: 0.75rem; animation: f-float 2.5s ease-in-out infinite; }
  .f-empty-title { font-family: 'Orbitron', monospace; font-weight: 900; font-size: 0.8rem; color: var(--yellow); letter-spacing: 0.15em; margin-bottom: 0.35rem; }
  .f-empty-sub { font-size: 0.62rem; color: rgba(255,255,255,0.3); margin-bottom: 1rem; }

  /* TOPIC VIEW */
  .f-topic-view { display: flex; flex-direction: column; gap: 0.75rem; }

  .f-back-btn {
    font-family: 'Orbitron', monospace; font-size: 0.58rem; font-weight: 700;
    color: rgba(0,245,255,0.5); background: none; border: none; cursor: pointer;
    letter-spacing: 0.1em; margin-bottom: 0.5rem; transition: color 0.15s;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .f-back-btn:hover { color: var(--cyan); }

  .f-topic-header {
    background: var(--card);
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
    border: 1px solid rgba(0,245,255,0.2); padding: 1.25rem;
  }

  .f-view-title { font-family: 'Orbitron', monospace; font-weight: 900; font-size: clamp(0.9rem,2.5vw,1.3rem); color: var(--cyan); text-shadow: 0 0 12px rgba(0,245,255,0.4); letter-spacing: 0.03em; margin: 0.75rem 0 0.5rem; line-height: 1.3; }

  .f-view-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; font-size: 0.6rem; color: rgba(255,255,255,0.3); margin-bottom: 0.75rem; }
  .f-view-meta-author { display: flex; align-items: center; gap: 0.3rem; }
  .f-view-meta-name { font-family: 'Orbitron', monospace; font-size: 0.55rem; font-weight: 700; color: rgba(0,245,255,0.6); }

  .f-markdown {
    font-size: 0.72rem; line-height: 1.7; color: rgba(255,255,255,0.75);
    font-family: 'Share Tech Mono', monospace;
    padding: 0.75rem; background: rgba(0,0,0,0.2);
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    border: 1px solid rgba(255,255,255,0.06);
  }
  .f-markdown h1,.f-markdown h2,.f-markdown h3 { font-family: 'Orbitron', monospace; color: var(--cyan); font-weight: 900; letter-spacing: 0.05em; margin: 0.75rem 0 0.35rem; }
  .f-markdown strong { color: var(--pink); }
  .f-markdown code { font-size: 0.65rem; background: rgba(0,245,255,0.08); color: var(--cyan); padding: 0.1rem 0.35rem; border: 1px solid rgba(0,245,255,0.2); }
  .f-markdown pre { background: rgba(0,0,0,0.5); border: 1px solid rgba(0,245,255,0.15); padding: 0.75rem; margin: 0.5rem 0; overflow-x: auto; }
  .f-markdown ul,.f-markdown ol { padding-left: 1.2rem; }
  .f-markdown li { color: rgba(255,255,255,0.65); }
  .f-markdown a { color: rgba(0,245,255,0.7); }

  .f-view-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 0.75rem; }
  .f-view-action {
    font-family: 'Orbitron', monospace; font-size: 0.55rem; font-weight: 700;
    letter-spacing: 0.08em; padding: 0.45rem 0.85rem;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.4); cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
    transition: all 0.15s; text-decoration: none; display: inline-block;
  }
  .f-view-action:hover { color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.2); }
  .f-view-action.liked { background: rgba(255,45,120,0.1); border-color: rgba(255,45,120,0.4); color: var(--pink); }

  /* REPLIES */
  .f-replies-box {
    background: var(--card);
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    border: 1px solid rgba(255,45,120,0.18); padding: 1rem;
  }
  .f-replies-title { font-family: 'Orbitron', monospace; font-weight: 900; font-size: 0.65rem; color: var(--pink); text-shadow: 0 0 8px var(--pink); letter-spacing: 0.15em; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,45,120,0.12); display: block; }

  .f-reply {
    background: rgba(0,0,0,0.2); padding: 0.85rem;
    border-left: 2px solid rgba(255,255,255,0.06);
    margin-bottom: 0.6rem; transition: border-color 0.15s;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  }
  .f-reply:last-child { margin-bottom: 0; }
  .f-reply:hover { border-left-color: rgba(0,245,255,0.3); }
  .f-reply.accepted { border-left-color: var(--green); background: rgba(57,255,20,0.04); }

  .f-reply-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
  .f-reply-author { display: flex; align-items: center; gap: 0.5rem; }
  .f-reply-avatar { font-size: 1.2rem; }
  .f-reply-name { font-family: 'Orbitron', monospace; font-size: 0.6rem; font-weight: 700; color: rgba(255,255,255,0.7); }
  .f-reply-time { font-size: 0.55rem; color: rgba(255,255,255,0.25); }
  .f-reply-badge { font-family: 'Orbitron', monospace; font-size: 0.48rem; font-weight: 900; letter-spacing: 0.1em; padding: 0.15rem 0.45rem; background: rgba(57,255,20,0.08); border: 1px solid rgba(57,255,20,0.4); color: var(--green); clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px)); }

  .f-reply-actions { display: flex; gap: 0.4rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.04); margin-top: 0.5rem; }
  .f-reply-btn { font-family: 'Orbitron', monospace; font-size: 0.5rem; font-weight: 700; padding: 0.25rem 0.5rem; background: none; border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); cursor: pointer; clip-path: polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px)); transition: all 0.15s; }
  .f-reply-btn:hover { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.2); }
  .f-reply-btn.liked { background: rgba(255,45,120,0.08); border-color: rgba(255,45,120,0.35); color: var(--pink); }

  /* NO REPLIES */
  .f-no-replies { text-align: center; padding: 2rem 1rem; }
  .f-no-replies-icon { font-family: 'Press Start 2P', monospace; font-size: 1.5rem; color: rgba(0,245,255,0.3); display: block; margin-bottom: 0.5rem; }
  .f-no-replies-text { font-family: 'Orbitron', monospace; font-size: 0.65rem; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; }
  .f-no-replies-sub { font-size: 0.58rem; color: rgba(255,255,255,0.2); margin-top: 0.25rem; }

  /* REPLY FORM */
  .f-reply-form {
    background: var(--card);
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    border: 1px solid rgba(57,255,20,0.2); padding: 1rem;
  }
  .f-form-title { font-family: 'Orbitron', monospace; font-weight: 900; font-size: 0.65rem; color: var(--green); text-shadow: 0 0 8px var(--green); letter-spacing: 0.15em; margin-bottom: 0.75rem; display: block; }

  .f-tabs { display: flex; gap: 0.3rem; margin-bottom: 0.6rem; }
  .f-tab {
    font-family: 'Orbitron', monospace; font-size: 0.55rem; font-weight: 700;
    letter-spacing: 0.08em; padding: 0.35rem 0.75rem;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.3); cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px));
    transition: all 0.15s;
  }
  .f-tab.active { background: rgba(57,255,20,0.1); border-color: rgba(57,255,20,0.4); color: var(--green); }

  .f-textarea {
    width: 100%; min-height: 140px; padding: 0.75rem;
    background: rgba(0,0,0,0.3); border: 1px solid rgba(57,255,20,0.15);
    color: rgba(255,255,255,0.8); font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem; resize: vertical; outline: none;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    transition: border-color 0.2s;
  }
  .f-textarea::placeholder { color: rgba(255,255,255,0.2); }
  .f-textarea:focus { border-color: rgba(57,255,20,0.4); box-shadow: 0 0 12px rgba(57,255,20,0.08); }

  .f-preview-box { min-height: 140px; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(57,255,20,0.1); clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px)); }
  .f-preview-empty { font-size: 0.62rem; color: rgba(255,255,255,0.2); font-style: italic; }

  .f-md-hint { font-size: 0.55rem; color: rgba(57,255,20,0.35); letter-spacing: 0.05em; margin: 0.4rem 0 0.75rem; }

  .f-form-btns { display: flex; gap: 0.5rem; }
  .f-form-btn {
    font-family: 'Orbitron', monospace; font-size: 0.58rem; font-weight: 700;
    letter-spacing: 0.08em; padding: 0.55rem 1rem;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    border: none; cursor: pointer; transition: all 0.15s;
  }
  .f-form-btn:hover { filter: brightness(1.2); transform: scale(1.03); }
  .f-form-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; filter: none; }
  .f-form-btn-cancel { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); }
  .f-form-btn-submit { flex: 1; background: rgba(57,255,20,0.12); border: 1px solid rgba(57,255,20,0.4); color: var(--green); text-shadow: 0 0 8px var(--green); }

  /* LOCKED / NOT AUTH */
  .f-locked-box { background: rgba(191,95,255,0.05); border: 1px solid rgba(191,95,255,0.3); clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); padding: 1.25rem; text-align: center; }
  .f-locked-icon { font-family: 'Press Start 2P', monospace; font-size: 1.5rem; color: var(--purple); text-shadow: 0 0 12px var(--purple); display: block; margin-bottom: 0.5rem; }
  .f-locked-title { font-family: 'Orbitron', monospace; font-size: 0.65rem; font-weight: 900; color: var(--purple); letter-spacing: 0.15em; margin-bottom: 0.3rem; }
  .f-locked-sub { font-size: 0.6rem; color: rgba(255,255,255,0.3); }

  .f-notauth-box { background: rgba(0,245,255,0.03); border: 1px solid rgba(0,245,255,0.2); clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); padding: 1.25rem; text-align: center; }
  .f-notauth-icon { font-family: 'Press Start 2P', monospace; font-size: 1.5rem; color: var(--cyan); text-shadow: 0 0 12px var(--cyan); display: block; margin-bottom: 0.5rem; }
  .f-notauth-title { font-family: 'Orbitron', monospace; font-size: 0.65rem; font-weight: 900; color: var(--cyan); letter-spacing: 0.15em; margin-bottom: 0.3rem; }
  .f-notauth-sub { font-size: 0.6rem; color: rgba(255,255,255,0.3); margin-bottom: 0.75rem; }
  .f-notauth-btn { font-family: 'Orbitron', monospace; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; padding: 0.55rem 1.25rem; background: rgba(0,245,255,0.1); border: 1px solid rgba(0,245,255,0.4); color: var(--cyan); clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px)); text-decoration: none; display: inline-block; transition: all 0.2s; }
  .f-notauth-btn:hover { background: rgba(0,245,255,0.18); box-shadow: 0 0 15px rgba(0,245,255,0.2); }

  /* MODAL */
  .f-modal-overlay { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,0.92); display: flex; align-items: center; justify-content: center; padding: 1rem; overflow-y: auto; }
  .f-modal {
    background: var(--card);
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
    border: 2px solid rgba(0,245,255,0.35);
    box-shadow: 0 0 30px rgba(0,245,255,0.1), inset 0 0 30px rgba(0,245,255,0.02);
    width: 100%; max-width: 680px; padding: 1.5rem; margin: auto;
  }
  .f-modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
  .f-modal-title { font-family: 'Orbitron', monospace; font-weight: 900; font-size: 0.75rem; color: var(--cyan); text-shadow: 0 0 10px var(--cyan); letter-spacing: 0.1em; }
  .f-modal-close { font-family: 'Orbitron', monospace; font-size: 0.7rem; font-weight: 700; color: rgba(255,45,120,0.6); background: none; border: none; cursor: pointer; transition: color 0.15s; }
  .f-modal-close:hover { color: var(--pink); }

  .f-field { margin-bottom: 0.85rem; }
  .f-label { font-family: 'Orbitron', monospace; font-size: 0.52rem; font-weight: 700; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); display: block; margin-bottom: 0.35rem; }
  .f-input {
    width: 100%; padding: 0.6rem 0.75rem;
    background: rgba(0,0,0,0.3); border: 1px solid rgba(0,245,255,0.15);
    color: rgba(255,255,255,0.8); font-family: 'Share Tech Mono', monospace; font-size: 0.7rem;
    outline: none;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    transition: border-color 0.2s;
  }
  .f-input::placeholder { color: rgba(255,255,255,0.2); }
  .f-input:focus { border-color: rgba(0,245,255,0.4); box-shadow: 0 0 12px rgba(0,245,255,0.08); }
  .f-select {
    width: 100%; padding: 0.6rem 0.75rem;
    background: rgba(0,0,0,0.3); border: 1px solid rgba(0,245,255,0.15);
    color: rgba(255,255,255,0.8); font-family: 'Share Tech Mono', monospace; font-size: 0.7rem;
    outline: none; cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    transition: border-color 0.2s;
  }
  .f-select:focus { border-color: rgba(0,245,255,0.4); }
  .f-hint { font-size: 0.55rem; color: rgba(255,255,255,0.2); margin-top: 0.25rem; letter-spacing: 0.05em; }

  .f-modal-btns { display: flex; gap: 0.5rem; margin-top: 1rem; }

  /* KEYFRAMES */
  @keyframes f-marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
  @keyframes f-flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.4} 94%{opacity:1} 96%{opacity:0.6} 97%{opacity:1} }
  @keyframes f-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes f-counter { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
  .f-blink { animation: f-blink 1s step-end infinite; }
  @keyframes f-blink { 0%,100%{opacity:1} 50%{opacity:0} }
`;

// ─────────────────────────────────────────
type Category = { id:string; name:string; icon:string; count:number; description:string; color:string; };
type Topic = { id:number; title:string; excerpt:string; content:string; author:string; authorId:string; avatar:string; createdAt:string; lastActivity:string; replies:number; views:number; likes:number; category:string; isPinned?:boolean; isHot?:boolean; isLocked?:boolean; isSolved?:boolean; tags?:string[]; };
type Reply = { id:number; topicId:number; author:string; authorId:string; avatar:string; content:string; createdAt:string; likes:number; isAccepted?:boolean; };
type User = { id:string; username:string; avatar:string; role:string; posts:number; joined:string; reputation:number; };

const categories: Category[] = [
  { id:"all",      name:"Tutto",             icon:"◈", count:1243, description:"Tutte le discussioni",        color:"from-violet-600 to-purple-600" },
  { id:"pvp",      name:"PvP & Combat",      icon:"⬡", count:487,  description:"Setup, strategie e meta PvP", color:"from-red-600 to-orange-600" },
  { id:"plugin",   name:"Plugin & Config",   icon:"◎", count:312,  description:"Setup server e plugin",       color:"from-blue-600 to-cyan-600" },
  { id:"italian",  name:"Community IT",      icon:"⬟", count:256,  description:"Discussioni in italiano",     color:"from-green-600 to-emerald-600" },
  { id:"events",   name:"Eventi & Tornei",   icon:"◈", count:189,  description:"Organizza e partecipa",       color:"from-pink-600 to-rose-600" },
  { id:"help",     name:"Aiuto & Supporto",  icon:"◎", count:421,  description:"Problemi e richieste",        color:"from-yellow-600 to-amber-600" },
  { id:"showcase", name:"Showcase & Build",  icon:"⬡", count:234,  description:"Mostra le tue creazioni",     color:"from-indigo-600 to-purple-600" },
  { id:"market",   name:"Marketplace",       icon:"⬟", count:178,  description:"Compra, vendi e scambia",     color:"from-emerald-600 to-teal-600" },
];

const mockTopics: Topic[] = [
  { id:1, title:"Miglior setup PvP 2026? Meta attuale e strategie vincenti", excerpt:"Quali armi e armor state usando? Netherite o Diamond?", content:"# Setup PvP Meta 2026\n\nFratelli, mo vi spiego il **meta attuale** per dominare in PvP:\n\n## Armor\n- Full Netherite con Protection IV\n- Helmet con Respiration III\n\n## Armi\n- Netherite Sword (Sharpness V)\n- Bow (Power V, Infinity, Flame)\n\nVoi che usate?", author:"DarkSlayer", authorId:"user_123", avatar:"🛡️", createdAt:"2 ore fa", lastActivity:"15 min fa", replies:47, views:1240, likes:89, category:"pvp", isHot:true, tags:["meta","pvp","netherite"] },
  { id:2, title:"[RISOLTO] VotePlugin non funziona su Velocity proxy", excerpt:"Voti non arrivano dal proxy al server...", content:"# Problema VotePlugin\n\nRaga ho un problema con VotePlugin su Velocity.\n\n**Setup:**\n- Velocity 3.3.0\n- VotingPlugin 6.14\n\nQualcuno sa come fixare?", author:"ProxyKing", authorId:"user_456", avatar:"🚀", createdAt:"5 ore fa", lastActivity:"1 ora fa", replies:23, views:892, likes:34, category:"plugin", isPinned:true, isSolved:true, tags:["velocity","plugin","help"] },
  { id:3, title:"Cerco server italiani Roleplay seri e attivi 2026", excerpt:"Qualcuno conosce server RP attivi con community italiana?", content:"Yo bro, cerco server Roleplay italiani seri. Devono avere:\n\n- Community attiva\n- Staff serio\n- Economia funzionante\n\nDrop i vostri consigli sotto 👇", author:"LucaRP", authorId:"user_789", avatar:"🏰", createdAt:"ieri", lastActivity:"3 ore fa", replies:68, views:1450, likes:103, category:"italian", isHot:true, tags:["roleplay","server","italiano"] },
  { id:4, title:"TORNEO PvP - Prize Pool 500€ - Registrazioni Aperte!", excerpt:"Primo torneo ufficiale H-Ytale con premi veri!", content:"# 🏆 TORNEO PVP UFFICIALE\n\n**Prize Pool: 500€**\n\n- 1° posto: 250€\n- 2° posto: 150€\n- 3° posto: 100€\n\n**Data:** 28 Febbraio 2026\n**Formato:** 1v1 Bracket", author:"EventMaster", authorId:"admin_1", avatar:"👑", createdAt:"3 ore fa", lastActivity:"20 min fa", replies:156, views:3420, likes:287, category:"events", isPinned:true, isHot:true, tags:["torneo","pvp","prize"] },
  { id:5, title:"La mia mega base medievale - 6 mesi di lavoro", excerpt:"Ho finito la mia build più ambiziosa, che ne pensate?", content:"Bro ho speso **6 mesi** a buildare questa mega base medievale in survival.\n\n**Features:**\n- Castello con 4 torri\n- Villaggio completo\n- Farms automatiche\n\nRate da 1 a 10 👇", author:"MasterBuilder", authorId:"user_321", avatar:"🏗️", createdAt:"ieri", lastActivity:"5 ore fa", replies:42, views:987, likes:156, category:"showcase", tags:["build","survival","medieval"] },
];

const mockReplies: Reply[] = [
  { id:1, topicId:1, author:"PvPMaster", authorId:"user_999", avatar:"⚔️", content:"Bro io uso ancora Diamond con Protection IV perché costa meno riparare. Per il PvP serio però Netherite è must have.", createdAt:"1 ora fa", likes:12 },
  { id:2, topicId:1, author:"CombatLegend", authorId:"user_888", avatar:"🔥", content:"# Il mio setup\n\n**Armor:** Full Netherite (Prot IV)\n\n**Armi:**\n- Netherite Axe (Sharpness V)\n- Bow (Power V, Infinity)\n\nQuesto setup mi ha fatto vincere 3 tornei 💯", createdAt:"45 min fa", likes:23, isAccepted:true },
  { id:3, topicId:2, author:"DevExpert", authorId:"user_777", avatar:"💻", content:"Devi configurare il forwarding:\n\n```yaml\nplayer-info-forwarding-mode = \"modern\"\n```\n\nE nel config di VotingPlugin abilita Velocity support. Poi restart tutto.", createdAt:"2 ore fa", likes:18, isAccepted:true },
];

const topUsers: User[] = [
  { id:"1", username:"DarkSlayer",   avatar:"🛡️", role:"Legend", posts:1247, joined:"2023", reputation:8940 },
  { id:"2", username:"ProxyKing",    avatar:"🚀", role:"Expert", posts:892,  joined:"2024", reputation:5670 },
  { id:"3", username:"BuildMaster",  avatar:"🏗️", role:"Pro",    posts:634,  joined:"2024", reputation:4230 },
];

const RANK_COLORS = ["c-yellow","c-cyan","c-purple"] as const;

const Forum: Component = () => {
  const auth = useAuth();
  const [selectedCategory, setSelectedCategory] = createSignal("all");
  const [selectedTopic, setSelectedTopic]       = createSignal<Topic | null>(null);
  const [showNewTopic, setShowNewTopic]          = createSignal(false);
  const [searchQuery, setSearchQuery]            = createSignal("");
  const [sortBy, setSortBy]                      = createSignal<"recent"|"hot"|"replies"|"views">("hot");
  const [newTitle, setNewTitle]                  = createSignal("");
  const [newContent, setNewContent]              = createSignal("");
  const [newCategory, setNewCategory]            = createSignal("all");
  const [newTags, setNewTags]                    = createSignal("");
  const [replyContent, setReplyContent]          = createSignal("");
  const [showPreview, setShowPreview]            = createSignal(false);
  const [likedTopics, setLikedTopics]            = createSignal<Set<number>>(new Set());
  const [likedReplies, setLikedReplies]          = createSignal<Set<number>>(new Set());
  const [onlineUsers, setOnlineUsers]            = createSignal(0);
  const [todayPosts, setTodayPosts]              = createSignal(0);

  onMount(() => {
    let count = 0;
    const iv = setInterval(() => {
      count++;
      setOnlineUsers(Math.min(count * 3, 284));
      setTodayPosts(Math.min(count * 4, 427));
      if (count >= 100) clearInterval(iv);
    }, 15);
    onCleanup(() => clearInterval(iv));
  });

  const filteredTopics = createMemo(() => {
    let result = mockTopics;
    if (selectedCategory() !== "all") result = result.filter(t => t.category === selectedCategory());
    const q = searchQuery().toLowerCase().trim();
    if (q) result = result.filter(t => t.title.toLowerCase().includes(q) || t.excerpt.toLowerCase().includes(q) || t.author.toLowerCase().includes(q) || (t.tags||[]).some(tag => tag.toLowerCase().includes(q)));
    result = [...result];
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (sortBy() === "hot") return ((b.replies*2)+(b.views/10)+(b.likes*3)) - ((a.replies*2)+(a.views/10)+(a.likes*3));
      if (sortBy() === "replies") return b.replies - a.replies;
      if (sortBy() === "views") return b.views - a.views;
      return b.id - a.id;
    });
    return result;
  });

  const topicReplies = createMemo(() => {
    const t = selectedTopic(); if (!t) return [];
    return mockReplies.filter(r => r.topicId === t.id);
  });

  const handleCreateTopic = () => {
    if (!auth.isAuthenticated()) { notify(LANG.notify.loginRequired,"error"); return; }
    if (!newTitle().trim()) { notify(LANG.notify.noTitle,"error"); return; }
    if (!newContent().trim()) { notify(LANG.notify.noContent,"error"); return; }
    if (newCategory() === "all") { notify(LANG.notify.noCat,"error"); return; }
    notify(LANG.notify.topicCreated,"success");
    setShowNewTopic(false); setNewTitle(""); setNewContent(""); setNewCategory("all"); setNewTags("");
  };

  const handleReply = () => {
    if (!auth.isAuthenticated()) { notify(LANG.notify.replyLogin,"error"); return; }
    if (!replyContent().trim()) { notify(LANG.notify.noReply,"error"); return; }
    notify(LANG.notify.replyPublished,"success");
    setReplyContent("");
  };

  const toggleLikeTopic = (id: number) => {
    if (!auth.isAuthenticated()) { notify(LANG.notify.likeLogin,"error"); return; }
    setLikedTopics(prev => { const s = new Set(prev); s.has(id) ? (s.delete(id), notify(LANG.notify.likeRemoved,"info")) : (s.add(id), notify(LANG.notify.likeAdded,"success")); return s; });
  };

  const toggleLikeReply = (id: number) => {
    if (!auth.isAuthenticated()) { notify(LANG.notify.likeLogin,"error"); return; }
    setLikedReplies(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const md = (text: string) => ({ __html: marked.parse(text) as string });
  const clearFilters = () => { setSelectedCategory("all"); setSearchQuery(""); setSortBy("hot"); };

  return (
    <>
      <style>{STYLES}</style>
      <div class="f-root">
        <Notifications />

        {/* TICKER */}
        <div class="f-ticker-wrap">
          <span class="f-ticker">{LANG.ticker.repeat(5)}</span>
        </div>

        {/* HERO */}
        <div class="f-hero">
          <div class="f-hero-bg" />
          <div class="f-hero-tag">{LANG.hero.tag} <span class="f-blink">_</span></div>
          <div class="f-hero-title">{LANG.hero.title}</div>
          <div class="f-hero-sub">{LANG.hero.subtitle}</div>
          <div class="f-stats">
            {[
              { val: onlineUsers(), ...LANG.stats.online,  cls:"c-cyan"   },
              { val: todayPosts(),  ...LANG.stats.posts,   cls:"c-pink"   },
              { val: "2.8K",        ...LANG.stats.topics,  cls:"c-yellow" },
              { val: "4.1K",        ...LANG.stats.members, cls:"c-green"  },
            ].map(s => (
              <div class={`f-stat ${s.cls}`} style={`border: 1px solid currentColor; box-shadow: 0 0 12px currentColor;`}>
                <div class="f-stat-val">{s.icon} {s.val}</div>
                <div class="f-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LAYOUT */}
        <div class="f-layout">

          {/* SIDEBAR */}
          <aside class="f-sidebar">
            <div class="f-sidebar-sticky">

              {/* NEW TOPIC */}
              <Show when={auth.isAuthenticated()}>
                <button class="f-new-btn" onClick={() => setShowNewTopic(true)}>
                  {LANG.sidebar.newTopic}
                </button>
              </Show>

              {/* CATEGORIE */}
              <div class="f-panel f-panel-yellow">
                <span class="f-panel-title yellow">{LANG.sidebar.categories}</span>
                <For each={categories}>
                  {(cat) => (
                    <button
                      class={`f-cat-btn ${selectedCategory() === cat.id ? 'active' : ''}`}
                      onClick={() => { setSelectedCategory(cat.id); setSelectedTopic(null); }}
                    >
                      <span class="f-cat-icon">{cat.icon}</span>
                      <span class="f-cat-name">{cat.name}</span>
                      <span class="f-cat-count">{cat.count}</span>
                    </button>
                  )}
                </For>
              </div>

              {/* STATS */}
              <div class="f-panel f-panel-purple">
                <span class="f-panel-title purple">{LANG.sidebar.stats}</span>
                <For each={LANG.sidebar.statsData}>
                  {(s) => (
                    <div class="f-stat-row">
                      <span class="f-stat-row-label">{s.label}</span>
                      <span class={`f-stat-row-val ${(s as any).highlight ? 'highlight' : ''}`}>{s.val}</span>
                    </div>
                  )}
                </For>
              </div>

              {/* TOP CONTRIBUTORS */}
              <div class="f-panel f-panel-pink">
                <span class="f-panel-title pink">{LANG.sidebar.contributors}</span>
                <For each={topUsers}>
                  {(user, i) => (
                    <div class="f-contrib">
                      <span class={`f-contrib-rank ${RANK_COLORS[i()] ?? 'c-cyan'}`}>#{i()+1}</span>
                      <span class="f-contrib-avatar">{user.avatar}</span>
                      <div>
                        <div class="f-contrib-name">{user.username}</div>
                        <div class="f-contrib-posts">{user.posts} POST</div>
                      </div>
                    </div>
                  )}
                </For>
              </div>

              {/* LINKS */}
              <div class="f-panel f-panel-green">
                <span class="f-panel-title green">{LANG.sidebar.links}</span>
                <For each={LANG.sidebar.links}>
                  {(l) => <A href={l.href} class="f-link">{l.label}</A>}
                </For>
              </div>
            </div>
          </aside>

          {/* MAIN */}
          <main class="f-main">

            {/* BREADCRUMB */}
            <div class="f-breadcrumb">
              <A href="/">HOME</A><span>›</span>
              <A href="/forum">FORUM</A>
              <Show when={selectedCategory() !== "all"}>
                <span>›</span>
                <span class="f-breadcrumb-active">{categories.find(c=>c.id===selectedCategory())?.name.toUpperCase()}</span>
              </Show>
              <Show when={selectedTopic()}>
                <span>›</span>
                <span class="f-breadcrumb-active" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px;">
                  {selectedTopic()?.title.toUpperCase()}
                </span>
              </Show>
            </div>

            {/* ── LISTA TOPICS ── */}
            <Show when={!selectedTopic()}>

              {/* CONTROLS */}
              <div class="f-controls">
                <div class="f-search-wrap">
                  <span class="f-search-icon">▶</span>
                  <input class="f-search" placeholder={LANG.list.search} value={searchQuery()} onInput={e=>setSearchQuery(e.currentTarget.value)} />
                  <Show when={searchQuery()}>
                    <button class="f-search-clear" onClick={()=>setSearchQuery("")}>✕</button>
                  </Show>
                </div>
                <div class="f-sort-row">
                  <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
                    <span class="f-sort-label">{LANG.list.sort}</span>
                    <div class="f-sort-opts">
                      <For each={LANG.list.sortOpts}>
                        {(o) => (
                          <button class={`f-sort-btn ${sortBy()===o.value?'active':''}`} onClick={()=>setSortBy(o.value as any)}>
                            {o.label}
                          </button>
                        )}
                      </For>
                    </div>
                  </div>
                  <Show when={selectedCategory()!=="all"||searchQuery()}>
                    <button class="f-clear-btn" onClick={clearFilters}>{LANG.list.clear}</button>
                  </Show>
                </div>
                <div class="f-showing">
                  {LANG.list.showing} <span>{filteredTopics().length}</span> {LANG.list.topics}
                  {searchQuery() && ` ◈ "${searchQuery()}"`}
                </div>
              </div>

              {/* TOPIC LIST */}
              <Show
                when={filteredTopics().length > 0}
                fallback={
                  <div class="f-empty">
                    <span class="f-empty-icon">?</span>
                    <div class="f-empty-title">{LANG.list.notFound}</div>
                    <div class="f-empty-sub">{LANG.list.notFoundSub}</div>
                    <button class="f-sort-btn" style="margin-top:0.75rem;" onClick={clearFilters}>{LANG.list.showAll}</button>
                  </div>
                }
              >
                <For each={filteredTopics()}>
                  {(topic) => (
                    <div class={`f-topic-card ${topic.isPinned?'pinned':''}`} onClick={()=>setSelectedTopic(topic)}>
                      <div class="f-topic-inner">
                        <div class="f-topic-avatar">{topic.avatar}</div>
                        <div class="f-topic-body">
                          <div class="f-topic-badges">
                            {topic.isPinned && <span class="f-badge f-badge-pinned">{LANG.badges.pinned}</span>}
                            {topic.isHot    && <span class="f-badge f-badge-hot">{LANG.badges.hot}</span>}
                            {topic.isSolved && <span class="f-badge f-badge-solved">{LANG.badges.solved}</span>}
                            {topic.isLocked && <span class="f-badge f-badge-locked">{LANG.badges.locked}</span>}
                          </div>
                          <div class="f-topic-title-row">
                            <span class="f-topic-title">{topic.title}</span>
                            <div class="f-topic-quick-stats">
                              <span class="f-topic-qstat green">◎ {topic.replies}</span>
                              <span class="f-topic-qstat cyan">◈ {topic.views}</span>
                            </div>
                          </div>
                          <p class="f-topic-excerpt">{topic.excerpt}</p>
                          <Show when={topic.tags && topic.tags.length > 0}>
                            <div class="f-topic-tags">
                              <For each={topic.tags}>{tag=><span class="f-tag">#{tag}</span>}</For>
                            </div>
                          </Show>
                          <div class="f-topic-meta">
                            <span class="f-topic-meta-author">◈ {topic.author.toUpperCase()}</span>
                            <span>•</span><span>{topic.createdAt}</span>
                            <span>•</span><span>◎ {topic.lastActivity}</span>
                            <span>•</span>
                            <span class="f-topic-meta-cat">{categories.find(c=>c.id===topic.category)?.icon} {categories.find(c=>c.id===topic.category)?.name.toUpperCase()}</span>
                          </div>
                          <div class="f-topic-actions" onClick={e=>e.stopPropagation()}>
                            <button class={`f-action-btn ${likedTopics().has(topic.id)?'liked':''}`} onClick={()=>toggleLikeTopic(topic.id)}>
                              ⬡ {topic.likes+(likedTopics().has(topic.id)?1:0)}
                            </button>
                            <button class="f-action-btn" onClick={()=>setSelectedTopic(topic)}>{LANG.list.reply}</button>
                            <button class="f-action-btn" onClick={()=>notify(LANG.notify.shared,"success")}>{LANG.list.share}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </Show>
            </Show>

            {/* ── TOPIC VIEW ── */}
            <Show when={selectedTopic()}>
              <div class="f-topic-view">

                {/* HEADER */}
                <div class="f-topic-header">
                  <button class="f-back-btn" onClick={()=>setSelectedTopic(null)}>← {LANG.topic.back}</button>

                  <div class="f-topic-badges">
                    {selectedTopic()?.isPinned && <span class="f-badge f-badge-pinned">{LANG.badges.pinned}</span>}
                    {selectedTopic()?.isHot    && <span class="f-badge f-badge-hot">{LANG.badges.hot}</span>}
                    {selectedTopic()?.isSolved && <span class="f-badge f-badge-solved">{LANG.badges.solved}</span>}
                    {selectedTopic()?.isLocked && <span class="f-badge f-badge-locked">{LANG.badges.locked}</span>}
                  </div>

                  <div class="f-view-title">{selectedTopic()?.title.toUpperCase()}</div>

                  <div class="f-view-meta">
                    <div class="f-view-meta-author">
                      <span>{selectedTopic()?.avatar}</span>
                      <span class="f-view-meta-name">{selectedTopic()?.author.toUpperCase()}</span>
                    </div>
                    <span>•</span><span>{selectedTopic()?.createdAt}</span>
                    <span>•</span><span>◈ {selectedTopic()?.views} {LANG.topic.views}</span>
                    <span>•</span><span>◎ {selectedTopic()?.replies} {LANG.topic.replies}</span>
                  </div>

                  <Show when={selectedTopic()?.tags && selectedTopic()!.tags!.length > 0}>
                    <div class="f-topic-tags" style="margin-bottom:0.75rem;">
                      <For each={selectedTopic()?.tags}>{tag=><span class="f-tag">#{tag}</span>}</For>
                    </div>
                  </Show>

                  <div class="f-markdown" innerHTML={md(selectedTopic()!.content)} />

                  <div class="f-view-actions">
                    <button class={`f-view-action ${likedTopics().has(selectedTopic()!.id)?'liked':''}`} onClick={()=>toggleLikeTopic(selectedTopic()!.id)}>
                      {LANG.topic.like} {selectedTopic()!.likes+(likedTopics().has(selectedTopic()!.id)?1:0)}
                    </button>
                    <button class="f-view-action" onClick={()=>notify(LANG.notify.shared,"success")}>{LANG.topic.share}</button>
                    <Show when={auth.isAuthenticated()}>
                      <button class="f-view-action" onClick={()=>notify(LANG.notify.saved,"success")}>{LANG.topic.save}</button>
                    </Show>
                  </div>
                </div>

                {/* REPLIES */}
                <div class="f-replies-box">
                  <span class="f-replies-title">◎ {topicReplies().length} {LANG.topic.repliesLabel}</span>
                  <Show
                    when={topicReplies().length > 0}
                    fallback={
                      <div class="f-no-replies">
                        <span class="f-no-replies-icon">◎</span>
                        <div class="f-no-replies-text">{LANG.topic.noReplies}</div>
                        <div class="f-no-replies-sub">{LANG.topic.noRepliesSub}</div>
                      </div>
                    }
                  >
                    <For each={topicReplies()}>
                      {(reply) => (
                        <div class={`f-reply ${reply.isAccepted?'accepted':''}`}>
                          <div class="f-reply-header">
                            <div class="f-reply-author">
                              <span class="f-reply-avatar">{reply.avatar}</span>
                              <div>
                                <div class="f-reply-name">{reply.author.toUpperCase()}</div>
                                <div class="f-reply-time">{reply.createdAt}</div>
                              </div>
                            </div>
                            {reply.isAccepted && <span class="f-reply-badge">{LANG.badges.accepted}</span>}
                          </div>
                          <div class="f-markdown" innerHTML={md(reply.content)} />
                          <div class="f-reply-actions">
                            <button class={`f-reply-btn ${likedReplies().has(reply.id)?'liked':''}`} onClick={()=>toggleLikeReply(reply.id)}>
                              ⬡ {reply.likes+(likedReplies().has(reply.id)?1:0)}
                            </button>
                            <button class="f-reply-btn" onClick={()=>notify(LANG.notify.replyQuoted,"info")}>{LANG.topic.quote}</button>
                            <Show when={auth.isAuthenticated() && auth.user()?.id===selectedTopic()?.authorId}>
                              <button class="f-reply-btn" onClick={()=>notify(LANG.notify.replyAccepted,"success")}>{LANG.topic.accept}</button>
                            </Show>
                          </div>
                        </div>
                      )}
                    </For>
                  </Show>
                </div>

                {/* REPLY FORM */}
                <Show when={auth.isAuthenticated() && !selectedTopic()?.isLocked}>
                  <div class="f-reply-form">
                    <span class="f-form-title">{LANG.topic.replyTitle}</span>
                    <div class="f-tabs">
                      <button class={`f-tab ${!showPreview()?'active':''}`} onClick={()=>setShowPreview(false)}>{LANG.topic.writeTab}</button>
                      <button class={`f-tab ${showPreview()?'active':''}`} onClick={()=>setShowPreview(true)}>{LANG.topic.previewTab}</button>
                    </div>
                    <Show when={!showPreview()}>
                      <textarea class="f-textarea" placeholder={LANG.topic.placeholder} value={replyContent()} onInput={e=>setReplyContent(e.currentTarget.value)} />
                    </Show>
                    <Show when={showPreview()}>
                      <div class="f-preview-box">
                        <Show when={replyContent().trim()} fallback={<p class="f-preview-empty">◈ Nessun contenuto...</p>}>
                          <div class="f-markdown" innerHTML={md(replyContent())} />
                        </Show>
                      </div>
                    </Show>
                    <div class="f-md-hint">{LANG.topic.mdHint}</div>
                    <div class="f-form-btns">
                      <button class="f-form-btn f-form-btn-cancel" onClick={()=>{setReplyContent("");setShowPreview(false);}}>{LANG.topic.cancel}</button>
                      <button class="f-form-btn f-form-btn-submit" onClick={handleReply} disabled={!replyContent().trim()}>{LANG.topic.publish}</button>
                    </div>
                  </div>
                </Show>

                <Show when={selectedTopic()?.isLocked}>
                  <div class="f-locked-box">
                    <span class="f-locked-icon">⬟</span>
                    <div class="f-locked-title">{LANG.topic.locked}</div>
                    <div class="f-locked-sub">{LANG.topic.lockedSub}</div>
                  </div>
                </Show>

                <Show when={!auth.isAuthenticated()}>
                  <div class="f-notauth-box">
                    <span class="f-notauth-icon">◈</span>
                    <div class="f-notauth-title">{LANG.topic.notAuth}</div>
                    <div class="f-notauth-sub">{LANG.topic.notAuthSub}</div>
                    <A href="/login" class="f-notauth-btn">{LANG.topic.login}</A>
                  </div>
                </Show>
              </div>
            </Show>
          </main>
        </div>

        {/* MODAL NUOVO TOPIC */}
        <Show when={showNewTopic()}>
          <div class="f-modal-overlay">
            <div class="f-modal">
              <div class="f-modal-header">
                <span class="f-modal-title">{LANG.modal.title}</span>
                <button class="f-modal-close" onClick={()=>setShowNewTopic(false)}>{LANG.modal.close}</button>
              </div>

              <div class="f-field">
                <span class="f-label">{LANG.modal.titleLabel}</span>
                <input class="f-input" placeholder={LANG.modal.titlePh} value={newTitle()} onInput={e=>setNewTitle(e.currentTarget.value)} />
              </div>

              <div class="f-field">
                <span class="f-label">{LANG.modal.catLabel}</span>
                <select class="f-select" value={newCategory()} onChange={e=>setNewCategory(e.currentTarget.value)}>
                  <option value="all" disabled>{LANG.modal.catDefault}</option>
                  <For each={categories.filter(c=>c.id!=="all")}>
                    {(cat)=><option value={cat.id}>{cat.icon} {cat.name}</option>}
                  </For>
                </select>
              </div>

              <div class="f-field">
                <span class="f-label">{LANG.modal.tagsLabel}</span>
                <input class="f-input" placeholder={LANG.modal.tagsPh} value={newTags()} onInput={e=>setNewTags(e.currentTarget.value)} />
                <div class="f-hint">{LANG.modal.tagsHint}</div>
              </div>

              <div class="f-field">
                <span class="f-label">{LANG.modal.contentLabel}</span>
                <textarea class="f-textarea" style="min-height:180px;" placeholder={LANG.modal.contentPh} value={newContent()} onInput={e=>setNewContent(e.currentTarget.value)} />
                <div class="f-hint">{LANG.modal.mdHint}</div>
              </div>

              <div class="f-modal-btns">
                <button class="f-form-btn f-form-btn-cancel" onClick={()=>{setShowNewTopic(false);setNewTitle("");setNewContent("");setNewCategory("all");setNewTags("");}}>{LANG.modal.cancel}</button>
                <button class="f-form-btn f-form-btn-submit" style="flex:1;" onClick={handleCreateTopic}>{LANG.modal.publish}</button>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </>
  );
};

export default Forum;
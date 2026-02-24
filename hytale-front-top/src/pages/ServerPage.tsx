// src/pages/ServerBoard.tsx
import { Component, createSignal, For, Show, createMemo, onMount, onCleanup } from "solid-js";
import { createResource } from "solid-js";
import PlayersVoteModal from "../component/modal/PlayersVoteModal";
import { ServerService } from "../services/server.service";
import Notifications, { notify, requireDiscordLogin } from "../component/template/Notification";
import { ServerResponse } from "../types/ServerResponse";
import { VoteService } from "../services/votes.service";
import { useAuth } from "../auth/AuthContext";
import { A } from "@solidjs/router";
import TopFiveServerCard from "../component/card/widget/TopFiveServerCard";
import ServerCardHacking from "../component/card/ServerCard/ServerCardHacking";
import HeroMain from "../component/hero/HeroMain";
import HeroServerMain from "../component/hero/HeroServerMain";

// ═══════════════════════════════════════════════
// 🕹️ LANG CONFIG — cambia tutto il testo qui
// ═══════════════════════════════════════════════
const LANG = {
  page: {
    title: "Lista Aggiornata al 2026",
    subtitle: "SCEGLI IL TUO UNIVERSO",
    loading: "⚙ INIZIALIZZAZIONE SISTEMA...",
    error: "⛔ ERRORE DI SISTEMA",
  },
  hero: {
    title: "Hytale - Servers",
    subtitle: "SCALA LA RETE. DOMINA IL SISTEMA, GIOCA CON GLI AMICI.",
    tag: "// CLASSIFICHE IN TEMPO REALE",
  },
  stats: {
    votes: { label: "VOTI OGGI", icon: "⬡" },
    players: { label: "GIOCATORI ONLINE", icon: "◈" },
    trending: { label: "SERVER TREND", icon: "◎" },
  },
  search: {
    title: "◈ SCAN UNIVERSO",
    subtitle: "Cerca nella rete di server",
    placeholder: "Nome del server..",
  },
  filters: {
    title: "⬡ MODALITÀ",
    active: {
      title: "FILTRI ATTIVI",
      viewing: "Stai guardando:",
      clear: "✕ RESET FILTRI",
      ghost: "◈ NESSUN FILTRO DA RESETTARE",
    },
    inactive: {
      title: "NESSUN FILTRO",
      subtitle: "Attiva un filtro per cercare",
    },
  },
  sort: {
    label: "◈ ORDINA PER",
  },
  quick: {
    title: "⚡ QUICK ACCESS",
    add: "➕ INSERISCI SERVER",
    scrollTop: "⬆ TORNA ALL'INIZIO",
  },
  results: {
    showing: "MOSTRANDO",
    servers: "SERVER ATTIVI",
    loadingMore: "⚙ CARICAMENTO DATI...",
    allLoaded: "FINE TRASMISSIONE",
    allLoadedSub: "Hai visto tutti i server nella rete",
    notFound: "NESSUN SEGNALE TROVATO",
    notFoundSub: "Prova a modificare i filtri di ricerca",
    clearFilters: "✕ RESET RICERCA",
  },
  scrollTop: "⬆",
};

// ═══════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════
const ARCADE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  :root {
    --neon-pink: #ff2d78;
    --neon-cyan: #00f5ff;
    --neon-yellow: #ffe600;
    --neon-green: #39ff14;
    --neon-purple: #bf5fff;
    --bg-dark: #020408;
    --bg-card: #080f1a;
    --pixel-size: 2px;
  }

  .arcade-bg {
    background: var(--bg-dark);
    background-image:
      linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px);
    background-size: 32px 32px;
    min-height: 100vh;
  }

  .scanlines::after {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.15) 2px,
      rgba(0,0,0,0.15) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  .neon-text-pink {
    color: var(--neon-pink);
    text-shadow: 0 0 7px var(--neon-pink), 0 0 20px var(--neon-pink), 0 0 40px var(--neon-pink);
  }

  .neon-text-cyan {
    color: var(--neon-cyan);
    text-shadow: 0 0 7px var(--neon-cyan), 0 0 20px var(--neon-cyan), 0 0 40px var(--neon-cyan);
  }

  .neon-text-yellow {
    color: var(--neon-yellow);
    text-shadow: 0 0 7px var(--neon-yellow), 0 0 20px var(--neon-yellow);
  }

  .neon-text-green {
    color: var(--neon-green);
    text-shadow: 0 0 7px var(--neon-green), 0 0 20px var(--neon-green);
  }

  .neon-border-pink {
    border: 2px solid var(--neon-pink);
    box-shadow: 0 0 10px var(--neon-pink), inset 0 0 10px rgba(255,45,120,0.1);
  }

  .neon-border-cyan {
    border: 2px solid var(--neon-cyan);
    box-shadow: 0 0 10px var(--neon-cyan), inset 0 0 10px rgba(0,245,255,0.05);
  }

  .neon-border-yellow {
    border: 2px solid var(--neon-yellow);
    box-shadow: 0 0 10px var(--neon-yellow), inset 0 0 10px rgba(255,230,0,0.05);
  }

  .neon-border-purple {
    border: 2px solid var(--neon-purple);
    box-shadow: 0 0 10px var(--neon-purple), inset 0 0 10px rgba(191,95,255,0.05);
  }

  .arcade-card {
    background: var(--bg-card);
    border-radius: 0;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  }

  .arcade-btn {
    font-family: 'Orbitron', monospace;
    font-weight: 700;
    letter-spacing: 0.1em;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    transition: all 0.15s;
    cursor: pointer;
  }

  .arcade-btn:hover {
    transform: scale(1.03);
    filter: brightness(1.2);
  }

  .arcade-btn:active {
    transform: scale(0.97);
  }

  .pixel-font {
    font-family: 'Press Start 2P', monospace;
  }

  .orbitron {
    font-family: 'Orbitron', monospace;
  }

  .mono {
    font-family: 'Share Tech Mono', monospace;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(2px, -1px); }
    60% { transform: translate(-1px, 1px); }
    80% { transform: translate(1px, -2px); }
    100% { transform: translate(0); }
  }

  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }

  @keyframes pulse-neon {
    0%, 100% { box-shadow: 0 0 10px var(--neon-cyan), inset 0 0 10px rgba(0,245,255,0.05); }
    50% { box-shadow: 0 0 25px var(--neon-cyan), 0 0 50px var(--neon-cyan), inset 0 0 20px rgba(0,245,255,0.1); }
  }

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    92% { opacity: 1; }
    93% { opacity: 0.4; }
    94% { opacity: 1; }
    96% { opacity: 0.6; }
    97% { opacity: 1; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  @keyframes counter-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .blink { animation: blink 1s step-end infinite; }
  .glitch { animation: glitch 0.3s infinite; }
  .pulse-neon { animation: pulse-neon 2s ease-in-out infinite; }
  .flicker { animation: flicker 4s ease-in-out infinite; }
  .float { animation: float 3s ease-in-out infinite; }
  .counter-up { animation: counter-up 0.6s ease-out forwards; }

  .tag-active {
    animation: pulse-neon 1.5s ease-in-out infinite;
  }

  .arcade-input {
    background: rgba(0,245,255,0.03);
    border: 1px solid rgba(0,245,255,0.3);
    color: var(--neon-cyan);
    font-family: 'Share Tech Mono', monospace;
    outline: none;
    transition: all 0.2s;
  }

  .arcade-input::placeholder {
    color: rgba(0,245,255,0.3);
  }

  .arcade-input:focus {
    border-color: var(--neon-cyan);
    box-shadow: 0 0 15px rgba(0,245,255,0.3), inset 0 0 10px rgba(0,245,255,0.05);
    background: rgba(0,245,255,0.05);
  }

  .ticker-wrap {
    overflow: hidden;
    border-top: 1px solid var(--neon-pink);
    border-bottom: 1px solid var(--neon-pink);
    box-shadow: 0 0 10px var(--neon-pink);
    background: rgba(255,45,120,0.05);
  }

  .ticker {
    display: inline-block;
    white-space: nowrap;
    animation: marquee 20s linear infinite;
  }

  .corner-tl::before, .corner-br::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
  }

  .stat-card {
    position: relative;
    overflow: hidden;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%);
    animation: shine 3s ease-in-out infinite;
  }

  @keyframes shine {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(100%) rotate(45deg); }
  }
`;

const ServersPage: Component = () => {
  const auth = useAuth();
  const discord_id_user = auth.user()?.id ?? '';

  const [allServers, setAllServers] = createSignal<ServerResponse[]>([]);
  const [page, setPage] = createSignal(1);
  const [hasMore, setHasMore] = createSignal(true);
  const [isLoadingMore, setIsLoadingMore] = createSignal(false);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [selectedServer, setSelectedServer] = createSignal<ServerResponse | null>(null);
  const [playerGameName, setPlayerGameName] = createSignal<string>("");
  const [activeFilters, setActiveFilters] = createSignal<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = createSignal("");
  const [sortBy, setSortBy] = createSignal<"votes" | "recent" | "players">("votes");
  const [scrollY, setScrollY] = createSignal(0);

  const ITEMS_PER_PAGE = 12;

  const [initialData] = createResource(async () => {
    try {
      const result = await ServerService.getServerParams({
        page: 1,
        limit: ITEMS_PER_PAGE,
        sort: sortBy()
      });
      setAllServers(result.data);
      setHasMore(result.data.length >= ITEMS_PER_PAGE);
      return result;
    } catch (error) {
      console.error("Errore caricamento server:", error);
      throw error;
    }
  });

  const loadMoreServers = async () => {
    if (isLoadingMore() || !hasMore()) return;
    setIsLoadingMore(true);
    try {
      const nextPage = page() + 1;
      const result = await ServerService.getServerParams({
        page: nextPage,
        limit: ITEMS_PER_PAGE,
        sort: sortBy()
      });
      if (result.data.length > 0) {
        setAllServers(prev => [...prev, ...result.data]);
        setPage(nextPage);
        setHasMore(result.data.length >= ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      notify(LANG.results.loadingMore, "error");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setScrollY(scrollTop);
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    if (scrollTop + clientHeight >= scrollHeight - 500 && !isLoadingMore() && hasMore()) {
      loadMoreServers();
    }
  };


  const handleVoteRequest = (server: ServerResponse) => {
    if (!auth.isAuthenticated()) {
      requireDiscordLogin();
      return;
    }
    setIsModalOpen(true);
    setSelectedServer(server);
  };

  const handlePlayerVote = () => {
    const voteRes = VoteService.addVote(
      discord_id_user,
      selectedServer()?.id ?? 0,
      playerGameName() ?? ''
    );
    if (voteRes != null) {
      notify(`Voto registrato per ${selectedServer()?.name}! 🎉`, "success");
      setAllServers(prev => prev.map(s =>
        s.id === selectedServer()?.id ? { ...s, votes: (s.votes || 0) + 1 } : s
      ));
    }
    setIsModalOpen(false);
  };

  const availableTags = ["PvP", "Survival", "MiniGames", "Creative", "Roleplay", "Skyblock", "Factions", "Anarchy"];

  const TAG_COLORS = [
    { active: 'neon-border-pink neon-text-pink', inactive: 'text-pink-400/50 border-pink-900/50' },
    { active: 'neon-border-cyan neon-text-cyan', inactive: 'text-cyan-400/50 border-cyan-900/50' },
    { active: 'neon-border-yellow neon-text-yellow', inactive: 'text-yellow-400/50 border-yellow-900/50' },
    { active: 'neon-border-purple neon-text-purple', inactive: 'text-purple-400/50 border-purple-900/50' },
  ];

  const filteredServers = createMemo(() => {
    let result = allServers();
    const filters = activeFilters();
    if (filters.size > 0) {
      result = result.filter(s => {
        const tags = (s as any).tags ?? [];
        return Array.from(filters).some(tag => tags.includes(tag));
      });
    }
    const query = searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(s =>
        s.name?.toLowerCase().includes(query) ||
        s.ip?.toLowerCase().includes(query) ||
        (() => {
          try {
            const tags = typeof (s as any).tags === 'string'
              ? JSON.parse((s as any).tags)
              : ((s as any).tags ?? []);
            return Array.isArray(tags) && tags.some((t: string) => t.toLowerCase().includes(query));
          } catch { return false; }
        })()
      );
    }
    const sort = sortBy();
    if (sort === "votes") result = [...result].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
    else if (sort === "recent") result = [...result].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
    else if (sort === "players") result = [...result].sort((a, b) => ((b as any).online_players ?? 0) - ((a as any).online_players ?? 0));
    return result;
  });

  const toggleFilter = (tag: string) => {
    setActiveFilters(prev => {
      const newSet = new Set(prev);
      newSet.has(tag) ? newSet.delete(tag) : newSet.add(tag);
      return newSet;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters(new Set<string>());
    setSearchQuery("");
  };

  const activeFiltersMessage = createMemo(() => {
    const filters = Array.from(activeFilters());
    const query = searchQuery();
    if (filters.length === 0 && !query) return null;
    const parts = [];
    if (filters.length > 0) parts.push(filters.length === 1 ? `"${filters[0]}"` : `${filters.length} modalità`);
    if (query) parts.push(`"${query}"`);
    return parts.join(' + ');
  });

  // Sostituisci solo il JSX del return, tenendo tutta la logica esistente invariata

  // --- Matrix Rain Canvas ---
  const MatrixRain: Component = () => {
    let canvasRef: HTMLCanvasElement | undefined;

    onMount(() => {
      if (!canvasRef) return;
      const canvas = canvasRef;
      const ctx = canvas.getContext("2d")!;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01ハヒフヘホマミムメモヤユヨラリルレロワヲン ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
      const fontSize = 18;
      const cols = Math.floor(canvas.width / fontSize);
      const drops: number[] = Array(cols).fill(1);

      const draw = () => {
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const green = Math.random() > 0.95 ? "#fff" : "#00ff41";
          ctx.fillStyle = green;
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      };

      const interval = setInterval(draw, 50);
      onCleanup(() => clearInterval(interval));
    });

    return (
      <canvas
        ref={canvasRef}
        class="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        style={{ "z-index": "0", }}
      />
    );
  };

  return (
    <section
      class="min-h-screen text-white"
      style={{
        background: "linear-gradient(160deg, #000300 0%, #000a02 40%, #000500 100%)",
        "font-family": "'Share Tech Mono', monospace",
      }}
    >



      {/* ── HERO ── */}
      <div class="relative overflow-hidden border-b border-green-900/30 py-12 px-6 text-center">
        <HeroServerMain />
      </div>
      <MatrixRain />

      {/* ── Mobile LAYOUT ── */}




      <div class="lg:hidden p-4">
     
     <div class="sticky top-4 space-y-4">

              {/* Filtri attivi / inattivi */}
              <Show
                when={activeFiltersMessage()}
                fallback={
                  <div class="relative border border-purple-800/40 bg-black/60 p-4">
                    <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-purple-500/40" />
                    <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-purple-500/40" />
                    <div class="flex items-center gap-3 mb-3">
                      <span class="text-xl text-purple-400/60">◎</span>
                      <div>
                        <div class="text-xs text-purple-300/60 font-bold tracking-widest uppercase">{LANG.filters.inactive.title}</div>
                        <div class="text-xs text-white/25 mt-0.5">{LANG.filters.inactive.subtitle}</div>
                      </div>
                    </div>
                    <div class="text-xs text-white/20 text-center py-2 border border-white/10 bg-black/40">
                      {LANG.filters.active.ghost}
                    </div>
                  </div>
                }
              >
                <div class="relative border border-pink-700/50 bg-black/60 p-4">
                  <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-pink-500/50" />
                  <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-pink-500/50" />
                  <div class="flex items-start gap-3 mb-3">
                    <span class="text-xl text-pink-400">◈</span>
                    <div class="flex-1">
                      <div class="text-xs text-pink-400 font-black tracking-widest uppercase mb-1">{LANG.filters.active.title}</div>
                      <div class="text-xs text-white/50">
                        {LANG.filters.active.viewing} <span class="text-cyan-400">{activeFiltersMessage()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={clearAllFilters}
                    class="w-full py-2 text-xs border border-pink-700/50 text-pink-400 bg-pink-900/20 hover:bg-pink-900/40 hover:border-pink-500/70 transition-all tracking-widest uppercase"
                  >
                    {LANG.filters.active.clear}
                  </button>
                </div>
              </Show>

              {/* Search */}
              <div class="relative border border-green-800/40 bg-black/60 p-4">
                <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/40" />
                <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/40" />
                <div class="text-xs text-green-400/70 font-bold tracking-widest uppercase mb-1">{LANG.search.title}</div>
                <div class="text-xs text-white/25 mb-3">{LANG.search.subtitle}</div>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 text-xs">▶</span>
                  <input
                    type="text"
                    placeholder={LANG.search.placeholder}
                    value={searchQuery()}
                    onInput={(e) => setSearchQuery(e.currentTarget.value)}
                    class="w-full pl-7 pr-4 py-2 text-sm bg-black/60 border border-green-900/50 text-green-300 placeholder-green-900/60 focus:outline-none focus:border-green-600/60 transition-colors"
                    style={{ "font-family": "'Share Tech Mono', monospace" }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div class="relative border border-green-800/40 bg-black/60 p-4">
                <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/40" />
                <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/40" />
                <div class="text-xs text-green-400/70 font-bold tracking-widest uppercase mb-3">{LANG.filters.title}</div>
                <div class="flex flex-wrap gap-2">
                  <For each={availableTags}>
                    {(tag) => {
                      const idx = availableTags.indexOf(tag) % TAG_COLORS.length;
                      const isActive = () => activeFilters().has(tag);
                      return (
                        <button
                          onClick={() => toggleFilter(tag)}
                          class={`text-xs px-2.5 py-1.5 border transition-all duration-200 tracking-wide ${isActive()
                            ? TAG_COLORS[idx].active + " bg-white/5"
                            : TAG_COLORS[idx].inactive + " bg-transparent hover:bg-white/5"
                            }`}
                          style={{ "font-family": "'Share Tech Mono', monospace" }}
                        >
                          {isActive() ? "◈ " : "◎ "}#{tag}
                        </button>
                      );
                    }}
                  </For>
                </div>
              </div>

            </div>

        </div>






      <div class="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex gap-6">

          {/* ── SIDEBAR SX ── */}
          <aside class="hidden lg:block w-72 flex-shrink-0">
            <div class="sticky top-4 space-y-4">

              {/* Filtri attivi / inattivi */}
              <Show
                when={activeFiltersMessage()}
                fallback={
                  <div class="relative border border-purple-800/40 bg-black/60 p-4">
                    <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-purple-500/40" />
                    <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-purple-500/40" />
                    <div class="flex items-center gap-3 mb-3">
                      <span class="text-xl text-purple-400/60">◎</span>
                      <div>
                        <div class="text-xs text-purple-300/60 font-bold tracking-widest uppercase">{LANG.filters.inactive.title}</div>
                        <div class="text-xs text-white/25 mt-0.5">{LANG.filters.inactive.subtitle}</div>
                      </div>
                    </div>
                    <div class="text-xs text-white/20 text-center py-2 border border-white/10 bg-black/40">
                      {LANG.filters.active.ghost}
                    </div>
                  </div>
                }
              >
                <div class="relative border border-pink-700/50 bg-black/60 p-4">
                  <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-pink-500/50" />
                  <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-pink-500/50" />
                  <div class="flex items-start gap-3 mb-3">
                    <span class="text-xl text-pink-400">◈</span>
                    <div class="flex-1">
                      <div class="text-xs text-pink-400 font-black tracking-widest uppercase mb-1">{LANG.filters.active.title}</div>
                      <div class="text-xs text-white/50">
                        {LANG.filters.active.viewing} <span class="text-cyan-400">{activeFiltersMessage()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={clearAllFilters}
                    class="w-full py-2 text-xs border border-pink-700/50 text-pink-400 bg-pink-900/20 hover:bg-pink-900/40 hover:border-pink-500/70 transition-all tracking-widest uppercase"
                  >
                    {LANG.filters.active.clear}
                  </button>
                </div>
              </Show>

              {/* Search */}
              <div class="relative border border-green-800/40 bg-black/60 p-4">
                <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/40" />
                <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/40" />
                <div class="text-xs text-green-400/70 font-bold tracking-widest uppercase mb-1">{LANG.search.title}</div>
                <div class="text-xs text-white/25 mb-3">{LANG.search.subtitle}</div>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 text-xs">▶</span>
                  <input
                    type="text"
                    placeholder={LANG.search.placeholder}
                    value={searchQuery()}
                    onInput={(e) => setSearchQuery(e.currentTarget.value)}
                    class="w-full pl-7 pr-4 py-2 text-sm bg-black/60 border border-green-900/50 text-green-300 placeholder-green-900/60 focus:outline-none focus:border-green-600/60 transition-colors"
                    style={{ "font-family": "'Share Tech Mono', monospace" }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div class="relative border border-green-800/40 bg-black/60 p-4">
                <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/40" />
                <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/40" />
                <div class="text-xs text-green-400/70 font-bold tracking-widest uppercase mb-3">{LANG.filters.title}</div>
                <div class="flex flex-wrap gap-2">
                  <For each={availableTags}>
                    {(tag) => {
                      const idx = availableTags.indexOf(tag) % TAG_COLORS.length;
                      const isActive = () => activeFilters().has(tag);
                      return (
                        <button
                          onClick={() => toggleFilter(tag)}
                          class={`text-xs px-2.5 py-1.5 border transition-all duration-200 tracking-wide ${isActive()
                            ? TAG_COLORS[idx].active + " bg-white/5"
                            : TAG_COLORS[idx].inactive + " bg-transparent hover:bg-white/5"
                            }`}
                          style={{ "font-family": "'Share Tech Mono', monospace" }}
                        >
                          {isActive() ? "◈ " : "◎ "}#{tag}
                        </button>
                      );
                    }}
                  </For>
                </div>
              </div>

            </div>
          </aside>

          {/* ── CENTRO ── */}
          <main class="flex-1 min-w-0">


            <Show
              when={!initialData.loading}
              fallback={
                <div class="text-center py-20">
                  <div class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <div class="text-sm text-green-700/60 tracking-widest">{LANG.page.loading}</div>
                </div>
              }
            >
              <Show
                when={!initialData.error}
                fallback={
                  <div class="text-center py-20">
                    <div class="text-sm text-pink-500/70 tracking-widest">{LANG.page.error}</div>
                  </div>
                }
              >
                <Show
                  when={filteredServers().length > 0}
                  fallback={
                    <div class="relative border border-yellow-800/40 bg-black/60 text-center py-16 px-8">
                      <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-yellow-500/40" />
                      <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-yellow-500/40" />
                      <div class="text-4xl text-yellow-400/60 mb-4">?</div>
                      <div class="text-lg text-yellow-400/80 mb-2 tracking-widest uppercase" style={{ "font-family": "'Orbitron', monospace" }}>
                        {LANG.results.notFound}
                      </div>
                      <div class="text-sm text-white/25 mb-6">{LANG.results.notFoundSub}</div>
                      <button
                        onClick={clearAllFilters}
                        class="px-8 py-3 border border-yellow-700/50 text-yellow-400/80 bg-yellow-900/20 hover:bg-yellow-900/40 transition-all text-sm tracking-widest uppercase"
                        style={{ "font-family": "'Share Tech Mono', monospace" }}
                      >
                        {LANG.results.clearFilters}
                      </button>
                    </div>
                  }
                >
                  <div class="grid grid-cols-1 gap-4">
                    <For each={filteredServers()}>
                      {(server) => <ServerCardHacking server={server} onVoteRequest={handleVoteRequest} />}
                    </For>
                  </div>

                  <Show when={isLoadingMore()}>
                    <div class="text-center py-10">
                      <div class="w-5 h-5 border border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <div class="text-sm text-green-800/50 tracking-widest">{LANG.results.loadingMore}</div>
                    </div>
                  </Show>

                  <Show when={!hasMore() && allServers().length > 0}>
                    <div class="text-center py-10 border-t border-green-900/20 mt-6">
                      <div
                        class="text-sm text-green-600/50 mb-1 tracking-widest uppercase"
                        style={{ "font-family": "'Orbitron', monospace" }}
                      >
                        {LANG.results.allLoaded}
                      </div>
                      <div class="text-xs text-white/20 tracking-widest">{LANG.results.allLoadedSub}</div>
                    </div>
                  </Show>
                </Show>
              </Show>
            </Show>
          </main>

          {/* ── SIDEBAR DX ── */}
          <aside class="hidden lg:block w-72 flex-shrink-0 space-y-4">
            {/* <TopFiveServerCard /> */}

            <div class="sticky top-4">
              <div class="relative border border-purple-800/40 bg-black/60 p-4">
                <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-purple-500/40" />
                <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-purple-500/40" />
                <div class="text-xs text-purple-400/70 font-bold tracking-widest uppercase mb-3">{LANG.quick.title}</div>
                <Show when={auth.isAuthenticated()}>
                  <A
                    href="/servers/add"
                    class="block w-full py-2.5 text-xs text-center border border-green-700/50 text-green-400/80 bg-green-900/20 hover:bg-green-900/40 hover:border-green-500/60 transition-all tracking-widest uppercase mb-2"
                    style={{ "font-family": "'Share Tech Mono', monospace" }}
                  >
                    {LANG.quick.add}
                  </A>
                </Show>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  class="w-full py-2.5 text-xs border border-purple-700/50 text-purple-400/80 bg-purple-900/20 hover:bg-purple-900/40 hover:border-purple-500/60 transition-all tracking-widest uppercase"
                  style={{ "font-family": "'Share Tech Mono', monospace" }}
                >
                  {LANG.quick.scrollTop}
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* Modals & Notifications */}
      <PlayersVoteModal
        isOpen={isModalOpen()}
        onClose={() => setIsModalOpen(false)}
        server_id={selectedServer()?.id || 0}
        discord_id_user={discord_id_user}
        server_secret_key={selectedServer()?.secret_key || ""}
        server_name={selectedServer()?.name || ""}
        server_ip={selectedServer()?.ip || ""}
        player_game_name={playerGameName() ?? ""}
        onPlayerNameChange={() => setPlayerGameName("")}
        onPlayerVote={handlePlayerVote}
      />
      <Notifications />

      {/* Scroll top FAB */}
      <Show when={scrollY() > 500}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          class="fixed bottom-8 right-8 z-50 w-12 h-12 border border-pink-700/60 bg-black text-pink-400 hover:border-pink-500 hover:text-pink-300 hover:shadow-lg hover:shadow-pink-900/30 transition-all flex items-center justify-center text-lg"
          style={{ "font-family": "'Share Tech Mono', monospace" }}
        >
          ↑
        </button>
      </Show>
    </section>
  );
};

export default ServersPage;
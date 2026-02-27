import { Component, createSignal, For, Show, createResource } from "solid-js";
import { A } from "@solidjs/router";
import { ServerService } from "../services/server.service";
import { ServerResponse } from "../types/ServerResponse";

const LANG = {
  hero: {
    title: "LEADERBOARD",
    subtitle: "SCALA LA RETE. DOMINA IL SISTEMA.",
    tag: "// CLASSIFICHE IN TEMPO REALE",
  },
  notFound: {
    title: "NESSUN SEGNALE TROVATO",
    sub: "Modifica i parametri di ricerca",
  },
  trend: { up: "▲", down: "▼", same: "—" },
  loading: "◎ INIZIALIZZAZIONE SISTEMA...",
};

// Medaglie top 3
const RANK_COLORS: Record<number, { border: string; text: string; glow: string; medal: string }> = {
  0: { border: "border-yellow-500/60", text: "text-yellow-400", glow: "rgba(234,179,8,0.15)", medal: "◈" },
  1: { border: "border-zinc-400/50", text: "text-zinc-300", glow: "rgba(161,161,170,0.1)", medal: "◈" },
  2: { border: "border-orange-700/50", text: "text-orange-500", glow: "rgba(194,65,12,0.1)", medal: "◈" },
};

const LeaderboardPage: Component = () => {
  const [allServers, setAllServers] = createSignal<ServerResponse[]>([]);
  const [searchQuery, setSearchQuery] = createSignal("");

  const [initialData] = createResource(async () => {
    try {
      const result = await ServerService.getServerParams({ page: 1, limit: 100, sort: "voti_totali:desc" });
      setAllServers(result.data);
      return result;
    } catch (error) {
      console.error("Errore caricamento server:", error);
      throw error;
    }
  });

  const filtered = () =>
    allServers().filter((s) =>
      s.name?.toLowerCase().includes(searchQuery().toLowerCase()) ||
      s.ip?.toLowerCase().includes(searchQuery().toLowerCase())
    );

  return (
    <div
      class="min-h-screen text-white"
      style={{
        background: "linear-gradient(160deg, #000300 0%, #000a02 40%, #000500 100%)",
        "font-family": "'Share Tech Mono', monospace",
      }}
    >
      {/* Grid bg */}
      <div
        class="fixed inset-0 pointer-events-none"
        style={{
          "z-index": "0",
          "background-image": `
            linear-gradient(rgba(0,255,65,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,65,0.025) 1px, transparent 1px)
          `,
          "background-size": "40px 40px",
        }}
      />
      {/* Scanlines */}
      <div
        class="fixed inset-0 pointer-events-none"
        style={{
          "z-index": "1",
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.008) 3px, rgba(0,255,65,0.008) 4px)",
        }}
      />

      {/* ── HERO ── */}
      <div class="relative overflow-hidden border-b border-green-900/30 py-16 px-6 text-center">
        <div
          class="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(0,255,65,0.07) 0%, transparent 70%)" }}
        />
        {/* Glow centrale */}
        <div
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(0,255,65,0.05) 0%, transparent 70%)" }}
        />

        <div class="relative z-10 max-w-3xl mx-auto">
          <div class="flex items-center justify-center gap-2 mb-4">
            <div class="h-px w-16 bg-green-800/50" />
            <span class="text-green-700/60 text-xs tracking-[0.3em] uppercase">
              {LANG.hero.tag} <span class="animate-pulse text-green-500">_</span>
            </span>
            <div class="h-px w-16 bg-green-800/50" />
          </div>

          <h1
            class="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-none mb-3"
            style={{
              "font-family": "'Orbitron', monospace",
              "text-shadow": "0 0 60px rgba(0,255,65,0.2)",
            }}
          >
            {LANG.hero.title}
          </h1>

          <p class="text-sm text-green-700/50 tracking-[0.3em] uppercase mt-3">
            {LANG.hero.subtitle}
          </p>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Search + count bar */}
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          {/* Search */}
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 text-xs">▶</span>
            <input
              type="text"
              placeholder="◈ CERCA NELLA RETE..."
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              class="w-full pl-7 pr-4 py-2.5 text-sm bg-black/60 border border-green-900/50 text-green-300 placeholder-green-900/50 focus:outline-none focus:border-green-600/60 transition-colors"
              style={{ "font-family": "'Share Tech Mono', monospace" }}
            />
          </div>

          {/* Count */}
          <div class="relative border border-green-800/40 bg-black/60 px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
            <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-green-500/40 pointer-events-none" />
            <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-green-500/40 pointer-events-none" />
            <span class="text-white/30 text-xs">TOTALE</span>
            <span class="text-green-400 font-bold text-sm">{filtered().length}</span>
            <span class="text-white/30 text-xs">SERVER</span>
            <span class="text-pink-400 animate-pulse text-xs ml-1">◈ LIVE</span>
          </div>
        </div>

        {/* Loading */}
        <Show when={initialData.loading}>
          <div class="text-center py-20">
            <div class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div class="text-xs text-green-700/50 tracking-widest animate-pulse">{LANG.loading}</div>
          </div>
        </Show>

        {/* Error */}
        <Show when={initialData.error}>
          <div class="text-center py-20 text-red-500/60 text-sm tracking-widest">
            ⚠ ERRORE_CONNESSIONE // RIPROVA
          </div>
        </Show>

        {/* Content */}
        <Show when={!initialData.loading && !initialData.error}>
          <Show
            when={filtered().length >0}
            fallback={
              <div class="relative border border-yellow-800/40 bg-black/60 text-center py-16 px-8">
                <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-yellow-600/40 pointer-events-none" />
                <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-yellow-600/40 pointer-events-none" />
                <div class="text-4xl text-yellow-500/40 mb-4">?</div>
                <div class="text-base text-yellow-500/70 tracking-widest uppercase mb-2" style={{ "font-family": "'Orbitron', monospace" }}>
                  {LANG.notFound.title}
                </div>
                <div class="text-xs text-white/25 tracking-widest">{LANG.notFound.sub}</div>
              </div>
            }
          >
            {/* ── PODIUM TOP 3 ── */}
            <Show when={filtered().length >= 3 && searchQuery() === ""}>
              <div class="grid grid-cols-3 gap-4 mb-10">
                {[1, 0, 2].map((rankIdx) => {
                  const server = filtered()[rankIdx];
                  const colors = RANK_COLORS[rankIdx];
                  const isFirst = rankIdx === 0;
                  return (
                    <div
                      class={`relative border ${colors.border} bg-black/70 p-4 text-center flex flex-col items-center gap-2 transition-all ${isFirst ? "py-6" : ""}`}
                      style={{ "box-shadow": `0 0 25px ${colors.glow}` }}
                    >
                      <div class="absolute top-0 left-0 w-3 h-3 border-t border-l pointer-events-none" style={{ "border-color": colors.glow.replace("0.15", "0.5").replace("0.1", "0.4") }} />
                      <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r pointer-events-none" style={{ "border-color": colors.glow.replace("0.15", "0.5").replace("0.1", "0.4") }} />

                      <span class={`text-xs tracking-widest ${colors.text} font-bold`}>
                        {colors.medal} #{rankIdx + 1}
                      </span>
                      <div
                        class="text-sm font-black text-white truncate w-full"
                        style={{ "font-family": "'Orbitron', monospace" }}
                      >
                        {server?.name}
                      </div>
                      <div class={`text-lg font-black ${colors.text}`}>
                        {server?.voti_totali ?? 0}
                        <span class="text-xs ml-1 opacity-60">VOTI</span>
                      </div>
                      <A
                        href={`/server/${server?.id}`}
                        class={`text-xs px-3 py-1.5 border ${colors.border} ${colors.text} hover:bg-white/5 transition-all tracking-widest uppercase w-full text-center`}
                      >
                        ENTRA →
                      </A>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div class="flex items-center gap-3 mb-6">
                <div class="h-px flex-1 bg-gradient-to-r from-transparent to-green-900/30" />
                <span class="text-green-800/50 text-xs tracking-widest">// RANK_4_AND_BELOW</span>
                <div class="h-px flex-1 bg-gradient-to-l from-transparent to-green-900/30" />
              </div>
            </Show>

            {/* ── TABLE ── */}
            <div class="relative border border-green-900/30 bg-black/40">
              <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/30 pointer-events-none" />
              <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/30 pointer-events-none" />

              {/* Table header */}
              <div class="grid grid-cols-12 gap-2 px-4 py-2 border-b border-green-900/30 text-green-800/50 text-xs tracking-widest uppercase">
                <div class="col-span-1">POS</div>
                <div class="col-span-5">SERVER</div>
                <div class="col-span-3">IP</div>
                <div class="col-span-1 text-right">VOTI</div>
                <div class="col-span-2 text-right">AZIONI</div>
              </div>

              {/* Rows */}
              <For each={searchQuery() !== "" ? filtered() : filtered().slice(3)}>
                {(server, i) => {
                  const absRank = searchQuery() !== "" ? i() : i() + 3;
                  const isTop = absRank < 3;
                  const colors = isTop ? RANK_COLORS[absRank] : null;

                  return (
                    <div
                      class={`grid grid-cols-12 gap-2 px-4 py-3 border-b border-green-900/20 items-center hover:bg-green-900/5 transition-colors ${isTop ? "bg-black/20" : ""}`}
                    >
                      {/* Rank */}
                      <div class={`col-span-1 text-sm font-bold ${colors ? colors.text : "text-green-700/50"}`}>
                        #{absRank + 1}
                      </div>

                      {/* Name */}
                      <div class="col-span-5 flex items-center gap-2 min-w-0">
                        <span class="text-green-600/40 text-xs">▶</span>
                        <span
                          class="text-white text-sm font-bold truncate"
                          style={{ "font-family": absRank < 3 ? "'Orbitron', monospace" : "inherit" }}
                        >
                          {server.name}
                        </span>
                      </div>

                      {/* IP */}
                      <div class="col-span-3 text-green-800/50 text-xs truncate font-mono">
                        {server.ip}
                      </div>

                      {/* Voti */}
                      <div class={`col-span-1 text-right text-sm font-bold ${colors ? colors.text : "text-green-400/70"}`}>
                        {server.voti_totali ?? 0}
                      </div>

                      {/* Actions */}
                      <div class="col-span-2 flex items-center justify-end gap-1.5">
                        <A
                          href={`/server/${server.id}`}
                          class="text-xs px-2 py-1 border border-green-800/40 text-green-600/70 hover:border-green-600/60 hover:text-green-400 transition-all tracking-widest uppercase"
                        >
                          ENTRA
                        </A>
                      </div>
                    </div>
                  );
                }}
              </For>

              {/* Footer */}
              <div class="px-4 py-2 text-xs text-green-900/40 tracking-widest text-center">
                ◈ {filtered().length} SERVER IN CLASSIFICA // AGGIORNAMENTO IN TEMPO REALE
              </div>
            </div>

          </Show>
        </Show>
      </div>
    </div>
  );
};

export default LeaderboardPage;
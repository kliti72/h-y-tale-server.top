import { Component, createSignal, For, Show, createMemo, onMount, onCleanup } from "solid-js";
import { createResource } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../auth/AuthContext";
import { ServerService } from "../services/server.service";
import { VoteService } from "../services/votes.service";
import { ServerResponse } from "../types/ServerResponse";
import GameServerCardComponent from "../component/card/GameServerCardComponent";
import PlayersVoteModal from "../component/modal/PlayersVoteModal";
import Notifications, { notify, requireDiscordLogin } from "../component/notify/NotificationComponent";

const TAGS = ["PvP", "Survival", "MiniGames", "Creative", "Roleplay", "Skyblock", "Factions", "Anarchy"];
const ITEMS = 12;
const RUNES = ["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ","ᛁ","ᛃ","ᛇ","ᛈ","ᛉ","ᛊ","ᛏ","ᛒ","ᛖ","ᛗ","ᛚ","ᛜ","ᛞ","ᛟ"];

// ── floating rune background ──────────────────────────────────────────────────
const RuneField = () => {
  const runes = Array.from({ length: 20 }, (_, i) => ({
    char: RUNES[i % RUNES.length],
    top: `${(i * 94.3 + 17) % 90 + 4}%`,
    left: `${(i * 137.7 + 31) % 94 + 2}%`,
    opacity: 0.025 + (i % 4) * 0.012,
    size: 16 + (i % 5) * 8,
    rotate: (i * 47) % 360,
  }));
  return (
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {runes.map(r => (
        <span class="absolute font-serif text-amber-500 select-none" style={{
          top: r.top, left: r.left, opacity: r.opacity,
          "font-size": `${r.size}px`, transform: `rotate(${r.rotate}deg)`,
        }}>{r.char}</span>
      ))}
    </div>
  );
};

// ── widget shell ──────────────────────────────────────────────────────────────
const Widget: Component<{ label: string; icon: string; children: any }> = (p) => (
  <div class="relative bg-stone-900 border border-stone-700">
    <span class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-700/70 pointer-events-none" />
    <span class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-700/70 pointer-events-none" />
    <span class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-700/70 pointer-events-none" />
    <span class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-700/70 pointer-events-none" />
    <div class="flex items-center gap-2 px-4 py-2.5 bg-stone-950/50 border-b border-stone-700/60">
      <span class="text-base leading-none">{p.icon}</span>
      <span class="font-serif text-[11px] uppercase tracking-[0.2em] text-amber-600">{p.label}</span>
    </div>
    <div class="p-4">{p.children}</div>
  </div>
);

// ── sidebar shared component ──────────────────────────────────────────────────
const SidebarContent: Component<{
  search: string; onSearch: (v: string) => void;
  filters: Set<string>; onToggle: (t: string) => void;
  sortBy: string; onSort: (v: "votes"|"recent"|"players") => void;
  activeCount: number; onClear: () => void;
  isAuth: boolean;
}> = (p) => (
  <div class="space-y-3">
    <Widget label="Cerca server" icon="">
      <input
        type="text" placeholder="Nome o IP..."
        value={p.search} onInput={e => p.onSearch(e.currentTarget.value)}
        class="w-full px-3 py-2.5 bg-stone-950 border border-stone-700 focus:border-amber-700 text-stone-300 font-serif text-sm outline-none transition-colors placeholder:text-stone-600"
      />
    </Widget>

    <Widget label="Modalità di gioco" icon="⚔️">
      <div class="flex flex-wrap gap-1.5">
        <For each={TAGS}>{tag => (
          <button
            onClick={() => p.onToggle(tag)}
            class={`px-2.5 py-1.5 text-xs font-serif border transition-all
              ${p.filters.has(tag)
                ? "border-amber-700 bg-amber-950/60 text-amber-300"
                : "border-stone-700 text-stone-500 hover:border-stone-600 hover:text-stone-300 hover:bg-stone-800/50"}`}
          >{tag}</button>
        )}</For>
      </div>
      <Show when={p.activeCount > 0}>
        <button
          onClick={p.onClear}
          class="mt-3 w-full py-1.5 border border-red-900/50 text-red-700 hover:text-red-500 hover:bg-red-950/20 font-serif text-xs uppercase tracking-wider transition-all"
        >✕ Rimuovi filtri ({p.activeCount})</button>
      </Show>
    </Widget>

    <Widget label="Ordina per" icon="👑">
      <div class="flex flex-col gap-1">
        {(["votes", "recent", "players"] as const).map(opt => (
          <button
            onClick={() => p.onSort(opt)}
            class={`py-2.5 px-3 text-sm font-serif border text-left flex items-center gap-2.5 transition-all
              ${p.sortBy === opt
                ? "border-amber-800/60 bg-amber-950/40 text-amber-400"
                : "border-transparent text-stone-500 hover:bg-stone-800/50 hover:text-stone-300"}`}
          >
            <span>{opt === "votes" ? "⚔" : opt === "recent" ? "📜" : "👥"}</span>
            {opt === "votes" ? "Più votati" : opt === "recent" ? "Più recenti" : "Più giocatori"}
            <Show when={p.sortBy === opt}>
              <span class="ml-auto text-amber-700 text-xs">✦</span>
            </Show>
          </button>
        ))}
      </div>
    </Widget>

    <Show when={p.isAuth}>
      <A href="/servers/add"
        class="flex items-center justify-center gap-2 w-full py-3 border border-amber-800/60 bg-gradient-to-r from-amber-950/40 to-stone-900 text-amber-500 hover:text-amber-300 hover:border-amber-600 font-serif text-xs uppercase tracking-[0.18em] transition-all"
      >✦ Aggiungi il tuo server ✦</A>
    </Show>
  </div>
);

// ── PAGE ──────────────────────────────────────────────────────────────────────
const ServerListPage: Component = () => {
  const auth = useAuth();
  const [allServers, setAllServers] = createSignal<ServerResponse[]>([]);
  const [page, setPage] = createSignal(1);
  const [hasMore, setHasMore] = createSignal(true);
  const [loadingMore, setLoadingMore] = createSignal(false);
  const [search, setSearch] = createSignal("");
  const [filters, setFilters] = createSignal<Set<string>>(new Set());
  const [sortBy, setSortBy] = createSignal<"votes"|"recent"|"players">("votes");
  const [scrollY, setScrollY] = createSignal(0);
  const [modalOpen, setModalOpen] = createSignal(false);
  const [selectedServer, setSelectedServer] = createSignal<ServerResponse | null>(null);
  const [playerName, setPlayerName] = createSignal("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = createSignal(false);

  const [initialData] = createResource(async () => {
    const result = await ServerService.getServerParams({ page: 1, limit: ITEMS, sort: sortBy() });
    setAllServers(result.data);
    setHasMore(result.data.length >= ITEMS);
    return result;
  });

  const loadMore = async () => {
    if (loadingMore() || !hasMore()) return;
    setLoadingMore(true);
    try {
      const next = page() + 1;
      const r = await ServerService.getServerParams({ page: next, limit: ITEMS, sort: sortBy() });
      if (r.data.length > 0) { setAllServers(p => [...p, ...r.data]); setPage(next); setHasMore(r.data.length >= ITEMS); }
      else setHasMore(false);
    } catch { notify("Errore caricamento", "error"); }
    finally { setLoadingMore(false); }
  };

  onMount(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 600) loadMore();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  const toggleFilter = (tag: string) => setFilters(prev => {
    const s = new Set(prev); s.has(tag) ? s.delete(tag) : s.add(tag); return s;
  });
  const clearFilters = () => { setFilters(new Set<string>()); setSearch(""); };

  const filtered = createMemo(() => {
    let r = allServers();
    if (filters().size > 0) r = r.filter(s => Array.from(filters()).some(t => ((s as any).tags ?? []).includes(t)));
    const q = search().toLowerCase().trim();
    if (q) r = r.filter(s => s.name?.toLowerCase().includes(q) || s.ip?.toLowerCase().includes(q));
    if (sortBy() === "votes") r = [...r].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
    else if (sortBy() === "recent") r = [...r].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
    return r;
  });

  const activeCount = () => filters().size + (search() ? 1 : 0);

  const handleVote = (server: ServerResponse) => {
    if (!auth.isAuthenticated()) { requireDiscordLogin(); return; }
    setSelectedServer(server); setModalOpen(true);
  };
  const handlePlayerVote = () => {
    VoteService.addVote(auth.user()?.id ?? "", selectedServer()?.id ?? 0, playerName());
    notify(`Voto registrato per ${selectedServer()?.name}!`, "success");
    setModalOpen(false);
  };

  const sidebarProps = () => ({
    search: search(), onSearch: setSearch,
    filters: filters(), onToggle: toggleFilter,
    sortBy: sortBy(), onSort: setSortBy,
    activeCount: activeCount(), onClear: clearFilters,
    isAuth: auth.isAuthenticated(),
  });

  return (
    <div class="relative min-h-screen bg-stone-950 overflow-x-hidden">
      <RuneField />

      {/* ── Hero band ─────────────────────────────────────────── */}
      <div class="relative z-10 border-b-2 border-stone-800 bg-gradient-to-b from-stone-900/70 to-transparent">
        {/* rune strip */}
        <div class="h-7 flex items-center justify-center gap-5 border-b border-stone-800/60 bg-stone-950/60 overflow-hidden">
          {RUNES.slice(0, 14).map(r => (
            <span class="text-amber-900/50 font-serif text-xs select-none">{r}</span>
          ))}
        </div>

        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="h-px w-10 bg-gradient-to-r from-transparent to-amber-800/60" />
              <span class="text-amber-700 font-serif text-xs uppercase tracking-[0.25em]">Registro dei server</span>
              <div class="h-px w-10 bg-gradient-to-l from-transparent to-amber-800/60" />
            </div>
            <h1 class="font-serif font-black text-3xl sm:text-4xl text-stone-100 tracking-wide">
              Server <span class="text-amber-500 drop-shadow-[0_0_12px_rgba(200,140,20,0.4)]">H-YTale</span>
            </h1>
            <p class="text-stone-500 font-serif text-sm mt-2 flex flex-wrap items-center gap-2">
              <Show when={filtered().length > 0} fallback={<span>Nessun server trovato</span>}>
                <span class="text-amber-800/70 text-base">⚔</span>
                <span>{filtered().length} server nel registro</span>
              </Show>
              <Show when={activeCount() > 0}>
                <span class="text-stone-700">·</span>
                <span class="text-amber-700/80">{activeCount()} filtri attivi</span>
              </Show>
            </p>
          </div>

          {/* mobile filter toggle */}
          <button
            class="lg:hidden flex items-center gap-2 px-5 py-2.5 border border-stone-700 hover:border-amber-800/60 bg-stone-900 text-stone-400 hover:text-amber-400 font-serif text-xs uppercase tracking-widest transition-all"
            onClick={() => setMobileFiltersOpen(v => !v)}
          >
            {mobileFiltersOpen() ? "✕ Chiudi" : `⚙️ Filtri${activeCount() > 0 ? ` · ${activeCount()}` : ""}`}
          </button>
        </div>
      </div>

      {/* ── Mobile filter drawer ───────────────────────────────── */}
      <Show when={mobileFiltersOpen()}>
        <div class="lg:hidden relative z-10 border-b-2 border-amber-900/30 bg-stone-950/98 px-4 py-5">
          <SidebarContent {...sidebarProps()} />
        </div>
      </Show>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div class="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
        <div class="flex gap-0">

          {/* ── Desktop sidebar ── */}
          <aside class="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0">
            <div class="sticky top-20 space-y-4">
              <div class="flex items-center gap-2">
                <div class="h-px flex-1 bg-gradient-to-r from-transparent to-amber-900/40" />
                <span class="text-amber-900/50 font-serif text-xs select-none">✦ ᚠ ᚢ ᚦ ✦</span>
                <div class="h-px flex-1 bg-gradient-to-l from-transparent to-amber-900/40" />
              </div>
              <SidebarContent {...sidebarProps()} />
              <div class="pt-1 text-center select-none">
                <span class="text-stone-800 font-serif text-2xl tracking-[0.4em]">ᛃ ᛇ ᛈ ᛉ</span>
              </div>
            </div>
          </aside>

          {/* ── Vertical divider ── */}
          <div class="hidden lg:block w-px mx-8 bg-gradient-to-b from-transparent via-amber-900/35 to-transparent flex-shrink-0" />

          {/* ── Cards ── */}
          <main class="flex-1 min-w-0">
            <div class="flex items-center gap-4 mb-6">
              <span class="font-serif text-[11px] uppercase tracking-[0.22em] text-amber-800/70 whitespace-nowrap">
                Taverna dei guerrieri
              </span>
              <div class="flex-1 h-px bg-gradient-to-r from-amber-900/35 to-transparent" />
              <span class="text-amber-900/35 font-serif text-xs select-none">ᛞ ᛟ</span>
            </div>

            <Show when={!initialData.loading} fallback={
              <div class="flex flex-col items-center justify-center py-40 gap-5 text-amber-800 font-serif">
                <div class="w-10 h-10 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
                <span class="text-sm uppercase tracking-[0.2em]">Caricamento taverna...</span>
                <span class="text-amber-900/50 text-xl tracking-widest select-none">ᚠ ᚢ ᚦ ᚨ</span>
              </div>
            }>
              <Show when={!initialData.error} fallback={
                <div class="text-center py-32 border border-stone-800 bg-stone-900/30">
                  <p class="text-4xl mb-3">⚠️</p>
                  <p class="text-red-700 font-serif text-lg">Errore di sistema</p>
                  <p class="text-stone-600 font-serif text-sm mt-1">Riprova più tardi</p>
                </div>
              }>
                <Show when={filtered().length > 0} fallback={
                  <div class="relative text-center py-32 border border-stone-800 bg-stone-900/20 overflow-hidden">
                    <span class="absolute top-4 left-4 text-stone-800/30 font-serif text-5xl select-none">ᛒ</span>
                    <span class="absolute bottom-4 right-4 text-stone-800/30 font-serif text-5xl select-none">ᛖ</span>
                    <p class="text-5xl mb-4">🏰</p>
                    <p class="text-stone-300 font-serif text-xl mb-2">Nessun server trovato</p>
                    <p class="text-stone-600 font-serif text-sm mb-6">Modifica i filtri di ricerca</p>
                    <button onClick={clearFilters}
                      class="px-8 py-2.5 border border-amber-900/60 text-amber-700 hover:text-amber-400 hover:border-amber-700 font-serif text-sm uppercase tracking-widest transition-all">
                      Reset ricerca
                    </button>
                  </div>
                }>
                  <div class="grid grid-cols-1 xl:grid-cols-1 gap-3">
                    <For each={filtered()}>
                      {server => (
                        <div class="w-full">
                          <GameServerCardComponent server={server} onVoteRequest={handleVote} />
                        </div>
                      )}
                    </For>
                  </div>

                  <Show when={loadingMore()}>
                    <div class="flex flex-col items-center py-10 gap-3">
                      <div class="w-7 h-7 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
                      <span class="text-xs font-serif text-stone-600 uppercase tracking-wider">Carico altri...</span>
                    </div>
                  </Show>

                  <Show when={!hasMore() && allServers().length > 0}>
                    <div class="mt-10 pt-6 border-t border-stone-800/60 flex items-center gap-5">
                      <div class="flex-1 h-px bg-gradient-to-r from-transparent via-amber-900/30 to-transparent" />
                      <div class="text-center">
                        <p class="text-stone-600 font-serif text-xs uppercase tracking-[0.2em]">Fine del registro</p>
                        <p class="text-amber-900/40 font-serif text-base mt-1 tracking-widest select-none">✦ ᚠ ᛟ ✦</p>
                      </div>
                      <div class="flex-1 h-px bg-gradient-to-r from-transparent via-amber-900/30 to-transparent" />
                    </div>
                  </Show>
                </Show>
              </Show>
            </Show>
          </main>
        </div>
      </div>

      {/* ── FAB ── */}
      <Show when={scrollY() > 500}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          class="fixed bottom-8 right-6 z-50 w-11 h-11 border border-amber-800/60 bg-stone-900/95 text-amber-500 hover:text-amber-300 hover:border-amber-600 transition-all flex items-center justify-center font-serif text-lg shadow-2xl shadow-black/60"
        >↑</button>
      </Show>

      <PlayersVoteModal
        isOpen={modalOpen()} onClose={() => setModalOpen(false)}
        server_id={selectedServer()?.id || 0}
        discord_id_user={auth.user()?.id ?? ""}
        server_secret_key={selectedServer()?.secret_key || ""}
        server_name={selectedServer()?.name || ""}
        server_ip={selectedServer()?.ip || ""}
        player_game_name={playerName()}
        onPlayerNameChange={() => setPlayerName("")}
        onPlayerVote={handlePlayerVote}
      />
      <Notifications />
    </div>
  );
};

export default ServerListPage;
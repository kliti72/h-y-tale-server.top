// src/pages/ServerBoard.tsx
import { Component, createSignal, For, Show, createMemo, onMount, onCleanup } from "solid-js";
import { createResource } from "solid-js";
import GamingCard from "../component/card/ServerCard/GamingCard";
import PlayersVoteModal from "../component/modal/PlayersVoteModal";
import { ServerService } from "../services/server.service";
import Notifications, { notify, requireDiscordLogin } from "../component/template/Notification";
import { ServerResponse } from "../types/ServerResponse";
import { VoteService } from "../services/votes.service";
import { useAuth } from "../auth/AuthContext";
import { A } from "@solidjs/router";
import TopFixe from "../component/card/TopFive";
import TopFiveCard from "../component/card/TopFive";
import TopFiveServerCard from "../component/card/widget/TopFiveServerCard";
import TopFiveForumCard from "../component/card/widget/TopFiveForumCard";

const ServerBoard: Component = () => {
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
  const [viewMode, setViewMode] = createSignal<"grid" | "list">("grid");
  const [totalVotesToday, setTotalVotesToday] = createSignal(0);
  const [onlinePlayers, setOnlinePlayers] = createSignal(0);
  const [trendingServers, setTrendingServers] = createSignal(0);
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
      console.error("Errore caricamento più server:", error);
      notify("Errore nel caricamento fra!", "error");
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

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    const animateCounters = () => {
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        setTotalVotesToday(Math.min(count * 47, 2384));
        setOnlinePlayers(Math.min(count * 23, 1456));
        setTrendingServers(Math.min(count * 2, 127));
        if (count >= 100) clearInterval(interval);
      }, 20);
    };
    setTimeout(animateCounters, 300);
    onCleanup(() => window.removeEventListener('scroll', handleScroll));
  });

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

  const availableTags = [
    "PvP", "Survival", "MiniGames", "Creative", "Roleplay", "Skyblock",
    "Factions", "Anarchy"
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
          } catch {
            return false;
          }
        })()
      );
    }
    const sort = sortBy();
    if (sort === "votes") {
      result = [...result].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
    } else if (sort === "recent") {
      result = [...result].sort((a, b) =>
        new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
      );
    } else if (sort === "players") {
      result = [...result].sort((a, b) =>
        ((b as any).online_players ?? 0) - ((a as any).online_players ?? 0)
      );
    }
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
    if (filters.length > 0) {
      const filterText = filters.length === 1 ? `"${filters[0]}"` : `${filters.length} modalità`;
      parts.push(filterText);
    }
    if (query) parts.push(`"${query}"`);
    return parts.join(' e ');
  });

  const recentForumPosts = [
    { title: "Miglior server PvP 2026?", author: "DarkKnight", replies: 42, time: "2h fa", hot: true },
    { title: "Come configurare il VotePlugin?", author: "AdminHytale", replies: 18, time: "4h fa", hot: false },
    { title: "Server italiani cercasi", author: "Italiano1990", replies: 31, time: "ieri", hot: true },
  ];

  const communityStats = [
    { label: "Voti Oggi", value: totalVotesToday, icon: "🔥", color: "from-orange-500 to-red-500" },
    { label: "Player Online", value: onlinePlayers, icon: "👥", color: "from-blue-500 to-cyan-500" },
    { label: "Server Trending", value: trendingServers, icon: "📈", color: "from-purple-500 to-pink-500" }
  ];

  return (
    <section class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white">
      {/* Hero */}
      <div class="relative overflow-hidden">
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
          <div class="absolute w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse" />
        </div>
        <div class="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 class="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Top Server Minecraft
          </h1>
          <p class="text-xl md:text-2xl text-violet-300 max-w-3xl mx-auto mb-8">
            Scopri, vota e domina i regni più epici 🎮✨
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <For each={communityStats}>
              {(stat) => (
                <div class={`bg-gradient-to-br ${stat.color} p-1 rounded-2xl`}>
                  <div class="bg-gray-900/90 rounded-2xl p-6">
                    <div class="text-4xl mb-2">{stat.icon}</div>
                    <div class="text-3xl font-black mb-1">{stat.value().toLocaleString()}</div>
                    <div class="text-sm text-gray-300">{stat.label}</div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>

      {/* Layout con sticky */}
      <div class="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex gap-8">

          {/* SIDEBAR SX - STICKY */}
          <aside class="hidden lg:block w-80 flex-shrink-0">
            <div style="position: sticky; top: 1.5rem;">

              {/* Active Filters */}
              <Show when={activeFiltersMessage()}>
                <div class="bg-fuchsia-600/20 border-2 border-fuchsia-500/60 rounded-2xl p-4 mb-6 ">
                  <div class="flex items-start gap-3 mb-3">
                    <span class="text-3xl">🎯</span>
                    <div class="flex-1">
                      <h4 class="font-bold mb-1">Filtri Attivi</h4>
                      <p class="text-sm text-fuchsia-200">
                        Stai guardando: <span class="font-bold">{activeFiltersMessage()}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearAllFilters}
                    class="w-full px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-lg font-semibold text-sm"
                  >
                    ✕ Cancella filtri
                  </button>
                </div>
              </Show>

              {/* Ricerca */}
              <div class="bg-gray-900/90 rounded-2xl p-6 border border-violet-900/50 mb-6">
                <h3 class="text-xl font-bold text-fuchsia-400 mb-4">🔍 Ricerca</h3>
                <input
                  type="text"
                  placeholder="Nome, IP, modalità..."
                  value={searchQuery()}
                  onInput={(e) => setSearchQuery(e.currentTarget.value)}
                  class="w-full px-4 py-3 bg-gray-950/80 border border-violet-700/50 rounded-xl text-white placeholder-violet-400"
                />
              </div>

              {/* Sort */}
              <div class="bg-gray-900/90 rounded-2xl p-6 border border-violet-900/50 mb-6">
                <label class="block text-sm text-violet-300 font-medium mb-2">📊 Ordina:</label>
                <select
                  value={sortBy()}
                  onChange={(e) => setSortBy(e.currentTarget.value as any)}
                  class="w-full px-4 py-3 bg-gray-950/80 border border-violet-700/50 rounded-lg text-white"
                >
                  <option value="votes">🔥 Più Votati</option>
                  <option value="recent">🆕 Più Recenti</option>
                  <option value="players">👥 Più Player</option>
                </select>
              </div>

              {/* Tags */}
              <div class="bg-gray-900/90 rounded-2xl p-6 border border-violet-900/50 mb-6">
                <h3 class="text-xl font-bold text-fuchsia-400 mb-4">🏷️ Modalità</h3>
                <div class="flex flex-wrap gap-2">
                  <For each={availableTags}>
                    {(tag) => {
                      const active = activeFilters().has(tag);
                      const colors = ["from-fuchsia-600 to-purple-600", "from-cyan-600 to-blue-600", "from-pink-600 to-rose-600", "from-orange-600 to-red-600", "from-green-600 to-emerald-600"];
                      const color = colors[availableTags.indexOf(tag) % colors.length];
                      return (
                        <button
                          onClick={() => toggleFilter(tag)}
                          class={`px-3 py-1.5 rounded-full text-xs font-medium ${active
                              ? `bg-gradient-to-r ${color} text-white border-2 border-white/30`
                              : "bg-violet-950/70 text-violet-200 border border-violet-700/60"
                            }`}
                        >
                          {active && "✓ "}#{tag}
                        </button>
                      );
                    }}
                  </For>
                </div>
              </div>

              {/* Quick Actions */}
              <div class="bg-gray-900/90 rounded-2xl p-6 border border-violet-900/50">
                <h3 class="text-xl font-bold text-fuchsia-400 mb-4">⚡ Quick</h3>
                <Show when={auth.isAuthenticated()}>
                  <A href="/servers/add" class="block w-full py-3 px-4 text-center bg-green-600/20 border border-green-500/50 rounded-lg mb-3">
                    ➕ Aggiungi Server
                  </A>
                </Show>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} class="w-full py-3 px-4 text-center bg-violet-600/20 border border-violet-500/50 rounded-lg">
                  ⬆️ Torna su
                </button>
              </div>
            </div>
          </aside>

          {/* CENTRO - LISTA SERVER */}
          <main class="flex-1 min-w-0">
            <div class="mb-6 px-4 py-3 bg-gray-900/80 border border-violet-900/50 rounded-xl">
              <span class="text-violet-400">
                Mostrando <span class="font-bold text-fuchsia-400">{filteredServers().length}</span> server
              </span>
            </div>

            <Show when={!initialData.loading} fallback={<div class="text-center py-20">⚙️ Caricamento...</div>}>
              <Show when={!initialData.error} fallback={<div class="text-center py-20 text-red-400">❌ Errore</div>}>
                <Show when={filteredServers().length > 0} fallback={
                  <div class="text-center py-16 bg-amber-950/30 rounded-2xl border border-amber-500/30">
                    <div class="text-6xl mb-4">🔍</div>
                    <p class="text-amber-400 text-xl mb-6">Nessun server trovato</p>
                    <button onClick={clearAllFilters} class="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold">
                      ✕ Cancella filtri
                    </button>
                  </div>
                }>
                  <div class="grid grid-cols-1 gap-6">
                    <For each={filteredServers()}>
                      {(server) => <GamingCard server={server} onVoteRequest={handleVoteRequest} />}
                    </For>
                  </div>

                  <Show when={isLoadingMore()}>
                    <div class="text-center py-10">⚙️ Caricamento...</div>
                  </Show>

                  <Show when={!hasMore() && allServers().length > 0}>
                    <div class="text-center py-10">
                      <div class="text-5xl mb-3">🎉</div>
                      <p class="text-lg text-violet-400">Hai visto tutti i server!</p>
                    </div>
                  </Show>
                </Show>
              </Show>
            </Show>
          </main>

          {/* SIDEBAR DX - STICKY */}
          <aside class="hidden lg:block w-80 flex-shrink-0">
            <div style="position: sticky; top: 1.5rem;">
              {/* Top 5 */}
              <TopFiveServerCard />

              {/* Forum */}
              <TopFiveForumCard />
            </div>
          </aside>
        </div>
      </div>

      <PlayersVoteModal
        isOpen={isModalOpen()}
        onClose={() => setIsModalOpen(false)}
        server_id={selectedServer()?.id || 0}
        discord_id_user={discord_id_user}
        server_secret_key={selectedServer()?.secret_key || ""}
        server_name={selectedServer()?.name || ''}
        server_ip={selectedServer()?.ip || ''}
        player_game_name={playerGameName() ?? ''}
        onPlayerNameChange={() => setPlayerGameName("")}
        onPlayerVote={handlePlayerVote}
      />

      <Notifications />

      <Show when={scrollY() > 500}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} class="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-full text-2xl">
          ⬆️
        </button>
      </Show>
    </section>
  );
};

export default ServerBoard;
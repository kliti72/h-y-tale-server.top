import { Component, createSignal, For, Show, createMemo, onMount, onCleanup } from "solid-js";
import { createResource } from "solid-js";
import GamingCard from "../component/card/GamingCard";
import PlayersVoteModal from "../component/modal/PlayersVoteModal";
import { ServerService } from "../services/server.service";
import Notifications, { notify, requireDiscordLogin } from "../component/template/Notification";
import { ServerResponse } from "../types/ServerResponse";
import { VoteService } from "../services/votes.service";
import { useAuth } from "../auth/AuthContext";
import { A } from "@solidjs/router";
import Pagination from "../component/template/Pagination";

const Top: Component = () => {
  const auth = useAuth();
  const discord_id_user = auth.user()?.id ?? '';

  const [refreshTrigger, setRefreshTrigger] = createSignal(0);
  const [servers] = createResource(refreshTrigger, () => ServerService.getServers());

  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [selectedServer, setSelectedServer] = createSignal<ServerResponse | null>(null);
  const [playerGameName, setPlayerGameName] = createSignal<string>("");

  const [activeFilters, setActiveFilters] = createSignal<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = createSignal("");
  const [sortBy, setSortBy] = createSignal<"votes" | "recent" | "players">("votes");
  const [viewMode, setViewMode] = createSignal<"grid" | "list">("grid");
  
  // Stats animate
  const [totalVotesToday, setTotalVotesToday] = createSignal(0);
  const [onlinePlayers, setOnlinePlayers] = createSignal(0);
  const [trendingServers, setTrendingServers] = createSignal(0);

  // Scroll reveal effect
  const [scrollY, setScrollY] = createSignal(0);

  onMount(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Animazione contatori stats
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
      setRefreshTrigger(prev => prev + 1);
      // Confetti effect
      createConfetti();
    }

    setIsModalOpen(false);
  };

  const createConfetti = () => {
    // Implementa effetto confetti se vuoi
    console.log("🎊 BOOM! Voto registrato!");
  };

  const serverData = () => servers()?.data ?? [];
  const serverCount = () => servers()?.count ?? 0;

  const availableTags = [
    "PvP", "Survival", "MiniGames", "Creative", "Roleplay", "Skyblock",
    "Factions", "Anarchy", "Economy", "Modded", "Vanilla", "Italian",
    "Discord Rich", "Events", "Hardcore", "Pixelmon", "Towny", "Bedwars",
    "Prison", "KitPvP", "UHC", "Build Battle"
  ];

  const filteredServers = createMemo(() => {
    let result = serverData();
    
    // Filtro per tag
    const filters = activeFilters();
    if (filters.size > 0) {
      result = result.filter(s => {
        const tags = (s as any).tags ?? [];
        return Array.from(filters).some(tag => tags.includes(tag));
      });
    }

    // Filtro per ricerca
    const query = searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.ip.toLowerCase().includes(query) ||
        ((s as any).tags ?? []).some((t: string) => t.toLowerCase().includes(query))
      );
    }

    // Ordinamento
    const sort = sortBy();
    if (sort === "votes") {
      result = [...result].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
    } else if (sort === "recent") {
      result = [...result].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
    } else if (sort === "players") {
      result = [...result].sort((a, b) => ((b as any).online_players ?? 0) - ((a as any).online_players ?? 0));
    }

    return result;
  });

  const toggleFilter = (tag: string) => {
    setActiveFilters(prev => {
      const newSet = new Set(prev);
      newSet.has(tag) ? newSet.delete(tag) : newSet.add(tag);
      return newSet;
    });
    setCurrentPage(1); // Reset pagina
  };

  const clearAllFilters = () => {
    setActiveFilters(new Set());
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Dati forum (sostituisci con fetch reale)
  const recentForumPosts = [
    { title: "Miglior server PvP 2026?", author: "DarkKnight", replies: 42, time: "2h fa", hot: true },
    { title: "Come configurare il VotePlugin?", author: "AdminHytale", replies: 18, time: "4h fa", hot: false },
    { title: "Server italiani cercasi", author: "Italiano1990", replies: 31, time: "ieri", hot: true },
    { title: "Eventi settimanali – partecipa!", author: "EventMaster", replies: 9, time: "ieri", hot: false },
    { title: "Nuovo mondo spawn – feedback", author: "BuilderPro", replies: 15, time: "2 giorni fa", hot: false },
  ];

  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = createSignal(1);

  const totalPages = createMemo(() =>
    Math.ceil(filteredServers().length / itemsPerPage)
  );

  const paginatedServers = createMemo(() => {
    const start = (currentPage() - 1) * itemsPerPage;
    return filteredServers().slice(start, start + itemsPerPage);
  });

  // Stats della community
  const communityStats = [
    { label: "Voti Oggi", value: totalVotesToday, icon: "🔥", color: "from-orange-500 to-red-500" },
    { label: "Player Online", value: onlinePlayers, icon: "👥", color: "from-blue-500 to-cyan-500" },
    { label: "Server Trending", value: trendingServers, icon: "📈", color: "from-purple-500 to-pink-500" }
  ];

  return (
    <section class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white overflow-hidden">
      {/* Hero Section Potenziato */}
      <div class="relative overflow-hidden">
        {/* Effetto particelle animate */}
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
          <div class="absolute w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700" />
          <div class="absolute w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse delay-1000" />
        </div>

        <div class="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div 
            class="transition-all duration-700"
            style={{ 
              transform: `translateY(${Math.min(scrollY() * 0.3, 50)}px)`,
              opacity: Math.max(1 - scrollY() * 0.002, 0.3)
            }}
          >
            <h1 class="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              Top Server Hytale
            </h1>
            <p class="text-xl md:text-2xl text-violet-300 max-w-3xl mx-auto mb-8">
              Scopri, vota e domina i regni più epici del blocco 🎮✨
            </p>

            {/* Stats Community */}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 ">
              <For each={communityStats}>
                {(stat) => (
                  <div class={`
                    bg-gradient-to-br ${stat.color} p-1 rounded-2xl
                    hover:scale-105 transition-transform duration-300
                  `}>
                    <div class="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 h-full">
                      <div class="text-4xl mb-2">{stat.icon}</div>
                      <div class="text-3xl font-black text-white mb-1">
                        {stat.value().toLocaleString()}
                      </div>
                      <div class="text-sm text-gray-300">{stat.label}</div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>

      {/* Contenuto principale */}
      <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar sinistra – Top 5 + Quick Actions */}
          <aside class="lg:col-span-3 space-y-6 hidden lg:block ">
            {/* Top 5 Oggi */}
            <div class="
              bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6
              border border-violet-900/50 shadow-2xl shadow-violet-950/60 backdrop-blur-md 
              sticky top-6 hover:border-fuchsia-500/50 transition-all duration-300
            ">
              <div class="flex items-center justify-between mb-6 sticky">
                <h3 class="text-2xl font-bold text-fuchsia-400 flex items-center gap-3">
                  <span class="text-3xl">🏆</span> Top 5 Oggi
                </h3>
                <button 
                  onClick={() => setRefreshTrigger(prev => prev + 1)}
                  class="text-violet-400 hover:text-fuchsia-400 transition-colors"
                  title="Aggiorna"
                >
                  🔄
                </button>
              </div>
              
              <For each={serverData().slice(0, 5)}>
                {(server, i) => (
                  <A 
                    href={`/server/${server.id}`}
                    class="
                      group py-4 border-b border-violet-900/30 last:border-0 
                      flex items-center gap-4 hover:bg-violet-950/40 rounded-lg px-3 
                      transition-all duration-200 cursor-pointer
                    "
                  >
                    <span class={`
                      text-4xl font-black w-12 text-center
                      ${i() === 0 ? 'text-yellow-400' : ''}
                      ${i() === 1 ? 'text-gray-300' : ''}
                      ${i() === 2 ? 'text-amber-600' : ''}
                      ${i() > 2 ? 'text-violet-500' : ''}
                    `}>
                      #{i() + 1}
                    </span>
                    <div class="flex-1 min-w-0">
                      <p class="font-bold truncate group-hover:text-fuchsia-400 transition-colors">
                        {server.name}
                      </p>
                      <div class="flex items-center gap-2 text-sm text-violet-400">
                        <span>🔥 {server.votes ?? 0} voti</span>
                        {(server as any).online_players && (
                          <span class="text-green-400">● {(server as any).online_players}</span>
                        )}
                      </div>
                    </div>
                  </A>
                )}
              </For>

              <A 
                href="/leaderboard"
                class="
                  mt-6 block w-full py-3 text-center 
                  bg-gradient-to-r from-fuchsia-600 to-purple-600 
                  hover:from-fuchsia-500 hover:to-purple-500
                  rounded-xl font-semibold transition-all duration-300
                  shadow-lg shadow-fuchsia-900/50
                "
              >
                Vedi Classifica Completa →
              </A>
            </div>

            {/* Quick Actions */}
            <div class="
              bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6
              border border-violet-900/50 shadow-xl backdrop-blur-md
            ">
              <h3 class="text-xl font-bold text-fuchsia-400 mb-4">⚡ Quick Actions</h3>
              <div class="space-y-3">
                <Show when={auth.isAuthenticated()}>
                  <A 
                    href="/dashboard/add-server"
                    class="
                      block w-full py-3 px-4 text-center 
                      bg-green-600/20 hover:bg-green-600/30 
                      border border-green-500/50 rounded-lg
                      transition-all duration-200 font-medium
                    "
                  >
                    ➕ Aggiungi Server
                  </A>
                </Show>
                <A 
                  href="/premium"
                  class="
                    block w-full py-3 px-4 text-center 
                    bg-yellow-600/20 hover:bg-yellow-600/30 
                    border border-yellow-500/50 rounded-lg
                    transition-all duration-200 font-medium
                  "
                >
                  ⭐ Vai Premium
                </A>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  class="
                    w-full py-3 px-4 text-center 
                    bg-violet-600/20 hover:bg-violet-600/30 
                    border border-violet-500/50 rounded-lg
                    transition-all duration-200 font-medium
                  "
                >
                  ⬆️ Torna su
                </button>
              </div>
            </div>
          </aside>

          {/* Contenuto centrale */}
          <main class="lg:col-span-6 space-y-8">
            
            {/* Barra ricerca e filtri */}
            <div class="
              bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6
              border border-violet-900/50 shadow-xl backdrop-blur-md
            ">
              {/* Ricerca */}
              <div class="mb-6">
                <div class="relative">
                  <input
                    type="text"
                    placeholder="Cerca server, IP, modalità..."
                    value={searchQuery()}
                    onInput={(e) => {
                      setSearchQuery(e.currentTarget.value);
                      setCurrentPage(1);
                    }}
                    class="
                      w-full px-6 py-4 pl-14 bg-gray-950/80 border border-violet-700/50 
                      rounded-xl text-white placeholder-violet-400
                      focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/50
                      transition-all duration-200
                    "
                  />
                  <span class="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
                  <Show when={searchQuery()}>
                    <button 
                      onClick={() => {
                        setSearchQuery("");
                        setCurrentPage(1);
                      }}
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </Show>
                </div>
              </div>

              {/* Controlli View + Sort */}
              <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div class="flex items-center gap-3">
                  <span class="text-sm text-violet-300 font-medium">Ordina:</span>
                  <select
                    value={sortBy()}
                    onChange={(e) => setSortBy(e.currentTarget.value as any)}
                    class="
                      px-4 py-2 bg-gray-950/80 border border-violet-700/50 
                      rounded-lg text-white focus:outline-none focus:border-fuchsia-500
                    "
                  >
                    <option value="votes">🔥 Più Votati</option>
                    <option value="recent">🆕 Più Recenti</option>
                    <option value="players">👥 Più Player</option>
                  </select>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    class={`
                      px-4 py-2 rounded-lg transition-all
                      ${viewMode() === "grid" 
                        ? "bg-fuchsia-600 text-white" 
                        : "bg-gray-800 text-violet-300 hover:bg-gray-700"}
                    `}
                  >
                    ⊞ Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    class={`
                      px-4 py-2 rounded-lg transition-all
                      ${viewMode() === "list" 
                        ? "bg-fuchsia-600 text-white" 
                        : "bg-gray-800 text-violet-300 hover:bg-gray-700"}
                    `}
                  >
                    ☰ Lista
                  </button>
                </div>
              </div>

              {/* Tags filtri */}
              <div>
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-bold text-fuchsia-400">Filtra per Modalità</h3>
                  <Show when={activeFilters().size > 0 || searchQuery()}>
                    <button
                      onClick={clearAllFilters}
                      class="text-sm text-red-400 hover:text-red-300 underline"
                    >
                      Cancella filtri ({activeFilters().size})
                    </button>
                  </Show>
                </div>
                
                <div class="flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-violet-600 scrollbar-track-gray-900">
                  <For each={availableTags}>
                    {(tag) => {
                      const active = activeFilters().has(tag);
                      return (
                        <button
                          onClick={() => toggleFilter(tag)}
                          class={`
                            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                            transition-all duration-200 transform hover:scale-105
                            ${active
                              ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg shadow-fuchsia-900/50 scale-105"
                              : "bg-violet-950/70 text-violet-200 hover:bg-violet-800/80"}
                            border ${active ? "border-fuchsia-500" : "border-violet-700/60"}
                          `}
                        >
                          {active && "✓ "}#{tag}
                        </button>
                      );
                    }}
                  </For>
                </div>
              </div>

              {/* Risultati count */}
              <div class="mt-4 text-sm text-violet-400">
                Mostrando <span class="font-bold text-fuchsia-400">{filteredServers().length}</span> server
                {activeFilters().size > 0 && ` con filtri attivi`}
                {searchQuery() && ` per "${searchQuery()}"`}
              </div>
            </div>

            {/* Cards */}
            <Show 
              when={!servers.loading} 
              fallback={
                <div class="text-center py-20">
                  <div class="inline-block animate-spin text-6xl mb-4">⚙️</div>
                  <div class="text-2xl text-violet-400 font-semibold">Caricamento regni epici...</div>
                </div>
              }
            >
              <Show 
                when={!servers.error} 
                fallback={
                  <div class="
                    bg-red-950/50 border border-red-500/50 rounded-2xl p-8 text-center
                  ">
                    <p class="text-red-400 text-xl mb-2">❌ Errore caricamento</p>
                    <p class="text-red-300">{servers.error?.message}</p>
                    <button 
                      onClick={() => setRefreshTrigger(prev => prev + 1)}
                      class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                    >
                      Riprova
                    </button>
                  </div>
                }
              >
                <Show 
                  when={serverCount() > 0} 
                  fallback={
                    <div class="text-center py-16 bg-gray-900/50 rounded-2xl border border-violet-900/30">
                      <div class="text-6xl mb-4">🏗️</div>
                      <p class="text-zinc-400 text-xl">Nessun server ancora... Sii il primo!</p>
                      <A 
                        href="/dashboard/add-server"
                        class="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-transform"
                      >
                        Aggiungi il Tuo Server
                      </A>
                    </div>
                  }
                >
                  <Show 
                    when={filteredServers().length > 0} 
                    fallback={
                      <div class="text-center py-16 bg-amber-950/30 rounded-2xl border border-amber-500/30">
                        <div class="text-6xl mb-4">🔍</div>
                        <p class="text-amber-400 text-xl mb-2">
                          Nessun server trovato con i filtri attuali
                        </p>
                        <p class="text-amber-300/70 mb-6">
                          Prova a rimuovere qualche filtro o cambia la ricerca
                        </p>
                        <button
                          onClick={clearAllFilters}
                          class="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold transition-colors"
                        >
                          Rimuovi tutti i filtri
                        </button>
                      </div>
                    }
                  >
                    <div class={
                      viewMode() === "grid"
                        ? "grid grid-cols-1 gap-6"
                        : "space-y-4"
                    }>
                      <For each={paginatedServers()}>
                        {(server) => (
                          <div class="animate-fadeIn">
                            <GamingCard server={server} onVoteRequest={handleVoteRequest} />
                          </div>
                        )}
                      </For>
                    </div>

                    {/* Pagination */}
                    <Show when={totalPages() > 1}>
                      <div class="mt-10">
                        <Pagination
                          currentPage={currentPage()}
                          totalItems={filteredServers().length}
                          itemsPerPage={itemsPerPage}
                          onPageChange={(page) => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        />
                      </div>
                    </Show>
                  </Show>
                </Show>
              </Show>
            </Show>
          </main>

          {/* Sidebar destra – Forum / Discussioni */}
          <aside class="lg:col-span-3 space-y-6 hidden lg:block">
            {/* Forum Posts */}
            <div class="
              bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6
              border border-violet-900/50 shadow-2xl backdrop-blur-md 
              sticky top-6
            ">
              <h3 class="text-2xl font-bold text-fuchsia-400 mb-6 flex items-center gap-3">
                <span class="text-3xl">💬</span> Discussioni Hot
              </h3>

              <For each={recentForumPosts}>
                {(post) => (
                  <div class="
                    group py-4 border-b border-violet-900/30 last:border-0 
                    hover:bg-violet-950/30 rounded-lg px-3 transition-all duration-200 
                    cursor-pointer relative
                  ">
                    {post.hot && (
                      <span class="absolute -top-1 -right-1 text-xl animate-pulse">🔥</span>
                    )}
                    <p class="font-semibold text-violet-200 line-clamp-2 group-hover:text-fuchsia-400 transition-colors mb-2">
                      {post.title}
                    </p>
                    <div class="flex items-center gap-2 text-xs text-zinc-400">
                      <span class="text-violet-400">👤 {post.author}</span>
                      <span>•</span>
                      <span>💬 {post.replies}</span>
                      <span>•</span>
                      <span>🕐 {post.time}</span>
                    </div>
                  </div>
                )}
              </For>

              <A 
                href="/forum"
                class="
                  mt-6 block w-full py-3 text-center 
                  bg-gradient-to-r from-purple-600 to-pink-600 
                  hover:from-purple-500 hover:to-pink-500
                  rounded-xl font-semibold transition-all duration-300
                  shadow-lg shadow-purple-900/50
                "
              >
                Entra nel Forum →
              </A>
            </div>

            {/* Banner Promo */}
            <div class="
              bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6
              border border-yellow-500/50 shadow-2xl
              hover:scale-105 transition-transform duration-300 cursor-pointer
            ">
              <div class="text-center">
                <div class="text-5xl mb-3">⭐</div>
                <h4 class="text-xl font-black text-white mb-2">
                  Vai Premium!
                </h4>
                <p class="text-sm text-yellow-100 mb-4">
                  Server in evidenza, statistiche avanzate e molto altro
                </p>
                <A 
                  href="/premium"
                  class="
                    inline-block px-6 py-2 bg-white text-orange-600 
                    font-bold rounded-lg hover:bg-yellow-100 transition-colors
                  "
                >
                  Scopri di più
                </A>
              </div>
            </div>

            {/* Social Links */}
            <div class="
              bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6
              border border-violet-900/50 shadow-xl backdrop-blur-md
            ">
              <h3 class="text-lg font-bold text-fuchsia-400 mb-4">🌐 Seguici</h3>
              <div class="grid grid-cols-2 gap-3">
                {[
                  { icon: "🎮", label: "Discord", color: "from-indigo-600 to-blue-600" },
                  { icon: "🐦", label: "Twitter", color: "from-cyan-600 to-blue-500" },
                  { icon: "📺", label: "YouTube", color: "from-red-600 to-pink-600" },
                  { icon: "📷", label: "Instagram", color: "from-purple-600 to-pink-600" }
                ].map(social => (
                  <button class={`
                    py-3 px-4 bg-gradient-to-r ${social.color} rounded-lg
                    hover:scale-105 transition-transform duration-200
                    text-center font-medium text-sm
                  `}>
                    <div class="text-2xl mb-1">{social.icon}</div>
                    {social.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal + Notifiche */}
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

      {/* Scroll to Top Button */}
      <Show when={scrollY() > 500}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          class="
            fixed bottom-8 right-8 z-50
            w-14 h-14 bg-gradient-to-r from-fuchsia-600 to-purple-600
            rounded-full shadow-2xl shadow-fuchsia-900/50
            flex items-center justify-center text-2xl
            hover:scale-110 transition-transform duration-300
            animate-bounce
          "
          title="Torna su"
        >
          ⬆️
        </button>
      </Show>
    </section>
  );
};

export default Top;
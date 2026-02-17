// src/pages/ServerBoard.tsx
import { Component, createSignal, For, Show, createMemo, onMount, onCleanup } from "solid-js";
import { createResource } from "solid-js";
import PlayersVoteModal from "../../component/modal/PlayersVoteModal";
import { ServerService } from "../../services/server.service";
import Notifications, { notify, requireDiscordLogin } from "../../component/template/Notification";
import { ServerResponse } from "../../types/ServerResponse";
import { VoteService } from "../../services/votes.service";
import { useAuth } from "../../auth/AuthContext";
import { A } from "@solidjs/router";
import GamingCard from "../../component/card/ServerCard/GamingCard";

// ═══════════════════════════════════════════════
// 🎮 LANG CONFIG
// ═══════════════════════════════════════════════
const LANG = {
    page: {
        title: "🎮 Server Explorer!",
        subtitle: "Trova il tuo prossimo mondo preferito",
        loading: "🌀 Caricamento avventura...",
        error: "💥 Ops! Qualcosa è andato storto",
        version: "🟢 Online e pronto!",
    },
    stats: {
        votes: { label: "Voti oggi!", icon: "⭐" },
        players: { label: "Giocatori online", icon: "👾" },
        trending: { label: "Server di tendenza", icon: "🔥" },
    },
    search: {
        title: "🔍 Cerca server",
        subtitle: "Nome, IP o modalità di gioco",
        placeholder: "Cerca il tuo server...",
    },
    filters: {
        title: "🏷️ Modalità di gioco",
        active: {
            title: "Filtri attivi!",
            viewing: "Stai guardando:",
            clear: "✕ Rimuovi filtri",
            ghost: "Nessun filtro da rimuovere",
        },
        inactive: {
            title: "Nessun filtro attivo",
            subtitle: "Usa i filtri per trovare server",
        },
    },
    sort: { label: "Ordina per" },
    quick: {
        title: "⚡ Azioni rapide",
        add: "➕ Aggiungi il tuo server",
        scrollTop: "⬆️ Torna in cima",
    },
    results: {
        showing: "Mostro",
        servers: "server disponibili",
        loadingMore: "🌀 Carico altri server...",
        allLoaded: "🎉 Hai visto tutto!",
        allLoadedSub: "Hai esplorato tutti i server nella lista",
        notFound: "😅 Nessun server trovato",
        notFoundSub: "Prova a cambiare i filtri di ricerca",
        clearFilters: "✕ Rimuovi filtri",
    },
    scrollTop: "⬆️",
};



const ServerPageGame: Component = () => {
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
    const [totalVotesToday, setTotalVotesToday] = createSignal(0);
    const [onlinePlayers, setOnlinePlayers] = createSignal(0);
    const [trendingServers, setTrendingServers] = createSignal(0);

    const ITEMS_PER_PAGE = 12;

    const [initialData] = createResource(async () => {
        try {
            const result = await ServerService.getServerParams({ page: 1, limit: ITEMS_PER_PAGE, sort: sortBy() });
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
            const result = await ServerService.getServerParams({ page: nextPage, limit: ITEMS_PER_PAGE, sort: sortBy() });
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
        if (scrollTop + clientHeight >= scrollHeight - 500 && !isLoadingMore() && hasMore()) loadMoreServers();
    };

    onMount(() => {
        window.addEventListener('scroll', handleScroll);
        let count = 0;
        const iv = setInterval(() => {
            count++;
            setTotalVotesToday(Math.min(count * 47, 2384));
            setOnlinePlayers(Math.min(count * 23, 1456));
            setTrendingServers(Math.min(count * 2, 127));
            if (count >= 100) clearInterval(iv);
        }, 20);
        onCleanup(() => { window.removeEventListener('scroll', handleScroll); clearInterval(iv); });
    });

    const handleVoteRequest = (server: ServerResponse) => {
        if (!auth.isAuthenticated()) { requireDiscordLogin(); return; }
        setIsModalOpen(true);
        setSelectedServer(server);
    };

    const handlePlayerVote = () => {
        const voteRes = VoteService.addVote(discord_id_user, selectedServer()?.id ?? 0, playerGameName() ?? '');
        if (voteRes != null) {
            notify(`Voto registrato per ${selectedServer()?.name}! 🎉`, "success");
            setAllServers(prev => prev.map(s => s.id === selectedServer()?.id ? { ...s, votes: (s.votes || 0) + 1 } : s));
        }
        setIsModalOpen(false);
    };

    const availableTags = ["PvP", "Survival", "MiniGames", "Creative", "Roleplay", "Skyblock", "Factions", "Anarchy"];

    const filteredServers = createMemo(() => {
        let result = allServers();
        const filters = activeFilters();
        if (filters.size > 0) result = result.filter(s => { const tags = (s as any).tags ?? []; return Array.from(filters).some(tag => tags.includes(tag)); });
        const query = searchQuery().toLowerCase().trim();
        if (query) result = result.filter(s => s.name?.toLowerCase().includes(query) || s.ip?.toLowerCase().includes(query) || (() => { try { const tags = typeof (s as any).tags === 'string' ? JSON.parse((s as any).tags) : ((s as any).tags ?? []); return Array.isArray(tags) && tags.some((t: string) => t.toLowerCase().includes(query)); } catch { return false; } })());
        const sort = sortBy();
        if (sort === "votes") result = [...result].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
        else if (sort === "recent") result = [...result].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
        else if (sort === "players") result = [...result].sort((a, b) => ((b as any).online_players ?? 0) - ((a as any).online_players ?? 0));
        return result;
    });

    const toggleFilter = (tag: string) => {
        setActiveFilters(prev => { const s = new Set(prev); s.has(tag) ? s.delete(tag) : s.add(tag); return s; });
    };

    const clearAllFilters = () => { setActiveFilters(new Set<string>()); setSearchQuery(""); };

    const activeFiltersMessage = createMemo(() => {
        const filters = Array.from(activeFilters()); const query = searchQuery();
        if (filters.length === 0 && !query) return null;
        const parts = [];
        if (filters.length > 0) parts.push(filters.length === 1 ? `"${filters[0]}"` : `${filters.length} modalità`);
        if (query) parts.push(`"${query}"`);
        return parts.join(' e ');
    });

    return (
        <>

            <section class="game-root">

                {/* RAINBOW TOP BAR */}
                <div class="g-rainbow" />

                {/* TICKER */}
                <div class="g-ticker-wrap">
                    <span class="g-ticker">
                        {[...Array(8)].map(() => `🎮 Server Explorer Online! ⭐ Vota i tuoi preferiti! 🌍 Unisciti alla community! 🏆 Scala le classifiche! `).join('')}
                    </span>
                </div>

                {/* HERO */}
                <div class="g-hero">
                    <span class="g-hero-deco g-hero-deco-1">🎮</span>
                    <span class="g-hero-deco g-hero-deco-2">⭐</span>
                    <span class="g-hero-deco g-hero-deco-3">🌍</span>
                    <div class="g-hero-tag">{LANG.page.version}</div>
                    <div class="g-hero-title" style="margin-top:0.5rem;">{LANG.page.title}</div>
                    <div class="g-hero-sub">{LANG.page.subtitle}</div>

                    {/* STATS */}
                    <div class="g-stats">
                        {[
                            { val: totalVotesToday(), ...LANG.stats.votes, cls: "g-stat-blue", valCls: "blue" },
                            { val: onlinePlayers(), ...LANG.stats.players, cls: "g-stat-purple", valCls: "purple" },
                            { val: trendingServers(), ...LANG.stats.trending, cls: "g-stat-orange", valCls: "orange" },
                        ].map(s => (
                            <div class={`g-stat ${s.cls}`}>
                                <span class="g-stat-icon">{s.icon}</span>
                                <div class={`g-stat-val ${s.valCls}`}>{s.val.toLocaleString()}</div>
                                <div class="g-stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MAIN LAYOUT */}
                <div class="g-layout">

                    {/* SIDEBAR SX */}
                    <aside class="g-sidebar">
                        <div class="g-sidebar-sticky">

                            {/* FILTRI ATTIVI / INATTIVI */}
                            <Show
                                when={activeFiltersMessage()}
                                fallback={
                                    <div class="g-panel g-filter-inactive">
                                        <div class="g-panel-title purple">🔍 {LANG.filters.inactive.title}</div>
                                        <div class="g-filter-sub" style="margin-bottom:0.6rem;">{LANG.filters.inactive.subtitle}</div>
                                        <div class="g-filter-ghost">{LANG.filters.active.ghost}</div>
                                    </div>
                                }
                            >
                                <div class="g-panel g-filter-active">
                                    <div class="g-panel-title pink">🎯 {LANG.filters.active.title}</div>
                                    <div class="g-filter-sub" style="margin-bottom:0.6rem;">
                                        {LANG.filters.active.viewing} <strong style="color:var(--g-purple);">{activeFiltersMessage()}</strong>
                                    </div>
                                    <button class="g-clear-btn" onClick={clearAllFilters}>{LANG.filters.active.clear}</button>
                                </div>
                            </Show>

                            {/* SEARCH */}
                            <div class="g-panel g-panel-blue">
                                <div class="g-panel-title blue">{LANG.search.title}</div>
                                <div style="font-size:0.65rem;color:var(--g-muted);margin-bottom:0.5rem;font-weight:600;">{LANG.search.subtitle}</div>
                                <div class="g-search-wrap">
                                    <span class="g-search-icon">🔍</span>
                                    <input class="g-search" placeholder={LANG.search.placeholder} value={searchQuery()} onInput={e => setSearchQuery(e.currentTarget.value)} />
                                </div>
                            </div>

                            {/* SORT */}

                            {/* TAGS */}
                            <div class="g-panel g-panel-yellow">
                                <div class="g-panel-title yellow">{LANG.filters.title}</div>
                                <div class="g-tag-grid">
                                    <For each={availableTags}>
                                        {(tag) => {
                                            const idx = availableTags.indexOf(tag);
                                            const isActive = () => activeFilters().has(tag);
                                            return (
                                                <button class={`g-tag g-tag-${idx} ${isActive() ? 'on' : ''}`} onClick={() => toggleFilter(tag)}>
                                                    {isActive() ? '✓ ' : ''}{tag}
                                                </button>
                                            );
                                        }}
                                    </For>
                                </div>
                            </div>

                            {/* QUICK ACTIONS */}

                        </div>
                    </aside>

                    {/* CENTRO */}
                    <main class="g-main">

                        {/* RESULTS BAR */}
                        <div class="g-results-bar">
                            <div>
                                <span class="g-results-count">{filteredServers().length}</span>
                                <span class="g-results-label">{LANG.results.servers}</span>
                            </div>
                            <div class="g-live-badge">
                                <div class="g-live-dot" />
                                LIVE
                            </div>
                        </div>

                        <Show
                            when={!initialData.loading}
                            fallback={
                                <div class="g-loading">
                                    <span class="g-loading-icon">🌀</span>
                                    <div class="g-loading-text">{LANG.page.loading}</div>
                                </div>
                            }
                        >
                            <Show
                                when={!initialData.error}
                                fallback={
                                    <div class="g-empty">
                                        <span class="g-empty-icon">💥</span>
                                        <div class="g-empty-title">{LANG.page.error}</div>
                                    </div>
                                }
                            >
                                <Show
                                    when={filteredServers().length > 0}
                                    fallback={
                                        <div class="g-empty">
                                            <span class="g-empty-icon">😅</span>
                                            <div class="g-empty-title">{LANG.results.notFound}</div>
                                            <div class="g-empty-sub">{LANG.results.notFoundSub}</div>
                                            <button class="g-empty-btn" onClick={clearAllFilters}>{LANG.results.clearFilters}</button>
                                        </div>
                                    }
                                >
                                    <div style="display:flex;flex-direction:column;gap:0.75rem;">
                                        <For each={filteredServers()}>
                                            {(server) => <GamingCard server={server} onVoteRequest={handleVoteRequest} />}
                                        </For>
                                    </div>

                                    <Show when={isLoadingMore()}>
                                        <div class="g-load-more">
                                            <span style="font-size:1.5rem;display:block;animation:g-spin 1s linear infinite;">🌀</span>
                                            <div style="font-size:0.72rem;color:var(--g-muted);margin-top:0.4rem;font-weight:700;">{LANG.results.loadingMore}</div>
                                        </div>
                                    </Show>

                                    <Show when={!hasMore() && allServers().length > 0}>
                                        <div class="g-end">
                                            <span class="g-end-icon">🎉</span>
                                            <div class="g-end-title">{LANG.results.allLoaded}</div>
                                            <div class="g-end-sub">{LANG.results.allLoadedSub}</div>
                                        </div>
                                    </Show>
                                </Show>
                            </Show>
                        </Show>
                    </main>

                    {/* SIDEBAR DX */}
                    <aside class="g-sidebar">
                        <div style="position:sticky;top:1rem;">
                            <div class="g-panel g-panel-green">
                                <div class="g-panel-title green">{LANG.quick.title}</div>
                                <Show when={auth.isAuthenticated()}>
                                    <A href="/servers/add" class="g-quick-btn g-quick-add">{LANG.quick.add}</A>
                                </Show>
                                <button class="g-quick-btn g-quick-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{LANG.quick.scrollTop}</button>
                            </div>
                        </div>
                    </aside>
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
                    <button class="g-scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        {LANG.scrollTop}
                    </button>
                </Show>
            </section>
        </>
    );
};

export default ServerPageGame;
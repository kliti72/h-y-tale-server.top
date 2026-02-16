// src/components/ServerDetail.tsx
import { Component, createResource, createSignal, For, Show, Suspense, createMemo, onMount } from 'solid-js';
import { useParams, A } from '@solidjs/router';
import { ServerService } from '../services/server.service';
import { ServerResponse } from '../types/ServerResponse';
import PlayersVoteModal from '../component/modal/PlayersVoteModal';
import Notifications, { notify } from '../component/template/Notification';
import { useAuth } from '../auth/AuthContext';
import { VoteService } from '../services/votes.service';

// Types per le stats mockate
type PlayerActivity = {
  time: string;
  count: number;
};

type ServerStats = {
  online: boolean;
  players: {
    online: number;
    max: number;
  };
  uptime: string;
  version: string;
  ping: number;
};

type Review = {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
};

const ServerDetail: Component = () => {
  const params = useParams();
  const serverName = () => decodeURIComponent(params.name || '');
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [playerGameName, setPlayerGameName] = createSignal("");
  const [activeTab, setActiveTab] = createSignal<'overview' | 'stats' | 'reviews' | 'events'>('overview');
  const [isFavorite, setIsFavorite] = createSignal(false);
  const [copiedIP, setCopiedIP] = createSignal(false);
  const [showShareMenu, setShowShareMenu] = createSignal(false);
  
  const auth = useAuth();
  const discord_id_user = auth.user()?.id ?? '';

  // Stats mockate (in futuro da API)
  const [mockStats] = createSignal<ServerStats>({
    online: true,
    players: { online: 47, max: 100 },
    uptime: "99.8%",
    version: "1.20.4",
    ping: 23
  });

  // Activity chart data mockato
  const [playerActivity] = createSignal<PlayerActivity[]>([
    { time: '00:00', count: 12 },
    { time: '04:00', count: 8 },
    { time: '08:00', count: 15 },
    { time: '12:00', count: 34 },
    { time: '16:00', count: 52 },
    { time: '20:00', count: 47 },
  ]);

  // Reviews mockate
  const [mockReviews] = createSignal<Review[]>([
    {
      id: 1,
      author: "DarkSlayer",
      avatar: "🛡️",
      rating: 5,
      comment: "Server top! Staff attivo e community mega friendly. PvP bilanciato e economy ben fatta. Lo consiglio 100% bro 🔥",
      date: "2 giorni fa",
      likes: 23
    },
    {
      id: 2,
      author: "BuildMaster",
      avatar: "🏗️",
      rating: 4,
      comment: "Ottimo server survival, molte possibilità di build. Unico difetto: a volte il lag in zone troppo buildate. Overall molto buono!",
      date: "1 settimana fa",
      likes: 15
    },
    {
      id: 3,
      author: "PvPKing",
      avatar: "⚔️",
      rating: 5,
      comment: "Arena PvP spettacolare, tornei ogni weekend con premi veri. Meta ben bilanciato, no pay to win. Approved 💯",
      date: "2 settimane fa",
      likes: 31
    }
  ]);

  const [likedReviews, setLikedReviews] = createSignal<Set<number>>(new Set());

  const [server] = createResource<ServerResponse | undefined, string>(
    serverName,
    ServerService.getServerByName
  );

  const tagsArray = () => {
    const tags = server()?.tags;
    if (!tags || typeof tags !== 'string') return [];
    return tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const averageRating = createMemo(() => {
    const reviews = mockReviews();
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  });

  const copyIP = async () => {
    const ip = `${server()?.ip}${server()?.port ? ':' + server()?.port : ''}`;
    try {
      await navigator.clipboard.writeText(ip);
      setCopiedIP(true);
      notify("IP copiato negli appunti! 📋", "success");
      setTimeout(() => setCopiedIP(false), 2000);
    } catch (err) {
      notify("Errore nella copia", "error");
    }
  };

  const toggleFavorite = () => {
    if (!auth.isAuthenticated()) {
      notify("Fai login per salvare nei preferiti bro 🔐", "error");
      return;
    }
    setIsFavorite(!isFavorite());
    notify(isFavorite() ? "Aggiunto ai preferiti! ⭐" : "Rimosso dai preferiti", "info");
  };

  const shareServer = (platform: string) => {
    const url = window.location.href;
    const text = `Guarda questo server Minecraft: ${server()?.name}!`;
    
    switch(platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'discord':
        notify("Link copiato per Discord! 💬", "success");
        navigator.clipboard.writeText(url);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        notify("Link copiato! 🔗", "success");
        break;
    }
    setShowShareMenu(false);
  };

  const handlePlayerVote = () => {
    const voteRes = VoteService.addVote(
      discord_id_user,
      server()?.id ?? 0,
      playerGameName() ?? ''
    );

    if (voteRes != null) {
      notify(`Voto registrato per ${server()?.name}! 🎉`, "success");
    }

    setIsModalOpen(false);
  };

  const toggleLikeReview = (reviewId: number) => {
    if (!auth.isAuthenticated()) {
      notify("Login per mettere like alle recensioni", "error");
      return;
    }
    
    setLikedReviews(prev => {
      const newSet = new Set(prev);
      newSet.has(reviewId) ? newSet.delete(reviewId) : newSet.add(reviewId);
      return newSet;
    });
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white">
      
      {/* Hero Section */}
      <div class="relative overflow-hidden bg-black/40 border-b border-violet-900/50 backdrop-blur-sm">
        {/* Particelle di sfondo */}
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
          <div class="absolute w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700" />
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Suspense fallback={
            <div class="flex flex-col items-center justify-center py-20">
              <div class="w-16 h-16 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
              <p class="mt-6 text-xl text-violet-300">Caricamento server epico...</p>
            </div>
          }>
            <Show
              when={server()}
              fallback={
                <div class="text-center py-20">
                  <div class="text-6xl mb-6">❌</div>
                  <h2 class="text-3xl font-bold text-white mb-4">
                    Server non trovato
                  </h2>
                  <p class="text-violet-300 text-lg mb-8">
                    Il server <strong class="text-fuchsia-400">{serverName()}</strong> non esiste nel database bro
                  </p>
                  <A
                    href="/"
                    class="inline-block px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                    ← Torna ai Server
                  </A>
                </div>
              }
            >
              {(serverData) => (
                <div>
                  {/* Breadcrumb */}
                  <div class="flex items-center gap-2 text-sm text-violet-400 mb-6">
                    <A href="/" class="hover:text-fuchsia-300 transition-colors">Home</A>
                    <span>›</span>
                    <A href="/servers" class="hover:text-fuchsia-300 transition-colors">Server</A>
                    <span>›</span>
                    <span class="text-white font-medium">{serverData().name}</span>
                  </div>

                  {/* Header principale */}
                  <div class="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
                    <div class="flex-1">
                      <div class="flex items-center gap-4 mb-4">
                        <h1 class="text-4xl md:text-6xl font-black bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                          {serverData().name}
                        </h1>
                        {mockStats().online ? (
                          <span class="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-sm font-medium flex items-center gap-2">
                            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Online
                          </span>
                        ) : (
                          <span class="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full text-red-300 text-sm font-medium">
                            Offline
                          </span>
                        )}
                      </div>

                      <p class="text-xl text-violet-200 mb-6">
                        Esplora uno dei server più fighi della community 🎮✨
                      </p>

                      {/* Quick stats */}
                      <div class="flex flex-wrap items-center gap-4 text-sm">
                        <div class="flex items-center gap-2 px-4 py-2 bg-violet-950/50 rounded-lg border border-violet-800/30">
                          <span>👥</span>
                          <span class="font-bold text-white">{mockStats().players.online}/{mockStats().players.max}</span>
                          <span class="text-violet-300">giocatori</span>
                        </div>
                        <div class="flex items-center gap-2 px-4 py-2 bg-violet-950/50 rounded-lg border border-violet-800/30">
                          <span>🔥</span>
                          <span class="font-bold text-white">{serverData().votes || 0}</span>
                          <span class="text-violet-300">voti</span>
                        </div>
                        <div class="flex items-center gap-2 px-4 py-2 bg-violet-950/50 rounded-lg border border-violet-800/30">
                          <span>⭐</span>
                          <span class="font-bold text-white">{averageRating()}</span>
                          <span class="text-violet-300">rating</span>
                        </div>
                        <div class="flex items-center gap-2 px-4 py-2 bg-violet-950/50 rounded-lg border border-violet-800/30">
                          <span>📡</span>
                          <span class="font-bold text-white">{mockStats().ping}ms</span>
                          <span class="text-violet-300">ping</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div class="flex flex-col gap-3 w-full lg:w-auto">
                      <button
                        onClick={() => {
                          if (auth.isAuthenticated()) {
                            setIsModalOpen(true);
                          } else {
                            notify("Fai login con Discord per votare bro 🔐", "error");
                          }
                        }}
                        class="
                          flex items-center justify-center gap-3 px-8 py-4 
                          bg-gradient-to-r from-fuchsia-600 to-purple-600 
                          hover:from-fuchsia-500 hover:to-purple-500
                          rounded-xl text-lg font-bold shadow-lg shadow-fuchsia-900/50
                          hover:scale-105 active:scale-95 transition-all duration-300
                          border border-fuchsia-400/50
                        "
                      >
                        <span class="text-2xl">🔥</span>
                        Vota Questo Server
                      </button>

                      <div class="flex gap-3">
                        <button
                          onClick={toggleFavorite}
                          class={`
                            flex-1 flex items-center justify-center gap-2 px-6 py-3 
                            rounded-xl font-semibold transition-all duration-300
                            ${isFavorite()
                              ? "bg-yellow-500/20 border-2 border-yellow-500/50 text-yellow-300"
                              : "bg-violet-950/60 border-2 border-violet-700/50 text-violet-300 hover:bg-violet-900/80"}
                          `}
                        >
                          <span class="text-xl">{isFavorite() ? "⭐" : "☆"}</span>
                          {isFavorite() ? "Salvato" : "Salva"}
                        </button>

                        <div class="relative">
                          <button
                            onClick={() => setShowShareMenu(!showShareMenu())}
                            class="
                              flex items-center justify-center gap-2 px-6 py-3 
                              bg-violet-950/60 border-2 border-violet-700/50 
                              rounded-xl font-semibold text-violet-300
                              hover:bg-violet-900/80 transition-all
                            "
                          >
                            <span class="text-xl">🔗</span>
                            Share
                          </button>

                          <Show when={showShareMenu()}>
                            <div class="absolute right-0 mt-2 w-48 bg-gray-900 border border-violet-700 rounded-xl shadow-2xl z-10 overflow-hidden">
                              <button
                                onClick={() => shareServer('twitter')}
                                class="w-full px-4 py-3 text-left hover:bg-violet-950/60 transition-colors flex items-center gap-3"
                              >
                                <span>🐦</span> Twitter
                              </button>
                              <button
                                onClick={() => shareServer('discord')}
                                class="w-full px-4 py-3 text-left hover:bg-violet-950/60 transition-colors flex items-center gap-3"
                              >
                                <span>💬</span> Discord
                              </button>
                              <button
                                onClick={() => shareServer('copy')}
                                class="w-full px-4 py-3 text-left hover:bg-violet-950/60 transition-colors flex items-center gap-3"
                              >
                                <span>📋</span> Copia Link
                              </button>
                            </div>
                          </Show>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* IP Box */}
                  <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 border border-violet-800/50 backdrop-blur-md">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div class="flex-1">
                        <h3 class="text-sm font-medium text-violet-400 mb-2">Indirizzo Server</h3>
                        <div class="flex items-center gap-3 font-mono text-2xl">
                          <span class="text-fuchsia-400">{serverData().ip || '—'}</span>
                          {serverData().port && (
                            <>
                              <span class="text-violet-600">:</span>
                              <span class="text-fuchsia-400">{serverData().port}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={copyIP}
                        class={`
                          flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                          transition-all duration-300
                          ${copiedIP()
                            ? "bg-green-600 text-white"
                            : "bg-violet-600 hover:bg-violet-500 text-white"}
                        `}
                      >
                        <span class="text-xl">{copiedIP() ? "✓" : "📋"}</span>
                        {copiedIP() ? "Copiato!" : "Copia IP"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Show>
          </Suspense>
        </div>
      </div>

      {/* Contenuto principale */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense>
          <Show when={server()}>
            {(serverData) => (
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Sidebar Info */}
                <aside class="lg:col-span-4 space-y-6">
                  
                  {/* Server Info Card */}
                  <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 border border-violet-900/50 backdrop-blur-md sticky top-6">
                    <h3 class="text-xl font-bold text-fuchsia-400 mb-6 flex items-center gap-2">
                      <span>ℹ️</span> Info Server
                    </h3>

                    <div class="space-y-4">
                      <div>
                        <div class="text-sm text-violet-400 mb-1">Versione</div>
                        <div class="text-lg font-semibold text-white flex items-center gap-2">
                          <span>🎮</span> {mockStats().version}
                        </div>
                      </div>

                      <div>
                        <div class="text-sm text-violet-400 mb-1">Uptime</div>
                        <div class="text-lg font-semibold text-white flex items-center gap-2">
                          <span>⚡</span> {mockStats().uptime}
                        </div>
                      </div>

                      <div>
                        <div class="text-sm text-violet-400 mb-1">Creato il</div>
                        <div class="text-sm font-medium text-white">
                          {formatDate(serverData().created_at)}
                        </div>
                      </div>

                      <div>
                        <div class="text-sm text-violet-400 mb-2">Modalità</div>
                        <div class="flex flex-wrap gap-2">
                          <Show 
                            when={tagsArray().length > 0} 
                            fallback={
                              <span class="text-sm text-violet-500 italic">Nessun tag</span>
                            }
                          >
                            <For each={tagsArray()}>
                              {(tag) => (
                                <span class="px-3 py-1.5 bg-violet-950/60 border border-violet-700/50 rounded-full text-sm text-violet-200">
                                  #{tag}
                                </span>
                              )}
                            </For>
                          </Show>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 border border-violet-900/50 backdrop-blur-md">
                    <h3 class="text-xl font-bold text-fuchsia-400 mb-4 flex items-center gap-2">
                      <span>🔗</span> Link Utili
                    </h3>
                    <div class="space-y-2">
                      <a 
                        href="#" 
                        class="block px-4 py-3 bg-violet-950/40 hover:bg-violet-900/60 rounded-lg transition-colors text-violet-200 hover:text-white flex items-center gap-3"
                      >
                        <span>🌐</span> Sito Web
                      </a>
                      <a 
                        href="#" 
                        class="block px-4 py-3 bg-violet-950/40 hover:bg-violet-900/60 rounded-lg transition-colors text-violet-200 hover:text-white flex items-center gap-3"
                      >
                        <span>💬</span> Discord
                      </a>
                      <a 
                        href="#" 
                        class="block px-4 py-3 bg-violet-950/40 hover:bg-violet-900/60 rounded-lg transition-colors text-violet-200 hover:text-white flex items-center gap-3"
                      >
                        <span>📺</span> Forum
                      </a>
                      <a 
                        href="#" 
                        class="block px-4 py-3 bg-violet-950/40 hover:bg-violet-900/60 rounded-lg transition-colors text-violet-200 hover:text-white flex items-center gap-3"
                      >
                        <span>📖</span> Wiki
                      </a>
                    </div>
                  </div>

                  {/* Admin Contact */}
                  <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 border border-violet-900/50 backdrop-blur-md">
                    <h3 class="text-xl font-bold text-fuchsia-400 mb-4 flex items-center gap-2">
                      <span>👑</span> Contatta Staff
                    </h3>
                    <button class="w-full px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg font-semibold transition-all">
                      Invia Messaggio
                    </button>
                  </div>
                </aside>

                {/* Main Content */}
                <main class="lg:col-span-8 space-y-8">
                  
                  {/* Tabs */}
                  <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl border border-violet-900/50 backdrop-blur-md overflow-hidden">
                    <div class="flex border-b border-violet-800/50 overflow-x-auto">
                      {[
                        { id: 'overview', label: 'Panoramica', icon: '📊' },
                        { id: 'stats', label: 'Statistiche', icon: '📈' },
                        { id: 'reviews', label: 'Recensioni', icon: '⭐' },
                        { id: 'events', label: 'Eventi', icon: '🎉' }
                      ].map(tab => (
                        <button
                          onClick={() => setActiveTab(tab.id as any)}
                          class={`
                            flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap transition-all
                            ${activeTab() === tab.id
                              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-b-2 border-fuchsia-400"
                              : "text-violet-300 hover:bg-violet-950/40"}
                          `}
                        >
                          <span class="text-xl">{tab.icon}</span>
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div class="p-6 md:p-8">
                      
                      {/* Tab: Overview */}
                      <Show when={activeTab() === 'overview'}>
                        <div class="space-y-6">
                          <div>
                            <h3 class="text-2xl font-bold text-white mb-4">Descrizione</h3>
                            <p class="text-violet-200 leading-relaxed">
                              Benvenuto su <strong class="text-fuchsia-400">{serverData().name}</strong>! 🎮
                              <br /><br />
                              Questo è uno dei server più fighi della community italiana. Qui trovi PvP bilanciato, 
                              economia solida, eventi regolari e una community super attiva. Staff sempre presente 
                              e disponibile ad aiutare i player.
                              <br /><br />
                              Il server è online 24/7 con performance ottimali e zero lag. Vieni a trovarci bro! 🔥
                            </p>
                          </div>

                          <div>
                            <h3 class="text-2xl font-bold text-white mb-4">Features Principali</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { icon: "⚔️", title: "PvP Arena", desc: "Arena dedicata con kit bilanciati" },
                                { icon: "💰", title: "Economy", desc: "Sistema economico completo e fair" },
                                { icon: "🏆", title: "Tornei", desc: "Eventi settimanali con premi" },
                                { icon: "🛡️", title: "Land Claims", desc: "Proteggi le tue build" },
                                { icon: "🎁", title: "Daily Rewards", desc: "Ricompense giornaliere" },
                                { icon: "👥", title: "Community", desc: "Discord attivo 24/7" }
                              ].map(feature => (
                                <div class="bg-violet-950/40 border border-violet-800/30 rounded-xl p-4 hover:bg-violet-900/50 transition-colors">
                                  <div class="flex items-start gap-3">
                                    <span class="text-3xl">{feature.icon}</span>
                                    <div>
                                      <h4 class="font-bold text-white mb-1">{feature.title}</h4>
                                      <p class="text-sm text-violet-300">{feature.desc}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 class="text-2xl font-bold text-white mb-4">Regole del Server</h3>
                            <div class="bg-violet-950/30 border border-violet-800/30 rounded-xl p-6">
                              <ul class="space-y-2 text-violet-200">
                                <li class="flex items-start gap-3">
                                  <span class="text-green-400 mt-1">✓</span>
                                  <span>Rispetta tutti i giocatori e lo staff</span>
                                </li>
                                <li class="flex items-start gap-3">
                                  <span class="text-red-400 mt-1">✗</span>
                                  <span>No griefing, hacking o cheating di alcun tipo</span>
                                </li>
                                <li class="flex items-start gap-3">
                                  <span class="text-red-400 mt-1">✗</span>
                                  <span>No spam in chat o pubblicità</span>
                                </li>
                                <li class="flex items-start gap-3">
                                  <span class="text-green-400 mt-1">✓</span>
                                  <span>Divertiti e aiuta la community a crescere!</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </Show>

                      {/* Tab: Stats */}
                      <Show when={activeTab() === 'stats'}>
                        <div class="space-y-6">
                          <div>
                            <h3 class="text-2xl font-bold text-white mb-6">Player Activity (24h)</h3>
                            
                            {/* Chart semplice */}
                            <div class="bg-violet-950/30 rounded-xl p-6 border border-violet-800/30">
                              <div class="flex items-end justify-between h-48 gap-2">
                                <For each={playerActivity()}>
                                  {(data) => (
                                    <div class="flex-1 flex flex-col items-center gap-2">
                                      <div class="relative w-full bg-violet-900/40 rounded-t-lg overflow-hidden">
                                        <div 
                                          class="bg-gradient-to-t from-fuchsia-600 to-purple-500 rounded-t-lg transition-all duration-500"
                                          style={{ height: `${(data.count / 60) * 100}%` }}
                                        />
                                      </div>
                                      <div class="text-xs text-violet-400 font-medium">{data.time}</div>
                                      <div class="text-sm font-bold text-white">{data.count}</div>
                                    </div>
                                  )}
                                </For>
                              </div>
                            </div>
                          </div>

                          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-violet-950/40 border border-violet-800/30 rounded-xl p-6">
                              <h4 class="text-lg font-bold text-fuchsia-400 mb-4">Performance</h4>
                              <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                  <span class="text-violet-300">Ping Medio</span>
                                  <span class="font-bold text-white">{mockStats().ping}ms</span>
                                </div>
                                <div class="flex justify-between items-center">
                                  <span class="text-violet-300">Uptime</span>
                                  <span class="font-bold text-green-400">{mockStats().uptime}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                  <span class="text-violet-300">TPS</span>
                                  <span class="font-bold text-white">19.8</span>
                                </div>
                              </div>
                            </div>

                            <div class="bg-violet-950/40 border border-violet-800/30 rounded-xl p-6">
                              <h4 class="text-lg font-bold text-fuchsia-400 mb-4">Statistiche</h4>
                              <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                  <span class="text-violet-300">Voti Totali</span>
                                  <span class="font-bold text-white">{serverData().votes || 0}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                  <span class="text-violet-300">Player Unici</span>
                                  <span class="font-bold text-white">2,847</span>
                                </div>
                                <div class="flex justify-between items-center">
                                  <span class="text-violet-300">Record Player</span>
                                  <span class="font-bold text-fuchsia-400">97</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Show>

                      {/* Tab: Reviews */}
                      <Show when={activeTab() === 'reviews'}>
                        <div class="space-y-6">
                          
                          {/* Rating Overview */}
                          <div class="bg-violet-950/40 border border-violet-800/30 rounded-xl p-6">
                            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                              <div>
                                <div class="text-5xl font-black text-white mb-2">{averageRating()}</div>
                                <div class="flex items-center gap-1 mb-2">
                                  <For each={[1,2,3,4,5]}>
                                    {(star) => (
                                      <span class={`text-2xl ${star <= parseFloat(averageRating()) ? 'text-yellow-400' : 'text-gray-600'}`}>
                                        ⭐
                                      </span>
                                    )}
                                  </For>
                                </div>
                                <div class="text-sm text-violet-400">
                                  Basato su {mockReviews().length} recensioni
                                </div>
                              </div>

                              <Show when={auth.isAuthenticated()}>
                                <button 
                                  onClick={() => notify("Funzione in arrivo! (demo)", "info")}
                                  class="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl font-semibold transition-all"
                                >
                                  ✍️ Scrivi Recensione
                                </button>
                              </Show>
                            </div>
                          </div>

                          {/* Reviews List */}
                          <div class="space-y-4">
                            <For each={mockReviews()}>
                              {(review) => (
                                <div class="bg-violet-950/40 border border-violet-800/30 rounded-xl p-6 hover:bg-violet-900/50 transition-colors">
                                  <div class="flex items-start justify-between mb-4">
                                    <div class="flex items-center gap-3">
                                      <span class="text-3xl">{review.avatar}</span>
                                      <div>
                                        <div class="font-bold text-white">{review.author}</div>
                                        <div class="flex items-center gap-2">
                                          <div class="flex items-center gap-0.5">
                                            <For each={[1,2,3,4,5]}>
                                              {(star) => (
                                                <span class={`${star <= review.rating ? 'text-yellow-400' : 'text-gray-600'}`}>
                                                  ⭐
                                                </span>
                                              )}
                                            </For>
                                          </div>
                                          <span class="text-xs text-violet-400">• {review.date}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <p class="text-violet-200 mb-4 leading-relaxed">
                                    {review.comment}
                                  </p>

                                  <div class="flex items-center gap-4 pt-4 border-t border-violet-800/30">
                                    <button
                                      onClick={() => toggleLikeReview(review.id)}
                                      class={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                        ${likedReviews().has(review.id)
                                          ? "bg-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-500/50"
                                          : "bg-violet-950/60 text-violet-300 hover:bg-violet-900/80 border border-transparent"}
                                      `}
                                    >
                                      <span>{likedReviews().has(review.id) ? "👍" : "👍🏻"}</span>
                                      {review.likes + (likedReviews().has(review.id) ? 1 : 0)}
                                    </button>

                                    <button class="text-sm text-violet-400 hover:text-violet-200 transition-colors">
                                      💬 Rispondi
                                    </button>
                                  </div>
                                </div>
                              )}
                            </For>
                          </div>
                        </div>
                      </Show>

                      {/* Tab: Events */}
                      <Show when={activeTab() === 'events'}>
                        <div class="space-y-6">
                          <div class="text-center py-12">
                            <div class="text-6xl mb-4">🎉</div>
                            <h3 class="text-2xl font-bold text-white mb-2">Eventi in Arrivo</h3>
                            <p class="text-violet-300 mb-6">
                              Tornei, build competition e molto altro!
                            </p>
                          </div>

                          <div class="grid gap-4">
                            {[
                              { 
                                title: "Torneo PvP Weekend",
                                date: "Sabato 28 Feb • 18:00",
                                prize: "100€",
                                type: "pvp",
                                icon: "⚔️",
                                color: "from-red-600 to-orange-600"
                              },
                              {
                                title: "Build Competition",
                                date: "Domenica 1 Mar • 15:00",
                                prize: "Premium Rank",
                                type: "build",
                                icon: "🏗️",
                                color: "from-blue-600 to-cyan-600"
                              },
                              {
                                title: "Drop Party",
                                date: "Venerdì 27 Feb • 20:00",
                                prize: "Items Rari",
                                type: "party",
                                icon: "🎁",
                                color: "from-purple-600 to-pink-600"
                              }
                            ].map(event => (
                              <div class={`
                                bg-gradient-to-r ${event.color} p-1 rounded-xl
                                hover:scale-102 transition-transform
                              `}>
                                <div class="bg-gray-900/90 rounded-xl p-6">
                                  <div class="flex items-start justify-between gap-4">
                                    <div class="flex items-start gap-4">
                                      <span class="text-4xl">{event.icon}</span>
                                      <div>
                                        <h4 class="text-xl font-bold text-white mb-1">{event.title}</h4>
                                        <p class="text-violet-300 text-sm mb-2">{event.date}</p>
                                        <span class="inline-block px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-xs text-yellow-300 font-medium">
                                          🏆 {event.prize}
                                        </span>
                                      </div>
                                    </div>
                                    <button class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors">
                                      Partecipa
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Show>
                    </div>
                  </div>
                </main>
              </div>
            )}
          </Show>
        </Suspense>
      </div>

      {/* Modal Vote */}
      <PlayersVoteModal
        isOpen={isModalOpen()}
        onClose={() => setIsModalOpen(false)}
        server_id={server()?.id || 0}
        discord_id_user={discord_id_user}
        server_secret_key={server()?.secret_key || ""}
        server_name={server()?.name || ''}
        server_ip={server()?.ip || ''}
        player_game_name={playerGameName() ?? ''}
        onPlayerNameChange={() => setPlayerGameName("")}
        onPlayerVote={handlePlayerVote}
      />

      <Notifications />
    </div>
  );
};

export default ServerDetail;
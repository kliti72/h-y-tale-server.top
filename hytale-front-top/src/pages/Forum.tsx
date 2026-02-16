import { Component, createSignal, For, Show, createMemo, onMount, onCleanup } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../auth/AuthContext";
import Notifications, { notify } from "../component/template/Notification";
import { marked } from "marked";

// Tipi
type Category = { 
  id: string; 
  name: string; 
  icon: string; 
  count: number;
  description: string;
  color: string;
};

type Topic = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorId: string;
  avatar: string;
  createdAt: string;
  lastActivity: string;
  replies: number;
  views: number;
  likes: number;
  category: string;
  isPinned?: boolean;
  isHot?: boolean;
  isLocked?: boolean;
  isSolved?: boolean;
  tags?: string[];
};

type Reply = {
  id: number;
  topicId: number;
  author: string;
  authorId: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isAccepted?: boolean;
};

type User = {
  id: string;
  username: string;
  avatar: string;
  role: string;
  posts: number;
  joined: string;
  reputation: number;
};

const categories: Category[] = [
  { 
    id: "all", 
    name: "Tutto", 
    icon: "🌐", 
    count: 1243, 
    description: "Tutte le discussioni",
    color: "from-violet-600 to-purple-600"
  },
  { 
    id: "pvp", 
    name: "PvP & Combat", 
    icon: "⚔️", 
    count: 487, 
    description: "Setup, strategie e meta PvP",
    color: "from-red-600 to-orange-600"
  },
  { 
    id: "plugin", 
    name: "Plugin & Config", 
    icon: "🔧", 
    count: 312, 
    description: "Setup server, plugin e configurazioni",
    color: "from-blue-600 to-cyan-600"
  },
  { 
    id: "italian", 
    name: "Community Italiana", 
    icon: "🇮🇹", 
    count: 256, 
    description: "Discussioni nella nostra lingua",
    color: "from-green-600 to-emerald-600"
  },
  { 
    id: "events", 
    name: "Eventi & Tornei", 
    icon: "🎉", 
    count: 189, 
    description: "Organizza e partecipa agli eventi",
    color: "from-pink-600 to-rose-600"
  },
  { 
    id: "help", 
    name: "Aiuto & Supporto", 
    icon: "❓", 
    count: 421, 
    description: "Problemi tecnici e richieste di aiuto",
    color: "from-yellow-600 to-amber-600"
  },
  { 
    id: "showcase", 
    name: "Showcase & Build", 
    icon: "🏗️", 
    count: 234, 
    description: "Mostra le tue creazioni",
    color: "from-indigo-600 to-purple-600"
  },
  { 
    id: "market", 
    name: "Marketplace", 
    icon: "💎", 
    count: 178, 
    description: "Compra, vendi e scambia",
    color: "from-emerald-600 to-teal-600"
  },
];

const mockTopics: Topic[] = [
  { 
    id: 1, 
    title: "Miglior setup PvP 2026? Meta attuale e strategie vincenti", 
    excerpt: "Quali armi e armor state usando ora? Netherite o Diamond?", 
    content: "# Setup PvP Meta 2026\n\nFratelli, mo vi spiego il **meta attuale** per dominare in PvP:\n\n## Armor\n- Full Netherite con Protection IV\n- Helmet con Respiration III\n- Boots con Feather Falling IV\n\n## Armi\n- Netherite Sword (Sharpness V, Sweeping Edge III)\n- Bow (Power V, Infinity, Flame)\n- Crossbow per quick damage\n\nVoi che usate?",
    author: "DarkSlayer", 
    authorId: "user_123",
    avatar: "🛡️", 
    createdAt: "2 ore fa", 
    lastActivity: "15 min fa",
    replies: 47, 
    views: 1240, 
    likes: 89,
    category: "pvp", 
    isHot: true,
    tags: ["meta", "pvp", "netherite"]
  },
  { 
    id: 2, 
    title: "[RISOLTO] VotePlugin non funziona su Velocity proxy", 
    excerpt: "Voti non arrivano dal proxy al server...", 
    content: "# Problema VotePlugin\n\nRaga ho un problema con VotePlugin su Velocity. I voti non arrivano dal proxy ai server backend.\n\n**Setup:**\n- Velocity 3.3.0\n- VotingPlugin 6.14\n- Spigot 1.20.4\n\nQualcuno sa come fixare?",
    author: "ProxyKing", 
    authorId: "user_456",
    avatar: "🚀", 
    createdAt: "5 ore fa", 
    lastActivity: "1 ora fa",
    replies: 23, 
    views: 892, 
    likes: 34,
    category: "plugin", 
    isPinned: true,
    isSolved: true,
    tags: ["velocity", "plugin", "help"]
  },
  { 
    id: 3, 
    title: "Cerco server italiani Roleplay seri e attivi 2026", 
    excerpt: "Qualcuno conosce server RP attivi con community italiana?", 
    content: "Yo bro, cerco server Roleplay italiani seri dove giocare. Devono avere:\n\n- Community attiva\n- Staff serio\n- Economia funzionante\n- Eventi regolari\n\nDrop i vostri consigli sotto 👇",
    author: "LucaRP", 
    authorId: "user_789",
    avatar: "🏰", 
    createdAt: "ieri", 
    lastActivity: "3 ore fa",
    replies: 68, 
    views: 1450, 
    likes: 103,
    category: "italian",
    isHot: true,
    tags: ["roleplay", "server", "italiano"]
  },
  { 
    id: 4, 
    title: "TORNEO PvP - Prize Pool 500€ - Registrazioni Aperte!", 
    excerpt: "Primo torneo ufficiale H-Ytale con premi veri!", 
    content: "# 🏆 TORNEO PVP UFFICIALE H-YTALE\n\n**Prize Pool: 500€**\n\n- 1° posto: 250€\n- 2° posto: 150€\n- 3° posto: 100€\n\n**Data:** 28 Febbraio 2026\n**Formato:** 1v1 Bracket\n**Registrazioni:** Aperte fino al 25 Feb\n\nPer iscrivervi commentate sotto con il vostro IGN!",
    author: "EventMaster", 
    authorId: "admin_1",
    avatar: "👑", 
    createdAt: "3 ore fa", 
    lastActivity: "20 min fa",
    replies: 156, 
    views: 3420, 
    likes: 287,
    category: "events",
    isPinned: true,
    isHot: true,
    tags: ["torneo", "pvp", "prize"]
  },
  { 
    id: 5, 
    title: "La mia mega base medievale - 6 mesi di lavoro", 
    excerpt: "Ho finito la mia build più ambiziosa, che ne pensate?", 
    content: "Bro ho speso **6 mesi** a buildare questa mega base medievale in survival.\n\n**Features:**\n- Castello principale con 4 torri\n- Villaggio completo con 20+ edifici\n- Sistema di farms automatiche\n- Porto con navi custom\n\nScreenshot incoming! Rate da 1 a 10 👇",
    author: "MasterBuilder", 
    authorId: "user_321",
    avatar: "🏗️", 
    createdAt: "ieri", 
    lastActivity: "5 ore fa",
    replies: 42, 
    views: 987, 
    likes: 156,
    category: "showcase",
    tags: ["build", "survival", "medieval"]
  },
];

const mockReplies: Reply[] = [
  {
    id: 1,
    topicId: 1,
    author: "PvPMaster",
    authorId: "user_999",
    avatar: "⚔️",
    content: "Bro io uso ancora Diamond con Protection IV perché costa meno riparare. Per il PvP serio però Netherite è must have.",
    createdAt: "1 ora fa",
    likes: 12
  },
  {
    id: 2,
    topicId: 1,
    author: "CombatLegend",
    authorId: "user_888",
    avatar: "🔥",
    content: "# Il mio setup\n\n**Armor:** Full Netherite (Prot IV, Unbreaking III)\n\n**Armi:**\n- Netherite Axe (Sharpness V) per burst damage\n- Sword per sustained DPS\n- Bow (Power V, Punch II, Infinity)\n\n**Consumabili:**\n- Golden Apples x64\n- Ender Pearls x16\n- Strength II potions\n\nQuesto setup mi ha fatto vincere 3 tornei, trust me bro 💯",
    createdAt: "45 min fa",
    likes: 23,
    isAccepted: true
  },
  {
    id: 3,
    topicId: 2,
    author: "DevExpert",
    authorId: "user_777",
    avatar: "💻",
    content: "Devi configurare il forwarding correttamente:\n\n```yaml\n# velocity.toml\nplayer-info-forwarding-mode = \"modern\"\n```\n\nE nel config di VotingPlugin abilita Velocity support. Poi restart tutto.",
    createdAt: "2 ore fa",
    likes: 18,
    isAccepted: true
  },
];

const topUsers: User[] = [
  { id: "1", username: "DarkSlayer", avatar: "🛡️", role: "Legend", posts: 1247, joined: "2023", reputation: 8940 },
  { id: "2", username: "ProxyKing", avatar: "🚀", role: "Expert", posts: 892, joined: "2024", reputation: 5670 },
  { id: "3", username: "BuildMaster", avatar: "🏗️", role: "Pro", posts: 634, joined: "2024", reputation: 4230 },
];

const Forum: Component = () => {
  const auth = useAuth();
  const [selectedCategory, setSelectedCategory] = createSignal("all");
  const [selectedTopic, setSelectedTopic] = createSignal<Topic | null>(null);
  const [showNewTopic, setShowNewTopic] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [sortBy, setSortBy] = createSignal<"recent" | "hot" | "replies" | "views">("hot");
  const [showFilters, setShowFilters] = createSignal(false);
  
  const [newTitle, setNewTitle] = createSignal("");
  const [newContent, setNewContent] = createSignal("");
  const [newCategory, setNewCategory] = createSignal("all");
  const [newTags, setNewTags] = createSignal("");
  
  const [replyContent, setReplyContent] = createSignal("");
  const [showMarkdownPreview, setShowMarkdownPreview] = createSignal(false);
  
  const [likedTopics, setLikedTopics] = createSignal<Set<number>>(new Set());
  const [likedReplies, setLikedReplies] = createSignal<Set<number>>(new Set());
  
  // Stats animate
  const [onlineUsers, setOnlineUsers] = createSignal(0);
  const [todayPosts, setTodayPosts] = createSignal(0);

  onMount(() => {
    // Animazione contatori
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setOnlineUsers(Math.min(count * 3, 284));
      setTodayPosts(Math.min(count * 4, 427));
      if (count >= 100) clearInterval(interval);
    }, 15);
  });

  const filteredTopics = createMemo(() => {
    let result = mockTopics;
    
    // Filtro categoria
    if (selectedCategory() !== "all") {
      result = result.filter(t => t.category === selectedCategory());
    }
    
    // Filtro ricerca
    const query = searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.excerpt.toLowerCase().includes(query) ||
        t.author.toLowerCase().includes(query) ||
        (t.tags || []).some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Ordinamento
    const sort = sortBy();
    result = [...result];
    
    // Pinned sempre in cima
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      if (sort === "hot") {
        const scoreA = (a.replies * 2) + (a.views / 10) + (a.likes * 3);
        const scoreB = (b.replies * 2) + (b.views / 10) + (b.likes * 3);
        return scoreB - scoreA;
      } else if (sort === "replies") {
        return b.replies - a.replies;
      } else if (sort === "views") {
        return b.views - a.views;
      }
      // recent by default
      return b.id - a.id;
    });
    
    return result;
  });

  const topicReplies = createMemo(() => {
    const topic = selectedTopic();
    if (!topic) return [];
    return mockReplies.filter(r => r.topicId === topic.id);
  });

  const handleCreateTopic = () => {
    if (!auth.isAuthenticated()) {
      notify("Devi fare login per creare topic bro 🔐", "error");
      return;
    }
    
    if (!newTitle().trim()) {
      notify("Inserisci un titolo decente fra", "error");
      return;
    }
    
    if (!newContent().trim()) {
      notify("Il contenuto è vuoto bro", "error");
      return;
    }
    
    if (newCategory() === "all") {
      notify("Scegli una categoria specifica", "error");
      return;
    }
    
    notify("Topic creato con successo! 🎉 (demo)", "success");
    setShowNewTopic(false);
    setNewTitle("");
    setNewContent("");
    setNewCategory("all");
    setNewTags("");
  };

  const handleReply = () => {
    if (!auth.isAuthenticated()) {
      notify("Fai login per rispondere bro 🔐", "error");
      return;
    }
    
    if (!replyContent().trim()) {
      notify("Scrivi qualcosa prima di inviare", "error");
      return;
    }
    
    notify("Risposta pubblicata! 💬", "success");
    setReplyContent("");
  };

  const toggleLikeTopic = (topicId: number) => {
    if (!auth.isAuthenticated()) {
      notify("Login per mettere like bro", "error");
      return;
    }
    
    setLikedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
        notify("Like rimosso", "info");
      } else {
        newSet.add(topicId);
        notify("Like aggiunto! 👍", "success");
      }
      return newSet;
    });
  };

  const toggleLikeReply = (replyId: number) => {
    if (!auth.isAuthenticated()) {
      notify("Login per mettere like", "error");
      return;
    }
    
    setLikedReplies(prev => {
      const newSet = new Set(prev);
      newSet.has(replyId) ? newSet.delete(replyId) : newSet.add(replyId);
      return newSet;
    });
  };

  const renderMarkdown = (text: string) => {
    return { __html: marked.parse(text) as string };
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("hot");
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950">
      <Notifications />

      {/* Hero Section Migliorato */}
      <div class="relative overflow-hidden bg-black/90 border-b border-violet-900/50">
        {/* Particelle di sfondo */}
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
          <div class="absolute w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700" />
        </div>

        <div class="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 class="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent mb-4">
            FORUM H-YTALE
          </h1>
          <p class="text-xl md:text-2xl text-violet-200 mb-8 max-w-2xl mx-auto">
            Discuti, chiedi aiuto, condividi esperienze con la community più fire 🔥
          </p>

          {/* Stats rapide */}
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: "👥", label: "Online", value: onlineUsers() },
              { icon: "💬", label: "Post Oggi", value: todayPosts() },
              { icon: "📝", label: "Topic", value: "2.8K" },
              { icon: "👤", label: "Membri", value: "4.1K" }
            ].map(stat => (
              <div class="bg-violet-950/50 backdrop-blur-sm rounded-xl p-4 border border-violet-800/30">
                <div class="text-2xl mb-1">{stat.icon}</div>
                <div class="text-2xl font-black text-white">{stat.value}</div>
                <div class="text-xs text-violet-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 sm:px-6 py-10">
        
        {/* ==================== SIDEBAR CATEGORIE ==================== */}
        <aside class="lg:w-80 flex-shrink-0">
          <div class="sticky top-6 space-y-6">
            
            {/* Bottone Nuovo Topic */}
            <Show when={auth.isAuthenticated()}>
              <button
                onClick={() => setShowNewTopic(true)}
                class="
                  w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 
                  rounded-2xl font-bold text-lg shadow-lg shadow-fuchsia-900/50
                  hover:scale-105 transition-all duration-300
                  flex items-center justify-center gap-3
                "
              >
                <span class="text-2xl">✍️</span>
                Nuovo Topic
              </button>
            </Show>

            {/* Categorie */}
            <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 border border-violet-900/50 backdrop-blur-md">
              <h3 class="uppercase text-xs font-bold text-violet-400 mb-5 tracking-widest flex items-center gap-2">
                <span>📂</span> Categorie
              </h3>
              <div class="space-y-2">
                <For each={categories}>
                  {(cat) => (
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedTopic(null);
                      }}
                      class={`
                        group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200
                        ${selectedCategory() === cat.id 
                          ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105` 
                          : "hover:bg-violet-950/60 text-violet-200 hover:scale-102"}
                      `}
                    >
                      <span class="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                      <div class="flex-1 text-left">
                        <div class="font-semibold text-sm">{cat.name}</div>
                        <div class="text-xs opacity-70">{cat.count} topic</div>
                      </div>
                      {selectedCategory() === cat.id && (
                        <span class="text-xl">→</span>
                      )}
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Stats Forum */}
            <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 border border-violet-900/50 backdrop-blur-md">
              <h4 class="font-bold text-fuchsia-400 mb-4 flex items-center gap-2">
                <span>📊</span> Statistiche
              </h4>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between items-center">
                  <span class="text-violet-300">Topic totali</span>
                  <strong class="text-white">2.847</strong>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-violet-300">Post totali</span>
                  <strong class="text-white">18.392</strong>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-violet-300">Membri</span>
                  <strong class="text-white">4.128</strong>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-violet-300">Record online</span>
                  <strong class="text-emerald-400">1.284 🔥</strong>
                </div>
              </div>
            </div>

            {/* Top Contributors */}
            <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 border border-violet-900/50 backdrop-blur-md">
              <h4 class="font-bold text-fuchsia-400 mb-4 flex items-center gap-2">
                <span>🏆</span> Top Contributors
              </h4>
              <div class="space-y-3">
                <For each={topUsers}>
                  {(user, i) => (
                    <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-violet-950/40 transition-colors">
                      <span class={`
                        text-2xl font-black w-8 text-center
                        ${i() === 0 ? 'text-yellow-400' : ''}
                        ${i() === 1 ? 'text-gray-300' : ''}
                        ${i() === 2 ? 'text-amber-600' : ''}
                      `}>
                        #{i() + 1}
                      </span>
                      <div class="text-2xl">{user.avatar}</div>
                      <div class="flex-1 min-w-0">
                        <div class="font-semibold text-sm truncate">{user.username}</div>
                        <div class="text-xs text-violet-400">{user.posts} post</div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>

            {/* Quick Links */}
            <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 border border-violet-900/50 backdrop-blur-md">
              <h4 class="font-bold text-fuchsia-400 mb-4 flex items-center gap-2">
                <span>🔗</span> Link Utili
              </h4>
              <div class="space-y-2 text-sm">
                <A href="/forum/rules" class="block text-violet-300 hover:text-fuchsia-400 transition-colors">
                  📜 Regole del Forum
                </A>
                <A href="/forum/guidelines" class="block text-violet-300 hover:text-fuchsia-400 transition-colors">
                  📋 Linee Guida
                </A>
                <A href="/forum/faq" class="block text-violet-300 hover:text-fuchsia-400 transition-colors">
                  ❓ FAQ
                </A>
                <A href="/forum/markdown" class="block text-violet-300 hover:text-fuchsia-400 transition-colors">
                  📝 Guida Markdown
                </A>
              </div>
            </div>
          </div>
        </aside>

        {/* ==================== AREA PRINCIPALE ==================== */}
        <main class="flex-1 min-w-0">
          
          {/* Breadcrumb */}
          <div class="flex flex-wrap items-center gap-2 text-sm text-violet-400 mb-6">
            <A href="/" class="hover:text-fuchsia-300 transition-colors">Home</A>
            <span>›</span>
            <A href="/forum" class="hover:text-fuchsia-300 transition-colors">Forum</A>
            <Show when={selectedCategory() !== "all"}>
              <span>›</span>
              <span class="text-fuchsia-300 font-medium">
                {categories.find(c => c.id === selectedCategory())?.name}
              </span>
            </Show>
            <Show when={selectedTopic()}>
              <span>›</span>
              <span class="text-white font-medium truncate max-w-xs">
                {selectedTopic()?.title}
              </span>
            </Show>
          </div>

          {/* ==================== LISTA TOPICS ==================== */}
          <Show when={!selectedTopic()}>
            
            {/* Header con controlli */}
            <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 mb-6 border border-violet-900/50 backdrop-blur-md">
              
              {/* Ricerca */}
              <div class="mb-6">
                <div class="relative">
                  <input
                    type="text"
                    placeholder="Cerca topic, autori, tag..."
                    value={searchQuery()}
                    onInput={(e) => setSearchQuery(e.currentTarget.value)}
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
                      onClick={() => setSearchQuery("")}
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400 hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  </Show>
                </div>
              </div>

              {/* Filtri e Sort */}
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-sm text-violet-300 font-medium">Ordina:</span>
                  <select
                    value={sortBy()}
                    onChange={(e) => setSortBy(e.currentTarget.value as any)}
                    class="
                      px-4 py-2 bg-gray-950/80 border border-violet-700/50 
                      rounded-lg text-white text-sm focus:outline-none focus:border-fuchsia-500
                    "
                  >
                    <option value="hot">🔥 Hot (Trending)</option>
                    <option value="recent">🆕 Recenti</option>
                    <option value="replies">💬 Più Risposte</option>
                    <option value="views">👁️ Più Viste</option>
                  </select>
                </div>

                <Show when={selectedCategory() !== "all" || searchQuery()}>
                  <button
                    onClick={clearFilters}
                    class="text-sm text-red-400 hover:text-red-300 underline"
                  >
                    Cancella filtri
                  </button>
                </Show>
              </div>

              {/* Risultati count */}
              <div class="mt-4 text-sm text-violet-400">
                Mostrando <span class="font-bold text-fuchsia-400">{filteredTopics().length}</span> topic
                {searchQuery() && ` per "${searchQuery()}"`}
              </div>
            </div>

            {/* Lista Topics */}
            <Show 
              when={filteredTopics().length > 0}
              fallback={
                <div class="text-center py-20 bg-gray-900/50 rounded-2xl border border-violet-900/30">
                  <div class="text-6xl mb-4">🔍</div>
                  <p class="text-violet-300 text-xl mb-2">Nessun topic trovato</p>
                  <p class="text-violet-400/70 mb-6">
                    Prova a cambiare categoria o ricerca
                  </p>
                  <button
                    onClick={clearFilters}
                    class="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl transition-colors"
                  >
                    Mostra tutti
                  </button>
                </div>
              }
            >
              <div class="space-y-4">
                <For each={filteredTopics()}>
                  {(topic) => (
                    <div class="
                      group bg-gradient-to-br from-gray-950/90 to-indigo-950/90 
                      border border-violet-800/50 hover:border-fuchsia-600/70
                      rounded-2xl p-6 cursor-pointer transition-all duration-300
                      hover:shadow-2xl hover:shadow-fuchsia-900/30 hover:-translate-y-1
                      backdrop-blur-sm
                    ">
                      <div class="flex gap-5">
                        
                        {/* Avatar */}
                        <div 
                          onClick={() => setSelectedTopic(topic)}
                          class="text-4xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all flex-shrink-0"
                        >
                          {topic.avatar}
                        </div>

                        {/* Contenuto */}
                        <div class="flex-1 min-w-0">
                          <div 
                            onClick={() => setSelectedTopic(topic)}
                            class="cursor-pointer"
                          >
                            {/* Titolo e badges */}
                            <div class="flex items-start justify-between gap-4 mb-2">
                              <h3 class="text-xl font-bold group-hover:text-fuchsia-300 transition-colors line-clamp-2 flex-1">
                                {topic.isPinned && <span class="text-yellow-400">📌 </span>}
                                {topic.isHot && <span class="text-orange-400">🔥 </span>}
                                {topic.isSolved && <span class="text-green-400">✅ </span>}
                                {topic.isLocked && <span class="text-red-400">🔒 </span>}
                                {topic.title}
                              </h3>
                              
                              {/* Stats rapide */}
                              <div class="flex items-center gap-4 text-sm flex-shrink-0">
                                <div class="text-emerald-400 font-mono flex items-center gap-1">
                                  <span>💬</span> {topic.replies}
                                </div>
                                <div class="text-violet-400 font-mono flex items-center gap-1">
                                  <span>👁️</span> {topic.views}
                                </div>
                              </div>
                            </div>

                            {/* Excerpt */}
                            <p class="text-violet-200/80 line-clamp-2 mb-3 text-sm">
                              {topic.excerpt}
                            </p>

                            {/* Tags */}
                            <Show when={topic.tags && topic.tags.length > 0}>
                              <div class="flex flex-wrap gap-2 mb-3">
                                <For each={topic.tags}>
                                  {(tag) => (
                                    <span class="px-3 py-1 bg-violet-950/60 border border-violet-700/40 rounded-full text-xs text-violet-300">
                                      #{tag}
                                    </span>
                                  )}
                                </For>
                              </div>
                            </Show>

                            {/* Meta info */}
                            <div class="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                              <span class="flex items-center gap-1.5">
                                <span class="text-violet-400">👤</span>
                                <strong class="text-violet-300">{topic.author}</strong>
                              </span>
                              <span>•</span>
                              <span class="flex items-center gap-1.5">
                                <span>🕐</span>
                                {topic.createdAt}
                              </span>
                              <span>•</span>
                              <span class="flex items-center gap-1.5">
                                <span>⚡</span>
                                ultimo: {topic.lastActivity}
                              </span>
                              <span>•</span>
                              <span class="text-fuchsia-400 font-medium">
                                {categories.find(c => c.id === topic.category)?.icon} {categories.find(c => c.id === topic.category)?.name}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div class="flex items-center gap-3 mt-4 pt-4 border-t border-violet-900/30">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLikeTopic(topic.id);
                              }}
                              class={`
                                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                ${likedTopics().has(topic.id)
                                  ? "bg-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-500/50"
                                  : "bg-violet-950/40 text-violet-300 hover:bg-violet-900/60 border border-violet-700/30"}
                              `}
                            >
                              <span>{likedTopics().has(topic.id) ? "❤️" : "🤍"}</span>
                              {topic.likes + (likedTopics().has(topic.id) ? 1 : 0)}
                            </button>

                            <button
                              onClick={() => setSelectedTopic(topic)}
                              class="
                                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                                bg-violet-950/40 text-violet-300 hover:bg-violet-900/60 
                                border border-violet-700/30 transition-all
                              "
                            >
                              <span>💬</span>
                              Rispondi
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                notify("Condiviso negli appunti! (demo)", "success");
                              }}
                              class="
                                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                                bg-violet-950/40 text-violet-300 hover:bg-violet-900/60 
                                border border-violet-700/30 transition-all
                              "
                            >
                              <span>🔗</span>
                              Condividi
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </Show>

          {/* ==================== VISTA TOPIC SINGOLO ==================== */}
          <Show when={selectedTopic()}>
            <div class="space-y-6">
              
              {/* Header Topic */}
              <div class="bg-gradient-to-br from-gray-950/90 to-purple-950/90 border border-violet-700/50 rounded-3xl p-8 backdrop-blur-sm">
                <button 
                  onClick={() => setSelectedTopic(null)} 
                  class="text-violet-400 hover:text-white mb-6 flex items-center gap-2 transition-colors group"
                >
                  <span class="group-hover:-translate-x-1 transition-transform">←</span>
                  Torna alle discussioni
                </button>

                {/* Badges */}
                <div class="flex flex-wrap gap-2 mb-4">
                  {selectedTopic()?.isPinned && (
                    <span class="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-xs text-yellow-300 font-medium">
                      📌 Pinned
                    </span>
                  )}
                  {selectedTopic()?.isHot && (
                    <span class="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-xs text-orange-300 font-medium">
                      🔥 Hot
                    </span>
                  )}
                  {selectedTopic()?.isSolved && (
                    <span class="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-xs text-green-300 font-medium">
                      ✅ Risolto
                    </span>
                  )}
                  {selectedTopic()?.isLocked && (
                    <span class="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-xs text-red-300 font-medium">
                      🔒 Bloccato
                    </span>
                  )}
                </div>

                {/* Titolo */}
                <h1 class="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                  {selectedTopic()?.title}
                </h1>

                {/* Meta */}
                <div class="flex flex-wrap items-center gap-4 text-sm text-violet-400 mb-6">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">{selectedTopic()?.avatar}</span>
                    <strong class="text-violet-200">{selectedTopic()?.author}</strong>
                  </div>
                  <span>•</span>
                  <span>{selectedTopic()?.createdAt}</span>
                  <span>•</span>
                  <span>{selectedTopic()?.views} visualizzazioni</span>
                  <span>•</span>
                  <span>{selectedTopic()?.replies} risposte</span>
                </div>

                {/* Tags */}
                <Show when={selectedTopic()?.tags && selectedTopic()!.tags!.length > 0}>
                  <div class="flex flex-wrap gap-2 mb-6">
                    <For each={selectedTopic()?.tags}>
                      {(tag) => (
                        <span class="px-4 py-1.5 bg-violet-950/60 border border-violet-600/50 rounded-full text-sm text-violet-200">
                          #{tag}
                        </span>
                      )}
                    </For>
                  </div>
                </Show>

                {/* Contenuto con Markdown */}
                <div 
                  class="
                    prose prose-invert max-w-none
                    prose-headings:text-fuchsia-300 prose-headings:font-bold
                    prose-a:text-violet-400 prose-a:no-underline hover:prose-a:text-fuchsia-400
                    prose-code:text-pink-300 prose-code:bg-black/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-black/60 prose-pre:border prose-pre:border-violet-700/30
                    prose-strong:text-violet-200
                    prose-ul:text-violet-100
                  " 
                  innerHTML={renderMarkdown(selectedTopic()!.content)} 
                />

                {/* Actions Topic */}
                <div class="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-violet-800/30">
                  <button
                    onClick={() => toggleLikeTopic(selectedTopic()!.id)}
                    class={`
                      flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                      ${likedTopics().has(selectedTopic()!.id)
                        ? "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-900/50"
                        : "bg-violet-950/60 text-violet-200 hover:bg-violet-900/80 border border-violet-700/40"}
                    `}
                  >
                    <span class="text-xl">{likedTopics().has(selectedTopic()!.id) ? "❤️" : "🤍"}</span>
                    {selectedTopic()!.likes + (likedTopics().has(selectedTopic()!.id) ? 1 : 0)} Like
                  </button>

                  <button
                    onClick={() => notify("Link copiato! (demo)", "success")}
                    class="
                      flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                      bg-violet-950/60 text-violet-200 hover:bg-violet-900/80 
                      border border-violet-700/40 transition-all
                    "
                  >
                    <span>🔗</span>
                    Condividi
                  </button>

                  <Show when={auth.isAuthenticated()}>
                    <button
                      onClick={() => notify("Funzione in arrivo! (demo)", "info")}
                      class="
                        flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                        bg-violet-950/60 text-violet-200 hover:bg-violet-900/80 
                        border border-violet-700/40 transition-all
                      "
                    >
                      <span>⭐</span>
                      Salva
                    </button>
                  </Show>
                </div>
              </div>

              {/* Risposte */}
              <div class="bg-gradient-to-br from-gray-950/90 to-indigo-950/90 border border-violet-700/50 rounded-3xl p-8 backdrop-blur-sm">
                <h3 class="text-2xl font-bold text-fuchsia-400 mb-6 flex items-center gap-3">
                  <span>💬</span>
                  {topicReplies().length} Risposte
                </h3>

                <Show 
                  when={topicReplies().length > 0}
                  fallback={
                    <div class="text-center py-12 text-violet-400">
                      <div class="text-5xl mb-4">💭</div>
                      <p class="text-lg">Nessuna risposta ancora... Sii il primo!</p>
                    </div>
                  }
                >
                  <div class="space-y-6">
                    <For each={topicReplies()}>
                      {(reply) => (
                        <div class={`
                          bg-black/40 border rounded-2xl p-6 transition-all
                          ${reply.isAccepted 
                            ? "border-green-500/50 bg-green-950/20" 
                            : "border-violet-700/30 hover:border-violet-600/50"}
                        `}>
                          {/* Header Reply */}
                          <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center gap-3">
                              <span class="text-3xl">{reply.avatar}</span>
                              <div>
                                <div class="font-semibold text-violet-200">{reply.author}</div>
                                <div class="text-xs text-violet-400">{reply.createdAt}</div>
                              </div>
                            </div>

                            {reply.isAccepted && (
                              <span class="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-xs text-green-300 font-medium">
                                ✅ Risposta Accettata
                              </span>
                            )}
                          </div>

                          {/* Contenuto Reply */}
                          <div 
                            class="
                              prose prose-invert prose-sm max-w-none
                              prose-headings:text-fuchsia-300
                              prose-a:text-violet-400 hover:prose-a:text-fuchsia-400
                              prose-code:text-pink-300 prose-code:bg-black/60 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                              prose-pre:bg-black/80 prose-pre:border prose-pre:border-violet-700/20
                            " 
                            innerHTML={renderMarkdown(reply.content)} 
                          />

                          {/* Actions Reply */}
                          <div class="flex items-center gap-3 mt-4 pt-4 border-t border-violet-800/20">
                            <button
                              onClick={() => toggleLikeReply(reply.id)}
                              class={`
                                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                ${likedReplies().has(reply.id)
                                  ? "bg-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-500/50"
                                  : "bg-violet-950/40 text-violet-300 hover:bg-violet-900/60 border border-transparent"}
                              `}
                            >
                              <span>{likedReplies().has(reply.id) ? "👍" : "👍🏻"}</span>
                              {reply.likes + (likedReplies().has(reply.id) ? 1 : 0)}
                            </button>

                            <button
                              onClick={() => notify("Risposta quotata! (demo)", "info")}
                              class="text-sm text-violet-400 hover:text-violet-200 transition-colors"
                            >
                              💬 Cita
                            </button>

                            <Show when={auth.isAuthenticated() && auth.user()?.id === selectedTopic()?.authorId}>
                              <button
                                onClick={() => notify("Risposta accettata! (demo)", "success")}
                                class="text-sm text-green-400 hover:text-green-300 transition-colors"
                              >
                                ✅ Accetta Risposta
                              </button>
                            </Show>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
              </div>

              {/* Form Nuova Risposta */}
              <Show when={auth.isAuthenticated() && !selectedTopic()?.isLocked}>
                <div class="bg-gradient-to-br from-gray-950/90 to-purple-950/90 border border-violet-700/50 rounded-3xl p-8 backdrop-blur-sm">
                  <h3 class="text-2xl font-bold text-fuchsia-400 mb-6 flex items-center gap-3">
                    <span>✍️</span>
                    Scrivi una Risposta
                  </h3>

                  {/* Tabs Preview/Edit */}
                  <div class="flex gap-2 mb-4">
                    <button
                      onClick={() => setShowMarkdownPreview(false)}
                      class={`
                        px-6 py-2 rounded-t-lg font-medium transition-all
                        ${!showMarkdownPreview()
                          ? "bg-violet-700 text-white"
                          : "bg-violet-950/60 text-violet-300 hover:bg-violet-900/80"}
                      `}
                    >
                      ✏️ Scrivi
                    </button>
                    <button
                      onClick={() => setShowMarkdownPreview(true)}
                      class={`
                        px-6 py-2 rounded-t-lg font-medium transition-all
                        ${showMarkdownPreview()
                          ? "bg-violet-700 text-white"
                          : "bg-violet-950/60 text-violet-300 hover:bg-violet-900/80"}
                      `}
                    >
                      👁️ Preview
                    </button>
                  </div>

                  {/* Editor/Preview */}
                  <Show when={!showMarkdownPreview()}>
                    <textarea
                      placeholder="Scrivi la tua risposta... (supporta **Markdown**)"
                      value={replyContent()}
                      onInput={(e) => setReplyContent(e.currentTarget.value)}
                      class="
                        w-full h-48 p-6 rounded-xl bg-black/60 border border-violet-700/50
                        text-white placeholder-violet-400 resize-none
                        focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/50
                        transition-all duration-200
                      "
                    />
                  </Show>

                  <Show when={showMarkdownPreview()}>
                    <div class="
                      min-h-48 p-6 rounded-xl bg-black/60 border border-violet-700/50
                      prose prose-invert max-w-none
                    ">
                      <Show 
                        when={replyContent().trim()}
                        fallback={<p class="text-violet-400/50 italic">Nessun contenuto da mostrare...</p>}
                      >
                        <div innerHTML={renderMarkdown(replyContent())} />
                      </Show>
                    </div>
                  </Show>

                  {/* Helper Text */}
                  <p class="text-xs text-violet-400 mt-3 mb-6">
                    💡 Supporto Markdown: **grassetto**, *corsivo*, `code`, [link](url), # titoli
                  </p>

                  {/* Buttons */}
                  <div class="flex gap-4">
                    <button
                      onClick={() => {
                        setReplyContent("");
                        setShowMarkdownPreview(false);
                      }}
                      class="
                        px-8 py-4 bg-zinc-800 hover:bg-zinc-700 
                        rounded-xl font-semibold transition-colors
                      "
                    >
                      Annulla
                    </button>
                    <button
                      onClick={handleReply}
                      disabled={!replyContent().trim()}
                      class="
                        flex-1 px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-violet-600 
                        hover:from-fuchsia-500 hover:to-violet-500
                        rounded-xl font-bold shadow-lg shadow-fuchsia-900/50
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300
                      "
                    >
                      Pubblica Risposta 🚀
                    </button>
                  </div>
                </div>
              </Show>

              {/* Messaggio se locked */}
              <Show when={selectedTopic()?.isLocked}>
                <div class="bg-red-950/30 border border-red-500/50 rounded-2xl p-6 text-center">
                  <div class="text-4xl mb-3">🔒</div>
                  <p class="text-red-300 font-medium">
                    Questo topic è stato bloccato e non accetta nuove risposte
                  </p>
                </div>
              </Show>

              {/* Messaggio se non loggato */}
              <Show when={!auth.isAuthenticated()}>
                <div class="bg-violet-950/30 border border-violet-500/50 rounded-2xl p-6 text-center">
                  <div class="text-4xl mb-3">🔐</div>
                  <p class="text-violet-300 mb-4">
                    Devi essere loggato per rispondere
                  </p>
                  <A 
                    href="/login"
                    class="
                      inline-block px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600
                      rounded-xl font-semibold hover:scale-105 transition-transform
                    "
                  >
                    Accedi ora
                  </A>
                </div>
              </Show>
            </div>
          </Show>
        </main>
      </div>

      {/* ==================== MODAL NUOVO TOPIC ==================== */}
      <Show when={showNewTopic()}>
        <div class="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div class="bg-gradient-to-br from-gray-950 to-indigo-950 border-2 border-fuchsia-600/70 rounded-3xl w-full max-w-3xl p-8 md:p-10 my-8">
            
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-3xl md:text-4xl font-black bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                ✍️ Crea Nuovo Topic
              </h2>
              <button
                onClick={() => setShowNewTopic(false)}
                class="text-3xl text-violet-400 hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div class="space-y-6">
              
              {/* Titolo */}
              <div>
                <label class="block text-sm font-medium text-violet-300 mb-2">
                  Titolo del Topic *
                </label>
                <input
                  type="text"
                  placeholder="Es: Come configurare VotePlugin su Velocity?"
                  value={newTitle()}
                  onInput={(e) => setNewTitle(e.currentTarget.value)}
                  class="
                    w-full px-6 py-4 rounded-xl bg-black/60 border border-violet-700/50
                    text-white placeholder-violet-400
                    focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/50
                    transition-all duration-200
                  "
                />
              </div>

              {/* Categoria */}
              <div>
                <label class="block text-sm font-medium text-violet-300 mb-2">
                  Categoria *
                </label>
                <select
                  value={newCategory()}
                  onChange={(e) => setNewCategory(e.currentTarget.value)}
                  class="
                    w-full px-6 py-4 rounded-xl bg-black/60 border border-violet-700/50
                    text-white focus:outline-none focus:border-fuchsia-500
                    transition-all duration-200
                  "
                >
                  <option value="all" disabled>Seleziona una categoria</option>
                  <For each={categories.filter(c => c.id !== "all")}>
                    {(cat) => (
                      <option value={cat.id}>{cat.icon} {cat.name}</option>
                    )}
                  </For>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label class="block text-sm font-medium text-violet-300 mb-2">
                  Tags (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="pvp, meta, tutorial (separati da virgola)"
                  value={newTags()}
                  onInput={(e) => setNewTags(e.currentTarget.value)}
                  class="
                    w-full px-6 py-4 rounded-xl bg-black/60 border border-violet-700/50
                    text-white placeholder-violet-400
                    focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/50
                    transition-all duration-200
                  "
                />
                <p class="text-xs text-violet-400 mt-2">
                  Aiuta gli altri a trovare il tuo topic più facilmente
                </p>
              </div>

              {/* Contenuto */}
              <div>
                <label class="block text-sm font-medium text-violet-300 mb-2">
                  Contenuto (supporta Markdown) *
                </label>
                <textarea
                  placeholder="Descrivi il tuo topic... Usa **grassetto**, *corsivo*, `code`, ecc."
                  value={newContent()}
                  onInput={(e) => setNewContent(e.currentTarget.value)}
                  class="
                    w-full h-64 p-6 rounded-xl bg-black/60 border border-violet-700/50
                    text-white placeholder-violet-400 resize-none
                    focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/50
                    transition-all duration-200
                  "
                />
                <p class="text-xs text-violet-400 mt-2">
                  💡 Supporto completo Markdown: titoli, liste, code blocks, link, immagini
                </p>
              </div>

              {/* Buttons */}
              <div class="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowNewTopic(false);
                    setNewTitle("");
                    setNewContent("");
                    setNewCategory("all");
                    setNewTags("");
                  }}
                  class="
                    flex-1 py-4 px-6 bg-zinc-800 hover:bg-zinc-700 
                    rounded-xl font-semibold transition-colors
                  "
                >
                  Annulla
                </button>
                <button
                  onClick={handleCreateTopic}
                  class="
                    flex-1 py-4 px-6 bg-gradient-to-r from-fuchsia-600 to-violet-600 
                    hover:from-fuchsia-500 hover:to-violet-500
                    rounded-xl font-bold shadow-lg shadow-fuchsia-900/50
                    transition-all duration-300
                  "
                >
                  Pubblica Topic 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Forum;
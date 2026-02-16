import { Component, createSignal, For, Show, createMemo } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../auth/AuthContext";
import Notifications, { notify } from "../component/template/Notification";
import { marked } from "marked";

type Category = {
  id: string;
  name: string;
  icon: string;
  count: number;
  sub?: { id: string; name: string; count: number }[];
};

type Topic = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  avatar: string;
  discordId?: string;
  createdAt: string;
  replies: number;
  views: number;
  likes: number;
  isLiked: boolean;
  category: string;
  isPinned?: boolean;
  isHot?: boolean;
};

const categories: Category[] = [
  { id: "all", name: "Tutto", icon: "🌐", count: 1243 },
  { 
    id: "pvp", name: "PvP", icon: "⚔️", count: 487,
    sub: [
      { id: "duels", name: "Duels", count: 142 },
      { id: "bedwars", name: "BedWars", count: 98 },
      { id: "practice", name: "Practice", count: 67 }
    ]
  },
  { id: "plugin", name: "Plugin & Config", icon: "🔧", count: 312 },
  { id: "italian", name: "Community Italiana", icon: "🇮🇹", count: 256 },
  { id: "events", name: "Eventi & Tornei", icon: "🎉", count: 189 },
  { id: "help", name: "Aiuto & Supporto", icon: "❓", count: 421 },
];

const mockTopics: Topic[] = [
  { id: 1, title: "Miglior setup PvP 2026? Meta attuale", excerpt: "Quali armi e armor state usando ora?", author: "DarkSlayer", avatar: "🛡️", discordId: "123456789", createdAt: "2 ore fa", replies: 47, views: 1240, likes: 23, isLiked: false, category: "pvp", isHot: true },
  { id: 2, title: "VotePlugin non funziona su Velocity", excerpt: "Voti non arrivano dal proxy...", author: "ProxyKing", avatar: "🚀", discordId: "987654321", createdAt: "5 ore fa", replies: 23, views: 892, likes: 12, isLiked: true, category: "plugin", isPinned: true },
  { id: 3, title: "Cerco server italiani Roleplay", excerpt: "Qualcuno conosce server RP attivi?", author: "LucaRP", avatar: "🏰", discordId: "555555555", createdAt: "ieri", replies: 68, views: 1450, likes: 34, isLiked: false, category: "italian" },
];

const Forum: Component = () => {
  const auth = useAuth();

  const [topics, setTopics] = createSignal<Topic[]>(mockTopics);
  const [selectedCategory, setSelectedCategory] = createSignal("all");
  const [selectedSub, setSelectedSub] = createSignal<string | null>(null);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [selectedTopic, setSelectedTopic] = createSignal<Topic | null>(null);
  const [showNewTopic, setShowNewTopic] = createSignal(false);

  const [newTitle, setNewTitle] = createSignal("");
  const [newContent, setNewContent] = createSignal("");

  // Filtraggio avanzato
  const filteredTopics = createMemo(() => {
    let list = topics();

    // Filtro categoria
    if (selectedCategory() !== "all") {
      list = list.filter(t => t.category === selectedCategory());
    }

    // Filtro sottocategoria
    if (selectedSub()) {
      list = list.filter(t => t.category === selectedSub());
    }

    // Ricerca globale
    if (searchQuery()) {
      const q = searchQuery().toLowerCase();
      list = list.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.excerpt.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q)
      );
    }

    return list;
  });

  const toggleLike = (id: number) => {
    setTopics(prev => prev.map(t => t.id === id 
      ? { ...t, likes: t.isLiked ? t.likes - 1 : t.likes + 1, isLiked: !t.isLiked } 
      : t
    ));
    notify("Like registrato!", "success");
  };

  const openDiscordDM = (discordId?: string, author?: string) => {
    if (!discordId) {
      notify("L'utente non ha Discord collegato", "error");
      return;
    }
    notify(`Apertura chat Discord con ${author}...`, "info");
    // Qui puoi mettere window.open(`https://discord.com/users/${discordId}`);
  };

  
  const renderMarkdown = (text: string) => {
    return { __html: marked.parse(text) as string };
  };

   const handleCreateTopic = () => {
    if (!newTitle() || !newContent()) return notify("Compila tutti i campi", "error");
    notify("Topic creato con successo! (demo)", "success");
    setShowNewTopic(false);
    setNewTitle("");
    setNewContent("");
  };


  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white">
      <Notifications />

      {/* Hero + Ricerca Globale */}
      <div class="bg-black/95 border-b border-violet-900 py-12">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 class="text-5xl md:text-6xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              FORUM
            </h1>
            <p class="text-xl text-violet-200 mt-2">La community di Hytale</p>
          </div>

          <div class="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Cerca topic, autori, plugin..."
              value={searchQuery()}
              onInput={e => setSearchQuery(e.currentTarget.value)}
              class="w-full pl-14 pr-6 py-4 bg-black/70 border border-violet-700 rounded-2xl text-lg focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30"
            />
            <span class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
          </div>

          <button
            onClick={() => setShowNewTopic(true)}
            class="px-10 py-4 bg-gradient-to-r from-violet-700 to-fuchsia-700 rounded-2xl font-bold text-lg hover:scale-105 transition"
          >
            + Nuovo Topic
          </button>
        </div>
      </div>

      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 px-6 py-12">
        {/* ==================== SIDEBAR CATEGORIE ==================== */}
        <aside class="lg:w-72 flex-shrink-0">
          <h3 class="uppercase text-xs font-bold text-violet-400 mb-5 tracking-widest">Categorie</h3>
          
          <div class="space-y-2">
            <For each={categories}>
              {(cat) => (
                <div>
                  <button
                    onClick={() => { setSelectedCategory(cat.id); setSelectedSub(null); }}
                    class={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${selectedCategory() === cat.id ? 'bg-violet-700 text-white shadow-lg' : 'hover:bg-violet-950/60'}`}
                  >
                    <span class="text-3xl">{cat.icon}</span>
                    <div class="flex-1 text-left">
                      <div class="font-semibold">{cat.name}</div>
                      <div class="text-xs text-violet-400">{cat.count} topic</div>
                    </div>
                  </button>

                  <Show when={cat.sub && selectedCategory() === cat.id}>
                    <div class="ml-12 mt-2 space-y-1">
                      <For each={cat.sub}>
                        {(sub) => (
                          <button
                            onClick={() => setSelectedSub(sub.id)}
                            class={`w-full text-left px-4 py-2.5 rounded-xl text-sm ${selectedSub() === sub.id ? 'bg-fuchsia-700 text-white' : 'hover:bg-violet-900'}`}
                          >
                            {sub.name} ({sub.count})
                          </button>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
              )}
            </For>
          </div>
        </aside>

        {/* ==================== AREA PRINCIPALE ==================== */}
        <main class="flex-1">
                  <div class="space-y-6">
              <For each={filteredTopics()}>
                {(topic) => (
                  <div
                    onClick={() => setSelectedTopic(topic)}
                    class="group bg-gradient-to-br from-gray-950 to-indigo-950 border border-violet-800/50 hover:border-fuchsia-600 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-0.5"
                  >
                    <div class="flex gap-5">
                      <div class="text-4xl opacity-70">{topic.avatar}</div>
                      <div class="flex-1">
                        <div class="flex items-start justify-between">
                          <h3 class="text-xl font-bold group-hover:text-fuchsia-300 transition">
                            {topic.isPinned && "📌 "}
                            {topic.isHot && "🔥 "}
                            {topic.title}
                          </h3>
                          <div class="text-right text-xs text-emerald-400 font-mono">
                            {topic.replies} <span class="text-zinc-500">risposte</span>
                          </div>
                        </div>
                        <p class="text-violet-200/80 line-clamp-2 mt-2">{topic.excerpt}</p>
                        <div class="mt-4 flex items-center gap-4 text-xs text-zinc-400">
                          <span>da <strong class="text-violet-300">{topic.author}</strong></span>
                          <span>•</span>
                          <span>{topic.createdAt}</span>
                          <span>•</span>
                          <span>{topic.views} visualizzazioni</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>

          {/* Vista singolo Topic con Markdown */}
          <Show when={selectedTopic()}>
            <div class="bg-gradient-to-br from-gray-950 to-purple-950 border border-violet-700 rounded-3xl p-8">
              <button onClick={() => setSelectedTopic(null)} class="text-violet-400 hover:text-white mb-6">
                ← Torna alle discussioni
              </button>

              <h1 class="text-3xl font-black mb-6">{selectedTopic()?.title}</h1>

              <div class="prose prose-invert max-w-none" innerHTML={renderMarkdown(selectedTopic()!.excerpt + "\n\n*(contenuto completo con markdown)*")} />

              {/* Risposte (mock) */}
              <div class="mt-12 space-y-8">
                <h3 class="text-2xl font-bold text-fuchsia-400">Risposte</h3>
                <div class="bg-black/40 rounded-2xl p-6">
                  <p class="text-zinc-300">Esempio di risposta con <strong>markdown</strong> supportato: **grassetto**, *corsivo*, link, ecc.</p>
                </div>
              </div>
            </div>
          </Show>
      </div>

 <Show when={selectedTopic()}>
            <div class="bg-gradient-to-br from-gray-950 to-purple-950 border border-violet-700 rounded-3xl p-8">
              <button onClick={() => setSelectedTopic(null)} class="text-violet-400 hover:text-white mb-6">
                ← Torna alle discussioni
              </button>

              <h1 class="text-3xl font-black mb-6">{selectedTopic()?.title}</h1>

              <div class="prose prose-invert max-w-none" innerHTML={renderMarkdown(selectedTopic()!.excerpt + "\n\n*(contenuto completo con markdown)*")} />

              {/* Risposte (mock) */}
              <div class="mt-12 space-y-8">
                <h3 class="text-2xl font-bold text-fuchsia-400">Risposte</h3>
                <div class="bg-black/40 rounded-2xl p-6">
                  <p class="text-zinc-300">Esempio di risposta con <strong>markdown</strong> supportato: **grassetto**, *corsivo*, link, ecc.</p>
                </div>
              </div>
            </div>
          </Show>

      {/* Modal Nuovo Topic */}
     <Show when={showNewTopic()}>
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center">
          <div class="bg-gradient-to-br from-gray-950 to-indigo-950 border border-fuchsia-600 rounded-3xl w-full max-w-2xl p-10">
            <h2 class="text-3xl font-black mb-8">Crea Nuovo Topic</h2>
            {/* form semplice */}
            <input placeholder="Titolo" class="w-full p-4 rounded-xl bg-black/60 mb-4" value={newTitle()} onInput={e => setNewTitle(e.currentTarget.value)} />
            <textarea placeholder="Contenuto (supporta markdown)" class="w-full h-48 p-4 rounded-xl bg-black/60 mb-6" value={newContent()} onInput={e => setNewContent(e.currentTarget.value)} />
            <div class="flex gap-4">
              <button onClick={() => setShowNewTopic(false)} class="flex-1 py-4 bg-zinc-800 rounded-xl">Annulla</button>
              <button onClick={handleCreateTopic} class="flex-1 py-4 bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-xl font-bold">Pubblica</button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Forum;
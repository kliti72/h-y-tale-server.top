import { Component, createSignal, For, Show, createMemo, onMount, onCleanup } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../auth/AuthContext"; // assumo esista
import Notifications, { notify } from "../component/template/Notification";
import { marked } from "marked";

// ────────────────────────────────────────────────
// Tipi adattati per GUIDE (non topics generici)
// ────────────────────────────────────────────────
type Category = { 
  id: string; 
  name: string; 
  icon: string; 
  count: number;
  description: string;
  color: string;
};

type Guide = {
  id: number;
  title: string;
  excerpt: string;
  content: string;          // markdown
  author: string;
  authorId: string;
  avatar: string;
  createdAt: string;
  lastUpdated: string;
  views: number;
  likes: number;
  comments: number;
  difficulty: "Principiante" | "Intermedio" | "Avanzato";
  readingTime: string;      // es: "8 min"
  category: string;
  isFeatured?: boolean;     // in evidenza
  tags: string[];
};

type Comment = {
  id: number;
  guideId: number;
  author: string;
  authorId: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
};

const categories: Category[] = [
  { id: "all",        name: "Tutte le Guide",     icon: "📚", count: 342, description: "Tutte le guide", color: "from-violet-600 to-purple-600" },
  { id: "beginner",   name: "Principanti",        icon: "🌱", count: 128, description: "Prime armi, risorse, basi", color: "from-emerald-600 to-teal-600" },
  { id: "building",   name: "Building & Design",  icon: "🏰", count: 95,  description: "Costruzioni, prefab, decorazioni", color: "from-amber-600 to-orange-600" },
  { id: "combat",     name: "Combat & PvP",       icon: "⚔️", count: 87,  description: "Meta armi, combo, armor", color: "from-red-600 to-rose-600" },
  { id: "progression",name: "Progression",        icon: "⬆️", count: 64,  description: "Tier up, adamantite, end-game", color: "from-blue-600 to-cyan-600" },
  { id: "scripting",  name: "Scripting & Mods",   icon: "💻", count: 56,  description: "JS scripting, visual scripting", color: "from-indigo-600 to-purple-600" },
  { id: "server",     name: "Server & Hosting",   icon: "🌐", count: 42,  description: "Setup server, plugin, config", color: "from-pink-600 to-fuchsia-600" },
  { id: "other",      name: "Altro",              icon: "❓", count: 31,  description: "Tips vari, easter egg, lore", color: "from-gray-600 to-zinc-600" },
];

const mockGuides: Guide[] = [
  { 
    id: 1, 
    title: "Guida Completa Progression 2026 – Da Stone a Adamantite", 
    excerpt: "Come raggiungere velocemente Tier 3 workbench, anvil e adamantite tools/armor in Adventure mode", 
    content: "# Progression Adamantite 2026\n\n## Tier 0 → Crude\n- Raccogli legno e pietra\n- Crea workbench base\n\n## Tier 1 → Copper/Iron\n...",
    author: "ProgressMaster", authorId: "u_101", avatar: "⬆️", 
    createdAt: "3 giorni fa", lastUpdated: "ieri",
    views: 18420, likes: 673, comments: 124,
    difficulty: "Intermedio", readingTime: "12 min",
    category: "progression", isFeatured: true,
    tags: ["progression", "tier-3", "adamantite", "crafting"]
  },
  { 
    id: 2, 
    title: "Combat System Spiegato – Armi, Combo e Best Builds", 
    excerpt: "Meccaniche di blocco, timing, armi melee/ranged/magie e meta PvP attuale", 
    content: "# Combat Hytale 2026\n\n**Blocking** → tasto destro con arma/shield\n\n**Combo** → light → heavy → special...\n\n...",
    author: "PvPGod", authorId: "u_202", avatar: "⚔️", 
    createdAt: "1 settimana fa", lastUpdated: "2 giorni fa",
    views: 12450, likes: 892, comments: 210,
    difficulty: "Principiante", readingTime: "9 min",
    category: "combat",
    tags: ["combat", "pvp", "weapons", "build"]
  },
  // ... puoi aggiungerne altri
];

const mockComments: Comment[] = [
  { id:1, guideId:1, author:"Noobita", authorId:"u_777", avatar:"🌱", content:"Grazie! Mi hai salvato ore di farming 🙏", createdAt:"2 ore fa", likes:34 },
  { id:2, guideId:1, author:"Tier3Hunter", content:"Manca la parte su dove trovare adamantite veins in Zone 4", createdAt:"1 ora fa", likes:12 },
];

const GuidesPage: Component = () => {
  const auth = useAuth();
  const [selectedCategory, setSelectedCategory] = createSignal("all");
  const [selectedGuide, setSelectedGuide] = createSignal<Guide | null>(null);
  const [showNewGuide, setShowNewGuide] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [sortBy, setSortBy] = createSignal<"popular" | "recent" | "updated">("popular");

  const [newTitle, setNewTitle] = createSignal("");
  const [newExcerpt, setNewExcerpt] = createSignal("");
  const [newContent, setNewContent] = createSignal("");
  const [newCategory, setNewCategory] = createSignal("all");
  const [newDifficulty, setNewDifficulty] = createSignal("Principiante");
  const [newReadingTime, setNewReadingTime] = createSignal("5 min");
  const [newTags, setNewTags] = createSignal("");

  const [commentContent, setCommentContent] = createSignal("");
  const [likedGuides, setLikedGuides] = createSignal<Set<number>>(new Set());

  const filteredGuides = createMemo(() => {
    let result = mockGuides;

    if (selectedCategory() !== "all") {
      result = result.filter(g => g.category === selectedCategory());
    }

    const q = searchQuery().toLowerCase().trim();
    if (q) {
      result = result.filter(g => 
        g.title.toLowerCase().includes(q) ||
        g.excerpt.toLowerCase().includes(q) ||
        g.author.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    result = [...result].sort((a,b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      if (sortBy() === "popular") return b.likes + b.views/10 - (a.likes + a.views/10);
      if (sortBy() === "updated") return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  });

  const guideComments = createMemo(() => {
    const g = selectedGuide();
    return g ? mockComments.filter(c => c.guideId === g.id) : [];
  });

  const handleCreateGuide = () => {
    if (!auth.isAuthenticated()) return notify("Login necessario", "error");
    if (!newTitle().trim() || !newContent().trim()) return notify("Titolo e contenuto obbligatori", "error");
    if (newCategory() === "all") return notify("Scegli categoria", "error");

    notify("Guida pubblicata! (demo)", "success");
    setShowNewGuide(false);
    // reset form...
  };

  const handleAddComment = () => {
    if (!auth.isAuthenticated()) return notify("Devi loggarti", "error");
    if (!commentContent().trim()) return;
    notify("Commento aggiunto! (demo)", "success");
    setCommentContent("");
  };

  const toggleLike = (id: number) => {
    if (!auth.isAuthenticated()) return notify("Login per mettere like", "error");
    setLikedGuides(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const renderMarkdown = (text: string) => ({ __html: marked.parse(text) });

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950">
      <Notifications />

      {/* Hero */}
      <div class="relative bg-black/80 border-b border-violet-900/50 py-16 text-center">
        <h1 class="text-6xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
          GUIDE HYTALE
        </h1>
        <p class="text-2xl text-violet-200 mt-4">
          Impara, condividi e diventa pro con la community 🔥
        </p>
      </div>

      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-10">

        {/* SIDEBAR */}
        <aside class="lg:w-80 flex-shrink-0">
          <div class="sticky top-6 space-y-6">

            <Show when={auth.isAuthenticated()}>
              <button
                onClick={() => setShowNewGuide(true)}
                class="w-full py-5 px-6 bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
              >
                <span class="text-3xl">📝</span> Crea Nuova Guida
              </button>
            </Show>

            {/* Categorie Guide */}
            <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 border border-violet-900/50">
              <h3 class="uppercase text-xs font-bold text-violet-400 mb-5">Categorie Guide</h3>
              <div class="space-y-2">
                <For each={categories}>
                  {cat => (
                    <button
                      onClick={() => { setSelectedCategory(cat.id); setSelectedGuide(null); }}
                      class={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all
                        ${selectedCategory() === cat.id ? `bg-gradient-to-r ${cat.color} text-white shadow-lg` : "hover:bg-violet-950/60"}`}
                    >
                      <span class="text-3xl">{cat.icon}</span>
                      <div class="flex-1 text-left">
                        <div class="font-semibold">{cat.name}</div>
                        <div class="text-xs opacity-70">{cat.count} guide</div>
                      </div>
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Stats veloci */}
            <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 border border-violet-900/50">
              <h4 class="font-bold text-fuchsia-400 mb-4">Statistiche Guide</h4>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between"><span>Guide totali</span><strong>342</strong></div>
                <div class="flex justify-between"><span>Visualizzazioni totali</span><strong>1.2M</strong></div>
                <div class="flex justify-between"><span>Like totali</span><strong>18.4k</strong></div>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENUTO PRINCIPALE */}
        <main class="flex-1">

          <Show when={!selectedGuide()}>
            {/* Controlli */}
            <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 mb-8 border border-violet-900/50">
              <div class="relative mb-6">
                <input
                  placeholder="Cerca guide, autori, tag..."
                  value={searchQuery()}
                  onInput={e => setSearchQuery(e.currentTarget.value)}
                  class="w-full py-4 pl-14 pr-12 bg-gray-950/80 border border-violet-700/50 rounded-xl text-white placeholder-violet-400 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/40"
                />
                <span class="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
              </div>

              <div class="flex flex-wrap justify-between gap-4">
                <select
                  value={sortBy()}
                  onChange={e => setSortBy(e.currentTarget.value as any)}
                  class="px-5 py-2.5 bg-gray-950/80 border border-violet-700/50 rounded-lg text-white"
                >
                  <option value="popular">⭐ Più apprezzate</option>
                  <option value="recent">🆕 Più recenti</option>
                  <option value="updated">🔄 Ultimo aggiornamento</option>
                </select>

                <span class="text-violet-300">
                  {filteredGuides().length} guide trovate
                </span>
              </div>
            </div>

            {/* Lista Guide */}
            <div class="space-y-5">
              <For each={filteredGuides()}>
                {guide => (
                  <div 
                    class="group bg-gradient-to-br from-gray-950/90 to-indigo-950/90 border border-violet-800/50 hover:border-fuchsia-600 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-2xl hover:shadow-fuchsia-900/30"
                    onClick={() => setSelectedGuide(guide)}
                  >
                    <div class="flex gap-5">
                      <span class="text-5xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">{guide.avatar}</span>

                      <div class="flex-1">
                        <div class="flex items-start justify-between gap-4">
                          <h3 class="text-2xl font-bold group-hover:text-fuchsia-300">
                            {guide.isFeatured && <span class="text-yellow-400 mr-2">★</span>}
                            {guide.title}
                          </h3>
                          <div class="flex items-center gap-5 text-sm whitespace-nowrap">
                            <span class="text-green-400">👍 {guide.likes}</span>
                            <span class="text-violet-300">💬 {guide.comments}</span>
                          </div>
                        </div>

                        <p class="text-violet-200/80 mt-2 line-clamp-2">{guide.excerpt}</p>

                        <div class="flex flex-wrap gap-2 mt-3">
                          <span class={`px-3 py-1 rounded-full text-xs font-medium
                            ${guide.difficulty === "Principiante" ? "bg-emerald-900/60 text-emerald-300" :
                              guide.difficulty === "Intermedio" ? "bg-amber-900/60 text-amber-300" :
                              "bg-red-900/60 text-red-300"}`}>
                            {guide.difficulty}
                          </span>
                          <span class="px-3 py-1 bg-violet-950/60 rounded-full text-xs text-violet-300">
                            ⏱️ {guide.readingTime}
                          </span>
                          <For each={guide.tags.slice(0,3)}>
                            {tag => <span class="px-3 py-1 bg-violet-950/40 rounded-full text-xs text-violet-400">#{tag}</span>}
                          </For>
                        </div>

                        <div class="mt-4 text-sm text-violet-400 flex flex-wrap gap-4">
                          <span>👤 {guide.author}</span>
                          <span>•</span>
                          <span>🕒 {guide.createdAt}</span>
                          <span>•</span>
                          <span>✎ Aggiornata {guide.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>

          {/* VISTA SINGOLA GUIDA */}
          <Show when={selectedGuide()}>
            <div class="space-y-8">

              <button 
                onClick={() => setSelectedGuide(null)}
                class="text-violet-400 hover:text-fuchsia-300 flex items-center gap-2 mb-6"
              >
                ← Torna alle guide
              </button>

              <div class="bg-gradient-to-br from-gray-950/90 to-purple-950/90 border border-violet-700/50 rounded-3xl p-8 backdrop-blur-sm">
                {selectedGuide()?.isFeatured && <span class="text-yellow-400 text-xl mb-2 block">★ Guida in Evidenza</span>}

                <h1 class="text-4xl font-black bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent mb-6">
                  {selectedGuide()?.title}
                </h1>

                <div class="flex flex-wrap gap-4 text-sm text-violet-300 mb-8">
                  <span class={`px-4 py-1.5 rounded-full
                    ${selectedGuide()?.difficulty === "Principiante" ? "bg-emerald-800/40 text-emerald-200" :
                      selectedGuide()?.difficulty === "Intermedio" ? "bg-amber-800/40 text-amber-200" :
                      "bg-rose-800/40 text-rose-200"}`}>
                    Difficoltà: {selectedGuide()?.difficulty}
                  </span>
                  <span class="px-4 py-1.5 bg-violet-900/40 rounded-full">⏱️ {selectedGuide()?.readingTime}</span>
                  <span>👤 {selectedGuide()?.author}</span>
                  <span>•</span>
                  <span>👁️ {selectedGuide()?.views.toLocaleString()}</span>
                  <span>•</span>
                  <span>💬 {selectedGuide()?.comments}</span>
                </div>

                <div 
                  class="prose prose-invert max-w-none prose-headings:text-fuchsia-300 prose-a:text-violet-400 hover:prose-a:text-fuchsia-400 prose-code:bg-black/50 prose-pre:bg-black/70"
                  innerHTML={renderMarkdown(selectedGuide()!.content).__html}
                />

                <div class="flex gap-4 mt-10 pt-6 border-t border-violet-800/40">
                  <button
                    onClick={() => toggleLike(selectedGuide()!.id)}
                    class={`flex items-center gap-3 px-7 py-3 rounded-xl font-medium
                      ${likedGuides().has(selectedGuide()!.id) 
                        ? "bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white shadow-lg" 
                        : "bg-violet-900/40 hover:bg-violet-800/60"}`}
                  >
                    {likedGuides().has(selectedGuide()!.id) ? "❤️" : "🤍"} 
                    {selectedGuide()!.likes + (likedGuides().has(selectedGuide()!.id) ? 1 : 0)}
                  </button>

                  <button class="flex items-center gap-3 px-7 py-3 bg-violet-900/40 hover:bg-violet-800/60 rounded-xl">
                    🔗 Condividi
                  </button>
                </div>
              </div>

              {/* Commenti */}
              <div class="bg-gradient-to-br from-gray-950/90 to-indigo-950/90 border border-violet-700/50 rounded-3xl p-8">
                <h3 class="text-2xl font-bold text-fuchsia-400 mb-6">Commenti ({guideComments().length})</h3>

                <div class="space-y-6">
                  <For each={guideComments()}>
                    {c => (
                      <div class="bg-black/40 p-6 rounded-2xl border border-violet-800/30">
                        <div class="flex items-center gap-3 mb-3">
                          <span class="text-3xl">{c.avatar}</span>
                          <div>
                            <strong class="text-violet-200">{c.author}</strong>
                            <div class="text-xs text-violet-500">{c.createdAt}</div>
                          </div>
                        </div>
                        <div class="prose prose-invert prose-sm" innerHTML={renderMarkdown(c.content).__html} />
                      </div>
                    )}
                  </For>
                </div>

                <Show when={auth.isAuthenticated()}>
                  <div class="mt-10">
                    <textarea
                      placeholder="Aggiungi un commento... (supporta markdown)"
                      value={commentContent()}
                      onInput={e => setCommentContent(e.currentTarget.value)}
                      class="w-full h-32 p-5 bg-black/50 border border-violet-700/50 rounded-xl text-white placeholder-violet-400 focus:border-fuchsia-500 resize-none"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!commentContent().trim()}
                      class="mt-3 px-8 py-3 bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-xl font-bold disabled:opacity-50"
                    >
                      Invia Commento
                    </button>
                  </div>
                </Show>
              </div>
            </div>
          </Show>
        </main>
      </div>

      {/* MODAL CREA GUIDA */}
      <Show when={showNewGuide()}>
        <div class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div class="bg-gradient-to-br from-gray-950 to-indigo-950 border-2 border-fuchsia-600/60 rounded-3xl w-full max-w-3xl p-10 my-8">

            <div class="flex justify-between items-center mb-8">
              <h2 class="text-4xl font-black bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                📝 Crea Nuova Guida
              </h2>
              <button onClick={() => setShowNewGuide(false)} class="text-4xl text-violet-400 hover:text-red-400">✕</button>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-violet-300 mb-2">Titolo Guida *</label>
                <input value={newTitle()} onInput={e=>setNewTitle(e.currentTarget.value)} class="w-full p-4 bg-black/60 border border-violet-700/50 rounded-xl" placeholder="Es: Guida Combat Avanzato 2026" />
              </div>

              <div>
                <label class="block text-violet-300 mb-2">Estratto (descrizione breve) *</label>
                <textarea value={newExcerpt()} onInput={e=>setNewExcerpt(e.currentTarget.value)} class="w-full h-24 p-4 bg-black/60 border border-violet-700/50 rounded-xl" placeholder="Riassunto in 1-2 frasi..." />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-violet-300 mb-2">Categoria *</label>
                  <select value={newCategory()} onChange={e=>setNewCategory(e.currentTarget.value)} class="w-full p-4 bg-black/60 border border-violet-700/50 rounded-xl">
                    <For each={categories.filter(c=>c.id !== "all")}>{c=><option value={c.id}>{c.icon} {c.name}</option>}</For>
                  </select>
                </div>
                <div>
                  <label class="block text-violet-300 mb-2">Difficoltà</label>
                  <select value={newDifficulty()} onChange={e=>setNewDifficulty(e.currentTarget.value as any)} class="w-full p-4 bg-black/60 border border-violet-700/50 rounded-xl">
                    <option>Principiante</option>
                    <option>Intermedio</option>
                    <option>Avanzato</option>
                  </select>
                </div>
                <div>
                  <label class="block text-violet-300 mb-2">Tempo lettura stimato</label>
                  <input value={newReadingTime()} onInput={e=>setNewReadingTime(e.currentTarget.value)} class="w-full p-4 bg-black/60 border border-violet-700/50 rounded-xl" placeholder="8 min" />
                </div>
              </div>

              <div>
                <label class="block text-violet-300 mb-2">Tags (separati da virgola)</label>
                <input value={newTags()} onInput={e=>setNewTags(e.currentTarget.value)} class="w-full p-4 bg-black/60 border border-violet-700/50 rounded-xl" placeholder="combat, pvp, armi, meta" />
              </div>

              <div>
                <label class="block text-violet-300 mb-2">Contenuto (Markdown supportato) *</label>
                <textarea value={newContent()} onInput={e=>setNewContent(e.currentTarget.value)} class="w-full h-80 p-6 bg-black/60 border border-violet-700/50 rounded-xl resize-none" placeholder="Scrivi la guida qui... # Titolo, **grassetto**, ```code```" />
              </div>

              <div class="flex gap-4">
                <button onClick={() => setShowNewGuide(false)} class="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl">Annulla</button>
                <button onClick={handleCreateGuide} class="flex-1 py-4 bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-xl font-bold shadow-lg shadow-fuchsia-900/50">Pubblica Guida 🚀</button>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default GuidesPage;
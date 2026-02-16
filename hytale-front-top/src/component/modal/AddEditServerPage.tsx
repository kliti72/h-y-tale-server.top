// AddEditServerPage.tsx
import { Component, createSignal, For, Show, createMemo, onMount } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { useAuth } from "../../auth/AuthContext";
import { ServerResponse } from "../../types/ServerResponse";
import { marked } from "marked";
import DOMPurify from "dompurify";

type AddEditServerPageProps = {
  mode?: 'add' | 'edit';
  serverId?: string;
  initialData?: Partial<ServerResponse>;
  onSubmit?: (data: Partial<ServerResponse>) => void;
};

const AddEditServerPage: Component<AddEditServerPageProps> = (props) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  // Stati del form
  const [name, setName] = createSignal("");
  const [ip, setIp] = createSignal("");
  const [port, setPort] = createSignal("25565");
  const [description, setDescription] = createSignal("");
  const [rules, setRules] = createSignal("");
  const [tags, setTags] = createSignal<string[]>([]);
  const [newTag, setNewTag] = createSignal("");
  const [website, setWebsite] = createSignal("");
  const [discord, setDiscord] = createSignal("");
  const [logoUrl, setLogoUrl] = createSignal("");
  const [bannerUrl, setBannerUrl] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  // Tag preset
  const presetTags = [
    "PvP", "Survival", "Creative", "Roleplay", "Economy",
    "Factions", "Skyblock", "Prison", "Towny", "Vanilla",
    "Modded", "Italian", "Events", "Discord Rich", "No Lag"
  ];

  // Carica i dati se siamo in modalità edit
  onMount(() => {
    if (props.mode === 'edit' && props.initialData) {
      setName(props.initialData.name || "");
      setIp(props.initialData.ip || "");
      setPort(props.initialData.port || "25565");
      setDescription(props.initialData.description || "");
      setRules(props.initialData.rules || "");
      setTags(props.initialData.tags || []);
      setWebsite(props.initialData.website_url || "");
      setDiscord(props.initialData.discord_url || "");
      setLogoUrl(props.initialData.logo_url || "");
      setBannerUrl(props.initialData.banner_url || "");
    }
  });

  const addTag = (tag?: string) => {
    const tagToAdd = tag || newTag().trim();
    if (tagToAdd && !tags().includes(tagToAdd)) {
      setTags((prev) => [...prev, tagToAdd]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async () => {
    // Validazione base fra
    if (!name().trim()) {
      alert("Ao bro, metti il nome del server!");
      return;
    }
    if (!ip().trim()) {
      alert("L'IP serve fra, come ti connetti sennò?");
      return;
    }
    if (!port().trim()) {
      alert("Porta necessaria bro!");
      return;
    }
    if (!description().trim()) {
      alert("Descrivi un po' il server no? Minimo quello!");
      return;
    }

    setIsLoading(true);

    try {
      await props.onSubmit?.({
        name: name(),
        ip: ip(),
        port: port(),
        description: description(),
        tags: tags(),
        website_url: website() || '',
        discord_url: discord() || '',
        banner_url: bannerUrl() || '',
        logo_url: logoUrl() || '',
        rules: rules() || '',
        secret_key: '',
      });

      // Torna alla home o lista server
      navigate('/servers');
    } catch (error) {
      console.error("Errore submit:", error);
      alert("Qualcosa è andato storto fra, riprova!");
    } finally {
      setIsLoading(false);
    }
  };

  // Preview Markdown
  const descriptionHtml = createMemo(() => {
    if (!description()) return "<p class='text-violet-400 italic'>Scrivi qualcosa qui...</p>";
    const raw = marked.parse(description(), { async: false, gfm: true });
    return DOMPurify.sanitize(raw as string);
  });

  const rulesHtml = createMemo(() => {
    if (!rules()) return "<p class='text-violet-400 italic'>Nessuna regola ancora bro</p>";
    const raw = marked.parse(rules(), { async: false, gfm: true });
    return DOMPurify.sanitize(raw as string);
  });

  const isEditMode = () => props.mode === 'edit';

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950">
      {/* Header */}
      <div class="bg-gradient-to-r from-violet-800 to-fuchsia-800 border-b border-violet-700/40">
        <div class="max-w-7xl mx-auto px-5 py-6 md:px-8 md:py-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
                <span class="text-4xl">🎮</span>
                {isEditMode() ? "Modifica Server" : "Aggiungi Server"}
              </h1>
              <p class="text-base md:text-lg text-violet-200 mt-1">
                {isEditMode() 
                  ? "Aggiorna le info del tuo server fra" 
                  : "Fai vedere il tuo server a tutti bro"}
              </p>
            </div>
            <button
              onClick={() => navigate('/panel')}
              class="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl transition font-medium"
            >
              ← Indietro
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div class="max-w-7xl mx-auto px-5 py-8 md:px-8 md:py-12">
        <div class="space-y-10">
          
          {/* Sezione Info Base */}
          <section class="bg-black/40 border border-violet-700/50 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 class="text-2xl md:text-3xl font-bold text-fuchsia-400 flex items-center gap-3">
              <span>📝</span> Info Essenziali
            </h2>

            <div class="space-y-5">
              <div>
                <label class="block text-violet-200 font-medium mb-2">Nome Server *</label>
                <input
                  value={name()}
                  onInput={e => setName(e.currentTarget.value)}
                  placeholder="Es: ItalianCraft Survival"
                  class="w-full px-5 py-4 bg-black/50 border border-violet-700/60 rounded-xl text-white placeholder-violet-500 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 outline-none transition"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-violet-200 font-medium mb-2">IP / Dominio *</label>
                  <input
                    value={ip()}
                    onInput={e => setIp(e.currentTarget.value)}
                    placeholder="play.mioserver.it"
                    class="w-full px-5 py-4 bg-black/50 border border-violet-700/60 rounded-xl text-white font-mono placeholder-violet-500 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 outline-none transition"
                  />
                </div>
                <div>
                  <label class="block text-violet-200 font-medium mb-2">Porta</label>
                  <input
                    value={port()}
                    onInput={e => setPort(e.currentTarget.value)}
                    placeholder="25565"
                    class="w-full px-5 py-4 bg-black/50 border border-violet-700/60 rounded-xl text-white font-mono placeholder-violet-500 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sezione Descrizione */}
          <section class="bg-black/40 border border-violet-700/50 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 class="text-2xl md:text-3xl font-bold text-fuchsia-400 flex items-center gap-3">
              <span>✍️</span> Descrizione Server
            </h2>
            
            <div>
              <label class="block text-violet-200 font-medium mb-3">
                Descrizione completa * (supporta HTML & CSS)
              </label>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 text-white">
                <textarea
                  value={description()}
                  onInput={e => setDescription(e.currentTarget.value)}
                  placeholder="**Caratteristiche principali**&#10;- Versione 1.20+&#10;- Eventi ogni settimana&#10;- Economy custom"
                  rows={12}
                  class="w-full px-5 py-4 bg-black/60 border border-violet-700/60 rounded-xl text-white placeholder-violet-500 font-mono text-sm resize-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 outline-none transition"
                />
                <div
                  class="prose prose-invert prose-sm md:prose-base border border-violet-700/40 rounded-xl p-5 bg-black/70 overflow-auto min-h-[300px]"
                  innerHTML={descriptionHtml()}
                />
              </div>
              <p class="text-sm text-violet-400 mt-2">
                💡 Usa **grassetto**, *italico*, liste, [link](url), ```code```
              </p>
            </div>
          </section>

          {/* Sezione Tag & Links */}
          <section class="bg-black/40 border border-violet-700/50 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 class="text-2xl md:text-3xl font-bold text-fuchsia-400 flex items-center gap-3">
              <span>🏷️</span> Tag & Collegamenti
            </h2>

            {/* Tags */}
            <div>
              <label class="block text-violet-300 font-semibold mb-3">
                Tag & Modalità
              </label>

              {/* Preset Tags */}
              <div class="mb-4">
                <p class="text-sm text-violet-400 mb-3">Seleziona dai tag comuni:</p>
                <div class="flex flex-wrap gap-2">
                  <For each={presetTags}>
                    {(tag) => {
                      const isSelected = () => tags().includes(tag);
                      return (
                        <button
                          type="button"
                          onClick={() => isSelected() ? removeTag(tag) : addTag(tag)}
                          class={`
                            px-4 py-2 rounded-lg font-medium transition-all text-sm
                            ${isSelected()
                              ? "bg-fuchsia-600 text-white border-2 border-fuchsia-400"
                              : "bg-violet-950/60 text-violet-300 border-2 border-violet-700/30 hover:bg-violet-900/80"}
                          `}
                        >
                          {isSelected() && "✓ "}#{tag}
                        </button>
                      );
                    }}
                  </For>
                </div>
              </div>

              {/* Custom Tag */}
              <div class="flex gap-2">
                <input
                  type="text"
                  value={newTag()}
                  onInput={(e) => setNewTag(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Tag personalizzato..."
                  class="flex-1 px-5 py-3 bg-black/60 border-2 border-violet-700/50 rounded-xl text-white placeholder-violet-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => addTag()}
                  class="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors font-semibold"
                >
                  + Aggiungi
                </button>
              </div>

              {/* Selected Tags */}
              <Show when={tags().length > 0}>
                <div class="mt-4 flex flex-wrap gap-2">
                  <For each={tags()}>
                    {(tag) => (
                      <div class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-lg border border-fuchsia-400/50">
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          class="text-white hover:text-red-300 font-bold text-lg leading-none ml-1"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>

            {/* Links */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-violet-300 font-semibold mb-2 flex items-center gap-2">
                  <span>🌐</span> Sito Web
                </label>
                <input
                  type="url"
                  value={website()}
                  onInput={(e) => setWebsite(e.currentTarget.value)}
                  placeholder="https://tuoserver.it"
                  class="w-full px-5 py-3 bg-black/60 border-2 border-violet-700/50 rounded-xl text-white placeholder-violet-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 transition-all"
                />
              </div>

              <div>
                <label class="block text-violet-300 font-semibold mb-2 flex items-center gap-2">
                  <span>💬</span> Discord
                </label>
                <input
                  type="url"
                  value={discord()}
                  onInput={(e) => setDiscord(e.currentTarget.value)}
                  placeholder="https://discord.gg/..."
                  class="w-full px-5 py-3 bg-black/60 border-2 border-violet-700/50 rounded-xl text-white placeholder-violet-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Sezione Media */}
          <section class="bg-black/40 border border-violet-700/50 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 class="text-2xl md:text-3xl font-bold text-fuchsia-400 flex items-center gap-3">
              <span>🖼️</span> Immagini & Media
            </h2>

            <div class="space-y-5">
              <div>
                <label class="block text-violet-300 font-semibold mb-2 flex items-center gap-2">
                  <span>🎨</span> Logo URL
                </label>
                <input
                  type="url"
                  value={logoUrl()}
                  onInput={(e) => setLogoUrl(e.currentTarget.value)}
                  placeholder="https://example.com/logo.png"
                  class="w-full px-5 py-3 bg-black/60 border-2 border-violet-700/50 rounded-xl text-white placeholder-violet-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 transition-all"
                />
                <p class="text-xs text-violet-400 mt-2">
                  Consigliato: 256x256 o 512x512px, JPG/PNG
                </p>
              </div>

              <div>
                <label class="block text-violet-300 font-semibold mb-2 flex items-center gap-2">
                  <span>🌄</span> Banner URL
                </label>
                <input
                  type="url"
                  value={bannerUrl()}
                  onInput={(e) => setBannerUrl(e.currentTarget.value)}
                  placeholder="https://example.com/banner.png"
                  class="w-full px-5 py-3 bg-black/60 border-2 border-violet-700/50 rounded-xl text-white placeholder-violet-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 transition-all"
                />
                <p class="text-xs text-violet-400 mt-2">
                  Consigliato: 1200x400px, JPG/PNG
                </p>
              </div>
            </div>
          </section>

          {/* Sezione Regole */}
          <section class="bg-black/40 border border-violet-700/50 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 class="text-2xl md:text-3xl font-bold text-fuchsia-400 flex items-center gap-3">
              <span>📜</span> Regole Server
            </h2>

            <div class="text-white">
              <label class="block text-violet-200 font-medium mb-3 ">
                Regole (supporta HTML & CSS)
              </label>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <textarea
                  value={rules()}
                  onInput={e => setRules(e.currentTarget.value)}
                  placeholder="1. No griefing&#10;2. Rispetta lo staff&#10;3. No cheat/hacks"
                  rows={10}
                  class="w-full px-5 py-4 bg-black/60 border border-violet-700/60 rounded-xl text-white placeholder-violet-500 font-mono text-sm resize-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 outline-none transition"
                />
                <div
                  class="prose prose-invert prose-sm md:prose-base border border-violet-700/40 rounded-xl p-5 bg-black/70 overflow-auto min-h-[250px]"
                  innerHTML={rulesHtml()}
                />
              </div>
            </div>
          </section>

          {/* Bottoni Submit */}
          <div class="flex items-center justify-between gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/servers')}
              class="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition font-semibold"
              disabled={isLoading()}
            >
              Annulla
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading()}
              class="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-bold shadow-lg transition flex items-center gap-3"
            >
              <Show when={!isLoading()} fallback={<span>⏳ Loading...</span>}>
                <span>🚀</span>
                {isEditMode() ? "Aggiorna Server" : "Pubblica Server"}
              </Show>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddEditServerPage;
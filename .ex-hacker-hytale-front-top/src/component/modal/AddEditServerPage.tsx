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

  const [name, setName] = createSignal("");
  const [ip, setIp] = createSignal("");
  const [port, setPort] = createSignal("5520");
  const [description, setDescription] = createSignal("");
  const [rules, setRules] = createSignal("");
  const [tags, setTags] = createSignal<string[]>([]);
  const [newTag, setNewTag] = createSignal("");
  const [website, setWebsite] = createSignal("");
  const [discord, setDiscord] = createSignal("");
  const [logoUrl, setLogoUrl] = createSignal("");
  const [bannerUrl, setBannerUrl] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  const presetTags = [
    "PvP", "Survival", "Creative", "Roleplay", "Economy",
    "Factions", "Skyblock", "Prison", "Towny", "Vanilla",
    "Modded", "Italian", "Events", "Discord Rich", "No Lag"
  ];

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
    const t = tag || newTag().trim();
    if (t && !tags().includes(t)) { setTags(p => [...p, t]); setNewTag(""); }
  };
  const removeTag = (t: string) => setTags(p => p.filter(x => x !== t));

  const handleSubmit = async () => {
    if (!name().trim()) { alert("⚠ NAME_REQUIRED"); return; }
    if (!ip().trim()) { alert("⚠ IP_REQUIRED"); return; }
    if (!port().trim()) { alert("⚠ PORT_REQUIRED"); return; }
    if (!description().trim()) { alert("⚠ DESCRIPTION_REQUIRED"); return; }
    setIsLoading(true);
    try {
      await props.onSubmit?.({
        name: name(), ip: ip(), port: port(), description: description(),
        tags: tags(), website_url: website() || '', discord_url: discord() || '',
        banner_url: bannerUrl() || '', logo_url: logoUrl() || '',
        rules: rules() || '', secret_key: '',
      });
      navigate('/servers');
    } catch (e) {
      alert("⚠ SUBMIT_FAILED // riprova");
    } finally {
      setIsLoading(false);
    }
  };

  const descriptionHtml = createMemo(() => {
    if (!description()) return "<p style='color:rgba(0,255,65,0.3);font-family:Share Tech Mono,monospace;font-size:12px'>&gt; Scrivi qualcosa...</p>";
    return DOMPurify.sanitize(marked.parse(description(), { async: false, gfm: true }) as string);
  });

  const rulesHtml = createMemo(() => {
    if (!rules()) return "<p style='color:rgba(0,255,65,0.3);font-family:Share Tech Mono,monospace;font-size:12px'>&gt; Nessuna regola ancora</p>";
    return DOMPurify.sanitize(marked.parse(rules(), { async: false, gfm: true }) as string);
  });

  const isEditMode = () => props.mode === 'edit';

  // Reusable input class
  const inputCls = "w-full px-4 py-3 text-sm bg-black/60 border border-green-900/50 text-green-300 placeholder-green-900/40 focus:outline-none focus:border-green-600/60 transition-colors";
  const inputStyle = { "font-family": "'Share Tech Mono', monospace" };

  return (
    <div
      class="min-h-screen text-white"
      style={{ background: "linear-gradient(160deg, #000300 0%, #000a02 40%, #000500 100%)", "font-family": "'Share Tech Mono', monospace" }}
    >
      {/* Grid bg */}
      <div class="fixed inset-0 pointer-events-none" style={{
        "z-index": "0",
        "background-image": `linear-gradient(rgba(0,255,65,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.025) 1px, transparent 1px)`,
        "background-size": "40px 40px",
      }} />
      <div class="fixed inset-0 pointer-events-none" style={{
        "z-index": "1",
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.008) 3px, rgba(0,255,65,0.008) 4px)",
      }} />

      {/* ── HEADER ── */}
      <div class="relative z-10 border-b border-green-900/30 py-10 px-6 text-center">
        <div class="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(0,255,65,0.05) 0%, transparent 70%)" }} />
        <div class="relative max-w-3xl mx-auto">
          <div class="flex items-center justify-center gap-2 mb-3">
            <div class="h-px w-12 bg-green-800/50" />
            <span class="text-green-700/50 text-xs tracking-[0.3em] uppercase">
              // {isEditMode() ? "EDIT_SERVER" : "DEPLOY_SERVER"} <span class="animate-pulse text-green-500">_</span>
            </span>
            <div class="h-px w-12 bg-green-800/50" />
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-white leading-none" style={{ "font-family": "'Orbitron', monospace", "text-shadow": "0 0 40px rgba(0,255,65,0.15)" }}>
            {isEditMode() ? "MODIFICA SERVER" : "AGGIUNGI SERVER"}
          </h1>
          <p class="text-xs text-green-800/50 tracking-widest mt-3">
            &gt;&gt; {isEditMode() ? "AGGIORNA I DATI DEL TUO REALM" : "INSERISCI IL TUO REALM NELLA RETE"}
          </p>
          <button
            onClick={() => navigate('/panel')}
            class="absolute right-0 top-0 text-xs px-4 py-2 border border-green-900/40 text-green-800/50 hover:text-green-400 hover:border-green-700/50 transition-all tracking-widest uppercase"
          >
            ← BACK
          </button>
        </div>
      </div>

      {/* ── FORM ── */}
      <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Helper: sezione card */}
        {/* ── INFO BASE ── */}
        <div class="relative border border-green-900/30 bg-black/50 p-6 md:p-8">
          <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/30 pointer-events-none" />
          <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/30 pointer-events-none" />

          <div class="flex items-center gap-3 mb-6 pb-3 border-b border-green-900/25">
            <span class="text-green-500/70 text-xs">◈</span>
            <span class="text-green-600/70 text-xs tracking-[0.25em] uppercase font-bold">INFO_ESSENZIALI</span>
          </div>

          <div class="space-y-4">
            <div>
              <div class="text-green-700/50 text-xs tracking-widest mb-2">&gt; SERVER_NAME *</div>
              <input value={name()} onInput={e => setName(e.currentTarget.value)} placeholder="Es: ItalianCraft Survival" class={inputCls} style={inputStyle} />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-2">
                <div class="text-green-700/50 text-xs tracking-widest mb-2">&gt; IP_ADDRESS *</div>
                <input value={ip()} onInput={e => setIp(e.currentTarget.value)} placeholder="play.mioserver.it" class={inputCls} style={inputStyle} />
              </div>
              <div>
                <div class="text-green-700/50 text-xs tracking-widest mb-2">&gt; PORT *</div>
                <input value={port()} onInput={e => setPort(e.currentTarget.value)} placeholder="25565" class={inputCls} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* ── DESCRIZIONE ── */}
        <div class="relative border border-green-900/30 bg-black/50 p-6 md:p-8">
          <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/30 pointer-events-none" />
          <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/30 pointer-events-none" />

          <div class="flex items-center gap-3 mb-6 pb-3 border-b border-green-900/25">
            <span class="text-green-500/70 text-xs">◈</span>
            <span class="text-green-600/70 text-xs tracking-[0.25em] uppercase font-bold">DESCRIPTION_MODULE</span>
          </div>

          <div class="text-green-700/50 text-xs tracking-widest mb-2">&gt; MARKDOWN_EDITOR // supporta HTML & CSS</div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <textarea
              value={description()} onInput={e => setDescription(e.currentTarget.value)}
              placeholder="**Caratteristiche**&#10;- Versione 1.20+&#10;- Economy custom"
              rows={12}
              class="w-full px-4 py-3 text-sm bg-black/60 border border-green-900/50 text-green-300 placeholder-green-900/40 focus:outline-none focus:border-green-600/60 transition-colors resize-none"
              style={inputStyle}
            />
            <div
              class="border border-green-900/30 bg-black/40 p-4 overflow-auto min-h-[300px] prose prose-invert prose-sm"
              style={{ "font-family": "'Share Tech Mono', monospace" }}
              innerHTML={descriptionHtml()}
            />
          </div>
          <div class="text-green-900/40 text-xs mt-2 tracking-wide">
            // **grassetto** *italico* [link](url) `code`
          </div>
        </div>

        {/* ── TAG & LINKS ── */}
        <div class="relative border border-green-900/30 bg-black/50 p-6 md:p-8">
          <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/30 pointer-events-none" />
          <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/30 pointer-events-none" />

          <div class="flex items-center gap-3 mb-6 pb-3 border-b border-green-900/25">
            <span class="text-green-500/70 text-xs">◈</span>
            <span class="text-green-600/70 text-xs tracking-[0.25em] uppercase font-bold">TAGS_&_LINKS</span>
          </div>

          {/* Preset tags */}
          <div class="text-green-700/50 text-xs tracking-widest mb-3">&gt; PRESET_TAGS</div>
          <div class="flex flex-wrap gap-2 mb-5">
            <For each={presetTags}>
              {(tag) => {
                const isSelected = () => tags().includes(tag);
                return (
                  <button
                    type="button"
                    onClick={() => isSelected() ? removeTag(tag) : addTag(tag)}
                    class="text-xs px-3 py-1.5 border transition-all tracking-wide"
                    style={{
                      "font-family": "'Share Tech Mono', monospace",
                      "border-color": isSelected() ? "rgba(0,255,65,0.5)" : "rgba(0,255,65,0.15)",
                      color: isSelected() ? "#00ff41" : "rgba(0,255,65,0.35)",
                      background: isSelected() ? "rgba(0,255,65,0.08)" : "transparent",
                    }}
                  >
                    {isSelected() ? "◈ " : "◎ "}#{tag}
                  </button>
                );
              }}
            </For>
          </div>

          {/* Custom tag */}
          <div class="text-green-700/50 text-xs tracking-widest mb-2">&gt; CUSTOM_TAG</div>
          <div class="flex gap-2 mb-4">
            <div class="relative flex-1">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 text-xs">▶</span>
              <input
                type="text" value={newTag()} onInput={e => setNewTag(e.currentTarget.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Tag personalizzato..."
                class="w-full pl-7 pr-4 py-2.5 text-sm bg-black/60 border border-green-900/50 text-green-300 placeholder-green-900/40 focus:outline-none focus:border-green-600/60 transition-colors"
                style={inputStyle}
              />
            </div>
            <button
              type="button" onClick={() => addTag()}
              class="px-5 py-2.5 text-xs border border-green-700/50 text-green-400 bg-green-900/20 hover:bg-green-900/35 transition-all tracking-widest uppercase"
              style={{ "font-family": "'Share Tech Mono', monospace" }}
            >
              + ADD
            </button>
          </div>

          {/* Selected tags */}
          <Show when={tags().length > 0}>
            <div class="flex flex-wrap gap-2 mb-6">
              <For each={tags()}>
                {(tag) => (
                  <div class="flex items-center gap-2 px-3 py-1 border border-green-700/50 bg-green-900/15 text-green-400 text-xs">
                    #{tag}
                    <button onClick={() => removeTag(tag)} class="text-green-700 hover:text-red-400 transition-colors text-base leading-none">×</button>
                  </div>
                )}
              </For>
            </div>
          </Show>

          {/* Links */}
          <div class="h-px mb-5" style={{ background: "linear-gradient(90deg, rgba(0,255,65,0.1), transparent)" }} />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-green-700/50 text-xs tracking-widest mb-2">&gt; WEBSITE_URL</div>
              <input type="url" value={website()} onInput={e => setWebsite(e.currentTarget.value)} placeholder="https://tuoserver.it" class={inputCls} style={inputStyle} />
            </div>
            <div>
              <div class="text-green-700/50 text-xs tracking-widest mb-2">&gt; DISCORD_URL</div>
              <input type="url" value={discord()} onInput={e => setDiscord(e.currentTarget.value)} placeholder="https://discord.gg/..." class={inputCls} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* ── MEDIA ── */}
        <div class="relative border border-green-900/30 bg-black/50 p-6 md:p-8">
          <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/30 pointer-events-none" />
          <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/30 pointer-events-none" />

          <div class="flex items-center gap-3 mb-6 pb-3 border-b border-green-900/25">
            <span class="text-green-500/70 text-xs">◈</span>
            <span class="text-green-600/70 text-xs tracking-[0.25em] uppercase font-bold">MEDIA_ASSETS</span>
          </div>

          <div class="space-y-4">
            <div>
              <div class="text-green-700/50 text-xs tracking-widest mb-2">&gt; LOGO_URL</div>
              <input type="url" value={logoUrl()} onInput={e => setLogoUrl(e.currentTarget.value)} placeholder="https://example.com/logo.png" class={inputCls} style={inputStyle} />
              <div class="text-green-900/40 text-xs mt-1">// Consigliato: 256×256px JPG/PNG</div>
            </div>
            <div>
              <div class="text-green-700/50 text-xs tracking-widest mb-2">&gt; BANNER_URL</div>
              <input type="url" value={bannerUrl()} onInput={e => setBannerUrl(e.currentTarget.value)} placeholder="https://example.com/banner.png" class={inputCls} style={inputStyle} />
              <div class="text-green-900/40 text-xs mt-1">// Consigliato: 1200×400px JPG/PNG</div>
            </div>

            {/* Preview */}
            <Show when={logoUrl() || bannerUrl()}>
              <div class="flex gap-4 mt-2">
                <Show when={logoUrl()}>
                  <div class="relative">
                    <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500/40 pointer-events-none" />
                    <img src={logoUrl()} alt="logo preview" class="w-16 h-16 object-cover" style={{ filter: "saturate(0.8)", border: "1px solid rgba(0,255,65,0.2)" }} onError={e => e.currentTarget.style.display = "none"} />
                  </div>
                </Show>
                <Show when={bannerUrl()}>
                  <div class="relative flex-1">
                    <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500/40 pointer-events-none" />
                    <img src={bannerUrl()} alt="banner preview" class="w-full h-16 object-cover" style={{ filter: "saturate(0.7)", border: "1px solid rgba(0,255,65,0.2)" }} onError={e => e.currentTarget.style.display = "none"} />
                  </div>
                </Show>
              </div>
            </Show>
          </div>
        </div>

        {/* ── REGOLE ── */}
        <div class="relative border border-green-900/30 bg-black/50 p-6 md:p-8">
          <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/30 pointer-events-none" />
          <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/30 pointer-events-none" />

          <div class="flex items-center gap-3 mb-6 pb-3 border-b border-green-900/25">
            <span class="text-green-500/70 text-xs">◈</span>
            <span class="text-green-600/70 text-xs tracking-[0.25em] uppercase font-bold">SERVER_RULES</span>
          </div>

          <div class="text-green-700/50 text-xs tracking-widest mb-2">&gt; MARKDOWN_EDITOR // supporta HTML & CSS</div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <textarea
              value={rules()} onInput={e => setRules(e.currentTarget.value)}
              placeholder="1. No griefing&#10;2. Rispetta lo staff&#10;3. No cheat/hacks"
              rows={10}
              class="w-full px-4 py-3 text-sm bg-black/60 border border-green-900/50 text-green-300 placeholder-green-900/40 focus:outline-none focus:border-green-600/60 transition-colors resize-none"
              style={inputStyle}
            />
            <div
              class="border border-green-900/30 bg-black/40 p-4 overflow-auto min-h-[250px] prose prose-invert prose-sm"
              style={{ "font-family": "'Share Tech Mono', monospace" }}
              innerHTML={rulesHtml()}
            />
          </div>
        </div>

        {/* ── SUBMIT ── */}
        <div class="flex items-center justify-between gap-4 pt-2 pb-10">
          <button
            type="button" onClick={() => navigate('/servers')}
            disabled={isLoading()}
            class="px-8 py-3.5 text-xs border border-green-900/40 text-green-800/55 hover:text-green-600/70 hover:border-green-800/55 transition-all tracking-widest uppercase disabled:opacity-40"
            style={{ "font-family": "'Share Tech Mono', monospace" }}
          >
            [ANNULLA]
          </button>

          <button
            type="button" onClick={handleSubmit}
            disabled={isLoading()}
            class="relative px-10 py-3.5 text-sm font-bold text-green-400 border border-green-700/50 bg-green-900/20 hover:bg-green-900/35 hover:border-green-500/60 transition-all tracking-widest uppercase disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              "font-family": "'Share Tech Mono', monospace",
              "box-shadow": isLoading() ? "none" : "0 0 20px rgba(0,255,65,0.1)",
            }}
          >
            <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-green-500/50 pointer-events-none" />
            <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-green-500/50 pointer-events-none" />
            <Show when={!isLoading()} fallback={
              <span class="flex items-center gap-2">
                <span class="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" />
                PROCESSING...
              </span>
            }>
              {isEditMode() ? "⬡ AGGIORNA_SERVER.exe" : "⬡ PUBBLICA_SERVER.exe"}
            </Show>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddEditServerPage;
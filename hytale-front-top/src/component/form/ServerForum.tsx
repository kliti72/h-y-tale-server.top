import { Component, createSignal, For, Show, createMemo, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../../auth/AuthContext";
import { ServerResponse } from "../../types/ServerResponse";
import { marked } from "marked";
import DOMPurify from "dompurify";

type Props = { mode?: 'add' | 'edit'; initialData?: Partial<ServerResponse>; onSubmit?: (data: Partial<ServerResponse>) => void; };

const PRESET_TAGS = ["PvP", "Survival", "Creative", "Roleplay", "Economy", "Factions", "Skyblock", "Prison", "Towny", "Vanilla", "Modded", "Italian", "Events"];

// ── shared input class ──
const inp = "w-full px-3 py-2.5 bg-stone-950 border font-serif text-sm text-stone-300 placeholder:text-stone-700 focus:outline-none transition-colors";
const inpOk = "border-stone-700 focus:border-amber-800";
const inpErr = "border-red-800/70 focus:border-red-700";

// ── reusable stone section ──
const Section = (props: { title: string; children: any }) => (
  <div class="relative border border-stone-700 bg-stone-900 p-6">
    <span class="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-800/60" />
    <span class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-800/60" />
    <div class="flex items-center gap-3 mb-5 pb-3 border-b border-stone-800">
      <span class="text-amber-700 font-serif text-xs uppercase tracking-widest">{props.title}</span>
      <div class="h-px flex-1 bg-stone-800" />
    </div>
    {props.children}
  </div>
);

const FieldLabel = (props: { label: string; error?: string }) => (
  <div class="flex items-center justify-between mb-1.5">
    <span class="text-stone-500 font-serif text-xs uppercase tracking-wide">{props.label}</span>
    <Show when={props.error}>
      <span class="text-red-600 font-serif text-xs">⚠ {props.error}</span>
    </Show>
  </div>
);

const ServerForm: Component<Props> = (props) => {
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
  const [submitError, setSubmitError] = createSignal("");

  // field errors
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const setErr = (k: string, v: string) => setErrors(p => ({ ...p, [k]: v }));
  const clearErr = (k: string) => setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  const hasErr = (k: string) => !!errors()[k];

  const isEdit = () => props.mode === 'edit';

  onMount(() => {
    if (isEdit() && props.initialData) {
      const d = props.initialData;
      setName(d.name ?? ""); setIp(d.ip ?? ""); setPort(d.port ?? "5520");
      setDescription(d.description ?? ""); setRules(d.rules ?? "");
      setTags(d.tags ?? []); setWebsite(d.website_url ?? "");
      setDiscord(d.discord_url ?? ""); setLogoUrl(d.logo_url ?? "");
      setBannerUrl(d.banner_url ?? "");
    }
  });

  const addTag = (t?: string) => {
    const tag = t ?? newTag().trim();
    if (tag && !tags().includes(tag)) { setTags(p => [...p, tag]); setNewTag(""); }
  };
  const removeTag = (t: string) => setTags(p => p.filter(x => x !== t));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name().trim()) e.name = "Campo obbligatorio";
    if (!ip().trim()) e.ip = "Campo obbligatorio";
    else if (!/^[\w.-]+$/.test(ip())) e.ip = "IP non valido";
    if (!port().trim()) e.port = "Campo obbligatorio";
    else if (isNaN(Number(port())) || Number(port()) < 1 || Number(port()) > 65535) e.port = "Porta non valida (1-65535)";
    if (!description().trim()) e.description = "Campo obbligatorio";
    if (website() && !/^https?:\/\//.test(website())) e.website = "Deve iniziare con https://";
    if (discord() && !/^https?:\/\//.test(discord())) e.discord = "Deve iniziare con https://";
    if (logoUrl() && !/^https?:\/\//.test(logoUrl())) e.logo = "URL non valido";
    if (bannerUrl() && !/^https?:\/\//.test(bannerUrl())) e.banner = "URL non valido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError("");
    if (!validate()) return;
    setIsLoading(true);
    try {
      await props.onSubmit?.({
        name: name(), ip: ip(), port: port(), description: description(),
        tags: tags(), website_url: website(), discord_url: discord(),
        banner_url: bannerUrl(), logo_url: logoUrl(), rules: rules(), secret_key: "",
      });
      navigate('/servers');
    } catch {
      setSubmitError("Errore durante il salvataggio. Riprova.");
    } finally { setIsLoading(false); }
  };

  const descHtml = createMemo(() =>
    description()
      ? DOMPurify.sanitize(marked.parse(description(), { async: false, gfm: true }) as string)
      : "<p style='color:#57534e;font-family:serif;font-size:13px'>Anteprima descrizione...</p>"
  );

  const rulesHtml = createMemo(() =>
    rules()
      ? DOMPurify.sanitize(marked.parse(rules(), { async: false, gfm: true }) as string)
      : "<p style='color:#57534e;font-family:serif;font-size:13px'>Anteprima regole...</p>"
  );

  return (
    <div class="min-h-screen bg-stone-950 text-stone-300">

      {/* Header */}
      <div class="relative border-b-2 border-amber-900/40 py-10 px-6 text-center">
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-800/40 to-transparent" />
        <div class="flex items-center justify-center gap-3 mb-3">
          <div class="h-px w-10 bg-amber-900/50" />
          <span class="text-amber-800 font-serif text-xs uppercase tracking-widest">{isEdit() ? "Modifica" : "Aggiungi"} Server</span>
          <div class="h-px w-10 bg-amber-900/50" />
        </div>
        <h1 class="font-serif font-black text-4xl text-amber-500 uppercase tracking-widest">
          {isEdit() ? "⚔ Aggiorna Realm" : "🏰 Pubblica Realm"}
        </h1>
        <button onClick={() => navigate('/panel')} class="absolute right-6 top-1/2 -translate-y-1/2 text-stone-600 hover:text-amber-500 font-serif text-xs uppercase tracking-widest transition-colors">
          ← Indietro
        </button>
      </div>

      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">

        {/* Info base */}
        <Section title="📜 Info Essenziali">
          <div class="space-y-4">
            <div>
              <FieldLabel label="Nome Server *" error={errors().name} />
              <input value={name()} onInput={e => { setName(e.currentTarget.value); clearErr("name"); }}
                placeholder="ItalianCraft Survival"
                class={`${inp} ${hasErr("name") ? inpErr : inpOk}`} />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-2">
                <FieldLabel label="IP Address *" error={errors().ip} />
                <input value={ip()} onInput={e => { setIp(e.currentTarget.value); clearErr("ip"); }}
                  placeholder="play.mioserver.it"
                  class={`${inp} ${hasErr("ip") ? inpErr : inpOk}`} />
              </div>
              <div>
                <FieldLabel label="Porta *" error={errors().port} />
                <input value={port()} onInput={e => { setPort(e.currentTarget.value); clearErr("port"); }}
                  placeholder="5520"
                  class={`${inp} ${hasErr("port") ? inpErr : inpOk}`} />
              </div>
            </div>
          </div>
        </Section>

        {/* Descrizione */}
        <Section title="📖 Descrizione">
          <FieldLabel label="Markdown supportato" error={errors().description} />
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <textarea value={description()} onInput={e => { setDescription(e.currentTarget.value); clearErr("description"); }}
              placeholder={"**Caratteristiche**\n- Versione 1.20+\n- Economy custom"}
              rows={10}
              class={`${inp} resize-none ${hasErr("description") ? inpErr : inpOk}`} />
            <div class="border border-stone-700 bg-stone-950 p-4 min-h-[250px] overflow-auto prose prose-stone prose-sm prose-invert max-w-none"
              innerHTML={descHtml()} />
          </div>
          <p class="text-stone-700 font-serif text-xs mt-2">**grassetto** *italico* [link](url) `code`</p>
        </Section>

        {/* Tags & Links */}
        <Section title="🏷 Tag & Link">
          <div class="flex flex-wrap gap-2 mb-4">
            <For each={PRESET_TAGS}>
              {tag => (
                <button type="button" onClick={() => tags().includes(tag) ? removeTag(tag) : addTag(tag)}
                  class={`px-2.5 py-1 text-xs font-serif border transition-all ${tags().includes(tag)
                    ? "border-amber-700/60 bg-amber-950/30 text-amber-500"
                    : "border-stone-700 text-stone-500 hover:border-stone-600"}`}>
                  {tag}
                </button>
              )}
            </For>
          </div>

          <div class="flex gap-2 mb-3">
            <input value={newTag()} onInput={e => setNewTag(e.currentTarget.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Tag personalizzato..."
              class={`${inp} flex-1 ${inpOk}`} />
            <button type="button" onClick={() => addTag()}
              class="px-4 border border-stone-700 text-stone-500 hover:text-amber-400 hover:border-amber-800 font-serif text-xs uppercase tracking-wide transition-all">
              + Aggiungi
            </button>
          </div>

          <Show when={tags().length > 0}>
            <div class="flex flex-wrap gap-2 mb-4">
              <For each={tags()}>
                {tag => (
                  <span class="flex items-center gap-1.5 px-2.5 py-1 border border-amber-800/50 bg-amber-950/20 text-amber-600 font-serif text-xs">
                    #{tag}
                    <button onClick={() => removeTag(tag)} class="text-stone-600 hover:text-red-500 transition-colors">×</button>
                  </span>
                )}
              </For>
            </div>
          </Show>

          <div class="h-px bg-stone-800 my-4" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Sito Web" error={errors().website} />
              <input type="url" value={website()} onInput={e => { setWebsite(e.currentTarget.value); clearErr("website"); }}
                placeholder="https://tuoserver.it"
                class={`${inp} ${hasErr("website") ? inpErr : inpOk}`} />
            </div>
            <div>
              <FieldLabel label="Discord" error={errors().discord} />
              <input type="url" value={discord()} onInput={e => { setDiscord(e.currentTarget.value); clearErr("discord"); }}
                placeholder="https://discord.gg/..."
                class={`${inp} ${hasErr("discord") ? inpErr : inpOk}`} />
            </div>
          </div>
        </Section>

        {/* Media */}
        <Section title="🖼 Media">
          <div class="space-y-4">
            <div>
              <FieldLabel label="Logo URL" error={errors().logo} />
              <input type="url" value={logoUrl()} onInput={e => { setLogoUrl(e.currentTarget.value); clearErr("logo"); }}
                placeholder="https://example.com/logo.png"
                class={`${inp} ${hasErr("logo") ? inpErr : inpOk}`} />
              <p class="text-stone-700 font-serif text-xs mt-1">Consigliato: 256×256px</p>
            </div>
            <div>
              <FieldLabel label="Banner URL" error={errors().banner} />
              <input type="url" value={bannerUrl()} onInput={e => { setBannerUrl(e.currentTarget.value); clearErr("banner"); }}
                placeholder="https://example.com/banner.png"
                class={`${inp} ${hasErr("banner") ? inpErr : inpOk}`} />
              <p class="text-stone-700 font-serif text-xs mt-1">Consigliato: 1200×400px</p>
            </div>
            <Show when={logoUrl() || bannerUrl()}>
              <div class="flex gap-3 pt-1">
                <Show when={logoUrl()}>
                  <img src={logoUrl()} alt="logo" class="w-14 h-14 object-cover border border-stone-700" onError={e => (e.currentTarget.style.display = "none")} />
                </Show>
                <Show when={bannerUrl()}>
                  <img src={bannerUrl()} alt="banner" class="flex-1 h-14 object-cover border border-stone-700" onError={e => (e.currentTarget.style.display = "none")} />
                </Show>
              </div>
            </Show>
          </div>
        </Section>

        {/* Regole */}
        <Section title="⚔ Regole del Server">
          <FieldLabel label="Markdown supportato" />
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <textarea value={rules()} onInput={e => setRules(e.currentTarget.value)}
              placeholder={"1. No griefing\n2. Rispetta lo staff\n3. No cheat"}
              rows={8}
              class={`${inp} resize-none ${inpOk}`} />
            <div class="border border-stone-700 bg-stone-950 p-4 min-h-[200px] overflow-auto prose prose-stone prose-sm prose-invert max-w-none"
              innerHTML={rulesHtml()} />
          </div>
        </Section>

        {/* Submit */}
        <Show when={submitError()}>
          <div class="relative border border-red-900/50 bg-red-950/20 px-4 py-3">
            <span class="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-800" />
            <p class="text-red-500 font-serif text-sm">⚠ {submitError()}</p>
          </div>
        </Show>

        <Show when={Object.keys(errors()).length > 0}>
          <div class="relative border border-amber-900/50 bg-amber-950/20 px-4 py-3">
            <span class="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-800" />
            <p class="text-amber-600 font-serif text-sm">⚠ Correggi i campi evidenziati prima di procedere.</p>
          </div>
        </Show>

        <div class="flex justify-between gap-4 pb-10">
          <button type="button" onClick={() => navigate('/panel')} disabled={isLoading()}
            class="px-6 py-2.5 border border-stone-700 text-stone-500 hover:text-stone-300 font-serif text-sm uppercase tracking-widest transition-all disabled:opacity-40">
            Annulla
          </button>
          <button type="button" onClick={handleSubmit} disabled={isLoading()}
            class="relative px-8 py-2.5 border-2 border-amber-800/60 bg-amber-950/20 hover:bg-amber-900/30 hover:border-amber-700 text-amber-500 hover:text-amber-400 font-serif text-sm uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            <span class="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-700" />
            <span class="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-700" />
            <Show when={!isLoading()} fallback={
              <span class="flex items-center gap-2">
                <span class="w-3 h-3 border border-amber-600 border-t-transparent rounded-full animate-spin" />
                Salvataggio...
              </span>
            }>
              {isEdit() ? "⚔ Aggiorna Server" : "🏰 Pubblica Server"}
            </Show>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ServerForm;
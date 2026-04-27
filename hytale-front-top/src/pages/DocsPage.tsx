import { createSignal, For, Show, JSX } from "solid-js";
import { useT } from "../lang/l18n";

// ── Data ──────────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "intro",   label: "Intro",    rune: "ᚺ" },
  { id: "install", label: "Install",  rune: "ᛁ" },
  { id: "config",  label: "Config",   rune: "ᚲ" },
  { id: "api",     label: "API",      rune: "ᚨ" },
  { id: "plugin",  label: "Comandi",  rune: "ᛈ" },
  { id: "network", label: "Network",  rune: "ᚾ" },
];

const BASE_URL = "https://h-y-tale.top/api";

// ── Atoms ─────────────────────────────────────────────────────────────────────
const H = (p: { children: JSX.Element; sub: string }) => (
  <>
    <h2 class="font-serif font-black text-amber-500 text-3xl uppercase tracking-widest mb-1">{p.children}</h2>
    <p class="text-amber-900/50 text-xs font-serif uppercase tracking-[0.3em] mb-6">{p.sub}</p>
  </>
);

const Divider = (p: { label: string }) => (
  <div class="flex items-center gap-3 my-6">
    <div class="h-px flex-1 bg-amber-900/20" />
    <span class="text-amber-800/50 text-xs font-serif uppercase tracking-[0.3em]">{p.label}</span>
    <div class="h-px flex-1 bg-amber-900/20" />
  </div>
);

const Code = (p: { code: string; lang?: string }) => {
  const [copied, setCopied] = createSignal(false);
  return (
    <div class="border border-amber-900/30 bg-stone-900/80 mt-3 mb-1">
      <div class="flex justify-between items-center px-4 py-1.5 border-b border-amber-900/20">
        <span class="text-amber-900/50 text-xs font-serif uppercase tracking-widest">{p.lang ?? "code"}</span>
        <button class="text-xs font-serif text-stone-600 hover:text-amber-500 transition-colors uppercase tracking-wider"
          onClick={() => { navigator.clipboard.writeText(p.code); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>
          {copied() ? "✓ Copiato" : "Copia"}
        </button>
      </div>
      <pre class="px-4 py-3 text-xs text-stone-300 overflow-x-auto leading-relaxed font-mono">{p.code}</pre>
    </div>
  );
};

const METHOD_COLORS: Record<string, string> = {
  GET:    "text-emerald-400 border-emerald-900/60 bg-emerald-950/40",
  POST:   "text-amber-400  border-amber-900/60   bg-amber-950/40",
  DELETE: "text-red-400    border-red-900/60      bg-red-950/40",
};

const Api = (p: { method: string; endpoint: string; desc: string; body?: string; response?: string; free?: boolean }) => (
  <div class="border border-amber-900/20 bg-stone-900/30 p-4 mb-4">
    <div class="flex items-center gap-2 mb-2 flex-wrap">
      <span class={`px-2 py-0.5 text-xs font-mono border uppercase ${METHOD_COLORS[p.method] ?? METHOD_COLORS.GET}`}>{p.method}</span>
      <code class="text-amber-500/80 text-sm font-mono break-all">{p.endpoint}</code>
      <Show when={p.free}><span class="text-xs font-serif text-emerald-600 border border-emerald-900/40 bg-emerald-950/30 px-2 py-0.5 uppercase tracking-wider">Free</span></Show>
    </div>
    <p class="text-stone-400 text-sm font-serif leading-relaxed mb-1">{p.desc}</p>
    <Show when={p.body}><Code lang="json · body" code={p.body!} /></Show>
    <Show when={p.response}><Code lang="json · response" code={p.response!} /></Show>
  </div>
);

// ── Sections ──────────────────────────────────────────────────────────────────
const Intro = () => (
  <>
    <H sub="ᚺ · H-Y-Tale-Server.top Plugin for hytale.">PLUGIN</H>
    <p class="text-stone-400 font-serif text-sm leading-relaxed mb-4">
      {useT()().docs_description}
    </p>
      <div class="grid grid-cols-2 gap-3 m-2">
          <DownloadButton href="../src/file/hytaletopvote.jar"/>
      </div>
      
       
    <div class="grid grid-cols-2 gap-3">
      {useT()().docs_card
        .map(([r,t,d]) => (
          <div class="border border-amber-900/20 bg-stone-900/30 p-3">
            <p class="text-amber-800/60 text-lg mb-1">{r}</p>
            <p class="text-amber-500/80 text-xs font-serif uppercase tracking-wider mb-1">{t}</p>
            <p class="text-stone-500 text-xs font-serif">{d}</p>
          </div>
        ))}
    </div>
  </>
);

const Install = () => (
  <>
    <H sub="ᛁ · Guida rapida">Installazione</H>
    {useT()().docs_install
    .map(([step, title, desc, code]) => (
      <div class="flex gap-4 mb-6">
        <span class="font-serif text-amber-800/60 text-sm uppercase tracking-widest pt-1 w-6 shrink-0">{step}</span>
        <div class="flex-1">
          <p class="text-amber-500/80 text-sm font-serif uppercase tracking-wider mb-1">{title}</p>
          <p class="text-stone-400 text-sm font-serif leading-relaxed">{desc}</p>
          <Show when={code}><Code lang="json" code={code!} /></Show>
        </div>
      </div>
    ))}
  </>
);

const DownloadButton = (p: { href?: string; version?: string }) => (
  <a href={p.href ?? "#"} download
    class="inline-flex items-center gap-2 px-5 py-2.5 border border-amber-700/40 bg-stone-900/60 hover:bg-amber-950/40 hover:border-amber-600 text-amber-400 font-serif text-sm uppercase tracking-widest transition-all duration-150">
    <span>↓</span> Download H-Y-Tale-Vote <span class="text-stone-600 text-xs">{p.version ?? "v1.0"}</span>
  </a>
);


const DownloadVoteAnnounce = (p: { href?: string; version?: string }) => (
  <a href={p.href ?? "#"}
    class="inline-flex items-center gap-2 px-5 py-2.5 border border-amber-700/40 bg-stone-900/60 hover:bg-amber-950/40 hover:border-amber-600 text-amber-400 font-serif text-sm uppercase tracking-widest transition-all duration-150">
    <span>↓</span> Vote Announcer <span class="text-stone-600 text-xs">{p.version ?? "v1.0.0"}</span>
  </a>
);

const DownloadForCurse = (p: { href?: string; version?: string }) => (
  <a href={p.href ?? "#"}
    class="inline-flex items-center gap-2 px-5 py-2.5 border border-amber-700/40 bg-stone-900/60 hover:bg-amber-950/40 hover:border-amber-600 text-amber-400 font-serif text-sm uppercase tracking-widest transition-all duration-150">
    <span>↓</span> Download On Curse Forge <span class="text-stone-600 text-xs">{p.version ?? "curseforge.com"}</span>
  </a>
);


const Config = () => (
  <>
    <H sub="ᚲ · config.json">Configurazione</H>

    {/* ── /setreward ── */}
    <Divider label="Impostare il Reward" />
    <p class="text-stone-400 font-serif text-sm leading-relaxed mb-3">
      Puoi configurare i reward direttamente in-game senza toccare il config.json.
    </p>
    <div class="border border-amber-900/20 bg-stone-900/30 p-4 mb-4 flex items-center gap-3">
      <code class="text-amber-400 font-mono text-sm">/setreward </code>
      <span class="text-xs font-serif text-stone-600 border border-stone-800 px-2 py-0.5 uppercase tracking-wider">Op </span>
    </div>
    <p class="text-stone-500 font-serif text-xs leading-relaxed mb-4">
      Il comando aprirà il menu dei premi, inserisci i premi all'interno della chest.
    </p>
    <div class="border border-amber-900/20 bg-stone-900/40 h-150 flex items-center justify-center text-stone-600 text-sm font-serif mb-2 overflow-hidden">
      <img src="./setreward.png">
      
      </img>
    </div>

    <Divider label="Prova il ritiro /claimtest" />
    <div class="border border-amber-900/20 bg-stone-900/30 p-4 mb-4 flex items-center gap-3">
      <code class="text-amber-400 font-mono text-sm">/claimtest </code>
      <span class="text-xs font-serif text-stone-600 border border-stone-800 px-2 py-0.5 uppercase tracking-wider">Op </span>
    </div>

    <p class="text-stone-500 font-serif text-xs leading-relaxed mb-4">
      Il comando aprirà il menu dei premi, inserisci i premi all'interno della chest.
    </p>

    {/* ── config.json ── */}
    <Divider label="config.json" />
    <Code code={useT()().docs_config_json} lang="json · config.json" />
    <Divider label="Parametri" />
    {useT()().docs_config.map(([k,type,note,desc]) => (
      <div class="border-b border-stone-900 py-3">
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <code class="text-amber-400/80 text-xs font-mono">{k}</code>
          <span class="text-stone-600 text-xs font-mono">{type}</span>
          <span class="text-amber-900/50 text-xs font-serif italic">{note}</span>
        </div>
        <p class="text-stone-500 text-xs font-serif">{desc}</p>
      </div>
    ))}
  </>
);

const ApiRef = () => (
  <>
    <H sub="ᚨ · Tutti gli endpoint sono gratuiti">API Reference</H>
    <div class="flex items-center gap-2 mb-6">
      <span class="text-xs font-serif text-stone-500">Base URL:</span>
      <code class="text-amber-500/70 text-xs font-mono border border-amber-900/30 bg-stone-900/50 px-2 py-0.5 break-all">{BASE_URL}</code>
    </div>
    <Divider label="Server" />
    <Api method="GET" endpoint="/servers/{id}" free desc="Tutte le informazioni del server richiesto."
      response={`{
  "success": true,
  "data": {
    "id": 1,
    "name": "Example",
    "ip": "play.example.net",
    "port": "5520",
    "tags": [
      "Roleplay",
      "Economy"
    ],
    "description": "This is a Server description.",
    "website_url": "https://example.com",
    "discord_url": "https://examèle.com",
    "voti_totali": 1,
    "banner_url": "https://example.com/banner.png",
    "logo_url": "https://example.com/banner.png",
    "rules": "<div class"rules example"> This is a example of rule </div>",
    "secret_key": "**",
    "created_at": "2026-03-04 06:20:04",
    "updated_at": "2026-03-04 06:20:04",
    "players_online": 22,
    "players_max": 100,
    "last_updated": "2026-03-04 06:20:04",
    "is_online": 1
}`} />

  </>
);

const Plugin = () => (
  <>
    <H sub="ᛈ · Comandi disponibili in-game">{useT()().docs_comandi_title}</H>
    {useT()().docs_comandi.map(([cmd, perm, desc]) => (
      <div class="border border-amber-900/20 bg-stone-900/30 p-4 mb-3">
        <div class="flex items-center gap-3 mb-2 flex-wrap">
          <code class="text-amber-400 text-sm font-mono">{cmd}</code>
          <span class="text-xs font-serif text-stone-600 border border-stone-800 px-2 py-0.5 uppercase tracking-wider">{perm}</span>
        </div>
        <p class="text-stone-400 text-sm font-serif">{desc}</p>
      </div>
    ))}
  </>
);

const Network = () => (
  <>
    <H sub="ᚾ · Configurazione multi-server">{useT()().docs_network_title}</H>
    <p class="text-stone-400 font-serif text-sm leading-relaxed mb-4">
      {useT()().docs_network_description}
    </p>
 
    <Divider label="Config principale" />
    <Code lang="json · server principale" code={`{ "secret_key": "xxxxx", "is_principal_network": true }`} />
    <Divider label="Config secondary" />
    <Code lang="json · server secondario" code={`{ "secret_key": "xxxxx", "is_principal_network": false, "secondary_id": "survival-1" }`} />
    <Code lang="json · server secondario" code={`{ "secret_key": "xxxxx", "is_principal_network": false, "secondary_id": "survival-2" }`} />
    <Divider label="Note" />
    {useT()().docs_note
      .map((note, i) => (
        <div class="flex gap-3 py-2 border-b border-stone-900">
          <span class="text-amber-900/50 font-serif text-xs pt-0.5 shrink-0">{i + 1}.</span>
          <span class="text-stone-400 text-sm font-serif leading-relaxed">{note}</span>
        </div>
      ))}
  </>
);

const CONTENT: Record<string, () => JSX.Element> = {
  intro: Intro, install: Install, config: Config, api: ApiRef, plugin: Plugin, network: Network
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DocsPage() {
  const [active, setActive] = createSignal("intro");
  const [mobileOpen, setMobileOpen] = createSignal(false);

  return (
    <div class="relative w-full min-h-screen bg-stone-950 flex flex-col md:flex-row overflow-hidden">
      <div class="absolute inset-0 opacity-5 pointer-events-none"
        style={{ "background-image": "radial-gradient(circle, #92400e 1px, transparent 1px)", "background-size": "32px 32px" }} />
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-800/50 to-transparent" />

      {/* Mobile topbar */}
      <div class="relative z-20 md:hidden flex items-center justify-between px-4 py-3 border-b border-amber-900/20 bg-stone-950">
        <p class="font-serif font-black text-amber-500 uppercase tracking-widest">H-YTale</p>
        <button onClick={() => setMobileOpen(v => !v)} class="text-stone-400 hover:text-amber-500 transition-colors font-mono text-lg">
          {mobileOpen() ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      <Show when={mobileOpen()}>
        <div class="relative z-20 md:hidden flex flex-col border-b border-amber-900/20 bg-stone-950">
          <For each={SECTIONS}>
            {s => (
              <button onClick={() => { setActive(s.id); setMobileOpen(false); }}
                class={`flex items-center gap-2 px-5 py-3 text-sm font-serif border-l-2 transition-all ${active() === s.id ? "text-amber-400 border-amber-600 bg-amber-950/30" : "text-stone-500 border-transparent hover:text-stone-300"}`}>
                <span class="text-amber-900/60 text-xs w-4">{s.rune}</span>{s.label}
              </button>
            )}
          </For>
        </div>
      </Show>

      {/* Sidebar desktop */}
      <aside class="relative z-10 hidden md:flex w-48 shrink-0 border-r border-amber-900/20 flex-col py-8 px-4 gap-1 sticky top-0 h-screen overflow-y-auto">
        <div class="mb-6 text-center">
          <p class="font-serif font-black text-amber-500 text-lg uppercase tracking-widest">H-YTale</p>
          <p class="text-stone-600 text-xs font-serif uppercase tracking-[0.3em] mt-0.5">Docs</p>
        </div>
        <For each={SECTIONS}>
          {s => (
            <button onClick={() => setActive(s.id)}
              class={`flex items-center gap-2.5 px-3 py-2 text-left text-sm font-serif transition-all border-l-2 ${active() === s.id ? "text-amber-400 border-amber-600 bg-amber-950/30 pl-2.5" : "text-stone-500 hover:text-stone-300 border-transparent"}`}>
              <span class="text-amber-900/60 text-xs w-4">{s.rune}</span>{s.label}
            </button>
          )}
        </For>
        <div class="mt-auto pt-6 border-t border-amber-900/20 text-center">
          <p class="text-stone-700 text-xs font-serif uppercase tracking-wider">v1.0 · Free</p>
          <p class="text-amber-900/40 text-sm mt-1 tracking-[0.5em]">ᚠᚱᛖᛖ</p>
        </div>
      </aside>

      {/* Content */}
      <main class="relative z-10 flex-1 overflow-y-auto px-5 md:px-8 py-8 md:py-10 max-w-3xl">
        <For each={SECTIONS}>
          {s => <Show when={active() === s.id}>{CONTENT[s.id]()}</Show>}
        </For>
      </main>
    </div>
  );
}
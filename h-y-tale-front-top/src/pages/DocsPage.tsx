import { createSignal, For, Show } from "solid-js";

// ── Sezioni docs ──────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "intro",    label: "Introduzione",   rune: "ᚺ" },
  { id: "install",  label: "Installazione",  rune: "ᛁ" },
  { id: "config",   label: "Configurazione", rune: "ᚲ" },
  { id: "api",      label: "API Reference",  rune: "ᚨ" },
  { id: "plugin",   label: "Plugin Comandi", rune: "ᛈ" },
  { id: "network",  label: "Network",        rune: "ᚾ" },
];

// ── Componente blocco codice ──────────────────────────────────────────────────
const CodeBlock = (props) => {
  const [copied, setCopied] = createSignal(false);
  const copy = () => {
    navigator.clipboard.writeText(props.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div class="relative group border border-amber-900/30 bg-stone-900/80 mt-3 mb-1">
      <div class="flex items-center justify-between px-4 py-1.5 border-b border-amber-900/20">
        <span class="text-amber-900/50 text-xs font-serif uppercase tracking-widest">{props.lang ?? "code"}</span>
        <button
          onClick={copy}
          class="text-xs font-serif text-stone-600 hover:text-amber-500 transition-colors uppercase tracking-wider"
        >
          {copied() ? "✓ Copiato" : "Copia"}
        </button>
      </div>
      <pre class="px-4 py-3 text-xs text-stone-300 overflow-x-auto leading-relaxed font-mono">{props.code}</pre>
    </div>
  );
};

// ── Badge metodo HTTP ─────────────────────────────────────────────────────────
const MethodBadge = (props) => {
  const colors = {
    GET:    "text-emerald-400 border-emerald-900/60 bg-emerald-950/40",
    POST:   "text-amber-400  border-amber-900/60   bg-amber-950/40",
    DELETE: "text-red-400    border-red-900/60      bg-red-950/40",
  };
  return (
    <span class={`inline-block px-2 py-0.5 text-xs font-mono border uppercase tracking-wider ${colors[props.method] ?? colors.GET}`}>
      {props.method}
    </span>
  );
};

// ── Blocco API singola ────────────────────────────────────────────────────────
const ApiBlock = (props) => (
  <div class="border border-amber-900/20 bg-stone-900/30 p-4 mb-4">
    <div class="flex items-center gap-3 mb-2 flex-wrap">
      <MethodBadge method={props.method} />
      <code class="text-amber-500/80 text-sm font-mono">{props.endpoint}</code>
      <Show when={props.free}>
        <span class="text-xs font-serif text-emerald-600 border border-emerald-900/40 bg-emerald-950/30 px-2 py-0.5 uppercase tracking-wider">Free</span>
      </Show>
    </div>
    <p class="text-stone-400 text-sm font-serif leading-relaxed mb-1">{props.desc}</p>
    <Show when={props.body}>
      <CodeBlock lang="json · body" code={props.body} />
    </Show>
    <Show when={props.response}>
      <CodeBlock lang="json · response" code={props.response} />
    </Show>
  </div>
);

// ── Divider runico ─────────────────────────────────────────────────────────────
const RuneDivider = (props) => (
  <div class="flex items-center gap-3 mb-6 mt-8">
    <div class="h-px flex-1 bg-amber-900/20" />
    <span class="text-amber-800/50 text-xs font-serif uppercase tracking-[0.3em]">{props.label}</span>
    <div class="h-px flex-1 bg-amber-900/20" />
  </div>
);

// ── Pagina ────────────────────────────────────────────────────────────────────
const DocsPage = () => {
  const [active, setActive] = createSignal("intro");

  return (
    <div class="relative w-full min-h-screen bg-stone-950 flex overflow-hidden">

      {/* dot grid bg */}
      <div
        class="absolute inset-0 opacity-5 pointer-events-none"
        style={{ "background-image": "radial-gradient(circle, #92400e 1px, transparent 1px)", "background-size": "32px 32px" }}
      />
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-800/50 to-transparent" />

      {/* ── SIDEBAR ── */}
      <aside class="relative z-10 w-52 shrink-0 border-r border-amber-900/20 flex flex-col py-8 px-4 gap-1 sticky top-0 h-screen overflow-y-auto">
        <div class="mb-6 text-center">
          <p class="font-serif font-black text-amber-500 text-lg uppercase tracking-widest">H-YTale</p>
          <p class="text-stone-600 text-xs font-serif uppercase tracking-[0.3em] mt-0.5">Documentazione</p>
        </div>

        <For each={SECTIONS}>
          {(s) => (
            <button
              onClick={() => setActive(s.id)}
              class={`flex items-center gap-2.5 px-3 py-2 text-left text-sm font-serif transition-all ${
                active() === s.id
                  ? "text-amber-400 border-l-2 border-amber-600 bg-amber-950/30 pl-2.5"
                  : "text-stone-500 hover:text-stone-300 border-l-2 border-transparent"
              }`}
            >
              <span class="text-amber-900/60 text-xs w-4">{s.rune}</span>
              {s.label}
            </button>
          )}
        </For>

        <div class="mt-auto pt-6 border-t border-amber-900/20">
          <p class="text-stone-700 text-xs font-serif text-center tracking-wider uppercase">v1.0 · Free</p>
          <p class="text-amber-900/40 text-center text-sm mt-1 tracking-[0.5em]">ᚠᚱᛖᛖ</p>
        </div>
      </aside>

      {/* ── CONTENT ── */}
      <main class="relative z-10 flex-1 overflow-y-auto px-8 py-10 max-w-3xl">

        {/* ── INTRO ── */}
        <Show when={active() === "intro"}>
          <h2 class="font-serif font-black text-amber-500 text-3xl uppercase tracking-widest mb-2">Introduzione</h2>
          <p class="text-amber-900/50 text-xs font-serif uppercase tracking-[0.3em] mb-6">ᚺ · H-YTale Server Tracker</p>

          <p class="text-stone-400 font-serif text-sm leading-relaxed mb-4">
            H-YTale Server Tracker è un sistema gratuito per monitorare i tuoi server Minecraft in tempo reale.
            Il plugin installato sul server invia automaticamente un ping ogni 2 minuti alla nostra API,
            aggiornando giocatori online, capacità massima e stato del server.
          </p>
          <p class="text-stone-400 font-serif text-sm leading-relaxed mb-6">
            Tutti i dati sono visibili dalla dashboard web, accessibile da qualsiasi dispositivo senza installazioni aggiuntive.
          </p>

          <RuneDivider label="Requisiti" />
          <div class="flex flex-col gap-2">
            {[
              ["Plugin",   "Bukkit / Spigot / Paper 1.17+"],
              ["Java",     "Java 11 o superiore"],
              ["Account",  "Registrazione gratuita su H-YTale"],
              ["Internet", "Connessione outbound sul server"],
            ].map(([k, v]) => (
              <div class="flex gap-4 py-2 border-b border-stone-900">
                <span class="text-amber-700/70 text-xs font-serif uppercase tracking-wider w-20 shrink-0 pt-0.5">{k}</span>
                <span class="text-stone-400 text-sm font-serif">{v}</span>
              </div>
            ))}
          </div>

          <RuneDivider label="Caratteristiche" />
          <div class="grid grid-cols-2 gap-3">
            {[
              { rune: "ᛈ", title: "Ping automatico",    desc: "Ogni 2 minuti, zero intervento manuale" },
              { rune: "ᚾ", title: "Network support",    desc: "Server secondari aggregati al principale" },
              { rune: "⚔", title: "Comando /claim",     desc: "Reward in-game configurabili liberamente" },
              { rune: "ᚱ", title: "API pubblica",       desc: "Accesso gratuito a tutti gli endpoint" },
            ].map(f => (
              <div class="border border-amber-900/20 bg-stone-900/30 p-3">
                <p class="text-amber-800/60 text-lg mb-1">{f.rune}</p>
                <p class="text-amber-500/80 text-xs font-serif uppercase tracking-wider mb-1">{f.title}</p>
                <p class="text-stone-500 text-xs font-serif leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </Show>

        {/* ── INSTALLAZIONE ── */}
        <Show when={active() === "install"}>
          <h2 class="font-serif font-black text-amber-500 text-3xl uppercase tracking-widest mb-2">Installazione</h2>
          <p class="text-amber-900/50 text-xs font-serif uppercase tracking-[0.3em] mb-6">ᛁ · Guida rapida</p>

          {[
            {
              step: "I",
              title: "Scarica il plugin",
              desc: "Scarica il file .jar dalla pagina download e inseriscilo nella cartella /plugins del tuo server.",
              code: null,
            },
            {
              step: "II",
              title: "Avvia il server",
              desc: "Avvia il server una volta per generare il file di configurazione in /plugins/h-y-tale-vote/config.json.",
              code: null,
            },
            {
              step: "III",
              title: "Copia la secret key",
              desc: "Dal pannello H-YTale, copia la tua secret key dalla lista server e incollala nel config.",
              code: `// plugins/h-y-tale-vote/config.json
{
  "secret_key": "la-tua-key-qui",
  "is_principal_network": true,
  "reward_item": {
    "stone": 5,
    "diamond_sword": 1
  }
}`,
            },
            {
              step: "IV",
              title: "Riavvia e verifica",
              desc: "Riavvia il server. Il plugin inizierà a pingare ogni 2 minuti. Controlla la dashboard per confermare.",
              code: null,
            },
          ].map(s => (
            <div class="flex gap-4 mb-6">
              <span class="font-serif text-amber-800/60 text-sm uppercase tracking-widest pt-1 w-6 shrink-0">{s.step}</span>
              <div class="flex-1">
                <p class="text-amber-500/80 text-sm font-serif uppercase tracking-wider mb-1">{s.title}</p>
                <p class="text-stone-400 text-sm font-serif leading-relaxed">{s.desc}</p>
                <Show when={s.code}>
                  <CodeBlock lang="json" code={s.code} />
                </Show>
              </div>
            </div>
          ))}
        </Show>

        {/* ── CONFIG ── */}
        <Show when={active() === "config"}>
          <h2 class="font-serif font-black text-amber-500 text-3xl uppercase tracking-widest mb-2">Configurazione</h2>
          <p class="text-amber-900/50 text-xs font-serif uppercase tracking-[0.3em] mb-6">ᚲ · config.json</p>

          <CodeBlock lang="json · config.json completo" code={`{
  "secret_key": "xxxxx-xxxxx-xxxxx-xxxxx",
  "is_principal_network": true,
  "secondary_id": "lobby-eu",
  "reward_item": {
    "stone": 5,
    "diamond": 1,
    "diamond_sword": 1
  }
}`} />

          <RuneDivider label="Parametri" />
          <div class="flex flex-col gap-2">
            {[
              ["secret_key",            "String",  "Obbligatorio", "Key univoca copiata dal pannello H-YTale"],
              ["is_principal_network",  "Boolean", "Default: true", "false se questo è un server secondario del network"],
              ["secondary_id",          "String",  "Solo secondary", "Nome univoco del sub-server (es. survival-1, lobby-eu)"],
              ["reward_item",           "Object",  "Obbligatorio", "Mappa item → quantità da dare al /claim"],
            ].map(([k, type, note, desc]) => (
              <div class="border-b border-stone-900 py-3">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <code class="text-amber-400/80 text-xs font-mono">{k}</code>
                  <span class="text-stone-600 text-xs font-mono">{type}</span>
                  <span class="text-amber-900/50 text-xs font-serif italic">{note}</span>
                </div>
                <p class="text-stone-500 text-xs font-serif">{desc}</p>
              </div>
            ))}
          </div>
        </Show>

        {/* ── API REFERENCE ── */}
        <Show when={active() === "api"}>
          <h2 class="font-serif font-black text-amber-500 text-3xl uppercase tracking-widest mb-2">API Reference</h2>
          <p class="text-amber-900/50 text-xs font-serif uppercase tracking-[0.3em] mb-2">ᚨ · Tutti gli endpoint sono gratuiti</p>
          <div class="flex items-center gap-2 mb-6">
            <span class="text-xs font-serif text-stone-500">Base URL:</span>
            <code class="text-amber-500/70 text-xs font-mono border border-amber-900/30 bg-stone-900/50 px-2 py-0.5">https://h-y-tale.top/api</code>
          </div>

          <RuneDivider label="Server" />

          <ApiBlock
            method="GET"
            endpoint="/servers"
            free
            desc="Ritorna la lista completa dei server registrati con le loro informazioni base."
            response={`{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Il Mio Server",
      "players_online": 80,
      "players_max": 100
    }
  ]
}`}
          />

          <ApiBlock
            method="GET"
            endpoint="/servers/status/:serverId"
            free
            desc="Ritorna lo status aggiornato di un server specifico, inclusi i giocatori aggregati dai secondary."
            response={`{
  "success": true,
  "data": {
    "server_id": 1,
    "players_online": 80,
    "players_max": 100,
    "is_online": 1,
    "last_updated": "2026-02-26 23:20:32"
  }
}`}
          />

          <ApiBlock
            method="GET"
            endpoint="/servers/status/full/:serverId"
            free
            desc="Come sopra ma include anche la lista completa dei server secondari attivi con il loro ping recente."
            response={`{
  "success": true,
  "data": {
    "server_id": 1,
    "players_online": 110,
    "players_max": 100,
    "is_online": 1,
    "secondary_servers": [
      {
        "secondary_id": "survival-1",
        "players_online": 30,
        "last_ping": "2026-02-26T23:38:49.739Z"
      }
    ]
  }
}`}
          />

          <RuneDivider label="Plugin · Richieste automatiche" />

          <ApiBlock
            method="POST"
            endpoint="/servers/status/ping"
            free
            desc="Inviata automaticamente dal plugin ogni 2 minuti. Aggiorna lo stato del server principale."
            body={`{
  "secret_key": "xxxxx-xxxxx-xxxxx-xxxxx",
  "players_online": 80,
  "players_max": 100,
  "is_online": true,
  "latency_ms": 18
}`}
            response={`{
  "success": true,
  "message": "Status aggiornato",
  "data": { "server_id": 1, "players_online": 80 }
}`}
          />

          <ApiBlock
            method="POST"
            endpoint="/servers/status/ping/secondary"
            free
            desc="Inviata dal plugin dei server secondari. Aggiorna solo la riga del secondary identificato da secondary_id. TTL implicito: 2 minuti."
            body={`{
  "secret_key": "xxxxx-xxxxx-xxxxx-xxxxx",
  "secondary_id": "survival-1",
  "players_online": 30
}`}
            response={`{
  "success": true,
  "message": "Status secondary aggiornato"
}`}
          />

          <RuneDivider label="Voti" />

          <ApiBlock
            method="GET"
            endpoint="/vote/claim/:secretkey/:playerName"
            free
            desc="Verifica se il giocatore ha un voto da ritirare. Chiamata dal plugin al comando /claim in-game."
            response={`{
  "success": true,
  "message": "Voto ritirato con successo",
  "serverId": 1
}`}
          />
        </Show>

        {/* ── PLUGIN COMANDI ── */}
        <Show when={active() === "plugin"}>
          <h2 class="font-serif font-black text-amber-500 text-3xl uppercase tracking-widest mb-2">Plugin Comandi</h2>
          <p class="text-amber-900/50 text-xs font-serif uppercase tracking-[0.3em] mb-6">ᛈ · Comandi disponibili in-game</p>

          <div class="flex flex-col gap-3 mb-8">
            {[
              {
                cmd: "/claim",
                perm: "Tutti i giocatori",
                desc: "Ritira il premio del voto. Il plugin chiama l'API e consegna gli item configurati nel config.json.",
              },
              {
                cmd: "/hytale reload",
                perm: "Op / Admin",
                desc: "Ricarica il config.json senza riavviare il server.",
              },
              {
                cmd: "/hytale status",
                perm: "Op / Admin",
                desc: "Mostra l'ultimo ping inviato, il numero di giocatori rilevati e la latenza verso l'API.",
              },
            ].map(c => (
              <div class="border border-amber-900/20 bg-stone-900/30 p-4">
                <div class="flex items-center gap-3 mb-2 flex-wrap">
                  <code class="text-amber-400 text-sm font-mono">{c.cmd}</code>
                  <span class="text-xs font-serif text-stone-600 border border-stone-800 px-2 py-0.5 uppercase tracking-wider">{c.perm}</span>
                </div>
                <p class="text-stone-400 text-sm font-serif leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <RuneDivider label="Permessi" />
          <div class="flex flex-col gap-2">
            {[
              ["hytale.claim",  "Permesso per usare /claim (default: true)"],
              ["hytale.admin",  "Permesso per reload e status (default: op)"],
            ].map(([perm, desc]) => (
              <div class="flex gap-4 py-2 border-b border-stone-900">
                <code class="text-amber-700/70 text-xs font-mono w-36 shrink-0 pt-0.5">{perm}</code>
                <span class="text-stone-400 text-sm font-serif">{desc}</span>
              </div>
            ))}
          </div>
        </Show>

        {/* ── NETWORK ── */}
        <Show when={active() === "network"}>
          <h2 class="font-serif font-black text-amber-500 text-3xl uppercase tracking-widest mb-2">Network</h2>
          <p class="text-amber-900/50 text-xs font-serif uppercase tracking-[0.3em] mb-6">ᚾ · Configurazione multi-server</p>

          <p class="text-stone-400 font-serif text-sm leading-relaxed mb-4">
            Se gestisci un network con più server (lobby + survival + minigames ecc.), puoi configurare
            un server principale e più server secondari. I giocatori di tutti i secondary vengono
            automaticamente sommati al totale del principale.
          </p>

          <RuneDivider label="Schema" />
          <div class="border border-amber-900/20 bg-stone-900/30 p-4 mb-6 font-mono text-xs text-stone-400 leading-loose">
            <p><span class="text-amber-500">PRINCIPALE</span> · lobby</p>
            <p class="pl-4 text-stone-600">└── pinga ogni 2min → aggrega tutti i secondary</p>
            <p class="pl-4 mt-2"><span class="text-amber-700">SECONDARY</span> · survival-1 → pinga ogni 15s</p>
            <p class="pl-4"><span class="text-amber-700">SECONDARY</span> · survival-2 → pinga ogni 15s</p>
            <p class="pl-4"><span class="text-amber-700">SECONDARY</span> · minigames  → pinga ogni 15s</p>
            <p class="pl-4 mt-2 text-stone-600">TTL: secondary ignorati se last_ping {">"} 2min</p>
          </div>

          <RuneDivider label="Config principale" />
          <CodeBlock lang="json · server principale" code={`{
  "secret_key": "xxxxx-xxxxx-xxxxx-xxxxx",
  "is_principal_network": true
}`} />

          <RuneDivider label="Config secondary" />
          <CodeBlock lang="json · server secondario" code={`{
  "secret_key": "xxxxx-xxxxx-xxxxx-xxxxx",
  "is_principal_network": false,
  "secondary_id": "survival-1"
}`} />

          <RuneDivider label="Note importanti" />
          <div class="flex flex-col gap-2">
            {[
              "Tutti i secondary devono usare la stessa secret_key del principale.",
              "Il secondary_id deve essere univoco per ogni sub-server del network.",
              "I secondary con last_ping più vecchio di 2 minuti vengono esclusi dalla somma.",
              "Il /claim è disponibile solo su tutti i server, ma puoi disabilitarlo sui singoli server dal file /mods/config.json nella riga enable_claim",
            ].map((note, i) => (
              <div class="flex gap-3 py-2 border-b border-stone-900">
                <span class="text-amber-900/50 font-serif text-xs pt-0.5 shrink-0">{i + 1}.</span>
                <span class="text-stone-400 text-sm font-serif leading-relaxed">{note}</span>
              </div>
            ))}
          </div>
        </Show>

      </main>
    </div>
  );
};

export default DocsPage;
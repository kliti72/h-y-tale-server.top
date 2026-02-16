import { Component, createSignal, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../auth/AuthContext";
import Notifications, { notify } from "../component/template/Notification";

type DocSection = {
  id: string;
  title: string;
  icon: string;
  subsections?: {
    id: string;
    title: string;
  }[];
};

const Docs: Component = () => {
  const auth = useAuth();
  const [activeSection, setActiveSection] = createSignal("intro");
  const [copiedCode, setCopiedCode] = createSignal("");

  const sections: DocSection[] = [
    {
      id: "intro",
      title: "Introduzione",
      icon: "📖"
    },
    {
      id: "plugin",
      title: "VotePlugin",
      icon: "🎮",
      subsections: [
        { id: "plugin-install", title: "Installazione" },
        { id: "plugin-config", title: "Configurazione" },
        { id: "plugin-commands", title: "Comandi" },
        { id: "plugin-permissions", title: "Permessi" }
      ]
    },
    {
      id: "api",
      title: "API Rest",
      icon: "🔌",
      subsections: [
        { id: "api-auth", title: "Autenticazione" },
        { id: "api-servers", title: "Server Endpoints" },
        { id: "api-votes", title: "Votes Endpoints" },
        { id: "api-stats", title: "Stats Endpoints" }
      ]
    },
    {
      id: "webhooks",
      title: "Webhooks",
      icon: "🔔"
    },
    {
      id: "examples",
      title: "Esempi Codice",
      icon: "💻"
    }
  ];

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    notify("Codice copiato! 📋", "success");
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white">
      
      {/* Header */}
      <div class="bg-black/40 border-b border-violet-900/50 sticky top-0 z-40 backdrop-blur-xl">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <A href="/" class="text-2xl font-black text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
                H-YTALE.top
              </A>
              <span class="text-violet-600">/</span>
              <h1 class="text-xl font-bold text-white">Documentazione</h1>
            </div>
            
            <div class="flex items-center gap-4">
              <a
                href="https://github.com/yourusername/voteplugin"
                target="_blank"
                class="flex items-center gap-2 px-4 py-2 bg-violet-950/60 hover:bg-violet-900/80 rounded-xl border border-violet-700/30 transition-all"
              >
                <span class="text-xl">💻</span>
                <span class="hidden sm:inline">GitHub</span>
              </a>
              <A
                href="/panel"
                class="px-6 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 rounded-xl font-semibold transition-all"
              >
                Dashboard
              </A>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex gap-8">

          {/* Sidebar Navigation */}
          <aside class="hidden lg:block w-64 flex-shrink-0">
            <div class="sticky top-24 space-y-2">
              <For each={sections}>
                {(section) => (
                  <div>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      class={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-left
                        ${activeSection() === section.id || section.subsections?.some(s => activeSection() === s.id)
                          ? "bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-500/50"
                          : "text-violet-300 hover:bg-violet-950/40 hover:text-white"}
                      `}
                    >
                      
                      <span class="text-xl">{section.icon}</span>
                      <span>{section.title}</span>
                    </button>
                    
                    <Show when={section.subsections}>
                      <div class="ml-6 mt-2 space-y-1">
                        <For each={section.subsections}>
                          {(sub) => (
                            <button
                              onClick={() => scrollToSection(sub.id)}
                              class={`
                                w-full text-left px-4 py-2 rounded-lg text-sm transition-all
                                ${activeSection() === sub.id
                                  ? "text-fuchsia-400 bg-violet-950/40 font-medium"
                                  : "text-violet-400 hover:text-white hover:bg-violet-950/20"}
                              `}
                            >
                              {sub.title}
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

          {/* Main Content */}
          <main class="flex-1 min-w-0">
            <div class="prose prose-invert prose-violet max-w-none">
              
              {/* INTRODUZIONE */}
              <section id="intro" class="mb-20 scroll-mt-24">
                <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-8 border border-violet-900/50 backdrop-blur-md">
                  <h1 class="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                    📖 Documentazione H-YTALE
                  </h1>
                  <p class="text-xl text-violet-200 mb-6">
                    Benvenuto nella documentazione completa di H-YTALE.top! Qui troverai tutte le informazioni 
                    necessarie per integrare il tuo server Minecraft con la nostra piattaforma. <br> </br>
                              Endpoint,Metodo,Descrizione,Esempio chiamata <br> </br>
/api/servers/status/:serverId,GET,Status attuale singolo server,/api/servers/status/42 <br> </br>
/api/servers/status,GET,Status di tutti i server,/api/servers/status <br> </br>
/api/servers/status/ping,POST,Aggiorna status (dal ping bot),"body: secret_key: ""..."", players_online: 87, ... " <br> </br>
/api/servers/top-populated,GET,Top 10 server più popolati,/api/servers/top-populated?limit=5 <br> </br>
/api/servers/online-count,GET,Conteggio server online,/api/servers/online-count <br> </br>
                  </p>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    {[
                      { icon: "🎮", title: "VotePlugin", desc: "Plugin Minecraft per gestire i voti" },
                      { icon: "🔌", title: "API Rest", desc: "Endpoints per integrazioni custom" },
                      { icon: "💻", title: "Esempi", desc: "Codice pronto all'uso" }
                    ].map(item => (
                      <div class="bg-violet-950/30 border border-violet-800/30 rounded-xl p-4 hover:bg-violet-900/40 transition-colors">
                        <div class="text-3xl mb-2">{item.icon}</div>
                        <h3 class="text-lg font-bold text-white mb-1">{item.title}</h3>
                        <p class="text-sm text-violet-300">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* VOTEPLUGIN */}
              <section id="plugin" class="mb-20 scroll-mt-24">
                <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-8 border border-violet-900/50 backdrop-blur-md">
                  <h2 class="text-3xl font-black mb-6 flex items-center gap-3">
                    <span class="text-4xl">🎮</span>
                    VotePlugin
                  </h2>
                  
                  <p class="text-lg text-violet-200 mb-8">
                    Il plugin ufficiale per integrare il sistema di voti nel tuo server Minecraft.
                  </p>

                  {/* Download Box */}
                  <div class="bg-green-950/30 border-2 border-green-600/50 rounded-xl p-6 mb-8">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 class="text-xl font-bold text-green-300 mb-2">📦 Download Latest</h4>
                        <p class="text-green-200/80">VotePlugin v1.0.3 - Paper/Purpur 1.21+</p>
                      </div>
                      <a
                        href="https://github.com/yourusername/voteplugin/releases/latest"
                        class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold transition-all"
                      >
                        Download .jar
                      </a>
                    </div>
                  </div>

                  {/* Installazione */}
                  <div id="plugin-install" class="mb-12 scroll-mt-24">
                    <h3 class="text-2xl font-bold text-fuchsia-400 mb-4">📥 Installazione</h3>
                    
                    <div class="space-y-6">
                      <div class="flex items-start gap-4">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center font-bold flex-shrink-0">
                          1
                        </div>
                        <div>
                          <p class="text-violet-200">
                            Scarica il file <code class="bg-black/60 px-2 py-1 rounded">VotePlugin.jar</code> dal link sopra
                          </p>
                        </div>
                      </div>

                      <div class="flex items-start gap-4">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center font-bold flex-shrink-0">
                          2
                        </div>
                        <div>
                          <p class="text-violet-200 mb-2">
                            Metti il file nella cartella <code class="bg-black/60 px-2 py-1 rounded">plugins</code> del tuo server
                          </p>
                          <div class="bg-black/60 rounded-lg p-4 font-mono text-sm border border-violet-700/30">
                            <span class="text-violet-400">server/</span><br/>
                            <span class="ml-4 text-violet-400">└── plugins/</span><br/>
                            <span class="ml-8 text-green-400">    └── VotePlugin.jar</span>
                          </div>
                        </div>
                      </div>

                      <div class="flex items-start gap-4">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center font-bold flex-shrink-0">
                          3
                        </div>
                        <div>
                          <p class="text-violet-200">
                            Riavvia il server. Il plugin genererà automaticamente il file di configurazione.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Configurazione */}
                  <div id="plugin-config" class="mb-12 scroll-mt-24">
                    <h3 class="text-2xl font-bold text-fuchsia-400 mb-4">⚙️ Configurazione</h3>
                    
                    <p class="text-violet-200 mb-4">
                      Dopo il primo avvio, modifica il file <code class="bg-black/60 px-2 py-1 rounded">plugins/VotePlugin/config.yml</code>:
                    </p>

                    <div class="relative">
                      <button
                        onClick={() => copyCode(`# H-YTALE VotePlugin Configuration
secret-key: "TUA_SECRET_KEY_QUI"

# API Settings
api:
  endpoint: "https://api.h-ytale.top/v1"
  timeout: 5000

# Vote Command
vote-command: "vote"
vote-aliases: ["voto", "votare"]

# Rewards
rewards:
  enabled: true
  commands:
    - "give %player% diamond 5"
    - "eco give %player% 1000"
    - "broadcast &6%player% &eha votato per il server!"
  
# Messages
messages:
  vote-success: "&aGrazie per aver votato! Hai ricevuto le ricompense."
  vote-cooldown: "&cPuoi votare di nuovo tra %time%."
  vote-error: "&cErrore durante il voto. Riprova più tardi."

# Top Voters
top-voters:
  enabled: true
  update-interval: 300 # secondi
  display-count: 10`, "config")}
                        class="absolute top-4 right-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold transition-colors"
                      >
                        {copiedCode() === "config" ? "✓ Copiato" : "📋 Copia"}
                      </button>
                      <pre class="bg-black/80 rounded-xl p-6 overflow-x-auto border border-violet-700/30 font-mono text-sm">
                        <code class="text-green-400">{`# H-YTALE VotePlugin Configuration
secret-key: "TUA_SECRET_KEY_QUI"

# API Settings
api:
  endpoint: "https://api.h-ytale.top/v1"
  timeout: 5000

# Vote Command
vote-command: "vote"
vote-aliases: ["voto", "votare"]

# Rewards
rewards:
  enabled: true
  commands:
    - "give %player% diamond 5"
    - "eco give %player% 1000"
    - "broadcast &6%player% &eha votato per il server!"
  
# Messages
messages:
  vote-success: "&aGrazie per aver votato! Hai ricevuto le ricompense."
  vote-cooldown: "&cPuoi votare di nuovo tra %time%."
  vote-error: "&cErrore durante il voto. Riprova più tardi."

# Top Voters
top-voters:
  enabled: true
  update-interval: 300 # secondi
  display-count: 10`}</code>
                      </pre>
                    </div>

                    <div class="mt-6 bg-yellow-950/30 border border-yellow-600/50 rounded-xl p-4">
                      <div class="flex items-start gap-3">
                        <span class="text-2xl">⚠️</span>
                        <div>
                          <h4 class="font-bold text-yellow-300 mb-1">Importante!</h4>
                          <p class="text-yellow-200/80 text-sm">
                            Ottieni la tua <strong>Secret Key</strong> dalla dashboard del tuo server in 
                            <A href="/panel" class="underline hover:text-yellow-100"> I Miei Server</A>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comandi */}
                  <div id="plugin-commands" class="mb-12 scroll-mt-24">
                    <h3 class="text-2xl font-bold text-fuchsia-400 mb-4">⌨️ Comandi</h3>
                    
                    <div class="space-y-3">
                      {[
                        { cmd: "/vote", desc: "Mostra i link per votare il server", perm: "voteplugin.vote" },
                        { cmd: "/votetop [periodo]", desc: "Mostra la classifica dei top voter (oggi/settimana/mese/sempre)", perm: "voteplugin.top" },
                        { cmd: "/voteclaim", desc: "Reclama le ricompense in sospeso", perm: "voteplugin.claim" },
                        { cmd: "/votestreak", desc: "Mostra la tua streak di voti consecutivi", perm: "voteplugin.streak" },
                        { cmd: "/votereload", desc: "Ricarica la configurazione del plugin", perm: "voteplugin.admin" },
                        { cmd: "/votetest <player>", desc: "Simula un voto per testing (solo admin)", perm: "voteplugin.admin" }
                      ].map(item => (
                        <div class="bg-violet-950/30 border border-violet-800/30 rounded-xl p-4 hover:bg-violet-900/40 transition-colors">
                          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <code class="text-green-400 font-bold">{item.cmd}</code>
                              <p class="text-sm text-violet-300 mt-1">{item.desc}</p>
                            </div>
                            <code class="text-xs text-violet-500 font-mono">{item.perm}</code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Permessi */}
                  <div id="plugin-permissions" class="scroll-mt-24">
                    <h3 class="text-2xl font-bold text-fuchsia-400 mb-4">🔐 Permessi</h3>
                    
                    <div class="overflow-x-auto">
                      <table class="w-full border-collapse">
                        <thead>
                          <tr class="bg-violet-950/50 border-b border-violet-800/50">
                            <th class="text-left p-4 font-semibold text-violet-300">Permesso</th>
                            <th class="text-left p-4 font-semibold text-violet-300">Descrizione</th>
                            <th class="text-left p-4 font-semibold text-violet-300">Default</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-violet-900/30">
                          {[
                            { perm: "voteplugin.*", desc: "Accesso a tutti i comandi", def: "op" },
                            { perm: "voteplugin.vote", desc: "Comando /vote", def: "true" },
                            { perm: "voteplugin.top", desc: "Comando /votetop", def: "true" },
                            { perm: "voteplugin.claim", desc: "Comando /voteclaim", def: "true" },
                            { perm: "voteplugin.streak", desc: "Comando /votestreak", def: "true" },
                            { perm: "voteplugin.admin", desc: "Comandi admin (reload, test)", def: "op" },
                            { perm: "voteplugin.notify", desc: "Ricevi notifiche sui voti degli altri", def: "op" }
                          ].map(item => (
                            <tr class="hover:bg-violet-950/20 transition-colors">
                              <td class="p-4 font-mono text-sm text-green-400">{item.perm}</td>
                              <td class="p-4 text-violet-200">{item.desc}</td>
                              <td class="p-4">
                                <span class={`px-2 py-1 rounded text-xs font-medium ${item.def === "true" ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"}`}>
                                  {item.def}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>

              {/* API REST */}
              <section id="api" class="mb-20 scroll-mt-24">
                <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-8 border border-violet-900/50 backdrop-blur-md">
                  <h2 class="text-3xl font-black mb-6 flex items-center gap-3">
                    <span class="text-4xl">🔌</span>
                    API Rest
                  </h2>
                  
                  <p class="text-lg text-violet-200 mb-8">
                    API RESTful completa per integrazioni personalizzate. Base URL: 
                    <code class="bg-black/60 px-2 py-1 rounded ml-2">https://api.h-ytale.top/v1</code>
                  </p>

                  {/* Autenticazione */}
                  <div id="api-auth" class="mb-12 scroll-mt-24">
                    <h3 class="text-2xl font-bold text-fuchsia-400 mb-4">🔑 Autenticazione</h3>
                    
                    <p class="text-violet-200 mb-4">
                      Tutte le richieste API richiedono un header di autenticazione con la tua Secret Key:
                    </p>

                    <div class="relative">
                      <button
                        onClick={() => copyCode(`Authorization: Bearer YOUR_SECRET_KEY_HERE`, "auth-header")}
                        class="absolute top-4 right-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold transition-colors z-10"
                      >
                        {copiedCode() === "auth-header" ? "✓ Copiato" : "📋 Copia"}
                      </button>
                      <pre class="bg-black/80 rounded-xl p-6 overflow-x-auto border border-violet-700/30 font-mono text-sm">
                        <code class="text-green-400">Authorization: Bearer YOUR_SECRET_KEY_HERE</code>
                      </pre>
                    </div>
                  </div>

                  {/* Server Endpoints */}
                  <div id="api-servers" class="mb-12 scroll-mt-24">
                    <h3 class="text-2xl font-bold text-fuchsia-400 mb-6">🎮 Server Endpoints</h3>

                    {/* GET /servers */}
                    <div class="mb-8 bg-violet-950/20 border border-violet-800/30 rounded-xl p-6">
                      <div class="flex items-center gap-3 mb-4">
                        <span class="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-lg font-bold text-sm">GET</span>
                        <code class="text-lg font-mono text-white">/servers</code>
                      </div>
                      <p class="text-violet-200 mb-4">Ottieni la lista di tutti i server pubblici</p>
                      
                      <h4 class="font-semibold text-white mb-2">Response Example:</h4>
                      <div class="relative">
                        <button
                          onClick={() => copyCode(`{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "MegaCraft ITA",
      "ip": "play.megacraft.it",
      "port": 25565,
      "votes": 1247,
      "online": true,
      "players": {
        "online": 47,
        "max": 100
      },
      "version": "1.20.4",
      "tags": ["pvp", "survival", "italian"]
    }
  ],
  "count": 247
}`, "get-servers")}
                          class="absolute top-2 right-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold transition-colors"
                        >
                          {copiedCode() === "get-servers" ? "✓" : "📋"}
                        </button>
                        <pre class="bg-black/80 rounded-xl p-4 overflow-x-auto border border-violet-700/30 font-mono text-xs">
                          <code class="text-green-300">{`{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "MegaCraft ITA",
      "ip": "play.megacraft.it",
      "port": 25565,
      "votes": 1247,
      "online": true,
      "players": {
        "online": 47,
        "max": 100
      },
      "version": "1.20.4",
      "tags": ["pvp", "survival", "italian"]
    }
  ],
  "count": 247
}`}</code>
                        </pre>
                      </div>
                    </div>

                    {/* GET /servers/:id */}
                    <div class="mb-8 bg-violet-950/20 border border-violet-800/30 rounded-xl p-6">
                      <div class="flex items-center gap-3 mb-4">
                        <span class="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-lg font-bold text-sm">GET</span>
                        <code class="text-lg font-mono text-white">/servers/:id</code>
                      </div>
                      <p class="text-violet-200 mb-4">Ottieni i dettagli di un server specifico</p>
                      
                      <h4 class="font-semibold text-white mb-2">Response Example:</h4>
                      <div class="relative">
                        <button
                          onClick={() => copyCode(`{
  "success": true,
  "data": {
    "id": 1,
    "name": "MegaCraft ITA",
    "ip": "play.megacraft.it",
    "port": 25565,
    "description": "Il miglior server italiano...",
    "votes": 1247,
    "votes_today": 23,
    "votes_week": 187,
    "votes_month": 842,
    "online": true,
    "players": {
      "online": 47,
      "max": 100
    },
    "version": "1.20.4",
    "tags": ["pvp", "survival", "italian"],
    "website": "https://megacraft.it",
    "discord": "https://discord.gg/megacraft",
    "created_at": "2024-01-15T10:30:00Z"
  }
}`, "get-server-id")}
                          class="absolute top-2 right-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold transition-colors"
                        >
                          {copiedCode() === "get-server-id" ? "✓" : "📋"}
                        </button>
                        <pre class="bg-black/80 rounded-xl p-4 overflow-x-auto border border-violet-700/30 font-mono text-xs">
                          <code class="text-green-300">{`{
  "success": true,
  "data": {
    "id": 1,
    "name": "MegaCraft ITA",
    "ip": "play.megacraft.it",
    "port": 25565,
    "description": "Il miglior server italiano...",
    "votes": 1247,
    "votes_today": 23,
    "votes_week": 187,
    "votes_month": 842,
    "online": true,
    "players": {
      "online": 47,
      "max": 100
    },
    "version": "1.20.4",
    "tags": ["pvp", "survival", "italian"],
    "website": "https://megacraft.it",
    "discord": "https://discord.gg/megacraft",
    "created_at": "2024-01-15T10:30:00Z"
  }
}`}</code>
                        </pre>
                      </div>
                    </div>

                    {/* POST /servers */}
                    <div class="bg-violet-950/20 border border-violet-800/30 rounded-xl p-6">
                      <div class="flex items-center gap-3 mb-4">
                        <span class="px-3 py-1 bg-green-600/30 text-green-300 rounded-lg font-bold text-sm">POST</span>
                        <code class="text-lg font-mono text-white">/servers</code>
                      </div>
                      <p class="text-violet-200 mb-4">Crea un nuovo server (richiede autenticazione utente)</p>
                      
                      <h4 class="font-semibold text-white mb-2">Request Body:</h4>
                      <div class="relative mb-4">
                        <button
                          onClick={() => copyCode(`{
  "name": "Il Mio Server",
  "ip": "play.mioserver.it",
  "port": 25565,
  "version": "1.20.4",
  "description": "Un server fantastico...",
  "tags": ["survival", "economy", "italian"],
  "website": "https://mioserver.it",
  "discord": "https://discord.gg/mioserver"
}`, "post-server")}
                          class="absolute top-2 right-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold transition-colors"
                        >
                          {copiedCode() === "post-server" ? "✓" : "📋"}
                        </button>
                        <pre class="bg-black/80 rounded-xl p-4 overflow-x-auto border border-violet-700/30 font-mono text-xs">
                          <code class="text-yellow-300">{`{
  "name": "Il Mio Server",
  "ip": "play.mioserver.it",
  "port": 25565,
  "version": "1.20.4",
  "description": "Un server fantastico...",
  "tags": ["survival", "economy", "italian"],
  "website": "https://mioserver.it",
  "discord": "https://discord.gg/mioserver"
}`}</code>
                        </pre>
                      </div>

                      <h4 class="font-semibold text-white mb-2">Response:</h4>
                      <div class="relative">
                        <pre class="bg-black/80 rounded-xl p-4 overflow-x-auto border border-violet-700/30 font-mono text-xs">
                          <code class="text-green-300">{`{
  "success": true,
  "data": {
    "id": 248,
    "secret_key": "sk_live_abc123xyz789...",
    "name": "Il Mio Server",
    "ip": "play.mioserver.it",
    ...
  }
}`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Votes Endpoints */}
                  <div id="api-votes" class="mb-12 scroll-mt-24">
                    <h3 class="text-2xl font-bold text-fuchsia-400 mb-6">🔥 Votes Endpoints</h3>

                    {/* POST /votes */}
                    <div class="mb-8 bg-violet-950/20 border border-violet-800/30 rounded-xl p-6">
                      <div class="flex items-center gap-3 mb-4">
                        <span class="px-3 py-1 bg-green-600/30 text-green-300 rounded-lg font-bold text-sm">POST</span>
                        <code class="text-lg font-mono text-white">/votes</code>
                      </div>
                      <p class="text-violet-200 mb-4">Registra un nuovo voto per un server</p>
                      
                      <h4 class="font-semibold text-white mb-2">Request Body:</h4>
                      <div class="relative mb-4">
                        <button
                          onClick={() => copyCode(`{
  "server_id": 1,
  "player_uuid": "123e4567-e89b-12d3-a456-426614174000",
  "player_name": "Steve",
  "ip_address": "192.168.1.1"
}`, "post-vote")}
                          class="absolute top-2 right-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold transition-colors"
                        >
                          {copiedCode() === "post-vote" ? "✓" : "📋"}
                        </button>
                        <pre class="bg-black/80 rounded-xl p-4 overflow-x-auto border border-violet-700/30 font-mono text-xs">
                          <code class="text-yellow-300">{`{
  "server_id": 1,
  "player_uuid": "123e4567-e89b-12d3-a456-426614174000",
  "player_name": "Steve",
  "ip_address": "192.168.1.1"
}`}</code>
                        </pre>
                      </div>

                      <h4 class="font-semibold text-white mb-2">Response:</h4>
                      <div class="relative">
                        <pre class="bg-black/80 rounded-xl p-4 overflow-x-auto border border-violet-700/30 font-mono text-xs">
                          <code class="text-green-300">{`{
  "success": true,
  "data": {
    "vote_id": 12345,
    "player_name": "Steve",
    "server_id": 1,
    "timestamp": "2024-02-16T15:30:00Z",
    "next_vote_at": "2024-02-17T15:30:00Z"
  }
}`}</code>
                        </pre>
                      </div>
                    </div>

                    {/* GET /votes/top */}
                    <div class="bg-violet-950/20 border border-violet-800/30 rounded-xl p-6">
                      <div class="flex items-center gap-3 mb-4">
                        <span class="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-lg font-bold text-sm">GET</span>
                        <code class="text-lg font-mono text-white">/votes/top?period=week</code>
                      </div>
                      <p class="text-violet-200 mb-4">Ottieni la classifica dei top voter (period: today|week|month|alltime)</p>
                      
                      <h4 class="font-semibold text-white mb-2">Response Example:</h4>
                      <div class="relative">
                        <button
                          onClick={() => copyCode(`{
  "success": true,
  "period": "week",
  "data": [
    {
      "rank": 1,
      "player_name": "Steve",
      "player_uuid": "123e4567-e89b-12d3-a456-426614174000",
      "votes": 42,
      "streak": 7
    },
    {
      "rank": 2,
      "player_name": "Alex",
      "player_uuid": "987f6543-b21c-34e5-d678-987654321000",
      "votes": 38,
      "streak": 5
    }
  ]
}`, "get-top-votes")}
                          class="absolute top-2 right-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold transition-colors"
                        >
                          {copiedCode() === "get-top-votes" ? "✓" : "📋"}
                        </button>
                        <pre class="bg-black/80 rounded-xl p-4 overflow-x-auto border border-violet-700/30 font-mono text-xs">
                          <code class="text-green-300">{`{
  "success": true,
  "period": "week",
  "data": [
    {
      "rank": 1,
      "player_name": "Steve",
      "player_uuid": "123e4567-e89b-12d3-a456-426614174000",
      "votes": 42,
      "streak": 7
    },
    {
      "rank": 2,
      "player_name": "Alex",
      "player_uuid": "987f6543-b21c-34e5-d678-987654321000",
      "votes": 38,
      "streak": 5
    }
  ]
}`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Stats Endpoints */}
                  <div id="api-stats" class="scroll-mt-24">
                    <h3 class="text-2xl font-bold text-fuchsia-400 mb-6">📊 Stats Endpoints</h3>

                    <div class="bg-violet-950/20 border border-violet-800/30 rounded-xl p-6">
                      <div class="flex items-center gap-3 mb-4">
                        <span class="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-lg font-bold text-sm">GET</span>
                        <code class="text-lg font-mono text-white">/stats/server/:id</code>
                      </div>
                      <p class="text-violet-200 mb-4">Ottieni le statistiche dettagliate di un server</p>
                      
                      <h4 class="font-semibold text-white mb-2">Response Example:</h4>
                      <div class="relative">
                        <button
                          onClick={() => copyCode(`{
  "success": true,
  "data": {
    "server_id": 1,
    "total_votes": 12847,
    "votes_today": 23,
    "votes_week": 187,
    "votes_month": 842,
    "unique_voters": 3421,
    "avg_votes_per_day": 34.2,
    "top_voters": [
      {
        "player_name": "Steve",
        "votes": 247
      }
    ],
    "vote_history": [
      {
        "date": "2024-02-16",
        "votes": 23
      }
    ]
  }
}`, "get-stats")}
                          class="absolute top-2 right-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold transition-colors"
                        >
                          {copiedCode() === "get-stats" ? "✓" : "📋"}
                        </button>
                        <pre class="bg-black/80 rounded-xl p-4 overflow-x-auto border border-violet-700/30 font-mono text-xs">
                          <code class="text-green-300">{`{
  "success": true,
  "data": {
    "server_id": 1,
    "total_votes": 12847,
    "votes_today": 23,
    "votes_week": 187,
    "votes_month": 842,
    "unique_voters": 3421,
    "avg_votes_per_day": 34.2,
    "top_voters": [
      {
        "player_name": "Steve",
        "votes": 247
      }
    ],
    "vote_history": [
      {
        "date": "2024-02-16",
        "votes": 23
      }
    ]
  }
}`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* WEBHOOKS */}
              <section id="webhooks" class="mb-20 scroll-mt-24">
                <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-8 border border-violet-900/50 backdrop-blur-md">
                  <h2 class="text-3xl font-black mb-6 flex items-center gap-3">
                    <span class="text-4xl">🔔</span>
                    Webhooks
                  </h2>
                  
                  <p class="text-lg text-violet-200 mb-8">
                    Ricevi notifiche in tempo reale quando qualcuno vota per il tuo server.
                  </p>

                  <div class="bg-blue-950/30 border-2 border-blue-600/50 rounded-xl p-6 mb-8">
                    <h4 class="text-xl font-bold text-blue-300 mb-3">📡 Configurazione Webhook</h4>
                    <p class="text-blue-200/80 mb-4">
                      Imposta l'URL del tuo webhook nella dashboard del server. Riceverai una richiesta POST per ogni voto.
                    </p>
                    <code class="block bg-black/60 px-4 py-2 rounded font-mono text-sm text-green-400">
                      https://tuoserver.it/api/webhooks/votes
                    </code>
                  </div>

                  <h4 class="font-semibold text-white mb-4 text-xl">Payload Webhook:</h4>
                  <div class="relative mb-6">
                    <button
                      onClick={() => copyCode(`{
  "event": "vote.created",
  "timestamp": "2024-02-16T15:30:00Z",
  "data": {
    "vote_id": 12345,
    "server_id": 1,
    "server_name": "MegaCraft ITA",
    "player": {
      "uuid": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Steve",
      "total_votes": 47
    },
    "ip_address": "192.168.1.1"
  }
}`, "webhook-payload")}
                      class="absolute top-2 right-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold transition-colors"
                    >
                      {copiedCode() === "webhook-payload" ? "✓ Copiato" : "📋 Copia"}
                    </button>
                    <pre class="bg-black/80 rounded-xl p-6 overflow-x-auto border border-violet-700/30 font-mono text-sm">
                      <code class="text-green-300">{`{
  "event": "vote.created",
  "timestamp": "2024-02-16T15:30:00Z",
  "data": {
    "vote_id": 12345,
    "server_id": 1,
    "server_name": "MegaCraft ITA",
    "player": {
      "uuid": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Steve",
      "total_votes": 47
    },
    "ip_address": "192.168.1.1"
  }
}`}</code>
                    </pre>
                  </div>

                  <div class="bg-yellow-950/30 border border-yellow-600/50 rounded-xl p-4">
                    <div class="flex items-start gap-3">
                      <span class="text-2xl">🔒</span>
                      <div>
                        <h4 class="font-bold text-yellow-300 mb-1">Sicurezza</h4>
                        <p class="text-yellow-200/80 text-sm">
                          Ogni webhook include un header <code class="bg-black/40 px-1 rounded">X-Signature</code> con 
                          HMAC SHA256 della tua secret key. Verifica sempre la firma prima di processare i dati.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ESEMPI CODICE */}
              <section id="examples" class="mb-20 scroll-mt-24">
                <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-8 border border-violet-900/50 backdrop-blur-md">
                  <h2 class="text-3xl font-black mb-6 flex items-center gap-3">
                    <span class="text-4xl">💻</span>
                    Esempi Codice
                  </h2>

                  {/* JavaScript Example */}
                  <div class="mb-8">
                    <h3 class="text-xl font-bold text-fuchsia-400 mb-4">JavaScript / Node.js</h3>
                    <div class="relative">
                      <button
                        onClick={() => copyCode(`// Ottieni lista server
const response = await fetch('https://api.h-ytale.top/v1/servers');
const data = await response.json();
console.log(data.data);

// Registra un voto
const voteResponse = await fetch('https://api.h-ytale.top/v1/votes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_SECRET_KEY'
  },
  body: JSON.stringify({
    server_id: 1,
    player_uuid: '123e4567-e89b-12d3-a456-426614174000',
    player_name: 'Steve',
    ip_address: '192.168.1.1'
  })
});
const voteData = await voteResponse.json();
console.log(voteData);`, "example-js")}
                        class="absolute top-2 right-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold transition-colors z-10"
                      >
                        {copiedCode() === "example-js" ? "✓" : "📋"}
                      </button>
                      <pre class="bg-black/80 rounded-xl p-6 overflow-x-auto border border-violet-700/30 font-mono text-sm">
                        <code class="text-purple-300">{`// Ottieni lista server
const response = await fetch('https://api.h-ytale.top/v1/servers');
const data = await response.json();
console.log(data.data);

// Registra un voto
const voteResponse = await fetch('https://api.h-ytale.top/v1/votes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_SECRET_KEY'
  },
  body: JSON.stringify({
    server_id: 1,
    player_uuid: '123e4567-e89b-12d3-a456-426614174000',
    player_name: 'Steve',
    ip_address: '192.168.1.1'
  })
});
const voteData = await voteResponse.json();
console.log(voteData);`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Python Example */}
                  <div class="mb-8">
                    <h3 class="text-xl font-bold text-fuchsia-400 mb-4">Python</h3>
                    <div class="relative">
                      <button
                        onClick={() => copyCode(`import requests

# Ottieni lista server
response = requests.get('https://api.h-ytale.top/v1/servers')
data = response.json()
print(data['data'])

# Registra un voto
vote_data = {
    'server_id': 1,
    'player_uuid': '123e4567-e89b-12d3-a456-426614174000',
    'player_name': 'Steve',
    'ip_address': '192.168.1.1'
}

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_SECRET_KEY'
}

vote_response = requests.post(
    'https://api.h-ytale.top/v1/votes',
    json=vote_data,
    headers=headers
)
print(vote_response.json())`, "example-python")}
                        class="absolute top-2 right-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold transition-colors z-10"
                      >
                        {copiedCode() === "example-python" ? "✓" : "📋"}
                      </button>
                      <pre class="bg-black/80 rounded-xl p-6 overflow-x-auto border border-violet-700/30 font-mono text-sm">
                        <code class="text-blue-300">{`import requests

# Ottieni lista server
response = requests.get('https://api.h-ytale.top/v1/servers')
data = response.json()
print(data['data'])

# Registra un voto
vote_data = {
    'server_id': 1,
    'player_uuid': '123e4567-e89b-12d3-a456-426614174000',
    'player_name': 'Steve',
    'ip_address': '192.168.1.1'
}

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_SECRET_KEY'
}

vote_response = requests.post(
    'https://api.h-ytale.top/v1/votes',
    json=vote_data,
    headers=headers
)
print(vote_response.json())`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Java/Kotlin Example */}
                  <div>
                    <h3 class="text-xl font-bold text-fuchsia-400 mb-4">Java (Spigot Plugin)</h3>
                    <div class="relative">
                      <button
                        onClick={() => copyCode(`// Nel tuo plugin Spigot
public void registerVote(Player player) {
    JSONObject json = new JSONObject();
    json.put("server_id", serverId);
    json.put("player_uuid", player.getUniqueId().toString());
    json.put("player_name", player.getName());
    json.put("ip_address", player.getAddress().getAddress().getHostAddress());
    
    HttpURLConnection conn = (HttpURLConnection) new URL(
        "https://api.h-ytale.top/v1/votes"
    ).openConnection();
    
    conn.setRequestMethod("POST");
    conn.setRequestProperty("Content-Type", "application/json");
    conn.setRequestProperty("Authorization", "Bearer " + secretKey);
    conn.setDoOutput(true);
    
    try (OutputStream os = conn.getOutputStream()) {
        os.write(json.toString().getBytes());
        os.flush();
    }
    
    int responseCode = conn.getResponseCode();
    if (responseCode == 200) {
        player.sendMessage("§aGrazie per aver votato!");
    }
}`, "example-java")}
                        class="absolute top-2 right-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold transition-colors z-10"
                      >
                        {copiedCode() === "example-java" ? "✓" : "📋"}
                      </button>
                      <pre class="bg-black/80 rounded-xl p-6 overflow-x-auto border border-violet-700/30 font-mono text-sm">
                        <code class="text-orange-300">{`// Nel tuo plugin Spigot
public void registerVote(Player player) {
    JSONObject json = new JSONObject();
    json.put("server_id", serverId);
    json.put("player_uuid", player.getUniqueId().toString());
    json.put("player_name", player.getName());
    json.put("ip_address", player.getAddress().getAddress().getHostAddress());
    
    HttpURLConnection conn = (HttpURLConnection) new URL(
        "https://api.h-ytale.top/v1/votes"
    ).openConnection();
    
    conn.setRequestMethod("POST");
    conn.setRequestProperty("Content-Type", "application/json");
    conn.setRequestProperty("Authorization", "Bearer " + secretKey);
    conn.setDoOutput(true);
    
    try (OutputStream os = conn.getOutputStream()) {
        os.write(json.toString().getBytes());
        os.flush();
    }
    
    int responseCode = conn.getResponseCode();
    if (responseCode == 200) {
        player.sendMessage("§aGrazie per aver votato!");
    }
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer CTA */}
              <div class="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl p-8 text-center">
                <h3 class="text-2xl font-bold text-white mb-3">
                  Hai bisogno di aiuto?
                </h3>
                <p class="text-violet-100 mb-6">
                  Unisciti al nostro Discord per supporto diretto dalla community
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://discord.gg/hytale"
                    class="px-8 py-4 bg-white hover:bg-gray-100 text-violet-600 rounded-xl font-bold transition-all"
                  >
                    💬 Discord Server
                  </a>
                  <A
                    href="/panel"
                    class="px-8 py-4 bg-black/30 hover:bg-black/50 text-white rounded-xl font-bold transition-all border-2 border-white/30"
                  >
                    🚀 Inizia Ora
                  </A>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Notifications />
    </div>
  );
};

export default Docs;
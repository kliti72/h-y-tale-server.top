import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../auth/AuthContext";
import Notifications, { notify } from "../component/template/Notification";

const VotePlugin: Component = () => {
  const auth = useAuth();

  const copySecretKey = (key: string) => {
    navigator.clipboard.writeText(key);
    notify("Secret Key copiata! Incollala nel config.yml", "success");
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white">
      {/* HERO */}
      <div class="relative py-20 md:py-28 px-6 text-center overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.15),transparent_60%)]" />
        
        <div class="max-w-5xl mx-auto">
          <h1 class="text-6xl md:text-7xl font-black tracking-tighter mb-6">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              VOTE
            </span>
            <span class="text-emerald-400">PLUGIN</span>
          </h1>
          
          <p class="text-2xl md:text-3xl text-violet-200/90 mb-10 max-w-3xl mx-auto">
            Il plugin ufficiale per far votare il tuo server Hytale e ricevere ricompense automatiche.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://github.com/tuoutenteam/voteplugin/releases/latest/download/VotePlugin.jar"
              class="
                inline-flex items-center gap-4 px-10 py-5 rounded-2xl text-xl font-bold
                bg-gradient-to-r from-emerald-600 to-teal-600
                hover:from-emerald-500 hover:to-teal-500
                text-white shadow-2xl shadow-emerald-900/60 hover:shadow-emerald-700/80
                border-2 border-emerald-500/70 hover:border-emerald-400/90
                transition-all duration-300 active:scale-95
              "
            >
              <span class="text-3xl">↓</span>
              SCARICA PLUGIN (1.0.3)
            </a>

            <A
              href="/panel"
              class="
                px-8 py-5 rounded-2xl text-lg font-semibold border-2 border-violet-600/60
                hover:border-violet-400 text-violet-200 hover:text-white
                transition-all duration-300
              "
            >
              Vai ai miei server →
            </A>
          </div>

          <p class="text-sm text-zinc-500 mt-6">Compatibile con Paper / Purpur 1.21+</p>
        </div>
      </div>

      {/* FEATURES */}
      <div class="max-w-6xl mx-auto px-6 py-16">
        <h2 class="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400">
          Cosa può fare VotePlugin
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "⭐",
              title: "Voti automatici",
              desc: "Riconosce i voti da tutti i siti più popolari (TopMinecraftServers, Minecraft-MP, ecc.)"
            },
            {
              icon: "🎁",
              title: "Ricompense personalizzabili",
              desc: "Comandi, item, denaro, permessi, effetti speciali... tutto configurabile"
            },
            {
              icon: "🔑",
              title: "Secret Key protetta",
              desc: "Ogni server ha la sua chiave univoca, impossibile da indovinare"
            },
            {
              icon: "📊",
              title: "Statistiche in tempo reale",
              desc: "Voti totali, streak, top voter del mese direttamente in-game"
            },
            {
              icon: "🌐",
              title: "Multi-server",
              desc: "Supporta BungeeCord / Velocity / multi-proxy"
            },
            {
              icon: "⚡",
              title: "Leggero e veloce",
              desc: "Zero lag, scritto in Kotlin, ottimizzato per server grandi"
            }
          ].map(item => (
            <div class="bg-black/40 border border-violet-800/50 rounded-2xl p-8 hover:border-fuchsia-600/60 transition-all group">
              <div class="text-5xl mb-6 opacity-80 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 class="text-2xl font-bold mb-3 text-fuchsia-300">{item.title}</h3>
              <p class="text-violet-200/80">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* GUIDA INSTALLAZIONE */}
      <div class="max-w-5xl mx-auto px-6 py-20 bg-black/60 border-t border-b border-violet-900/50">
        <h2 class="text-4xl font-bold text-center mb-16 text-emerald-400">Come installarlo in 3 minuti</h2>

        <div class="space-y-16">
          {/* Passo 1 */}
          <div class="flex flex-col md:flex-row gap-10 items-center">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-4xl font-bold flex-shrink-0">1</div>
            <div class="flex-1">
              <h3 class="text-2xl font-semibold mb-3">Scarica e metti nella cartella plugins</h3>
              <p class="text-zinc-300">Scarica il .jar e trascinalo nella cartella <code class="bg-black/70 px-2 py-0.5 rounded">plugins</code> del tuo server.</p>
            </div>
            <div class="text-emerald-400 text-6xl opacity-30">↓</div>
          </div>

          {/* Passo 2 */}
          <div class="flex flex-col md:flex-row gap-10 items-center">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-500 flex items-center justify-center text-4xl font-bold flex-shrink-0">2</div>
            <div class="flex-1">
              <h3 class="text-2xl font-semibold mb-3">Copia la tua Secret Key</h3>
              <p class="text-zinc-300 mb-4">Vai nella pagina <strong>"I Miei Server"</strong>, copia la chiave segreta del server che vuoi collegare.</p>
              
              <Show when={auth.isAuthenticated()}>
                <button
                  onClick={() => copySecretKey("esempio-chiave-segreta-123456")}
                  class="text-sm px-5 py-2 bg-violet-900/70 hover:bg-violet-800 rounded-lg border border-violet-700"
                >
                  Copia esempio chiave
                </button>
              </Show>
            </div>
          </div>

          {/* Passo 3 */}
          <div class="flex flex-col md:flex-row gap-10 items-center">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-4xl font-bold flex-shrink-0">3</div>
            <div class="flex-1">
              <h3 class="text-2xl font-semibold mb-3">Configura il plugin</h3>
              <p class="text-zinc-300 mb-4">Apri il file <code class="bg-black/70 px-2 py-0.5 rounded">plugins/VotePlugin/config.yml</code> e incolla la chiave:</p>
              
              <div class="bg-black/80 p-6 rounded-xl font-mono text-sm overflow-auto border border-violet-700/50">
                <span class="text-emerald-400">secret-key:</span> tua_chiave_super_segreta_qui<br/>
                <span class="text-emerald-400">vote-command:</span> vote<br/>
                <span class="text-emerald-400">reward-command:</span> give %player% diamond 5
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMANDI */}
      <div class="max-w-4xl mx-auto px-6 py-20">
        <h2 class="text-4xl font-bold text-center mb-12">Comandi disponibili</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-black/40 border border-violet-800/50 rounded-xl p-6">
            <code class="text-emerald-400">/vote</code>
            <p class="text-zinc-300 mt-2">Mostra i link per votare</p>
          </div>
          <div class="bg-black/40 border border-violet-800/50 rounded-xl p-6">
            <code class="text-emerald-400">/votetop</code>
            <p class="text-zinc-300 mt-2">Classifica dei top voter</p>
          </div>
          <div class="bg-black/40 border border-violet-800/50 rounded-xl p-6">
            <code class="text-emerald-400">/voteclaim</code>
            <p class="text-zinc-300 mt-2">Reclama ricompense in sospeso</p>
          </div>
          <div class="bg-black/40 border border-violet-800/50 rounded-xl p-6">
            <code class="text-emerald-400">/votereload</code>
            <p class="text-zinc-300 mt-2">Ricarica la configurazione (solo admin)</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div class="max-w-4xl mx-auto px-6 py-20 bg-black/40">
        <h2 class="text-4xl font-bold text-center mb-12 text-fuchsia-400">Domande frequenti</h2>
        <div class="space-y-8 text-lg">
          <div>
            <p class="font-semibold text-violet-300">Posso usare lo stesso plugin su più server?</p>
            <p class="text-zinc-400">Sì, ogni server ha la sua secret key. Puoi usare lo stesso plugin su tutta la rete.</p>
          </div>
          <div>
            <p class="font-semibold text-violet-300">Il plugin supporta proxy (Velocity/Bungee)?</p>
            <p class="text-zinc-400">Sì, è completamente compatibile con Velocity, BungeeCord e Waterfall.</p>
          </div>
          <div>
            <p class="font-semibold text-violet-300">Come faccio a vedere i voti in tempo reale?</p>
            <p class="text-zinc-400">Il plugin si connette direttamente al nostro sistema. I voti arrivano in meno di 3 secondi.</p>
          </div>
        </div>
      </div>

      {/* FOOTER CALL TO ACTION */}
      <div class="py-20 text-center border-t border-violet-900/50">
        <p class="text-xl text-zinc-400 mb-6">Pronto a far crescere il tuo server?</p>
        <A
          href="/panel"
          class="inline-block px-12 py-6 text-xl font-bold rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all"
        >
          Vai ai miei server e prendi la Secret Key →
        </A>
      </div>
    </div>
  );
};

export default VotePlugin;
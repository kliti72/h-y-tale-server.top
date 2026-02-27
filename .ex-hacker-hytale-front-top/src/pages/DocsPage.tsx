// DocsPage.tsx
import { Component, For } from "solid-js";

const DocsPage: Component = () => {
  return (
    <div
      class="min-h-screen text-[#00ff41] bg-black"
      style={{
        "font-family": "'Share Tech Mono', 'Courier New', monospace",
        background:
          "linear-gradient(160deg, #000300 0%, #000a02 40%, #000500 100%)",
      }}
    >
      {/* Grid di sfondo molto leggera */}
      <div
        class="fixed inset-0 pointer-events-none z-0"
        style={{
          "background-image": `
            linear-gradient(rgba(0,255,65,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,65,0.018) 1px, transparent 1px)
          `,
          "background-size": "50px 50px",
        }}
      />

      {/* Scanlines sottili */}
      <div
        class="fixed inset-0 pointer-events-none z-1"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.006) 2px, rgba(0,255,65,0.006) 3px)",
        }}
      />

      {/* Header / Hero */}
      <div class="relative border-b border-green-900/40 py-14 px-6 text-center overflow-hidden">
        <div
          class="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 0%, rgba(0,255,65,0.06) 0%, transparent 75%)",
          }}
        />

        <div class="relative z-10 max-w-4xl mx-auto">
          <div class="flex items-center justify-center gap-4 mb-5">
            <div class="h-px flex-1 bg-gradient-to-r from-transparent via-green-800/40 to-transparent" />
            <span class="text-xs tracking-[0.35em] uppercase text-green-700/70">
              VOTE → REWARD PROTOCOL
            </span>
            <div class="h-px flex-1 bg-gradient-to-l from-transparent via-green-800/40 to-transparent" />
          </div>

          <h1
            class="text-5xl sm:text-6xl md:text-7xl font-black leading-none mb-4"
            style={{
              "font-family": "'Orbitron', monospace",
              "text-shadow": "0 0 50px rgba(0,255,65,0.18)",
            }}
          >
            CLAIM REWARDS
          </h1>

          <p class="text-base text-green-700/60 tracking-[0.25em] uppercase">
             | In fase di sviluppo
          </p>
        </div>
      </div>

      {/* Contenuto principale */}
      <div class="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-12">

        {/* Installazione */}
        <section class="mb-20">
          <h2
            class="text-4xl font-black mb-6"
            style={{ "font-family": "'Orbitron', monospace" }}
          >
            INSTALLAZIONE
          </h2>

          <div class="relative border border-green-900/50 bg-black/50 p-6">
            <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-600/40 pointer-events-none" />
            <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-600/40 pointer-events-none" />

            <pre class="text-sm leading-7 overflow-x-auto text-[#00ff88]/90">
              {`# Scarica l'ultima versione
└─ IN FASE DI SVILUPPO.
  # Sposta nella cartella plugins del server
      plugins/
      └─ H-Y-Tale-Verifier-.jar 

# Riavvia il server`}
            </pre>
          </div>
        </section>

        {/* Configurazione */}
        <section class="mb-20">
          <h2
            class="text-4xl font-black mb-6"
            style={{ "font-family": "'Orbitron', monospace" }}
          >
            CONFIGURAZIONE
          </h2>

          <div class="relative border border-green-900/50 bg-black/50">
            <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-600/40 pointer-events-none" />
            <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-600/40 pointer-events-none" />

            <div class="bg-black/70 px-5 py-2 text-xs text-green-800/60 border-b border-green-900/40">
              plugins/H_Y_TALE-Verifier/config.json
            </div>

            <pre class="p-6 text-sm leading-7 text-[#00ff77]/90 overflow-x-auto">
{`# Impostare qui 
└─ web_secret_key: "s3cr3t_k3y_m0lto_lunga_e_compl3ss4_2026",
# Non toccare 
└─ clinet_secret_key: "s3cr3t_k3y_m0lto_lunga_e_compl3ss4_2026",

#Configurazioni Opzionali
disable_claim: false,
claim_success: "<green> Premi ritirati con successo. </green>"
claim_disabled: "&aCalim ."
claim_empty:   "&cNessun voto in attesa da claimare."
claim_cooldown: "&cDevi aspettare ancora {time} prima di claimare di nuovo."`}
            </pre>
          </div>

          <div class="mt-5 text-sm text-green-700/70">
            La <code class="text-[#00ff99]">secret_key</code> si trova nella lista dei tuoi server. <br> </br>
            Impostare  <code class="text-[#00ff99]">disable_claim</code> se si vuole disabilitare il ritiro del premio. <br> </br>
          </div>
        </section>

    

    <section class="mb-16">
          <h2
            class="text-4xl font-black mb-6"
            style={{ "font-family": "'Orbitron', monospace" }}
          >
            COMANDI GIOCATORI
          </h2>

          <div class="relative border border-green-900/50 bg-black/50">
            <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-600/40 pointer-events-none" />
            <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-600/40 pointer-events-none" />

            <ul class="divide-y divide-green-900/30 text-sm">
              <For
                each={[
                  "/claim                  → Ritira Premio",
                  "/vote                   → Ricevi link di voto diretto al server",
                  "/v                      → Vote alias",
                ]}
              >
                {(cmd) => (
                  <li class="px-6 py-3 flex items-start gap-4 hover:bg-green-950/30 transition-colors">
                    <span class="text-green-600/70 shrink-0">▶</span>
                    <code class="text-[#00ff88]">{cmd}</code>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </section>

        {/* Comandi admin */}
        <section class="mb-16">
          <h2
            class="text-4xl font-black mb-6"
            style={{ "font-family": "'Orbitron', monospace" }}
          >
            COMANDI ADMIN
          </h2>

          <div class="relative border border-green-900/50 bg-black/50">
            <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-600/40 pointer-events-none" />
            <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-600/40 pointer-events-none" />

            <ul class="divide-y divide-green-900/30 text-sm">
              <For
                each={[
                  "/vote forceclaim <player>     → forza esecuzione premi",
                  "/vote stats                   → statistiche globali plugin",
                ]}
              >
                {(cmd) => (
                  <li class="px-6 py-3 flex items-start gap-4 hover:bg-green-950/30 transition-colors">
                    <span class="text-green-600/70 shrink-0">▶</span>
                    <code class="text-[#00ff88]">{cmd}</code>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </section>

        <div class="text-center text-xs text-green-800/50 tracking-widest mt-24">
          VOTE-REWARD PLUGIN • HYTALE ECOSYSTEM • SICUREZZA CRITTOGRAFICA • 2026
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
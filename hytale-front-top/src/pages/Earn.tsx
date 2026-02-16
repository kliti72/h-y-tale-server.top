import { Component, createSignal, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import Notifications, { notify } from "../component/template/Notification";

const Earn: Component = () => {
  const [selectedTier, setSelectedTier] = createSignal<"free" | "basic" | "pro" | "enterprise">("basic");

  const tiers = [
    {
      id: "free" as const,
      name: "Free",
      price: "€0",
      period: "sempre",
      color: "from-gray-600 to-gray-700",
      features: [
        "10% revenue share sui voti",
        "Pagamenti mensili (min €50)",
        "Dashboard base",
        "Analytics 30 giorni",
        "Supporto community"
      ],
      limitations: [
        "Max 500 voti/mese inclusi",
        "Payout ogni 30 giorni",
        "Commissione PayPal: 3%"
      ]
    },
    {
      id: "basic" as const,
      name: "Basic",
      price: "€9.99",
      period: "/mese",
      color: "from-blue-600 to-cyan-600",
      popular: false,
      features: [
        "15% revenue share sui voti",
        "Pagamenti bi-settimanali (min €25)",
        "Dashboard avanzata",
        "Analytics 90 giorni",
        "Supporto prioritario email",
        "Voti illimitati"
      ],
      limitations: [
        "Commissione PayPal: 2.5%"
      ]
    },
    {
      id: "pro" as const,
      name: "Pro",
      price: "€29.99",
      period: "/mese",
      color: "from-purple-600 to-pink-600",
      popular: true,
      features: [
        "25% revenue share sui voti",
        "Pagamenti settimanali (min €10)",
        "Dashboard completa + API",
        "Analytics illimitati",
        "Supporto prioritario 24/7",
        "Voti illimitati",
        "Server in evidenza",
        "Badge personalizzati",
        "Webhook avanzati"
      ],
      limitations: [
        "Commissione PayPal: 2%"
      ]
    },
    {
      id: "enterprise" as const,
      name: "Enterprise",
      price: "Custom",
      period: "",
      color: "from-yellow-600 to-orange-600",
      features: [
        "35% revenue share sui voti",
        "Pagamenti instant su richiesta",
        "Dashboard white-label",
        "Analytics + Export dati",
        "Account manager dedicato",
        "Voti illimitati",
        "Posizionamento premium",
        "API rate limit custom",
        "Integrazioni custom",
        "Contratto personalizzato"
      ],
      limitations: []
    }
  ];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    notify("Codice copiato! 📋", "success");
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white">
      
      {/* Hero */}
      <div class="relative overflow-hidden bg-black/40 border-b border-violet-900/50">
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute w-96 h-96 bg-green-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
          <div class="absolute w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700" />
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div class="inline-block px-6 py-2 bg-green-600/20 border border-green-500/50 rounded-full text-green-300 font-semibold mb-6">
            💰 Programma Monetizzazione
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
            Guadagna con i Voti
          </h1>
          
          <p class="text-xl md:text-2xl text-violet-200 max-w-4xl mx-auto mb-8">
            Trasforma i voti dei tuoi player in entrate reali. Più voti ricevi, più guadagni. 
            Sistema di revenue share trasparente e pagamenti automatici.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <A
              href="/panel"
              class="px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-bold text-xl shadow-2xl shadow-green-900/50 transition-all"
            >
              🚀 Inizia Ora
            </A>
            <a
              href="#calculator"
              class="px-10 py-5 bg-violet-950/60 hover:bg-violet-900/80 border-2 border-violet-700/50 rounded-2xl font-bold text-xl transition-all"
            >
              📊 Calcola Guadagni
            </a>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Come Funziona */}
        <section class="mb-20">
          <h2 class="text-4xl font-black text-center mb-12 bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
            Come Funziona il Revenue Share
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                step: "1",
                icon: "👥",
                title: "Player Votano",
                desc: "I tuoi giocatori votano il server sulla nostra piattaforma",
                color: "from-blue-600 to-cyan-600"
              },
              {
                step: "2",
                icon: "💰",
                title: "Generi Revenue",
                desc: "Ogni voto genera valore che viene condiviso con te",
                color: "from-purple-600 to-pink-600"
              },
              {
                step: "3",
                icon: "💸",
                title: "Ricevi Pagamenti",
                desc: "Pagamenti automatici sul tuo conto PayPal o IBAN",
                color: "from-green-600 to-emerald-600"
              }
            ].map(item => (
              <div class={`relative overflow-hidden bg-gradient-to-br ${item.color} p-1 rounded-2xl`}>
                <div class="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 h-full">
                  <div class="text-6xl mb-4">{item.icon}</div>
                  <div class="text-5xl font-black text-white/20 absolute top-4 right-4">
                    {item.step}
                  </div>
                  <h3 class="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p class="text-violet-200">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div class="bg-gradient-to-br from-green-950/40 to-emerald-950/40 border-2 border-green-600/50 rounded-2xl p-8">
            <div class="flex items-start gap-4">
              <span class="text-5xl">💡</span>
              <div>
                <h3 class="text-2xl font-bold text-green-300 mb-3">Modello di Revenue</h3>
                <p class="text-green-100 mb-4 text-lg">
                  H-YTALE genera revenue attraverso sponsorizzazioni e premium player. 
                  Una percentuale di questo revenue viene condivisa con i server in base ai voti ricevuti.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-black/40 rounded-xl p-4">
                    <div class="text-3xl font-black text-green-400 mb-1">€0.05-0.20</div>
                    <div class="text-sm text-green-200">Per voto (varia con il piano)</div>
                  </div>
                  <div class="bg-black/40 rounded-xl p-4">
                    <div class="text-3xl font-black text-green-400 mb-1">100%</div>
                    <div class="text-sm text-green-200">Trasparenza garantita</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section class="mb-20">
          <h2 class="text-4xl font-black text-center mb-4">Scegli il Tuo Piano</h2>
          <p class="text-xl text-violet-300 text-center mb-12 max-w-2xl mx-auto">
            Più alto il piano, maggiore la percentuale di revenue share che ricevi
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <For each={tiers}>
              {(tier) => (
                <div class={`
                  relative overflow-hidden rounded-2xl border-2 transition-all duration-300
                  ${tier.popular 
                    ? "border-fuchsia-500 scale-105 shadow-2xl shadow-fuchsia-900/50" 
                    : "border-violet-800/50 hover:border-violet-600/50"}
                `}>
                  {tier.popular && (
                    <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-fuchsia-600 to-purple-600 py-2 text-center font-bold text-sm">
                      ⭐ PIÙ POPOLARE
                    </div>
                  )}

                  <div class={`bg-gradient-to-br ${tier.color} p-1`}>
                    <div class={`bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 h-full ${tier.popular ? 'pt-14' : ''}`}>
                      
                      {/* Header */}
                      <div class="text-center mb-6">
                        <h3 class="text-2xl font-black text-white mb-2">{tier.name}</h3>
                        <div class="flex items-baseline justify-center gap-1">
                          <span class="text-4xl font-black text-white">{tier.price}</span>
                          <span class="text-violet-400">{tier.period}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div class="space-y-3 mb-6">
                        <For each={tier.features}>
                          {(feature) => (
                            <div class="flex items-start gap-2">
                              <span class="text-green-400 mt-1">✓</span>
                              <span class="text-sm text-violet-200">{feature}</span>
                            </div>
                          )}
                        </For>
                      </div>

                      {/* Limitations */}
                      <Show when={tier.limitations.length > 0}>
                        <div class="border-t border-violet-800/30 pt-4 mb-6">
                          <For each={tier.limitations}>
                            {(limitation) => (
                              <div class="flex items-start gap-2 mb-2">
                                <span class="text-yellow-400 mt-1">!</span>
                                <span class="text-xs text-violet-400">{limitation}</span>
                              </div>
                            )}
                          </For>
                        </div>
                      </Show>

                      {/* CTA */}
                      <button
                        onClick={() => {
                          setSelectedTier(tier.id);
                          notify(`Piano ${tier.name} selezionato!`, "success");
                        }}
                        class={`
                          w-full py-3 rounded-xl font-bold transition-all
                          ${tier.popular
                            ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white"
                            : "bg-violet-950/60 hover:bg-violet-900/80 text-violet-200 border border-violet-700/50"}
                        `}
                      >
                        {tier.id === "enterprise" ? "Contattaci" : "Seleziona"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>

          {/* Comparison Note */}
          <div class="bg-violet-950/30 border border-violet-700/30 rounded-xl p-6 text-center">
            <p class="text-violet-300">
              💡 <strong>Pro Tip:</strong> Con il piano Pro, un server che riceve 1000 voti/mese può guadagnare 
              <strong class="text-green-400"> €150-250/mese</strong> in modo completamente passivo!
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator" class="mb-20 scroll-mt-24">
          <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-8 border border-violet-900/50">
            <h2 class="text-4xl font-black mb-8 text-center bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              📊 Calcola i Tuoi Guadagni
            </h2>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input */}
              <div class="space-y-6">
                <div>
                  <label class="block text-violet-300 font-semibold mb-2">Piano Selezionato</label>
                  <select
                    value={selectedTier()}
                    onChange={(e) => setSelectedTier(e.currentTarget.value as any)}
                    class="w-full px-6 py-4 bg-black/60 border-2 border-violet-700/50 rounded-xl text-white focus:outline-none focus:border-fuchsia-500"
                  >
                    <For each={tiers}>
                      {(tier) => (
                        <option value={tier.id}>{tier.name} - {tier.price}{tier.period}</option>
                      )}
                    </For>
                  </select>
                </div>

                <div>
                  <label class="block text-violet-300 font-semibold mb-2">Voti Mensili Stimati</label>
                  <input
                    type="number"
                    id="votes-input"
                    placeholder="Es: 1000"
                    class="w-full px-6 py-4 bg-black/60 border-2 border-violet-700/50 rounded-xl text-white focus:outline-none focus:border-fuchsia-500"
                  />
                </div>

                <div class="bg-blue-950/30 border border-blue-600/50 rounded-xl p-4">
                  <div class="flex items-start gap-3">
                    <span class="text-2xl">💡</span>
                    <div class="text-sm text-blue-200">
                      <strong>Stima conservativa:</strong> Un server medio riceve 20-50 voti/giorno. 
                      Server popolari possono superare i 200 voti/giorno.
                    </div>
                  </div>
                </div>
              </div>

              {/* Output */}
              <div class="bg-gradient-to-br from-green-950/40 to-emerald-950/40 border-2 border-green-600/50 rounded-xl p-6">
                <h3 class="text-2xl font-bold text-green-300 mb-6">Guadagno Stimato</h3>
                
                <div class="space-y-4">
                  <div class="bg-black/40 rounded-xl p-4">
                    <div class="text-sm text-green-200 mb-1">Revenue Share %</div>
                    <div class="text-4xl font-black text-green-400">
                      {selectedTier() === "free" ? "10%" : 
                       selectedTier() === "basic" ? "15%" :
                       selectedTier() === "pro" ? "25%" : "35%"}
                    </div>
                  </div>

                  <div class="bg-black/40 rounded-xl p-4">
                    <div class="text-sm text-green-200 mb-1">Valore per Voto</div>
                    <div class="text-3xl font-black text-green-400">
                      €{selectedTier() === "free" ? "0.05" : 
                         selectedTier() === "basic" ? "0.08" :
                         selectedTier() === "pro" ? "0.15" : "0.20"}
                    </div>
                  </div>

                  <div class="border-t border-green-700/30 pt-4">
                    <div class="text-sm text-green-200 mb-2">Con 1000 voti/mese:</div>
                    <div class="text-5xl font-black text-green-300 mb-2">
                      €{selectedTier() === "free" ? "50" : 
                         selectedTier() === "basic" ? "80" :
                         selectedTier() === "pro" ? "150" : "200"}
                    </div>
                    <div class="text-xs text-green-400">al mese</div>
                  </div>
                </div>

                <div class="mt-6 p-4 bg-yellow-950/30 border border-yellow-600/50 rounded-lg">
                  <div class="text-xs text-yellow-200">
                    ⚠️ Stime indicative. Il valore effettivo dipende dal revenue totale della piattaforma.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section class="mb-20">
          <h2 class="text-4xl font-black text-center mb-12">Metodi di Pagamento</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "💳",
                name: "PayPal",
                desc: "Pagamenti instant, commissioni basse",
                available: true,
                fee: "2-3%"
              },
              {
                icon: "🏦",
                name: "Bonifico IBAN",
                desc: "Bonifico bancario diretto (EU)",
                available: true,
                fee: "€0"
              },
              {
                icon: "💎",
                name: "Crypto",
                desc: "Bitcoin, Ethereum, USDT",
                available: false,
                badge: "Coming Soon"
              }
            ].map(method => (
              <div class={`
                bg-gradient-to-br from-gray-900/90 to-black/90 
                border ${method.available ? "border-green-600/50" : "border-violet-800/50"} 
                rounded-xl p-6 relative
              `}>
                {method.badge && (
                  <span class="absolute top-4 right-4 px-3 py-1 bg-yellow-600/20 border border-yellow-500/50 rounded-full text-xs text-yellow-300 font-semibold">
                    {method.badge}
                  </span>
                )}
                <div class="text-5xl mb-4">{method.icon}</div>
                <h3 class="text-xl font-bold text-white mb-2">{method.name}</h3>
                <p class="text-violet-300 mb-4">{method.desc}</p>
                {method.available && (
                  <div class="text-sm">
                    <span class="text-violet-400">Commissione: </span>
                    <span class="text-green-400 font-semibold">{method.fee}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section class="mb-20">
          <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-8 border border-violet-900/50">
            <h2 class="text-3xl font-black mb-6 flex items-center gap-3">
              <span>📋</span>
              Requisiti per Partecipare
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h3 class="text-xl font-bold text-fuchsia-400">✅ Necessari</h3>
                <div class="space-y-3">
                  {[
                    "Server verificato su H-YTALE",
                    "VotePlugin installato e configurato",
                    "Minimo 18 anni (o consenso genitore)",
                    "Account PayPal o IBAN valido",
                    "Rispetto delle policy della piattaforma"
                  ].map(req => (
                    <div class="flex items-start gap-2">
                      <span class="text-green-400 mt-1">✓</span>
                      <span class="text-violet-200">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div class="space-y-4">
                <h3 class="text-xl font-bold text-yellow-400">⚠️ Vietati</h3>
                <div class="space-y-3">
                  {[
                    "Voti fraudolenti o bot",
                    "Incentivare voti multipli dallo stesso utente",
                    "Contenuti illegali o inappropriati",
                    "Spam o pubblicità ingannevole",
                    "Violazione dei ToS di Minecraft"
                  ].map(warn => (
                    <div class="flex items-start gap-2">
                      <span class="text-red-400 mt-1">✗</span>
                      <span class="text-violet-200">{warn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div class="mt-8 p-6 bg-red-950/30 border border-red-600/50 rounded-xl">
              <div class="flex items-start gap-3">
                <span class="text-3xl">⚠️</span>
                <div>
                  <h4 class="font-bold text-red-300 mb-2">Sistema Anti-Frode</h4>
                  <p class="text-red-200/80 text-sm">
                    Monitoriamo attivamente tutti i voti per rilevare pattern sospetti. 
                    Server che utilizzano bot o sistemi fraudolenti verranno immediatamente bannati 
                    e perderanno tutti i guadagni accumulati. (Monitorniamo indirizzo dei giocatori e l'attività su server concorrenti, giocatori
                    sospetti vengono esclusi dall'earn)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section class="mb-20">
          <h2 class="text-4xl font-black text-center mb-12">Domande Frequenti</h2>
          
          <div class="space-y-4">
            {[
              {
                q: "Quando ricevo i pagamenti?",
                a: "Dipende dal tuo piano: Free ogni 30 giorni (min €50), Basic bi-settimanale (min €25), Pro settimanale (min €10), Enterprise instant su richiesta."
              },
              {
                q: "Come vengono calcolati i guadagni?",
                a: "Ogni voto ha un valore variabile (€0.05-0.20) basato sul revenue totale della piattaforma. La tua percentuale di revenue share dipende dal piano scelto."
              },
              {
                q: "Posso cambiare piano in qualsiasi momento?",
                a: "Sì! Puoi fare upgrade o downgrade quando vuoi. Le modifiche si applicano dal ciclo di fatturazione successivo."
              },
              {
                q: "Cosa succede se non raggiungo il minimo di payout?",
                a: "Il balance si accumula fino al mese successivo finché non raggiungi il minimo richiesto dal tuo piano."
              },
              {
                q: "I guadagni sono tassabili?",
                a: "Dipende dalla tua giurisdizione. Consigliamo di consultare un commercialista. H-YTALE non trattiene tasse, dovrai gestirle tu."
              },
              {
                q: "Posso avere più server nello stesso account?",
                a: "Sì! Puoi gestire più server e i guadagni vengono sommati in un unico balance."
              }
            ].map(faq => (
              <div class="bg-violet-950/30 border border-violet-800/30 rounded-xl p-6 hover:bg-violet-900/40 transition-colors">
                <h3 class="text-lg font-bold text-white mb-2">{faq.q}</h3>
                <p class="text-violet-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section class="text-center">
          <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12">
            <h2 class="text-4xl font-black text-white mb-4">
              Pronto a Monetizzare il Tuo Server?
            </h2>
            <p class="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Unisciti a centinaia di server che stanno già guadagnando con H-YTALE
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <A
                href="/panel"
                class="px-12 py-5 bg-white hover:bg-gray-100 text-green-600 rounded-xl font-black text-xl transition-all shadow-xl"
              >
                🚀 Configura Ora
              </A>
              <A
                href="/docs"
                class="px-12 py-5 bg-black/30 hover:bg-black/50 text-white border-2 border-white/30 rounded-xl font-bold text-xl transition-all"
              >
                📚 Leggi Docs
              </A>
            </div>
          </div>
        </section>
      </div>

      <Notifications />
    </div>
  );
};

export default Earn;
import { Component, createSignal, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import Notifications, { notify } from "../../component/template/Notification";
import { useAuth } from "../../auth/AuthContext";

const Premium: Component = () => {
  const auth = useAuth();
  
  const [billingCycle, setBillingCycle] = createSignal<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = createSignal<"starter" | "plus" | "ultra">("plus");

  const plans = [
    {
      id: "starter" as const,
      name: "Starter",
      icon: "⭐",
      price: { monthly: 4.99, yearly: 47.88 },
      color: "from-blue-600 to-cyan-600",
      features: [
        "3 voti extra al giorno",
        "Nessuna pubblicità",
        "Badge Premium",
        "Priorità supporto",
        "Stats avanzate personali",
        "Preferiti illimitati"
      ],
      votesPerDay: 4, // 1 base + 3 extra
      popular: false
    },
    {
      id: "plus" as const,
      name: "Plus",
      icon: "💎",
      price: { monthly: 9.99, yearly: 95.88 },
      color: "from-purple-600 to-pink-600",
      features: [
        "6 voti extra al giorno",
        "Tutto di Starter",
        "Badge Plus esclusivo",
        "Notifiche personalizzate",
        "Early access features",
        "Username colorato",
        "Profile personalizzato"
      ],
      votesPerDay: 7, // 1 base + 6 extra
      popular: true
    },
    {
      id: "ultra" as const,
      name: "Ultra",
      icon: "👑",
      price: { monthly: 19.99, yearly: 191.88 },
      color: "from-yellow-600 to-orange-600",
      features: [
        "12 voti extra al giorno",
        "Tutto di Plus",
        "Badge Ultra leggendario",
        "Server spotlight gratis/mese",
        "API access personale",
        "Custom profile themes",
        "Supporto VIP 24/7",
        "Ruolo Discord esclusivo"
      ],
      votesPerDay: 13, // 1 base + 12 extra
      popular: false
    }
  ];

  const savings = (plan: typeof plans[0]) => {
    const monthlyTotal = plan.price.monthly * 12;
    const yearlySavings = monthlyTotal - plan.price.yearly;
    const percentage = Math.round((yearlySavings / monthlyTotal) * 100);
    return { amount: yearlySavings.toFixed(2), percentage };
  };

  const handleSubscribe = (planId: string) => {
    if (!auth.isAuthenticated()) {
      notify("Fai login per sottoscrivere Premium! 🔐", "error");
      return;
    }
    notify(`Reindirizzamento al checkout ${planId}... (demo)`, "info");
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white">
      
      {/* Hero */}
      <div class="relative overflow-hidden bg-black/40 border-b border-violet-900/50">
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
          <div class="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700" />
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div class="inline-block px-6 py-2 bg-yellow-600/20 border border-yellow-500/50 rounded-full text-yellow-300 font-semibold mb-6">
            👑 H-YTALE Premium
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
            Supporta di Più, Vota di Più
          </h1>
          
          <p class="text-xl md:text-2xl text-violet-200 max-w-4xl mx-auto mb-8">
            Ottieni voti extra ogni giorno per supportare i tuoi server preferiti. 
            Più voti = più impatto sulla community!
          </p>

          <div class="flex items-center justify-center gap-4 mb-8">
            <div class="bg-violet-950/60 rounded-xl px-6 py-4 border border-violet-700/50">
              <div class="text-3xl font-black text-yellow-400">13x</div>
              <div class="text-sm text-violet-300">Voti con Ultra</div>
            </div>
            <div class="bg-violet-950/60 rounded-xl px-6 py-4 border border-violet-700/50">
              <div class="text-3xl font-black text-yellow-400">365+</div>
              <div class="text-sm text-violet-300">Voti extra/anno</div>
            </div>
            <div class="bg-violet-950/60 rounded-xl px-6 py-4 border border-violet-700/50">
              <div class="text-3xl font-black text-yellow-400">100%</div>
              <div class="text-sm text-violet-300">No pubblicità</div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Billing Toggle */}
        <div class="flex justify-center mb-12">
          <div class="inline-flex items-center gap-4 bg-violet-950/60 p-2 rounded-2xl border border-violet-700/50">
            <button
              onClick={() => setBillingCycle("monthly")}
              class={`
                px-8 py-3 rounded-xl font-bold transition-all
                ${billingCycle() === "monthly"
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg"
                  : "text-violet-300 hover:text-white"}
              `}
            >
              Mensile
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              class={`
                px-8 py-3 rounded-xl font-bold transition-all relative
                ${billingCycle() === "yearly"
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg"
                  : "text-violet-300 hover:text-white"}
              `}
            >
              Annuale
              <span class="absolute -top-2 -right-2 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <For each={plans}>
            {(plan) => {
              const price = billingCycle() === "monthly" ? plan.price.monthly : plan.price.yearly / 12;
              const save = billingCycle() === "yearly" ? savings(plan) : null;

              return (
                <div class={`
                  relative overflow-hidden rounded-2xl border-2 transition-all duration-300
                  ${plan.popular 
                    ? "border-fuchsia-500 scale-105 shadow-2xl shadow-fuchsia-900/50" 
                    : "border-violet-800/50 hover:border-violet-600/50 hover:scale-105"}
                `}>
                  {plan.popular && (
                    <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-fuchsia-600 to-purple-600 py-2 text-center font-bold text-sm z-10">
                      ⭐ PIÙ POPOLARE
                    </div>
                  )}

                  <div class={`bg-gradient-to-br ${plan.color} p-1 h-full`}>
                    <div class={`bg-gray-900/95 backdrop-blur-sm rounded-xl p-8 h-full flex flex-col ${plan.popular ? 'pt-12' : ''}`}>
                      
                      {/* Icon */}
                      <div class="text-6xl mb-4 text-center">{plan.icon}</div>

                      {/* Header */}
                      <div class="text-center mb-6">
                        <h3 class="text-3xl font-black text-white mb-2">{plan.name}</h3>
                        <div class="flex items-baseline justify-center gap-1 mb-2">
                          <span class="text-5xl font-black text-white">€{price.toFixed(2)}</span>
                          <span class="text-violet-400">/mese</span>
                        </div>
                        {save && (
                          <div class="text-sm text-green-400 font-semibold">
                            Risparmi €{save.amount}/anno ({save.percentage}%)
                          </div>
                        )}
                      </div>

                      {/* Votes Highlight */}
                      <div class="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/50 rounded-xl p-4 mb-6 text-center">
                        <div class="text-4xl font-black text-yellow-400 mb-1">
                          {plan.votesPerDay}
                        </div>
                        <div class="text-sm text-yellow-200">voti al giorno</div>
                        <div class="text-xs text-yellow-400 mt-1">
                          = {plan.votesPerDay * 30} voti/mese
                        </div>
                      </div>

                      {/* Features */}
                      <div class="space-y-3 mb-8 flex-1">
                        <For each={plan.features}>
                          {(feature) => (
                            <div class="flex items-start gap-2">
                              <span class="text-green-400 mt-1 flex-shrink-0">✓</span>
                              <span class="text-sm text-violet-200">{feature}</span>
                            </div>
                          )}
                        </For>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        class={`
                          w-full py-4 rounded-xl font-bold text-lg transition-all
                          ${plan.popular
                            ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white shadow-lg"
                            : "bg-violet-950/60 hover:bg-violet-900/80 text-white border border-violet-700/50"}
                        `}
                      >
                        Inizia Ora
                      </button>
                    </div>
                  </div>
                </div>
              );
            }}
          </For>
        </div>

        {/* How It Works */}
        <section class="mb-20">
          <h2 class="text-4xl font-black text-center mb-12 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            Come Funzionano i Voti Extra
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🆓",
                title: "Utente Free",
                desc: "1 voto al giorno per server",
                votes: "1",
                color: "from-gray-600 to-gray-700"
              },
              {
                icon: "💎",
                title: "Utente Plus",
                desc: "7 voti al giorno per server",
                votes: "7x",
                color: "from-purple-600 to-pink-600"
              },
              {
                icon: "👑",
                title: "Utente Ultra",
                desc: "13 voti al giorno per server",
                votes: "13x",
                color: "from-yellow-600 to-orange-600"
              }
            ].map(tier => (
              <div class={`relative overflow-hidden bg-gradient-to-br ${tier.color} p-1 rounded-2xl`}>
                <div class="bg-gray-900/95 backdrop-blur-sm rounded-xl p-8 text-center h-full">
                  <div class="text-6xl mb-4">{tier.icon}</div>
                  <h3 class="text-2xl font-bold text-white mb-2">{tier.title}</h3>
                  <p class="text-violet-200 mb-4">{tier.desc}</p>
                  <div class="text-5xl font-black text-yellow-400">{tier.votes}</div>
                </div>
              </div>
            ))}
          </div>

          <div class="mt-12 bg-gradient-to-br from-blue-950/40 to-cyan-950/40 border-2 border-blue-600/50 rounded-2xl p-8">
            <div class="flex items-start gap-4">
              <span class="text-5xl">💡</span>
              <div>
                <h3 class="text-2xl font-bold text-blue-300 mb-3">Come Distribuire i Voti</h3>
                <p class="text-blue-100 text-lg mb-4">
                  Con Premium puoi distribuire i tuoi voti come preferisci! Esempi:
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-black/40 rounded-xl p-4">
                    <div class="font-bold text-white mb-2">💎 Strategia Focus</div>
                    <div class="text-sm text-blue-200">Tutti i 7 voti su 1 server preferito</div>
                  </div>
                  <div class="bg-black/40 rounded-xl p-4">
                    <div class="font-bold text-white mb-2">🎯 Strategia Bilanciata</div>
                    <div class="text-sm text-blue-200">3-4 voti distribuiti su 2-3 server</div>
                  </div>
                  <div class="bg-black/40 rounded-xl p-4">
                    <div class="font-bold text-white mb-2">🌟 Strategia Diversity</div>
                    <div class="text-sm text-blue-200">1 voto ciascuno su 7 server diversi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Comparison */}
        <section class="mb-20">
          <h2 class="text-4xl font-black text-center mb-12">Confronto Completo</h2>
          
          <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl overflow-hidden border border-violet-900/50">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-violet-950/50 border-b border-violet-800/50">
                    <th class="text-left p-4 font-bold text-violet-300">Feature</th>
                    <th class="text-center p-4 font-bold text-gray-400">Free</th>
                    <th class="text-center p-4 font-bold text-blue-400">Starter</th>
                    <th class="text-center p-4 font-bold text-purple-400">Plus</th>
                    <th class="text-center p-4 font-bold text-yellow-400">Ultra</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-violet-900/30">
                  {[
                    { feature: "Voti al giorno", free: "1", starter: "4", plus: "7", ultra: "13" },
                    { feature: "Pubblicità", free: "Sì", starter: "No", plus: "No", ultra: "No" },
                    { feature: "Badge profilo", free: "Base", starter: "Premium", plus: "Plus", ultra: "Ultra" },
                    { feature: "Preferiti server", free: "10", starter: "∞", plus: "∞", ultra: "∞" },
                    { feature: "Stats personali", free: "Base", starter: "Avanzate", plus: "Complete", ultra: "Complete" },
                    { feature: "Notifiche", free: "Base", starter: "Base", plus: "Custom", ultra: "Custom" },
                    { feature: "Username colorato", free: "✗", starter: "✗", plus: "✓", ultra: "✓" },
                    { feature: "Profile themes", free: "✗", starter: "✗", plus: "✗", ultra: "✓" },
                    { feature: "Supporto", free: "Community", starter: "Priority", plus: "Priority", ultra: "VIP 24/7" },
                    { feature: "API access", free: "✗", starter: "✗", plus: "✗", ultra: "✓" },
                    { feature: "Server spotlight", free: "✗", starter: "✗", plus: "✗", ultra: "1/mese" }
                  ].map(row => (
                    <tr class="hover:bg-violet-950/20 transition-colors">
                      <td class="p-4 font-medium text-white">{row.feature}</td>
                      <td class="p-4 text-center text-gray-400">{row.free}</td>
                      <td class="p-4 text-center text-blue-300">{row.starter}</td>
                      <td class="p-4 text-center text-purple-300">{row.plus}</td>
                      <td class="p-4 text-center text-yellow-300">{row.ultra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Impact Calculator */}
        <section class="mb-20">
          <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-8 border border-violet-900/50">
            <h2 class="text-4xl font-black mb-8 text-center bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              📊 Calcola il Tuo Impatto
            </h2>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <For each={plans}>
                {(plan) => (
                  <div class={`bg-gradient-to-br ${plan.color} p-1 rounded-xl`}>
                    <div class="bg-gray-900/95 rounded-xl p-6">
                      <div class="text-center mb-6">
                        <div class="text-4xl mb-2">{plan.icon}</div>
                        <h3 class="text-xl font-bold text-white">{plan.name}</h3>
                      </div>

                      <div class="space-y-4">
                        <div class="bg-black/40 rounded-lg p-4 text-center">
                          <div class="text-sm text-violet-300 mb-1">Voti al giorno</div>
                          <div class="text-3xl font-black text-yellow-400">{plan.votesPerDay}</div>
                        </div>

                        <div class="bg-black/40 rounded-lg p-4 text-center">
                          <div class="text-sm text-violet-300 mb-1">Voti al mese</div>
                          <div class="text-2xl font-black text-green-400">{plan.votesPerDay * 30}</div>
                        </div>

                        <div class="bg-black/40 rounded-lg p-4 text-center">
                          <div class="text-sm text-violet-300 mb-1">Voti all'anno</div>
                          <div class="text-2xl font-black text-purple-400">{plan.votesPerDay * 365}</div>
                        </div>

                        <div class="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/50 rounded-lg p-4 text-center">
                          <div class="text-xs text-green-300 mb-1">Impatto server*</div>
                          <div class="text-lg font-bold text-green-400">
                            ~€{((plan.votesPerDay * 30) * 0.15).toFixed(2)}/mese
                          </div>
                          <div class="text-xs text-green-400 mt-1">* con revenue share medio</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>

            <div class="mt-8 text-center text-sm text-violet-400">
              💡 Più voti dai, più aiuti i tuoi server preferiti a guadagnare e crescere!
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section class="mb-20">
          <h2 class="text-4xl font-black text-center mb-12">Domande Frequenti</h2>
          
          <div class="space-y-4">
            {[
              {
                q: "Posso cancellare in qualsiasi momento?",
                a: "Sì! Puoi cancellare quando vuoi. Manterrai l'accesso Premium fino alla fine del periodo già pagato."
              },
              {
                q: "I voti extra scadono se non li uso?",
                a: "I voti devono essere usati entro la giornata. Ogni giorno ricevi il tuo set completo di voti freschi."
              },
              {
                q: "Posso votare lo stesso server più volte al giorno?",
                a: "Sì! Con Premium puoi usare tutti i tuoi voti su un singolo server o distribuirli come preferisci."
              },
              {
                q: "Cosa succede se faccio downgrade?",
                a: "Tornerai al limite di voti del piano inferiore dalla prossima fatturazione. I benefit extra rimangono fino ad allora."
              },
              {
                q: "Posso regalare Premium a un amico?",
                a: "Al momento no, ma stiamo lavorando sui gift codes! Resta aggiornato sul Discord."
              },
              {
                q: "Come funziona il trial gratuito?",
                a: "7 giorni gratis sul primo abbonamento. Puoi cancellare prima della fine senza costi."
              }
            ].map(faq => (
              <div class="bg-violet-950/30 border border-violet-800/30 rounded-xl p-6 hover:bg-violet-900/40 transition-colors">
                <h3 class="text-lg font-bold text-white mb-2">{faq.q}</h3>
                <p class="text-violet-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section class="text-center">
          <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12">
            <h2 class="text-4xl font-black text-white mb-4">
              Potenzia il Tuo Supporto Oggi
            </h2>
            <p class="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Oltre 1.200 player Premium stanno già supportando i loro server preferiti ogni giorno
            </p>
            
            <Show
              when={auth.isAuthenticated()}
              fallback={
                <button
                  onClick={() => auth.login()}
                  class="px-12 py-5 bg-white hover:bg-gray-100 text-purple-600 rounded-xl font-black text-xl transition-all shadow-xl"
                >
                  Accedi per Iniziare
                </button>
              }
            >
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleSubscribe("plus")}
                  class="px-12 py-5 bg-white hover:bg-gray-100 text-purple-600 rounded-xl font-black text-xl transition-all shadow-xl"
                >
                  Prova 7 Giorni Gratis
                </button>
                <A
                  href="#"
                  class="px-12 py-5 bg-black/30 hover:bg-black/50 text-white border-2 border-white/30 rounded-xl font-bold text-xl transition-all"
                >
                  Confronta Piani
                </A>
              </div>
            </Show>

            <p class="text-sm text-purple-200 mt-6">
              💳 Accettiamo tutte le carte di credito e PayPal • 🔒 Pagamenti sicuri con Stripe
            </p>
          </div>
        </section>
      </div>

      <Notifications />
    </div>
  );
};

export default Premium;
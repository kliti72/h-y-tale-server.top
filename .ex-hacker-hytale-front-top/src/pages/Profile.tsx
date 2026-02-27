import { Component, createSignal, createMemo, Show } from "solid-js";
import { A } from "@solidjs/router";
import Notifications, { notify } from "../component/template/Notification";

const ProfileEarnings: Component = () => {
  // Dati fittizi - in produzione verranno da API / auth context
    // --- Nuovi segnali per il modal ---
  const [showPaymentModal, setShowPaymentModal] = createSignal(false);
  const [paymentMethod, setPaymentMethod] = createSignal<"paypal" | "iban">("paypal");
  const [paypalEmailInput, setPaypalEmailInput] = createSignal("");
  const [ibanInput, setIbanInput] = createSignal(""); // da implementare lato server se serve
  const [errorMessage, setErrorMessage] = createSignal("");

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSavePayment = () => {
    setErrorMessage("");

    if (paymentMethod() === "paypal") {
      if (!paypalEmailInput().trim()) {
        setErrorMessage("Inserisci un indirizzo email PayPal");
        return;
      }
      if (!isValidEmail(paypalEmailInput())) {
        setErrorMessage("Email non valida");
        return;
      }

      // Qui andrebbe la chiamata API reale
      // es: await api.updatePaymentMethod({ type: "paypal", email: paypalEmailInput() })
      
      // Simulazione successo
      earningsData().paypalEmail = paypalEmailInput(); // aggiorna localmente (in prod usa setState globale o refetch)
      notify("Metodo di pagamento aggiornato con successo! ✅", "success");
      setShowPaymentModal(false);
    } else {
      if (!ibanInput().trim()) {
        setErrorMessage("Inserisci il tuo IBAN");
        return;
      }
      // Validazione IBAN base (puoi usare libreria iban.js in produzione)
      notify("IBAN salvato (funzionalità in fase di test)", "info");
      setShowPaymentModal(false);
    }
  };

  const [earningsData] = createSignal({
    username: "HypixelKiller42",
    serverName: "SkyBlock Legends",
    tier: "pro" as "free" | "basic" | "pro" | "enterprise",
    totalVotesLifetime: 28470,
    votesThisMonth: 1243,
    votesLastMonth: 1589,
    revenueThisMonth: 186.45,
    revenueLastMonth: 238.35,
    pendingBalance: 47.80,
    lastPayout: "12 Febbraio 2026",
    nextPayoutEstimate: "23 Febbraio 2026",
    paypalEmail: "hypixelkiller42@gmail.com",
    totalPayoutsLifetime: 1245.60,
  });

  const tierInfo = createMemo(() => {
    const tier = earningsData().tier;
    return {
      name: tier === "free" ? "Free" :
            tier === "basic" ? "Basic" :
            tier === "pro" ? "Pro" : "Enterprise",
      revenueShare: tier === "free" ? 10 :
                    tier === "basic" ? 15 :
                    tier === "pro" ? 25 : 35,
      color: tier === "free" ? "from-gray-600 to-gray-700" :
             tier === "basic" ? "from-blue-600 to-cyan-600" :
             tier === "pro" ? "from-purple-600 to-pink-600" :
                              "from-yellow-600 to-orange-600",
      valuePerVote: tier === "free" ? 0.05 :
                    tier === "basic" ? 0.08 :
                    tier === "pro" ? 0.15 : 0.20,
    };
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    notify("Copiato negli appunti! 📋", "success");
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white pb-20">
      <div class="relative overflow-hidden border-b border-violet-900/40 bg-black/50">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl -top-40 -left-40 animate-pulse" />
          <div class="absolute w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-1000" />
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div class="inline-flex items-center gap-3 px-6 py-2 bg-purple-950/60 border border-purple-600/50 rounded-full text-purple-300 font-semibold mb-6">
            <span class="text-xl">🏆</span> Il Mio Profilo Guadagni
          </div>

          <h1 class="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent">
            {earningsData().username}
          </h1>

          <p class="text-xl text-violet-300 mb-8">
            {earningsData().serverName} • Piano {tierInfo().name}
          </p>

          <div class="flex flex-wrap justify-center gap-4">
            <div class="px-8 py-4 bg-gradient-to-r from-purple-800/40 to-fuchsia-800/40 rounded-xl border border-purple-600/40">
              <div class="text-sm text-violet-300">Voti totali</div>
              <div class="text-4xl font-black text-white">{earningsData().totalVotesLifetime.toLocaleString()}</div>
            </div>
            <div class="px-8 py-4 bg-gradient-to-r from-green-800/40 to-emerald-800/40 rounded-xl border border-green-600/40">
              <div class="text-sm text-violet-300">Guadagni totali</div>
              <div class="text-4xl font-black text-green-400">€{earningsData().totalPayoutsLifetime.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Cards */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "Voti questo mese",
              value: earningsData().votesThisMonth,
              color: "from-cyan-600 to-blue-600",
              icon: "📈"
            },
            {
              title: "Guadagno questo mese",
              value: `€${earningsData().revenueThisMonth.toFixed(2)}`,
              color: "from-green-600 to-emerald-600",
              icon: "💸"
            },
            {
              title: "Saldo in attesa",
              value: `€${earningsData().pendingBalance.toFixed(2)}`,
              color: "from-yellow-600 to-amber-600",
              icon: "⏳"
            }
          ].map(card => (
            <div class={`bg-gradient-to-br ${card.color} p-px rounded-2xl shadow-xl shadow-black/40`}>
              <div class="bg-gray-950/90 backdrop-blur rounded-2xl p-8 h-full text-center">
                <div class="text-5xl mb-4">{card.icon}</div>
                <div class="text-xl text-violet-200 mb-2">{card.title}</div>
                <div class="text-4xl md:text-5xl font-black">{card.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Share & Tier Info */}
        <div class="bg-gradient-to-br from-gray-900 to-black border border-violet-800/50 rounded-2xl p-8 mb-12">
          <div class="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 class="text-3xl font-black mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Piano Attivo: {tierInfo().name}
              </h2>
              <div class="space-y-3 text-lg">
                <div class="flex items-center gap-3">
                  <span class="text-green-400 text-2xl">✓</span>
                  <span><strong>{tierInfo().revenueShare}% revenue share</strong> sui voti</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-green-400 text-2xl">✓</span>
                  <span>Valore medio stimato: <strong>€{tierInfo().valuePerVote.toFixed(2)}</strong> / voto</span>
                </div>
              </div>
            </div>

            <A
              href="/earn"
              class={`px-10 py-5 bg-gradient-to-r ${tierInfo().color} rounded-xl font-bold text-xl shadow-lg hover:scale-105 transition-transform`}
            >
              Cambia Piano →
            </A>
          </div>
        </div>

        {/* Payout Info */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div class="bg-gradient-to-br from-gray-900 to-black border border-green-900/50 rounded-2xl p-8">
            <h3 class="text-2xl font-bold text-green-400 mb-6">Prossimo Pagamento</h3>
            <div class="space-y-4 text-lg">
              <div>
                <span class="text-violet-300">Ultimo payout:</span>
                <span class="font-semibold text-white ml-2">{earningsData().lastPayout}</span>
              </div>
              <div>
                <span class="text-violet-300">Prossimo stima:</span>
                <span class="font-semibold text-green-300 ml-2">{earningsData().nextPayoutEstimate}</span>
              </div>
              <div>
                <span class="text-violet-300">Metodo:</span>
                <span class="font-semibold text-white ml-2">PayPal • {earningsData().paypalEmail}</span>
                <button
                  onClick={() => copyToClipboard(earningsData().paypalEmail)}
                  class="ml-3 text-sm text-violet-400 hover:text-violet-300"
                >
                  copia
                </button>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-gray-900 to-black border border-purple-900/50 rounded-2xl p-8">
            <h3 class="text-2xl font-bold text-purple-400 mb-6">Statistiche Voti</h3>
            <div class="grid grid-cols-2 gap-6 text-center">
              <div>
                <div class="text-4xl font-black text-white mb-1">{earningsData().votesThisMonth}</div>
                <div class="text-sm text-violet-300">questo mese</div>
              </div>
              <div>
                <div class="text-4xl font-black text-white mb-1">{earningsData().votesLastMonth}</div>
                <div class="text-sm text-violet-300">mese scorso</div>
              </div>
              <div class="col-span-2 pt-4 border-t border-purple-900/40">
                <div class="text-5xl font-black text-purple-300">
                  {earningsData().totalVotesLifetime.toLocaleString()}
                </div>
                <div class="text-lg text-violet-400">voti totali di sempre</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div class="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => notify("Funzionalità in arrivo!", "info")}
            class="px-12 py-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl font-bold text-xl shadow-2xl shadow-green-900/50 hover:brightness-110 transition"
          >
            Richiedi Payout Anticipato
          </button>

          <A
            href="/earn#calculator"
            class="px-12 py-6 bg-violet-950/70 border-2 border-violet-700 rounded-2xl font-bold text-xl hover:bg-violet-900/70 transition text-center"
          >
            Ricalcola Guadagni Potenziali
          </A>
        </div>
      </div>

              {/* Payment Method Management */}
        <div class="bg-gradient-to-br from-gray-900 to-black border border-violet-900/50 rounded-2xl p-8 mb-12">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 class="text-2xl font-bold text-violet-300 mb-2">Metodo di Pagamento Attivo</h3>
              <div class="flex items-center gap-3">
                <span class="text-3xl">{paymentMethod() === "paypal" ? "💳" : "🏦"}</span>
                <div>
                  <div class="font-semibold text-white">
                    {paymentMethod() === "paypal" 
                      ? `PayPal • ${earningsData().paypalEmail}` 
                      : "Bonifico IBAN"}
                  </div>
                  <div class="text-sm text-violet-400">
                    {paymentMethod() === "paypal" 
                      ? "Pagamenti rapidi, commissioni 2-3%" 
                      : "Nessuna commissione, 2-5 giorni lavorativi"}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              class="px-8 py-4 bg-gradient-to-r from-violet-700 to-fuchsia-700 hover:from-violet-600 hover:to-fuchsia-600 rounded-xl font-bold text-lg shadow-lg transition-all hover:scale-105"
            >
              Aggiorna Metodo di Pagamento
            </button>
          </div>
        </div>

              {/* Modal per aggiornamento pagamento */}
      <Show when={showPaymentModal()}>
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-gradient-to-br from-gray-950 to-indigo-950 border border-violet-700/60 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div class="p-8">
              <h3 class="text-3xl font-black text-center mb-8 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Aggiorna Metodo di Pagamento
              </h3>

              <div class="flex gap-4 mb-8 justify-center">
                <button
                  onClick={() => setPaymentMethod("paypal")}
                  class={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    paymentMethod() === "paypal"
                      ? "bg-violet-700 text-white shadow-lg shadow-violet-900/50"
                      : "bg-gray-800/60 text-violet-300 hover:bg-gray-700/60"
                  }`}
                >
                  PayPal
                </button>
                <button
                  onClick={() => setPaymentMethod("iban")}
                  class={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    paymentMethod() === "iban"
                      ? "bg-violet-700 text-white shadow-lg shadow-violet-900/50"
                      : "bg-gray-800/60 text-violet-300 hover:bg-gray-700/60"
                  }`}
                >
                  Bonifico IBAN
                </button>
              </div>

              <Show when={paymentMethod() === "paypal"}>
                <div class="mb-6">
                  <label class="block text-violet-300 font-semibold mb-2">
                    Indirizzo Email PayPal
                  </label>
                  <input
                    type="email"
                    value={paypalEmailInput()}
                    onInput={(e) => setPaypalEmailInput(e.currentTarget.value)}
                    placeholder="esempio@paypal.com"
                    class="w-full px-5 py-4 bg-black/60 border-2 border-violet-700/50 rounded-xl text-white focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
              </Show>

              <Show when={paymentMethod() === "iban"}>
                <div class="mb-6">
                  <label class="block text-violet-300 font-semibold mb-2">
                    IBAN (con prefisso paese)
                  </label>
                  <input
                    type="text"
                    value={ibanInput()}
                    onInput={(e) => setIbanInput(e.currentTarget.value.toUpperCase())}
                    placeholder="IT60X0542811101000000123456"
                    class="w-full px-5 py-4 bg-black/60 border-2 border-violet-700/50 rounded-xl text-white focus:outline-none focus:border-fuchsia-500 font-mono"
                  />
                  <p class="text-xs text-violet-400 mt-2">
                    Verrà verificato automaticamente prima del primo pagamento
                  </p>
                </div>
              </Show>

              <Show when={errorMessage()}>
                <div class="mb-6 p-4 bg-red-950/40 border border-red-600/50 rounded-xl text-red-300 text-center">
                  {errorMessage()}
                </div>
              </Show>

              <div class="flex gap-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  class="flex-1 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSavePayment}
                  class="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold shadow-lg shadow-green-900/40 transition"
                >
                  Salva Modifiche
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <Notifications />
    </div>
  );
};

export default ProfileEarnings;
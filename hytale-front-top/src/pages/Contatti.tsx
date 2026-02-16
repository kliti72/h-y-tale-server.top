import { Component, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import Notifications, { notify } from "../component/template/Notification"; // assumo esista

const Contatti: Component = () => {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [subject, setSubject] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    
    if (!name().trim() || !email().trim() || !message().trim()) {
      notify("Compila tutti i campi obbligatori!", "error");
      return;
    }

    setLoading(true);
    
    // Simulazione invio (sostituisci con fetch reale al tuo endpoint)
    setTimeout(() => {
      notify("Messaggio inviato con successo! Ti risponderemo presto 🚀", "success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setLoading(false);
    }, 1200);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white">
      <Notifications />

      {/* Hero semplice */}
      <div class="relative bg-black/80 border-b border-violet-900/50 py-16 md:py-24 text-center">
        <div class="max-w-4xl mx-auto px-6">
          <h1 class="text-5xl md:text-6xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent mb-6">
            CONTATTI
          </h1>
          <p class="text-xl md:text-2xl text-violet-200 max-w-2xl mx-auto">
            Hai domande, suggerimenti o vuoi collaborare con H-Ytale? Scrivici!
          </p>
        </div>
      </div>

      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div class="grid md:grid-cols-2 gap-12 lg:gap-16">

          {/* Info di contatto + social */}
          <div class="space-y-10">
            <div>
              <h2 class="text-3xl font-bold text-fuchsia-400 mb-6">Parliamo!</h2>
              <p class="text-violet-200 leading-relaxed mb-8">
                Siamo una community italiana dedicata a Hytale. Puoi contattarci per bug sul sito, idee per guide, partnership server, o semplicemente per chiacchierare del meta PvP 2026 🔥
              </p>
            </div>

            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <span class="text-4xl flex-shrink-0">📧</span>
                <div>
                  <h3 class="text-xl font-semibold text-violet-300">Email</h3>
                  <a 
                    href="mailto:info@h-ytale.it" 
                    class="text-fuchsia-400 hover:text-fuchsia-300 transition-colors text-lg"
                  >
                    info@h-ytale.it
                  </a>
                  <p class="text-sm text-violet-400 mt-1">Risposta entro 24-48h</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <span class="text-4xl flex-shrink-0">💬</span>
                <div>
                  <h3 class="text-xl font-semibold text-violet-300">Discord</h3>
                  <p class="text-violet-200">
                    Unisciti al nostro server ufficiale per parlare live con staff e community!
                  </p>
                  <a
                    href="https://discord.gg/xxxxxxxx" // ← metti il tuo link
                    target="_blank"
                    class="inline-block mt-2 px-6 py-3 bg-indigo-600/40 hover:bg-indigo-600/70 border border-indigo-500/50 rounded-xl font-medium transition-all"
                  >
                    Entra nel Discord →
                  </a>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <span class="text-4xl flex-shrink-0">🌐</span>
                <div>
                  <h3 class="text-xl font-semibold text-violet-300">Altre vie</h3>
                  <div class="flex flex-wrap gap-4 mt-3">
                    <A href="/forum" class="text-violet-300 hover:text-fuchsia-400 transition-colors">
                      Forum (per discussioni pubbliche)
                    </A>
                    <A href="/guide" class="text-violet-300 hover:text-fuchsia-400 transition-colors">
                      Guide (suggerimenti contenuti)
                    </A>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form di contatto */}
          <div class="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-8 md:p-10 border border-violet-800/50 backdrop-blur-md shadow-xl">
            <h2 class="text-3xl font-bold text-fuchsia-400 mb-8">Invia un messaggio</h2>

            <form onSubmit={handleSubmit} class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-violet-300 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                  class="w-full px-5 py-4 bg-black/50 border border-violet-700/50 rounded-xl text-white placeholder-violet-500 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 transition-all"
                  placeholder="Il tuo nome"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-violet-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  class="w-full px-5 py-4 bg-black/50 border border-violet-700/50 rounded-xl text-white placeholder-violet-500 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 transition-all"
                  placeholder="tua@email.com"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-violet-300 mb-2">
                  Oggetto
                </label>
                <input
                  type="text"
                  value={subject()}
                  onInput={(e) => setSubject(e.currentTarget.value)}
                  class="w-full px-5 py-4 bg-black/50 border border-violet-700/50 rounded-xl text-white placeholder-violet-500 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 transition-all"
                  placeholder="Es: Collaborazione server / Bug sito"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-violet-300 mb-2">
                  Messaggio *
                </label>
                <textarea
                  value={message()}
                  onInput={(e) => setMessage(e.currentTarget.value)}
                  rows={6}
                  class="w-full px-5 py-4 bg-black/50 border border-violet-700/50 rounded-xl text-white placeholder-violet-500 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 transition-all resize-none"
                  placeholder="Scrivi qui il tuo messaggio..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading()}
                class={`
                  w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300
                  ${loading() 
                    ? "bg-violet-800 cursor-not-allowed" 
                    : "bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 shadow-lg shadow-fuchsia-900/50 active:scale-98"}
                `}
              >
                {loading() ? "Invio in corso..." : "Invia Messaggio →"}
              </button>

              <p class="text-xs text-violet-400 text-center mt-4">
                Ti risponderemo il prima possibile. Non condividiamo i tuoi dati ❤️
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contatti;
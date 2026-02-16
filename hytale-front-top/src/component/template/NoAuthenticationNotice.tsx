// src/components/NotAuthenticatedNotice.tsx
import { Component, Show } from "solid-js";
import { useAuth } from "../../auth/AuthContext";
import { A } from "@solidjs/router";

const NotAuthenticatedNotice: Component = () => {
  const auth = useAuth();

  return (
    <div class="p-4">
    <Show when={!auth.isAuthenticated()}>        
      <div class="relative overflow-hidden bg-gradient-to-br from-gray-900/95 to-black/95 border-2 border-violet-700/50 rounded-3xl p-8 md:p-12
       mx-auto max-w-4xl backdrop-blur-md shadow-2xl shadow-violet-900/50">
        
        {/* Particelle decorative */}
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
          <div class="absolute w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700" />
        </div>

        <div class="relative z-10">
          {/* Icon & Title */}
          <div class="text-center mb-8">
            <div class="inline-block p-4 bg-violet-600/20 rounded-2xl mb-4">
              <span class="text-6xl">🔐</span>
            </div>
            <h3 class="text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              Accedi per Sbloccare Tutto
            </h3>
            <p class="text-lg text-violet-200 max-w-2xl mx-auto">
              Collega il tuo account Discord per accedere a tutte le funzionalità premium 
              e far parte della community più fire! 🔥
            </p>
          </div>

          {/* Login Button */}
          <div class="flex justify-center mb-10">
            <button
              onClick={() => auth.login()}
              class="
                group relative overflow-hidden
                px-12 py-5 rounded-2xl font-black text-xl
                bg-gradient-to-r from-[#5865F2] to-[#7289DA]
                hover:from-[#4752C4] hover:to-[#5865F2]
                text-white shadow-2xl shadow-blue-900/50
                transition-all duration-300
                hover:scale-105 active:scale-95
                border-2 border-blue-400/30 hover:border-blue-300/50
              "
            >
              <span class="relative z-10 flex items-center gap-3">
                <svg class="w-8 h-8" viewBox="0 0 71 55" fill="none">
                  <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/>
                </svg>
                Accedi con Discord
              </span>
              
              {/* Glow effect */}
              <div class="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-200/20 to-blue-400/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            </button>
          </div>

          {/* Features Grid */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { 
                icon: "🔥", 
                title: "Vota i Server", 
                desc: "Supporta i tuoi server preferiti e sali in classifica",
                color: "from-orange-600/20 to-red-600/20",
                border: "border-orange-500/30"
              },
              { 
                icon: "⭐", 
                title: "Aggiungi ai Preferiti", 
                desc: "Salva i server e ricevi notifiche sugli aggiornamenti",
                color: "from-yellow-600/20 to-amber-600/20",
                border: "border-yellow-500/30"
              },
              { 
                icon: "📊", 
                title: "Statistiche Personali", 
                desc: "Traccia i tuoi voti, streak e posizione in classifica",
                color: "from-blue-600/20 to-cyan-600/20",
                border: "border-blue-500/30"
              },
              { 
                icon: "🏆", 
                title: "Badge & Riconoscimenti", 
                desc: "Sblocca achievement e mostra il tuo supporto",
                color: "from-purple-600/20 to-pink-600/20",
                border: "border-purple-500/30"
              },
              { 
                icon: "💬", 
                title: "Partecipa al Forum", 
                desc: "Crea topic, commenta e interagisci con la community",
                color: "from-green-600/20 to-emerald-600/20",
                border: "border-green-500/30"
              },
              { 
                icon: "🎮", 
                title: "Gestisci i Tuoi Server", 
                desc: "Aggiungi e configura i tuoi server Minecraft",
                color: "from-indigo-600/20 to-violet-600/20",
                border: "border-indigo-500/30"
              }
            ].map(feature => (
              <div class={`
                group relative overflow-hidden
                bg-gradient-to-br ${feature.color}
                border ${feature.border}
                rounded-xl p-5
                hover:scale-105 transition-all duration-300
                hover:shadow-lg hover:shadow-violet-900/30
              `}>
                <div class="relative z-10">
                  <div class="flex items-start gap-4">
                    <span class="text-4xl group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </span>
                    <div class="flex-1">
                      <h4 class="font-bold text-white text-lg mb-1">
                        {feature.title}
                      </h4>
                      <p class="text-sm text-violet-300">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Hover glow */}
                <div class="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-fuchsia-600/10 to-violet-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          {/* Security Notice */}
          <div class="bg-violet-950/30 border border-violet-700/30 rounded-xl p-5 text-center">
            <div class="flex items-center justify-center gap-3 mb-3">
              <span class="text-2xl">🔒</span>
              <h4 class="font-bold text-violet-300 text-lg">Sicuro e Veloce</h4>
            </div>
            <p class="text-sm text-violet-400 max-w-2xl mx-auto">
              Usiamo solo le informazioni base del tuo profilo Discord (nome utente, avatar e ID). 
              Non accediamo mai ai tuoi messaggi o server privati. La tua privacy è la nostra priorità.
            </p>
          </div>

          {/* Additional Info */}
          <div class="mt-8 pt-8 border-t border-violet-800/30">
            <div class="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-violet-400">
              <div class="flex items-center gap-2">
                <span>✓</span>
                <span>Nessun dato sensibile richiesto</span>
              </div>
              <div class="hidden md:block w-1 h-1 bg-violet-600 rounded-full" />
              <div class="flex items-center gap-2">
                <span>✓</span>
                <span>Login in meno di 5 secondi</span>
              </div>
              <div class="hidden md:block w-1 h-1 bg-violet-600 rounded-full" />
              <div class="flex items-center gap-2">
                <span>✓</span>
                <span>Oltre 4.000 utenti registrati</span>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div class="mt-8 text-center">
            <p class="text-violet-300 mb-4">
              Oppure scopri di più su H-YTALE
            </p>
            <div class="flex flex-wrap justify-center gap-3">
              <A
                href="/about"
                class="px-6 py-2.5 bg-violet-950/60 hover:bg-violet-900/80 border border-violet-700/50 rounded-xl font-semibold transition-all text-violet-200 hover:text-white"
              >
                📖 Chi Siamo
              </A>
              <A
                href="/docs"
                class="px-6 py-2.5 bg-violet-950/60 hover:bg-violet-900/80 border border-violet-700/50 rounded-xl font-semibold transition-all text-violet-200 hover:text-white"
              >
                📚 Documentazione
              </A>
              <a
                href="https://discord.gg/hytale"
                target="_blank"
                class="px-6 py-2.5 bg-violet-950/60 hover:bg-violet-900/80 border border-violet-700/50 rounded-xl font-semibold transition-all text-violet-200 hover:text-white"
              >
                💬 Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </Show>
    </div>
  );
};

export default NotAuthenticatedNotice;
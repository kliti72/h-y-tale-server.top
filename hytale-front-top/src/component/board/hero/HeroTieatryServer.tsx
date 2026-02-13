// src/components/HeroSection.tsx  (o chiamalo SecondaryHero, BottomHero, etc.)
import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";

const HeroTieatryServer: Component = () => {
  const navigate = useNavigate();

  return (
    <section class="relative w-full py-16 px-6 bg-black/80 overflow-hidden">
      {/* Sfondo glass + gradient */}
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-black to-cyan-950/10 pointer-events-none" />
      <div class="absolute inset-0 backdrop-blur-[2px] opacity-40" />

      <div class="relative z-10 max-w-6xl mx-auto text-center">
        {/* Titolo secondario */}
        <h2 class="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
          Entra nel Mondo Hytale
          <span class="block text-emerald-400 mt-2">Scegli il tuo server</span>
        </h2>

        {/* Descrizione breve + tech vibe */}
        <p class="text-lg sm:text-xl text-zinc-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Centinaia di server attivi, comunità italiane e internazionali, modpack custom, survival estremo e roleplay epico.  
          Copia l'IP, entra in gioco e vota i tuoi preferiti.
        </p>

        {/* Stats rapide (glass cards) */}
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12 max-w-4xl mx-auto">
          <div class="backdrop-blur-md bg-black/30 border border-emerald-800/40 rounded-xl p-5 shadow-lg shadow-emerald-950/20">
            <div class="text-3xl sm:text-4xl font-bold text-emerald-400">+120</div>
            <div class="text-sm text-zinc-400 mt-1">Server attivi</div>
          </div>

          <div class="backdrop-blur-md bg-black/30 border border-emerald-800/40 rounded-xl p-5 shadow-lg shadow-emerald-950/20">
            <div class="text-3xl sm:text-4xl font-bold text-emerald-400">8.4k</div>
            <div class="text-sm text-zinc-400 mt-1">Giocatori oggi</div>
          </div>

          <div class="backdrop-blur-md bg-black/30 border border-emerald-800/40 rounded-xl p-5 shadow-lg shadow-emerald-950/20">
            <div class="text-3xl sm:text-4xl font-bold text-emerald-400">47k</div>
            <div class="text-sm text-zinc-400 mt-1">Voti totali</div>
          </div>

          <div class="backdrop-blur-md bg-black/30 border border-emerald-800/40 rounded-xl p-5 shadow-lg shadow-emerald-950/20">
            <div class="text-3xl sm:text-4xl font-bold text-emerald-400">24/7</div>
            <div class="text-sm text-zinc-400 mt-1">Uptime medio</div>
          </div>
        </div>

        {/* Call to action principali */}
        <div class="flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-8">


          <button
            onClick={() => navigate("/add-server")} // o dove hai il form per aggiungere server
            class={`
              flex items-center justify-center gap-3 px-8 py-5 rounded-xl text-lg font-semibold
              bg-black/40 hover:bg-emerald-950/60 text-emerald-300
              border border-emerald-800/50 hover:border-emerald-600/70
              transition-all duration-300 active:scale-95
            `}
          >
            <span class="text-xl">➕</span>
            Aggiungi il tuo server
          </button>
        </div>

        {/* Piccola nota tech/hacker sotto */}
        <p class="mt-10 text-sm text-zinc-500">
          IP rapidi da copiare • Voti in tempo reale • Community verificata
        </p>
      </div>
    </section>
  );
};

export default HeroTieatryServer;
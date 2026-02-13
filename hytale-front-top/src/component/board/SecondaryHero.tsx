import { Component } from "solid-js";

const SecondaryHero: Component = () => {

  return (
    <section class="relative w-full py-12 sm:py-16 px-6 bg-black/90 border-t border-emerald-900/30">
      {/* Sfondo leggero glass + gradient */}
      <div class="absolute inset-0 bg-gradient-to-t from-black via-emerald-950/10 to-transparent pointer-events-none" />
      <div class="absolute inset-0 backdrop-blur-[1px] opacity-30" />

      <div class="relative z-10 max-w-6xl mx-auto text-center">
        {/* Titolo compatto e diretto */}
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-5">
          Tutti i Server Hytale
          <span class="block text-emerald-400/90 mt-2 text-2xl sm:text-3xl">
            In un unico posto
          </span>
        </h2>

        {/* Descrizione breve, tech-oriented */}
        <p class="text-base sm:text-lg text-zinc-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Scorri, copia l'IP in un click, vota i tuoi preferiti e filtra per tag o popolarità.  
          Ogni server è verificato dalla community – pronto per essere conquistato.
        </p>

        {/* Piccoli badge / hint visivi (glass pills) */}
        <div class="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10">
          <div class="backdrop-blur-md bg-black/40 border border-emerald-800/50 rounded-full px-5 py-2 text-sm font-medium text-emerald-300 shadow-sm">
            Copia IP istantanea
          </div>
          <div class="backdrop-blur-md bg-black/40 border border-emerald-800/50 rounded-full px-5 py-2 text-sm font-medium text-emerald-300 shadow-sm">
            Voti in tempo reale
          </div>
          <div class="backdrop-blur-md bg-black/40 border border-emerald-800/50 rounded-full px-5 py-2 text-sm font-medium text-emerald-300 shadow-sm">
            Community italiana & internazionale
          </div>
          <div class="backdrop-blur-md bg-black/40 border border-emerald-800/50 rounded-full px-5 py-2 text-sm font-medium text-emerald-300 shadow-sm">
            24/7 online
          </div>
        </div>

        {/* Ultimo CTA prima della lista */}
        <button
          onClick={() => {
            // Scroll smooth alla lista server (se è sotto)
            document.getElementById("server-board")?.scrollIntoView({ behavior: "smooth" });
          }}
          class={`
            inline-flex items-center gap-3 px-9 py-4 rounded-xl text-lg font-semibold
            bg-gradient-to-r from-emerald-700 to-teal-700
            hover:from-emerald-600 hover:to-teal-600
            text-white shadow-lg shadow-emerald-900/40 hover:shadow-emerald-700/50
            border border-emerald-600/50 hover:border-emerald-400/60
            transition-all duration-300 active:scale-95
          `}
        >
          <span class="text-xl">↓</span>
          Inizia a sfogliare i server
        </button>

        {/* Piccola nota finale sotto */}
        <p class="mt-8 text-sm text-zinc-500">
          Ordina per voti • Filtra per tag • Aggiungi il tuo server in 30 secondi
        </p>
      </div>
    </section>
  );
};

export default SecondaryHero;